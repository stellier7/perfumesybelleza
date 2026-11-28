import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { JsonLd } from "@/components/json-ld";
import { NotesPyramid, RatingMeter } from "@/components/notes-pyramid";
import { ProductCard } from "@/components/product-card";
import { ProductActions, ProductGallery, ViewContent, type PurchaseTarget } from "@/components/product-purchase";
import { RememberProduct } from "@/components/recent-rail";
import { Shell } from "@/components/shell";
import { SHIPPING_LPS, TYPE_LABEL, store } from "@/config";
import { canonicalProductSlug, getBrowsableCatalog, getCatalog, getProductBySlug } from "@/lib/catalog";
import {
  comparisonSlug,
  displayTitle,
  formatSize,
  productSuggestions,
  type ProductSuggestionGroup,
} from "@/lib/catalog-model";
import { catalogSection } from "@/lib/catalog-section";
import { productFacts } from "@/lib/product-facts";
import { fold } from "@/lib/text";
import { formatPrice, hasShelfPrice } from "@/lib/pricing";
import { prerenderProductParams } from "@/lib/prerender-paths";
import type { PublicProduct } from "@/types/catalog";

type ProductParams = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  const params = prerenderProductParams(getCatalog());
  if (params.length > 0) return params;
  return [{ slug: "sin-producto" }];
}

export async function generateMetadata({ params }: ProductParams): Promise<Metadata> {
  const slug = (await params).slug;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Producto" };
  const canonical = canonicalProductSlug(slug) ?? product.slug;
  const title = product.isReference ? `${displayTitle(product)}: alternativas` : displayTitle(product);
  return {
    title,
    description: product.description,
    alternates: { canonical: `/producto/${canonical}` },
    openGraph: {
      title,
      description: product.description,
      images: product.images.slice(0, 1),
    },
  };
}

export default async function ProductPage({ params }: ProductParams) {
  const slug = (await params).slug;
  const canonical = canonicalProductSlug(slug);
  if (canonical && canonical !== slug) permanentRedirect(`/producto/${canonical}`);
  return (
    <Suspense fallback={<Shell className="py-12">Cargando producto…</Shell>}>
      <ProductScreen params={params} />
    </Suspense>
  );
}

async function ProductScreen({ params }: ProductParams) {
  const slug = (await params).slug;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const purchase = toPurchase(product);
  const suggestions = productSuggestions(product, getBrowsableCatalog());
  const title = displayTitle(product);
  const facts = productFacts(product);
  const section = catalogSection(product.type);
  const brandHref = `/tienda?${new URLSearchParams({ seccion: section, marca: product.brand }).toString()}`;

  return (
    <Shell className="py-6 md:py-10">
      <ViewContent product={purchase} />
      {!product.isReference ? (
        <RememberProduct
          item={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            brand: product.brand,
            price: product.price,
            image: product.images[0] ?? null,
            inStock: product.inStock,
            sizeLabel: formatSize(product) ?? undefined,
          }}
        />
      ) : null}
      {!product.isReference ? <JsonLd data={productJsonLd(product)} /> : null}
      <nav className="text-sm text-muted">
        <Link href="/tienda">Tienda</Link>
        <span> / </span>
        <span>{title}</span>
      </nav>
      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <ProductGallery images={product.images} name={title} />
        <div>
          <div className="max-md:pr-20">
            <p className="text-[0.7rem] uppercase tracking-[0.18em] text-gold">{TYPE_LABEL[product.type]}</p>
            <h1 className="mt-2 font-serif text-4xl leading-tight md:text-6xl">{title}</h1>
            {fold(title).includes(fold(product.brand)) ? null : (
              <p className="mt-2">
                <Link href={brandHref} className="text-muted underline-offset-4 hover:underline">
                  {product.brand}
                </Link>
              </p>
            )}
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
              {facts.length > 0 ? (
                <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line">
                  {facts.map((fact) => (
                    <div key={fact.label} className="bg-paper px-4 py-3">
                      <dt className="text-[0.68rem] uppercase tracking-[0.16em] text-muted">{fact.label}</dt>
                      <dd className="mt-1 text-sm">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              <div className="mt-4 rounded-3xl border border-line bg-stone/50 px-4 py-4 text-sm leading-6">
                <p>
                  Envío de {formatPrice(SHIPPING_LPS)} a todo Honduras con {store.carrier}. Los pedidos confirmados se
                  arman a las {store.orderFillTime} y la entrega tarda {store.shippingDays}.
                </p>
                <p className="mt-2">Pago por transferencia. El pedido se cierra por WhatsApp.</p>
              </div>
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
    case "family":
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
    name: displayTitle(product),
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
