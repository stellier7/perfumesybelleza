import { PAGE_SIZE } from "@/config";
import { catalogSection, isCatalogSection, type CatalogSection } from "@/lib/catalog-section";
import { assertNever } from "@/lib/text";
import { GENDERS, PRODUCT_TYPES, type Gender, type ProductType, type PublicProduct } from "@/types/catalog";

export const INSPIRATIONS_CATEGORY = "Inspiraciones";

export const SORT_KEYS = ["destacados", "precio-asc", "precio-desc", "nombre"] as const;
export type SortKey = (typeof SORT_KEYS)[number];

export type CatalogFilters = {
  seccion: CatalogSection;
  tipo: ProductType | "";
  marca: string;
  genero: Gender | "";
  categoria: string;
  min: number | null;
  max: number | null;
  stock: boolean;
  orden: SortKey;
  pagina: number;
};

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function isProductType(value: string): value is ProductType {
  return (PRODUCT_TYPES as readonly string[]).includes(value);
}

function isGender(value: string): value is Gender {
  return (GENDERS as readonly string[]).includes(value);
}

function isSortKey(value: string): value is SortKey {
  return (SORT_KEYS as readonly string[]).includes(value);
}

function numberOrNull(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
}

export function parseCatalogFilters(
  searchParams: Record<string, string | string[] | undefined>,
): CatalogFilters {
  const tipoValue = first(searchParams.tipo);
  const generoValue = first(searchParams.genero);
  const ordenValue = first(searchParams.orden);
  const pagina = Number(first(searchParams.pagina));
  const tipo = isProductType(tipoValue) ? tipoValue : "";
  const seccionValue = first(searchParams.seccion);
  const seccion: CatalogSection = isCatalogSection(seccionValue)
    ? seccionValue
    : tipo === "beauty"
      ? "cuidado"
      : "perfumes";
  return {
    seccion,
    tipo: tipo && catalogSection(tipo) === seccion ? tipo : "",
    marca: first(searchParams.marca).trim(),
    genero: isGender(generoValue) ? generoValue : "",
    categoria: first(searchParams.categoria).trim(),
    min: numberOrNull(first(searchParams.min)),
    max: numberOrNull(first(searchParams.max)),
    stock: first(searchParams.stock) === "1",
    orden: isSortKey(ordenValue) ? ordenValue : "destacados",
    pagina: Number.isInteger(pagina) && pagina > 0 ? pagina : 1,
  };
}

function priced(price: number, descending = false): number {
  if (price <= 0) return Number.POSITIVE_INFINITY;
  return descending ? -price : price;
}

function sortProducts(products: PublicProduct[], orden: SortKey): PublicProduct[] {
  const list = [...products];
  const byName = (a: PublicProduct, b: PublicProduct) => a.name.localeCompare(b.name, "es");
  switch (orden) {
    case "precio-asc":
      return list.sort((a, b) => priced(a.price) - priced(b.price) || byName(a, b));
    case "precio-desc":
      return list.sort((a, b) => priced(b.price, true) - priced(a.price, true) || byName(a, b));
    case "nombre":
      return list.sort(byName);
    case "destacados":
      return list.sort(
        (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || byName(a, b),
      );
    default:
      return assertNever(orden);
  }
}

export function applyCatalogFilters(
  products: PublicProduct[],
  filters: CatalogFilters,
): { items: PublicProduct[]; total: number; pages: number; page: number } {
  let list = products.filter(
    (product) => !product.isReference && catalogSection(product.type) === filters.seccion,
  );
  if (filters.tipo) list = list.filter((product) => product.type === filters.tipo);
  if (filters.marca) list = list.filter((product) => product.brand === filters.marca);
  if (filters.genero) list = list.filter((product) => product.gender === filters.genero);
  if (filters.seccion === "perfumes" && filters.categoria === INSPIRATIONS_CATEGORY) {
    list = list.filter((product) => product.inspiredBy.length > 0);
  } else if (filters.categoria) {
    list = list.filter((product) => product.category === filters.categoria);
  }
  if (filters.min !== null) list = list.filter((product) => product.price >= filters.min!);
  if (filters.max !== null) list = list.filter((product) => product.price <= filters.max!);
  if (filters.stock) list = list.filter((product) => product.inStock);
  list = sortProducts(list, filters.orden);
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(filters.pagina, pages);
  const start = (page - 1) * PAGE_SIZE;
  return { items: list.slice(start, start + PAGE_SIZE), total, pages, page };
}

export function catalogFilterQuery(filters: CatalogFilters, page = filters.pagina): string {
  const params = new URLSearchParams();
  params.set("seccion", filters.seccion);
  if (filters.tipo) params.set("tipo", filters.tipo);
  if (filters.marca) params.set("marca", filters.marca);
  if (filters.genero) params.set("genero", filters.genero);
  if (filters.categoria) params.set("categoria", filters.categoria);
  if (filters.min !== null) params.set("min", String(filters.min));
  if (filters.max !== null) params.set("max", String(filters.max));
  if (filters.stock) params.set("stock", "1");
  if (filters.orden !== "destacados") params.set("orden", filters.orden);
  if (page > 1) params.set("pagina", String(page));
  const query = params.toString();
  return query ? `?${query}` : "";
}
