/**
 * The code the hero terminal plays.
 *
 * Plain source strings, tokenised at runtime by a small scanner rather than
 * hand-marked up: the snippets stay readable and editable as code, which is
 * the whole point of a panel that claims to show real work.
 */

export type Snippet = {
  /** Tab label. */
  name: string;
  /** Shown in the status strip. */
  lang: string;
  code: string;
  /** Streamed into the console under the editor once the file finishes typing. */
  out: { text: string; kind?: "ok" | "warn" | "dim" | "metric" }[];
};

export const snippets: Snippet[] = [
  {
    name: "rag_pipeline.py",
    lang: "python",
    code: `# Grounded answers, or no answer at all.
async def answer(question: str, k: int = 8) -> Answer:
    hits = await store.hybrid_search(question, k=k, alpha=0.6)
    ctx = rerank(hits, model="bge-reranker-v2")[:5]

    if max(c.score for c in ctx) < THRESHOLD:
        return Answer(text=REFUSAL, cited=[])

    draft = await llm.stream(PROMPT.render(q=question, ctx=ctx))
    return verify(draft, sources=ctx)`,
    out: [
      { text: "retrieval  hybrid(bm25 + dense)  k=8", kind: "dim" },
      { text: "rerank     5 passages kept", kind: "dim" },
      { text: "grounded   4 / 4 claims cited", kind: "ok" },
      { text: "p95 1.9 s   ·   hallucination rate 0.4%", kind: "metric" },
    ],
  },
  {
    name: "agent_loop.py",
    lang: "python",
    code: `# An agent is a loop with a budget and a way out.
def run(goal: Goal, budget: Budget) -> Trace:
    state = State(goal)
    for step in range(budget.max_steps):
        plan = planner.next(state)
        if plan.done:
            return state.finish(plan)
        result = tools[plan.tool](**plan.args)
        state = state.observe(result)
        if budget.spent > budget.cap:
            raise BudgetExceeded(step, budget)`,
    out: [
      { text: "step 1    search_docs(query='sla terms')", kind: "dim" },
      { text: "step 2    read_table(id='pricing_v4')", kind: "dim" },
      { text: "step 3    done  ·  3 tools  ·  ₹0.011", kind: "ok" },
      { text: "no runaway loops   ·   cap held", kind: "metric" },
    ],
  },
  {
    name: "voice_stream.ts",
    lang: "typescript",
    code: `// 800 ms is the line between a call and a wait.
const turn = pipe(
  vad.detectEndpoint({ silenceMs: 220 }),
  asr.streaming({ partials: true }),
  llm.firstSentence({ maxTokens: 48 }),
  tts.stream({ voice: "warm", chunk: "sentence" }),
);

turn.on("audio", (frame) => telephony.write(frame));`,
    out: [
      { text: "endpoint   220 ms silence", kind: "dim" },
      { text: "asr → llm  first token 310 ms", kind: "dim" },
      { text: "barge-in   handled", kind: "ok" },
      { text: "end to end 650–800 ms in production", kind: "metric" },
    ],
  },
];

/* ── The scanner ───────────────────────────────────────────────────────────
   Deliberately small. It colours the five things that carry the shape of a
   line — comment, string, number, keyword, call — and leaves everything else
   as plain text. A full parser would colour more and read no better.
   ─────────────────────────────────────────────────────────────────────────── */

export type Kind = "com" | "str" | "num" | "key" | "fn" | "punc" | "txt";
export type Tok = { s: string; k: Kind };

const KEYWORDS = new Set([
  "async", "await", "def", "return", "if", "else", "elif", "for", "in", "raise",
  "class", "import", "from", "with", "not", "and", "or", "None", "True", "False",
  "const", "let", "var", "function", "new", "of", "export", "type", "interface",
  "null", "undefined", "true", "false",
]);

const PATTERN =
  /(#[^\n]*|\/\/[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b\d[\w.]*\b)|([A-Za-z_$][\w$]*)|([^\sA-Za-z_$\d]+)|(\s+)/g;

/** Tokenise one source string into lines of tokens. */
export function tokenize(code: string): Tok[][] {
  return code.split("\n").map((line) => {
    const out: Tok[] = [];
    PATTERN.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = PATTERN.exec(line))) {
      const [s, com, str, num, word, punc] = m;
      if (com) out.push({ s, k: "com" });
      else if (str) out.push({ s, k: "str" });
      else if (num) out.push({ s, k: "num" });
      else if (word) {
        const next = line[PATTERN.lastIndex];
        out.push({ s, k: KEYWORDS.has(word) ? "key" : next === "(" ? "fn" : "txt" });
      } else if (punc) out.push({ s, k: "punc" });
      else out.push({ s, k: "txt" });
    }
    return out;
  });
}
