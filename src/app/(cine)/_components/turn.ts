/**
 * One spoken turn, as a budget.
 *
 * Every instrument on this route reads this one array, so the drawing, the
 * controls and the copy cannot disagree. The hops sum to 750 ms, inside the
 * 650–800 ms band the résumé claims for production telephony; the ceiling
 * is 800.
 *
 * Nothing here is measured live. It is the shape of the budget the voice
 * architecture was designed against, drawn honestly, and the page says so.
 *
 * Turn-taking is two decisions, not one, so it is two hops: voice activity
 * detection asks whether there is speech at all, and endpointing asks whether
 * this speech has finished. Retrieval and reasoning are a single hop because
 * they overlap in practice — retrieval is started speculatively on the partial
 * transcript, so their budgets cannot be added end to end. The pair is held to
 * 250 ms together, and the split inside it is stated rather than implied.
 */

export type Stage = {
  id: string;
  /** Short form, for a node or a segment label. */
  short: string;
  /** Long form, for a trace row. */
  name: string;
  /** Budgeted milliseconds for this hop. */
  ms: number;
  /** Compute is the signal colour; io is the cold channel; risk is the warning. */
  kind: "compute" | "io" | "risk";
  /** What this hop actually does, in half-technical English. */
  what: string;
  /** The engineering decision that keeps it inside its budget. */
  lever: string;
  /** The named technique, for the readout. */
  technique: string;
  /** For a hop that covers two overlapping services, how the budget divides. */
  split?: string;
};

export const stages: Stage[] = [
  {
    id: "vad",
    short: "VAD",
    name: "vad · speech activity",
    ms: 80,
    kind: "risk",
    what: "Decide whether what is arriving is speech at all, frame by frame, and open the turn the moment it is. Everything downstream is gated on this, and it also runs in reverse — it is what lets the caller cut in over a reply.",
    lever: "A small model on short frames, running continuously rather than on request, so the turn opens on the first voiced frame instead of after a buffer has filled.",
    technique: "frame-level voice activity detection, barge-in",
  },
  {
    id: "endpoint",
    short: "END",
    name: "endpoint · end of turn",
    ms: 90,
    kind: "risk",
    what: "Decide the caller has actually stopped talking, rather than paused mid-sentence. Everything after this waits on it, so it is the most expensive judgement call on the chain.",
    lever: "Endpointing is tuned aggressively and paired with barge-in: if the decision is wrong, the caller talks over the reply and the turn is cancelled and restarted rather than queued behind it.",
    technique: "adaptive endpointing, cancel-and-restart",
  },
  {
    id: "asr",
    short: "ASR",
    name: "asr · streaming transcript",
    ms: 140,
    kind: "compute",
    what: "Turn audio into text. The transcript has been streaming in partials since the caller started speaking — this budget covers only the final flush after endpointing.",
    lever: "Streaming recognition, not batch. Partial hypotheses are already priming retrieval, so the finalised text costs a correction rather than a full pass.",
    technique: "streaming STT, partial hypotheses",
  },
  {
    id: "context",
    short: "RAG + LLM",
    name: "retrieve + reason · context and plan",
    ms: 250,
    kind: "compute",
    what: "Fetch the passages the model needs about this account, this contract, this price — then read them with the transcript and the negotiation state and decide what to say and whether to call a tool. Measured to the first token, not the last.",
    lever: "One budget for both because they overlap: retrieval is started speculatively on the partial transcript, so it is largely finished by the time the final text lands and the model is already warm. Short system prompt, cached prefix, small tool schemas.",
    technique: "speculative hybrid retrieval, prefix caching, TTFT-bound generation",
    split: "≈100 ms retrieval · ≈150 ms to first token",
  },
  {
    id: "tts",
    short: "TTS",
    name: "synthesise · first audio byte",
    ms: 130,
    kind: "compute",
    what: "Turn the reply into speech and start sending it. Only the first chunk is on the clock; the rest is generated while the caller is already hearing the sentence.",
    lever: "Synthesis is chunked at clause boundaries and streamed, so the reply begins before the model has finished writing it.",
    technique: "chunked streaming synthesis",
  },
  {
    id: "transport",
    short: "NET",
    name: "transport · telephony + jitter",
    ms: 60,
    kind: "io",
    what: "Carrier network, codec and the jitter buffer between the service and the caller's handset. Not code — but it is spent from the same budget as everything above it.",
    lever: "Media stays in-region and the buffer is held short; the budget is written with this hop reserved first, so no service upstream can spend it.",
    technique: "in-region media, short jitter buffer",
  },
];

export const CEILING_MS = 800;
export const BUDGET_MS = stages.reduce((sum, s) => sum + s.ms, 0);

/** Cumulative start offset of each hop, in ms. */
export const offsets: number[] = stages.reduce<number[]>((acc, s, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + stages[i - 1].ms);
  return acc;
}, []);

/**
 * Tool calls the agent makes inside the reasoning hop. They do not get their
 * own budget line because they run against the model's own turn — but a
 * reader who knows the architecture will look for them, so they are stated.
 */
export const sideEffects = [
  "crm.lookup(account)",
  "policy.check(offer)",
  "crm.write(outcome)",
];
