/**
 * A system's shape in one glyph: the stack drawn as the chain it actually
 * runs as, left to right, one node per component.
 *
 * Deliberately not a logo wall. The point of the card is the architecture,
 * and a reader should be able to see the number of hops before reading a
 * word of the description.
 */

const W = 300;
const H = 54;

/** Node captions have to survive at 7px, so they are shortened, not wrapped. */
function abbreviate(label: string): string {
  const head = label.split(/[\s/]+/)[0];
  return (head.length > 9 ? `${head.slice(0, 8)}·` : head).toUpperCase();
}

export function Topology({ stack }: { stack: readonly string[] }) {
  const n = stack.length;
  const padX = 22;
  const step = n > 1 ? (W - padX * 2) / (n - 1) : 0;
  const y = 18;

  return (
    <svg
      className="rt-topo"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Architecture: ${stack.join(" to ")}`}
    >
      {stack.slice(0, -1).map((item, i) => (
        <line key={item} x1={padX + i * step + 7} y1={y} x2={padX + (i + 1) * step - 7} y2={y} />
      ))}
      {stack.map((item, i) => (
        <g key={item}>
          <circle cx={padX + i * step} cy={y} r={5} />
          <text x={padX + i * step} y={y + 20} textAnchor="middle">
            {abbreviate(item)}
          </text>
        </g>
      ))}
    </svg>
  );
}
