import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FaqList } from "@/components/faq";
import { JsonLd } from "@/components/json-ld";
import { NotesPyramid, RatingMeter } from "@/components/notes-pyramid";
import { Shell } from "@/components/shell";
import { store } from "@/config";
import { getComparisonBySlug, getComparisonPairs } from "@/lib/catalog";
import { formatPrice, hasShelfPrice } from "@/lib/pricing";
import { faqJsonLd } from "@/lib/seo";
import type { PublicProduct } from "@/types/catalog";

type PairParams = { params: Promise<{ pair: string }> };

export function generateStaticParams() {
  const pairs = getComparisonPairs().map((pair) => ({ pair: pair.slug }));
  // Cache Components exige al menos un resultado aunque todavía no haya comparaciones.
  if (pairs.length > 0) return pairs;
  return [{ pair: "sin-comparaciones" }];
}

export async function generateMetadata({ params }: PairParams): Promise<Metadata> {
  const comparison = getComparisonBySlug((await params).pair);
  if (!comparison) return { title: "Comparación" };
  const title = `${comparison.original.name} y ${comparison.alternative.name}`;
  const description = `Compara ${comparison.original.name} con ${comparison.alternative.name}, una alternativa para quienes buscan un aroma similar.`;
  return {
    title,
    description,
    alternates: { canonical: `/comparar/${comparison.slug}` },
    openGraph: { title, description },
  };
}

export default function ComparisonPage({ params }: PairParams) {
  return (
    <Suspense fallback={<Shell className="py-12">Cargando comparación…</Shell>}>
      <Comparison params={params} />
    </Suspense>
  );
}

async function Comparison({ params }: PairParams) {
  const comparison = getComparisonBySlug((await params).pair);
  if (!comparison) notFound();
  const { original, alternative } = comparison;
  const faqs = [
    {
      question: "¿Es el mismo perfume?",
      answer: `No. ${alternative.name} es una alternativa para quienes buscan un aroma similar a ${original.name}. No es el perfume de la casa de diseño y no decimos que huela igual.`,
    },
    {
      question: "¿Cuál pido si quiero el de la casa?",
      answer: original.isReference
        ? `No trabajamos ${original.name}. ${alternative.name} es la alternativa disponible en el catálogo.`
        : original.inStock
          ? `${original.name} está disponible. ${alternative.name} es la opción más accesible para el día a día.`
          : `${original.name} está agotado. Puedes pedir ${alternative.name} o avisarnos para reposición.`,
    },
    {
      question: "¿Puedo pedirlos por WhatsApp?",
      answer: "Sí. Agrega el que quieras al carrito y te abrimos un mensaje con el total, el envío y los datos de transferencia.",
    },
  ];

  return (
    <Shell className="py-8 md:py-12">
      <JsonLd data={faqJsonLd(faqs)} />
      {!alternative.isReference ? <JsonLd data={productOffer(alternative)} /> : null}
      <nav className="text-sm text-muted">
        <Link href="/comparaciones">Comparaciones</Link>
        <span> / </span>
        <span>
          {original.name} y {alternative.name}
        </span>
      </nav>
      <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">
        {original.name} <span className="text-gold">y</span> {alternative.name}
      </h1>
      <p className="mt-4 max-w-2xl leading-7 text-muted">
        {alternative.name} es una alternativa para quienes buscan un aroma similar a {original.name}.
        Aquí ves precio, tamaño y para qué momento rinde mejor cada uno.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Side product={original} role="Referencia" />
        <Side product={alternative} role="Alternativa" />
      </div>
      <section className="mt-10 rounded-3xl bg-paper p-6">
        <h2 className="font-serif text-3xl">Para quién es cada uno</h2>
        <p className="mt-3 leading-7">
          {original.verdict ?? `${original.name} es la referencia de esta comparación.`}{" "}
          {alternative.verdict ?? `${alternative.name} es la alternativa que tenemos en catálogo.`}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/producto/${original.slug}`} className="rounded-full border border-line px-4 py-2 text-sm">
            Ver {original.name}
          </Link>
          {!alternative.isReference && alternative.inStock ? (
            <Link href={`/producto/${alternative.slug}`} className="rounded-full bg-ink px-4 py-2 text-sm text-ivory">
              Pedir {alternative.name}
            </Link>
          ) : null}
        </div>
      </section>
      <section className="mt-10">
        <h2 className="mb-4 font-serif text-3xl">Preguntas</h2>
        <FaqList items={faqs} />
      </section>
    </Shell>
  );
}

function Side({ product, role }: { product: PublicProduct; role: string }) {
  const price = product.isReference
    ? "No está en el catálogo"
    : !hasShelfPrice(product.price)
      ? "Precio por confirmar"
      : product.inStock
        ? formatPrice(product.price)
        : `${formatPrice(product.price)} · Agotado`;
  return (
    <article className="rounded-3xl border border-line bg-paper p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-gold">{role}</p>
      <h2 className="mt-2 font-serif text-3xl">{product.name}</h2>
      <p className="text-sm text-muted">{product.brand}</p>
      <p className="mt-4 text-lg">{price}</p>
      <p className="text-sm text-muted">{product.sizeMl ? `${product.sizeMl} ml` : "Tamaño no indicado"}</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <RatingMeter label="Duración" value={product.longevity} />
        <RatingMeter label="Estela" value={product.projection} />
      </div>
      {product.bestFor?.length ? (
        <p className="mt-4 text-sm">Mejor para: {product.bestFor.join(", ")}</p>
      ) : null}
      <div className="mt-4">
        <NotesPyramid notes={product.notes} />
      </div>
      {product.pros?.length ? (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">A favor</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {product.pros.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {product.cons?.length ? (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">En contra</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {product.cons.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}

function productOffer(product: PublicProduct) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((image) => `${store.url}${image}`),
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      priceCurrency: "HNL",
      price: product.price,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${store.url}/producto/${product.slug}`,
    },
  };
}
