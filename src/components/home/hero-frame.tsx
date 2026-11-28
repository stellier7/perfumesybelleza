import Image from "next/image";
import Link from "next/link";
import { SearchBox } from "@/components/search-box";
import { Shell } from "@/components/shell";

export function HeroFrame({ sale }: { sale: boolean }) {
  return (
    <section className={`hero-stage relative z-20 overflow-hidden border-b ${sale ? "border-white/10 bg-night text-ivory" : "border-line"}`}>
      {/* next/image no admite el desplazamiento de esta foto con el scroll. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/home/hero-fondo.webp" alt="" className="hero-photo pointer-events-none" />
      <div className={`pointer-events-none absolute inset-0 ${sale ? "bg-night/60" : "bg-ivory/40"}`} />
      <Shell className="relative grid items-end gap-10 py-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)] md:gap-14 md:py-16">
        <div>
          <p className={`text-[0.7rem] uppercase tracking-[0.24em] ${sale ? "text-champagne" : "text-gold"}`}>
            {sale ? "Black Friday" : "Honduras"}
          </p>
          <h1 className="mt-4 max-w-xl font-serif text-[3.15rem] leading-[0.92] tracking-[-0.03em] md:text-7xl">
            {sale ? "10% en todo el catálogo." : "Tu mundo de belleza, en un solo lugar."}
          </h1>
          <p className={`mt-5 max-w-md text-base leading-7 ${sale ? "text-champagne/90" : "text-muted"}`}>
            {sale
              ? "Hasta el lunes 30 de noviembre. El precio tachado es el de hoy."
              : "Descubre fragancias irresistibles, skincare coreano y esenciales de belleza seleccionados para ti."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/tienda"
              className={`inline-flex h-12 items-center rounded-full px-5 text-sm ${sale ? "bg-ivory text-ink" : "bg-ink text-ivory"}`}
            >
              {sale ? "Ver la tienda" : "Descubrir productos"}
            </Link>
            <Link
              href="#categorias"
              className={`inline-flex h-12 items-center rounded-full border px-5 text-sm ${sale ? "border-ivory/40 bg-night/40" : "border-ink bg-paper/70"}`}
            >
              Explorar categorías
            </Link>
          </div>
          <div className="mt-8 max-w-xl">
            <SearchBox variant="hero" />
          </div>
        </div>
        <figure>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-stone shadow-lift ring-4 ring-paper">
            <Image
              src="/home/hero-marco.webp"
              alt="Estantería de perfumes, velas y flores en una boutique"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 46vw"
              className="object-cover"
            />
          </div>
          <figcaption className={`mt-3 text-[0.7rem] uppercase tracking-[0.18em] ${sale ? "text-champagne/80" : "text-muted"}`}>
            Perfumería, skincare y belleza
          </figcaption>
        </figure>
      </Shell>
    </section>
  );
}
