import "server-only";
import { rawProducts } from "../../data/products";
import {
  buildCatalog,
  canonicalListingSlug,
  comparisonPairs,
  listedProducts,
  toSearchRecord,
  type ComparisonPair,
} from "@/lib/catalog-model";
import type { PublicProduct, SearchRecord } from "@/types/catalog";

const catalog = buildCatalog(rawProducts);
const sellable = catalog.filter((product) => !product.isReference);
const visibleSellable = listedProducts(sellable);
const visibleIds = new Set(visibleSellable.map((product) => product.id));

export function getCatalog(): PublicProduct[] {
  return catalog;
}

/** Lo que se muestra en la tienda y en la búsqueda. Un perfume repetido queda una sola vez, al precio más alto. */
export function getBrowsableCatalog(): PublicProduct[] {
  return catalog.filter((product) => product.isReference || visibleIds.has(product.id));
}

export function getSellableProducts(): PublicProduct[] {
  return visibleSellable;
}

export function getProductBySlug(slug: string): PublicProduct | null {
  return catalog.find((product) => product.slug === slug) ?? null;
}

export function canonicalProductSlug(slug: string): string | null {
  const product = getProductBySlug(slug);
  if (!product || product.isReference) return product?.slug ?? null;
  return canonicalListingSlug(product, sellable);
}

export function getSearchRecords(): SearchRecord[] {
  return getBrowsableCatalog().map(toSearchRecord);
}

export function getComparisonPairs(): ComparisonPair[] {
  return comparisonPairs(getBrowsableCatalog());
}

export function getComparisonBySlug(slug: string): ComparisonPair | null {
  return getComparisonPairs().find((pair) => pair.slug === slug) ?? null;
}

export function getFeaturedProducts(): PublicProduct[] {
  return getSellableProducts().filter((product) => product.featured && product.inStock);
}
