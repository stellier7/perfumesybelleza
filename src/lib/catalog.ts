import "server-only";
import { rawProducts } from "../../data/products";
import {
  buildCatalog,
  comparisonPairs,
  toSearchRecord,
  type ComparisonPair,
} from "@/lib/catalog-model";
import type { PublicProduct, SearchRecord } from "@/types/catalog";

const catalog = buildCatalog(rawProducts);

export function getCatalog(): PublicProduct[] {
  return catalog;
}

export function getSellableProducts(): PublicProduct[] {
  return catalog.filter((product) => !product.isReference);
}

export function getProductBySlug(slug: string): PublicProduct | null {
  return catalog.find((product) => product.slug === slug) ?? null;
}

export function getSearchRecords(): SearchRecord[] {
  return catalog.map(toSearchRecord);
}

export function getComparisonPairs(): ComparisonPair[] {
  return comparisonPairs(catalog);
}

export function getComparisonBySlug(slug: string): ComparisonPair | null {
  return getComparisonPairs().find((pair) => pair.slug === slug) ?? null;
}

export function getFeaturedProducts(): PublicProduct[] {
  return getSellableProducts().filter((product) => product.featured && product.inStock);
}
