import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SearchBox } from "@/components/search-box";
import { Shell } from "@/components/shell";
import { JsonLd } from "@/components/json-ld";
import { store } from "@/config";
import { formatPrice, hasShelfPrice } from "@/lib/pricing";
import { pageMetadata } from "@/lib/seo";
import {
  getComparisonPairs,
  getFeaturedProducts,
  getSearchRecords,
  getSellableProducts,
} from "@/lib/catalog";

export const metadata = pageMetadata({
  title: "Perfumes y belleza en Honduras",
  description:
    "Perfumes de diseñador, alternativas árabes y belleza. Envío a todo Honduras en 1 a 2 días hábiles, pago por transferencia y atención por WhatsApp.",
  path: "/",
});

const categories = [
  {
    href: "/tienda?tipo=arabic",
    title: "Perfumes árabes",
    text: "Alternativas para quienes buscan un aroma similar, con precios de uso frecuente.",
    className: "bg-night text-ivory",
  },
  {
    href: "/tienda?tipo=designer",
    title: "Perfumes de diseñador",
    text: "Piezas de casa para regalo o para quien ya tiene su firma.",
    className: "bg-blush text-ink",
  },
  {
    href: "/tienda?tipo=beauty",
    title: "Belleza",
    text: "Brumas, labios y cuidado para acompañar el perfume.",
    className: "bg-champagne-soft text-ink",
  },
  {
    href: "/tienda?categoria=Inspiraciones",
    title: "Inspiraciones",
    text: "Perfumes de la tienda inspirados en un aroma de diseñador, del más cercano al más libre.",
    className: "bg-paper text-ink",
  },
];

export default function HomePage() {
  const records = getSearchRecords();
  const featured = getFeaturedProducts();
  const spotlight = (featured.length > 0 ? featured : getSellableProducts()).slice(0, 8);
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
          areaServed: "Honduras",
          currenciesAccepted: "HNL",
        }}
      />
      <section className="relative z-20 border-b border-line">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -right-10 top-0 h-64 w-64 rounded-full bg-blush blur-3xl" />
        </div>
        <Shell className="relative py-14 md:py-20">
          <p className="text-xs uppercase tracking-[0.28em] text-gold">Honduras</p>
          <h1 className="mt-3 max-w-xl font-serif text-5xl leading-[0.95] md:text-7xl">
            El aroma que te queda.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-muted">
            Perfumes de diseñador, alternativas árabes y belleza, con envío a todo el país.
          </p>
          <div className="mt-8 max-w-xl">
            <SearchBox records={records} variant="hero" />
          </div>
        </Shell>
      </section>

      <Shell className="py-12">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className={`rounded-3xl p-6 shadow-soft transition duration-300 motion-safe:hover:-translate-y-0.5 hover:shadow-lift ${category.className}`}
            >
              <h2 className="font-serif text-3xl leading-none">{category.title}</h2>
              <p className="mt-3 text-sm leading-6 opacity-80">{category.text}</p>
            </Link>
          ))}
        </div>
      </Shell>

      <Shell className="pb-4">
        <h2 className="mb-6 font-serif text-4xl">Destacados</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {spotlight.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            href="/tienda"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-ink px-8 text-sm text-ivory sm:w-auto"
          >
            Ver tienda
          </Link>
        </div>
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
                    {pair.original.name} y {pair.alternative.name}
                  </p>
                  <p className="mt-3 font-serif text-2xl">
                    {pair.alternative.name}
                    <span className="text-champagne-soft"> · alternativa</span>
                  </p>
                  <p className="mt-2 text-sm text-champagne-soft">
                    {pair.original.isReference
                      ? "El perfume de referencia no está en el catálogo."
                      : pair.original.inStock
                        ? `${pair.original.name}: ${hasShelfPrice(pair.original.price) ? formatPrice(pair.original.price) : "Precio por confirmar"}`
                        : `${pair.original.name} está agotado.`}
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
