import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { JsonLd } from "@/components/json-ld";
import { NotesPyramid, RatingMeter } from "@/components/notes-pyramid";
import { ProductCard } from "@/components/product-card";
import { ProductActions, ProductGallery, ViewContent, type PurchaseTarget } from "@/components/product-purchase";
import { Shell } from "@/components/shell";
import { GENDER_LABEL, TYPE_LABEL, store } from "@/config";
import { getCatalog, getProductBySlug } from "@/lib/catalog";
import { comparisonSlug, nameWithBrand } from "@/lib/catalog-model";
import { formatPrice, hasShelfPrice } from "@/lib/pricing";
import type { PublicProduct } from "@/types/catalog";

type ProductParams = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getCatalog().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductParams): Promise<Metadata> {
  const product = getProductBySlug((await params).slug);
  if (!product) return { title: "Producto" };
  const title = product.isReference
    ? `${product.name}: alternativas`
    : `${product.name} de ${product.brand}`;
  return {
    title,
    description: product.description,
    alternates: { canonical: `/producto/${product.slug}` },
    openGraph: {
      title,
      description: product.description,
      images: product.images.slice(0, 1),
    },
  };
}

export default function ProductPage({ params }: ProductParams) {
  return (
    <Suspense fallback={<Shell className="py-12">Cargando producto…</Shell>}>
      <ProductScreen params={params} />
    </Suspense>
  );
}

async function ProductScreen({ params }: ProductParams) {
  const product = getProductBySlug((await params).slug);
  if (!product) notFound();
  const catalog = new Map(getCatalog().map((item) => [item.id, item]));
  const purchase = toPurchase(product);
  const alternatives = product.alternatives.flatMap((item) => {
    const match = catalog.get(item.id);
    return match ? [match] : [];
  });

  return (
    <Shell className="py-6 md:py-10">
      <ViewContent product={purchase} />
      {!product.isReference ? <JsonLd data={productJsonLd(product)} /> : null}
      <nav className="text-sm text-muted">
        <Link href="/tienda">Tienda</Link>
        <span> / </span>
        <span>{product.name}</span>
      </nav>
      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />
        <div>
          <div className="max-md:pr-20">
            <p className="text-xs uppercase tracking-[0.18em] text-gold">
              {TYPE_LABEL[product.type]} · {GENDER_LABEL[product.gender]}
            </p>
            <h1 className="mt-2 font-serif text-4xl leading-none md:text-6xl">{product.name}</h1>
            <p className="mt-2 text-muted">{product.brand}</p>
          </div>
          {product.isReference ? (
            <p className="mt-6 leading-7">
              Este perfume de diseñador no está en nuestro catálogo. Mira alternativas con un aroma similar.
            </p>
          ) : (
            <>
              <p className="mt-6 font-serif text-4xl">
                {hasShelfPrice(product.price) ? formatPrice(product.price) : "Precio por confirmar"}
              </p>
              <p className="mt-1 text-sm text-muted">
                {product.sizeMl ? `${product.sizeMl} ml` : "Tamaño por confirmar"}
                {product.inStock ? "" : " · Agotado"}
              </p>
              <p className="mt-4 leading-7">{product.description}</p>
              <ProductActions product={purchase} />
            </>
          )}
          {product.longevity || product.projection ? (
            <div className="mt-6 grid grid-cols-2 gap-4">
              <RatingMeter label="Duración estimada" value={product.longevity} />
              <RatingMeter label="Estela estimada" value={product.projection} />
            </div>
          ) : null}
        </div>
      </div>

      {hasNotes(product) ? (
        <section className="mt-10">
          <h2 className="font-serif text-3xl">Notas</h2>
          <div className="mt-4">
            <NotesPyramid notes={product.notes} />
          </div>
        </section>
      ) : null}

      {product.type === "arabic" && product.inspiredBy.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-serif text-3xl">Inspirado en</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Para quienes buscan un aroma similar. No es el perfume de la casa de diseño.
          </p>
          <ul className="mt-4 space-y-3">
            {product.inspiredBy.map((item) => (
              <li key={item.id}>
                <Link href={`/producto/${item.slug}`} className="font-medium hover:text-gold">
                  {nameWithBrand(item.name, item.brand)}
                </Link>
                <Link href={`/comparar/${comparisonSlug(item.slug, product.slug)}`} className="ml-3 text-sm text-gold">
                  Ver comparación
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {alternatives.some((item) => item.category !== "Set") ? (
        <section className="mt-12">
          <h2 className="font-serif text-3xl">Inspirado en {nameWithBrand(product.name, product.brand)}</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Del más cercano al más libre. No es el perfume de la casa.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {alternatives
              .filter((item) => item.category !== "Set")
              .map((alternative) => (
                <div key={alternative.id}>
                  <ProductCard product={alternative} />
                  <Link
                    href={`/comparar/${comparisonSlug(product.slug, alternative.slug)}`}
                    className="mt-2 inline-block text-sm text-gold"
                  >
                    Ver comparación
                  </Link>
                </div>
              ))}
          </div>
        </section>
      ) : null}
      {alternatives.some((item) => item.category === "Set") ? (
        <section className="mt-12">
          <h2 className="font-serif text-3xl">Sets</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {alternatives
              .filter((item) => item.category === "Set")
              .map((alternative) => (
                <ProductCard key={alternative.id} product={alternative} />
              ))}
          </div>
        </section>
      ) : null}
    </Shell>
  );
}

function toPurchase(product: PublicProduct): PurchaseTarget {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    price: product.price,
    images: product.images,
    inStock: product.inStock,
    isReference: product.isReference,
    sizeMl: product.sizeMl,
  };
}

function hasNotes(product: PublicProduct): boolean {
  return product.notes.top.length + product.notes.heart.length + product.notes.base.length > 0;
}

function productJsonLd(product: PublicProduct) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((image) => `${store.url}${image}`),
    sku: product.id,
    brand: { "@type": "Brand", name: product.brand },
    ...(hasShelfPrice(product.price)
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "HNL",
            price: product.price,
            availability: product.inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: `${store.url}/producto/${product.slug}`,
          },
        }
      : {}),
  };
}
