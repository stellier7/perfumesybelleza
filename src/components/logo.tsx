import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5 text-ink", className)} aria-label="Perfumes y Belleza, inicio">
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden="true">
        <rect width="40" height="40" fill="#202020" />
        <circle cx="20" cy="20" r="8.5" fill="none" stroke="#D8C6A5" strokeWidth="1.2" />
        <circle cx="20" cy="20" r="2" fill="#D8C6A5" />
      </svg>
      <span className="font-serif leading-none">
        <span className="block text-[1.35rem] tracking-tight">Perfumes</span>
        <span className="mt-1 block text-[0.62rem] uppercase tracking-[0.28em] text-gold">y Belleza</span>
      </span>
    </Link>
  );
}
