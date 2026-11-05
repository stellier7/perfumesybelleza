import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5 text-ink", className)} aria-label="Perfumes y Belleza, inicio">
      <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0" aria-hidden="true">
        <rect width="48" height="48" rx="14" fill="#f3d5ce" />
        <path
          d="M20 8h8v5h-8zM17 13h14l3 6v16c0 3-2.5 5-5.5 5h-9c-3 0-5.5-2-5.5-5V19z"
          fill="none"
          stroke="#8c6733"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path d="M19 22h10M18.5 28h11" stroke="#c4a36a" strokeWidth="1.4" />
        <circle cx="34" cy="14" r="3" fill="#c98984" />
      </svg>
      <span className="font-serif leading-none">
        <span className="block text-[1.35rem] tracking-tight">Perfumes</span>
        <span className="mt-1 block text-[0.62rem] uppercase tracking-[0.28em] text-gold">y Belleza</span>
      </span>
    </Link>
  );
}
