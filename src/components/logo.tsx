import Link from "next/link";
import { cn } from "@/lib/cn";

const petals = [
  { n: 12, cy: -17.2, rx: 5.6, ry: 9.6, rot: 0, fill: "#f8ece7", stroke: "#c4a36a", strokeWidth: 0.7 },
  { n: 9, cy: -11.6, rx: 4.4, ry: 7.2, rot: 10, fill: "#f0d2cb", stroke: "#8c6733", strokeWidth: 0.65 },
  { n: 7, cy: -7.2, rx: 3.3, ry: 5.1, rot: 6, fill: "#e4b6af", stroke: "#8c6733", strokeWidth: 0.55 },
] as const;

function Flower() {
  return (
    <g transform="translate(32 32)">
      {petals.map((layer) =>
        Array.from({ length: layer.n }, (_, index) => (
          <ellipse
            key={`${layer.cy}-${index}`}
            cx={0}
            cy={layer.cy}
            rx={layer.rx}
            ry={layer.ry}
            transform={`rotate(${layer.rot + (index * 360) / layer.n})`}
            fill={layer.fill}
            stroke={layer.stroke}
            strokeWidth={layer.strokeWidth}
          />
        )),
      )}
      <circle r={1.7} fill="#c98984" />
    </g>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5 text-ink", className)} aria-label="Perfumes y Belleza, inicio">
      <svg viewBox="0 0 64 64" className="h-10 w-10 shrink-0" aria-hidden="true">
        <rect width="64" height="64" rx="18.7" fill="#f3d5ce" />
        <Flower />
      </svg>
      <span className="font-serif leading-none">
        <span className="block text-[1.35rem] tracking-tight">Perfumes</span>
        <span className="mt-1 block text-[0.62rem] uppercase tracking-[0.28em] text-gold">y Belleza</span>
      </span>
    </Link>
  );
}
