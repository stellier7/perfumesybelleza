import Image from "next/image";
import Link from "next/link";
import { AutoRail } from "@/components/auto-rail";
import { CategoryRail } from "@/components/category-rail";
import { ProductCard } from "@/components/product-card";
import { SearchBox } from "@/components/search-box";
import { Shell } from "@/components/shell";
import { JsonLd } from "@/components/json-ld";
import { store } from "@/config";
import { isSpotlightFiller, pickFamous } from "@/lib/fame";
import { homeDepartments, homeShelf, SPOTLIGHTS } from "@/lib/home-rail";
import { nameWithBrand } from "@/lib/catalog-model";
import { formatPrice, hasShelfPrice } from "@/lib/pricing";
import { pageMetadata } from "@/lib/seo";
import { getComparisonPairs, getSellableProducts } from "@/lib/catalog";

export const metadata = pageMetadata({
  title: "Perfumes y belleza en Honduras",
  description:
    "Perfumes de diseñador, alternativas árabes y belleza. Envío a todo Honduras en 1 a 2 días hábiles, pago por transferencia y atención por WhatsApp.",
  path: "/",
});

export default function HomePage() {
  const departments = homeDepartments(
    getSellableProducts().map((product) => ({
      type: product.type,
      category: product.category,
      inspired: product.inspiredBy.length > 0,
    })),
  );
  const sellable = getSellableProducts().filter((product) => product.inStock);
  const spotlights = SPOTLIGHTS.map((shelf) => ({
    ...shelf,
    products: pickFamous(
      sellable.filter((product) => homeShelf(product) === shelf.id && !isSpotlightFiller(product)),
      10,
    ),
  })).filter((shelf) => shelf.products.length > 0);
  const pairs = getComparisonPairs().slice(0, 4);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Store",
          name: store.name,
          description: store.description,
          url: store.url,
          telephone: `+${store.whatsappNumber}`,
          email: store.email,
          areaServed: "Honduras",
          currenciesAccepted: "HNL",
        }}
      />
      <section className="relative z-20 border-b border-line">
        <Shell className="grid items-center gap-8 py-10 md:grid-cols-2 md:gap-12 md:py-16">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold">Honduras</p>
            <h1 className="mt-3 max-w-xl font-serif text-5xl leading-[0.95] md:text-7xl">
              El aroma que te queda.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-muted">
              Perfumes de diseñador, alternativas árabes y belleza, con envío a todo el país.
            </p>
            <div className="mt-8 max-w-xl">
              <SearchBox variant="hero" />
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-lift">
            <Image
              src="/home/hero.webp"
              alt="Frascos de perfume y un tarro de crema sobre piedra clara"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Shell>
      </section>

      <Shell className="py-12">
        <CategoryRail departments={departments} />
      </Shell>

      <Shell className="space-y-14 pb-4">
        {spotlights.map((shelf) => (
          <AutoRail
            key={shelf.id}
            direction="left"
            label={shelf.title}
            title={
              <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
                <h2 id={shelf.id === "perfumes" ? "destacados" : shelf.id} className="font-serif text-4xl">
                  {shelf.title}
                </h2>
                <Link href={shelf.href} className="mb-1 text-sm text-muted underline-offset-4 hover:underline">
                  Ver todo
                </Link>
              </div>
            }
          >
            {shelf.products.map((product) => (
              <div key={product.id} className="w-[16.5rem]">
                <ProductCard product={product} />
              </div>
            ))}
          </AutoRail>
        ))}
      </Shell>

      {pairs.length > 0 ? (
        <section className="mt-14 bg-night text-ivory">
          <Shell className="py-12">
            <h2 className="max-w-lg font-serif text-4xl leading-tight">
              ¿Buscas un perfume famoso? Mira sus alternativas
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {pairs.map((pair) => (
                <Link
                  key={pair.slug}
                  href={`/comparar/${pair.slug}`}
                  className="rounded-3xl border border-white/10 bg-night-soft p-5 transition duration-300 motion-safe:hover:-translate-y-0.5"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-champagne">
                    {nameWithBrand(pair.original.name, pair.original.brand)} y {pair.alternative.name}
                  </p>
                  <p className="mt-3 font-serif text-2xl">
                    {pair.alternative.name}
                    <span className="text-champagne-soft"> · alternativa</span>
                  </p>
                  <p className="mt-2 text-sm text-champagne-soft">
                    {pair.original.isReference
                      ? "El perfume de referencia no está en el catálogo."
                      : pair.original.inStock
                        ? `${nameWithBrand(pair.original.name, pair.original.brand)}: ${hasShelfPrice(pair.original.price) ? formatPrice(pair.original.price) : "Precio por confirmar"}`
                        : `${nameWithBrand(pair.original.name, pair.original.brand)} está agotado.`}
                    {" · "}
                    {pair.alternative.name}:{" "}
                    {hasShelfPrice(pair.alternative.price)
                      ? formatPrice(pair.alternative.price)
                      : "Precio por confirmar"}
                  </p>
                </Link>
              ))}
            </div>
          </Shell>
        </section>
      ) : null}

      <Shell className="grid gap-4 py-12 md:grid-cols-3">
        {[
          ["Envío", `A todo Honduras en ${store.shippingDays} con ${store.carrier}.`],
          ["Pago", "Por transferencia. Te enviamos los datos al confirmar el pedido."],
          ["WhatsApp", "Armas el pedido en la tienda y lo recibimos listo para preparar."],
        ].map(([title, text]) => (
          <div key={title} className="rounded-3xl border border-line bg-paper p-5 shadow-soft">
            <h3 className="font-serif text-2xl">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
          </div>
        ))}
      </Shell>
    </>
  );
}
