import Image from "next/image";
import Link from "next/link";
import { SearchBox } from "@/components/search-box";
import { Shell } from "@/components/shell";

export function HomeHero() {
  return (
    <section className="border-b border-line">
      <Shell className="grid items-end gap-10 py-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)] md:gap-14 md:py-16">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.24em] text-gold">Honduras</p>
          <h1 className="mt-4 max-w-xl font-serif text-[3.15rem] leading-[0.92] tracking-[-0.03em] md:text-7xl">
            Tu mundo de belleza, en un solo lugar.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-muted">
            Descubre fragancias irresistibles, skincare coreano y esenciales de belleza seleccionados para ti.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/tienda" className="inline-flex h-12 items-center bg-ink px-5 text-sm text-ivory">
              Descubrir productos
            </Link>
            <Link href="#categorias" className="inline-flex h-12 items-center border border-ink px-5 text-sm">
              Explorar categorías
            </Link>
          </div>
          <div className="mt-8 max-w-xl">
            <SearchBox variant="hero" />
          </div>
        </div>
        <figure>
          <div className="relative aspect-[4/5] overflow-hidden bg-stone">
            <Image
              src="/home/hero-marco.webp"
              alt="Estantería de perfumes, velas y flores en una boutique"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 46vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-3 text-[0.7rem] uppercase tracking-[0.18em] text-muted">
            Perfumería, skincare y belleza
          </figcaption>
        </figure>
      </Shell>
    </section>
  );
}
