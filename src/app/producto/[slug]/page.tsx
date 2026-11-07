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
import {
  comparisonSlug,
  formatSize,
  productSuggestions,
  type ProductSuggestionGroup,
} from "@/lib/catalog-model";
import { formatPrice, hasShelfPrice } from "@/lib/pricing";
import type { PublicProduct } from "@/types/catalog";

type ProductParams = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getCatalog().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductParams): Promise<Metadata> {
  const product = getProductBySlug((await params).slug);
  if (!product) return { title: "Producto" };
  const size = formatSize(product);
  const title = product.isReference
    ? `${product.name}: alternativas`
    : product.type === "beauty"
      ? size
        ? `${product.brand} ${product.name}, ${size}`
        : `${product.brand} ${product.name}`
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
  const purchase = toPurchase(product);
  const suggestions = productSuggestions(product, getCatalog());

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
                {formatSize(product) ?? "Tamaño por confirmar"}
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

      {suggestions.map((group) => (
        <SuggestionSection key={group.kind} group={group} current={product} />
      ))}
    </Shell>
  );
}

function SuggestionSection({
  group,
  current,
}: {
  group: ProductSuggestionGroup;
  current: PublicProduct;
}) {
  return (
    <section className="mt-12">
      <h2 className="font-serif text-3xl">{group.title}</h2>
      <p className="mt-2 max-w-xl text-sm leading-6 text-muted">{group.caption}</p>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {group.products.map((item) => {
          const compare = comparisonHref(group.kind, current.slug, item.slug);
          return (
            <div key={item.id}>
              <ProductCard product={item} />
              {compare ? (
                <Link href={compare} className="mt-2 inline-block text-sm text-gold">
                  Ver comparación
                </Link>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function comparisonHref(kind: ProductSuggestionGroup["kind"], currentSlug: string, itemSlug: string): string | null {
  switch (kind) {
    case "clones":
      return `/comparar/${comparisonSlug(currentSlug, itemSlug)}`;
    case "original":
      return `/comparar/${comparisonSlug(itemSlug, currentSlug)}`;
    case "sets":
    case "line":
    case "couple":
    case "more":
      return null;
    default: {
      const unreachable: never = kind;
      return unreachable;
    }
  }
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
    sizeLabel: product.sizeLabel,
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
    category: product.category,
    ...(formatSize(product) ? { size: formatSize(product) } : {}),
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
