import type { Metadata } from "next";
import { io } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FaqList } from "@/components/faq";
import { JsonLd } from "@/components/json-ld";
import { NotesPyramid, RatingMeter } from "@/components/notes-pyramid";
import { PriceMarkup } from "@/components/price-markup";
import { Shell } from "@/components/shell";
import { store } from "@/config";
import { getComparisonBySlug, getComparisonPairs } from "@/lib/catalog";
import { displayTitle, formatSize } from "@/lib/catalog-model";
import { fold } from "@/lib/text";
import { hasShelfPrice } from "@/lib/pricing";
import { isSaleActive, offerPrice, SALE } from "@/lib/sale";
import { prerenderComparisonParams } from "@/lib/prerender-paths";
import { faqJsonLd } from "@/lib/seo";
import type { PublicProduct } from "@/types/catalog";

type PairParams = { params: Promise<{ pair: string }> };

export function generateStaticParams() {
  return prerenderComparisonParams(getComparisonPairs().map((pair) => pair.slug));
}

export async function generateMetadata({ params }: PairParams): Promise<Metadata> {
  const comparison = getComparisonBySlug((await params).pair);
  if (!comparison) return { title: "Comparación" };
  const originalLabel = displayTitle(comparison.original);
  const alternativeLabel = displayTitle(comparison.alternative);
  const title = `${originalLabel} y ${alternativeLabel}`;
  const description = `Compara ${originalLabel} con ${alternativeLabel}, una alternativa para quienes buscan un aroma similar.`;
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
  await io();
  const now = new Date();
  const comparison = getComparisonBySlug((await params).pair);
  if (!comparison) notFound();
  const { original, alternative } = comparison;
  const originalLabel = displayTitle(original);
  const alternativeLabel = displayTitle(alternative);
  const faqs = [
    {
      question: "¿Es el mismo perfume?",
      answer: `No. ${alternativeLabel} es una alternativa para quienes buscan un aroma similar a ${originalLabel}. No es el perfume de la casa de diseño y no decimos que huela igual.`,
    },
    {
      question: "¿Cuál pido si quiero el de la casa?",
      answer: original.isReference
        ? `No trabajamos ${originalLabel}. ${alternativeLabel} es la alternativa disponible en el catálogo.`
        : original.inStock
          ? `${originalLabel} está disponible. ${alternativeLabel} es la opción más accesible para el día a día.`
          : `${originalLabel} está agotado. Puedes pedir ${alternativeLabel} o avisarnos para reposición.`,
    },
    {
      question: "¿Puedo pedirlos por WhatsApp?",
      answer: "Sí. Agrega el que quieras al carrito y te abrimos un mensaje con el total, el envío y los datos de transferencia.",
    },
  ];

  return (
    <Shell className="py-8 md:py-12">
      <JsonLd data={faqJsonLd(faqs)} />
      {!alternative.isReference ? <JsonLd data={productOffer(alternative, now)} /> : null}
      <nav className="text-sm text-muted">
        <Link href="/comparaciones">Comparaciones</Link>
        <span> / </span>
        <span>
          {originalLabel} y {alternativeLabel}
        </span>
      </nav>
      <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">
        {originalLabel} <span className="text-gold">y</span> {alternativeLabel}
      </h1>
      <p className="mt-4 max-w-2xl leading-7 text-muted">
        {alternativeLabel} es una alternativa para quienes buscan un aroma similar a {originalLabel}.
        Aquí ves precio, tamaño y para qué momento rinde mejor cada uno.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Side product={original} role="Referencia" now={now} />
        <Side product={alternative} role="Alternativa" now={now} />
      </div>
      <section className="mt-10 rounded-3xl bg-paper p-6 shadow-soft">
        <h2 className="font-serif text-3xl">Para quién es cada uno</h2>
        <p className="mt-3 leading-7">
          {original.verdict ?? `${originalLabel} es la referencia de esta comparación.`}{" "}
          {alternative.verdict ?? `${alternativeLabel} es la alternativa que tenemos en catálogo.`}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/producto/${original.slug}`} className="rounded-full border border-line px-4 py-2 text-sm">
            Ver {originalLabel}
          </Link>
          {!alternative.isReference && alternative.inStock ? (
            <Link href={`/producto/${alternative.slug}`} className="rounded-full bg-ink px-4 py-2 text-sm text-ivory">
              Pedir {alternativeLabel}
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

function Side({ product, role, now }: { product: PublicProduct; role: string; now: Date }) {
  const pay = offerPrice(product.price, now);
  return (
    <article className="rounded-3xl border border-line bg-paper p-5 shadow-soft">
      <p className="text-xs uppercase tracking-[0.16em] text-gold">{role}</p>
      <h2 className="mt-2 font-serif text-3xl leading-tight">{displayTitle(product)}</h2>
      {fold(displayTitle(product)).includes(fold(product.brand)) ? null : (
        <p className="text-sm text-muted">{product.brand}</p>
      )}
      <p className="mt-4 text-lg">
        {product.isReference ? (
          "No está en el catálogo"
        ) : (
          <>
            <PriceMarkup list={product.price} pay={pay} className="text-lg" />
            {product.inStock || !hasShelfPrice(product.price) ? null : <span className="text-muted"> · Agotado</span>}
          </>
        )}
      </p>
      <p className="text-sm text-muted">{formatSize(product) ?? "Tamaño no indicado"}</p>
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

function productOffer(product: PublicProduct, now: Date) {
  const pay = offerPrice(product.price, now);
  const onSale = isSaleActive(now) && hasShelfPrice(product.price) && pay !== product.price;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: displayTitle(product),
    description: product.description,
    image: product.images.map((image) => `${store.url}${image}`),
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      priceCurrency: "HNL",
      price: pay,
      ...(onSale ? { priceValidUntil: SALE.endsAt } : {}),
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${store.url}/producto/${product.slug}`,
    },
  };
}
