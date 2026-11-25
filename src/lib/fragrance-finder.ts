import { PAGE_SIZE } from "@/config";
import { catalogSection } from "@/lib/catalog-section";
import { orderByFame } from "@/lib/fame";
import { matchesAnyTerm } from "@/lib/match-term";
import { GENDERS, type Gender, type ProductType } from "@/types/catalog";

export const FRAGRANCE_FAMILIES = [
  { id: "dulce", label: "Dulce", terms: ["dulce", "vainilla", "vanilla", "caramelo", "chocolate", "miel", "gourmand"] },
  { id: "floral", label: "Floral", terms: ["floral", "rosa", "rose", "jazmín", "jasmine", "peonia", "peony"] },
  { id: "fresco", label: "Fresco", terms: ["fresco", "fresh", "acuático", "aqua", "marine", "marino"] },
  { id: "amaderado", label: "Amaderado", terms: ["amaderado", "madera", "woody", "oud", "sándalo", "cedro"] },
  { id: "citrico", label: "Cítrico", terms: ["cítrico", "limón", "bergamota", "naranja", "citrus"] },
  { id: "oriental", label: "Oriental", terms: ["oriental", "ámbar", "amber", "especiado", "incienso"] },
  { id: "intenso", label: "Intenso", terms: ["intenso", "intense", "elixir", "extrait"] },
  { id: "ligero", label: "Ligero", terms: ["ligero", "light", "eau fraiche", "eau fraîche"] },
] as const;

export type FragranceFamilyId = (typeof FRAGRANCE_FAMILIES)[number]["id"];

export const FRAGRANCE_CONCENTRATIONS = [
  "Eau de Parfum",
  "Eau de Toilette",
  "Parfum",
  "Extrait de Parfum",
  "Eau de Cologne",
  "Pure Parfum",
] as const;

export type FragranceQuery = {
  gender: Gender | "";
  type: "designer" | "arabic" | "";
  concentration: string;
  family: FragranceFamilyId | "";
  page: number;
};

export type FinderProduct = {
  id: string;
  brand: string;
  type: ProductType;
  gender: Gender;
  category: string;
  name: string;
  description: string;
  tags: string[];
  isReference: boolean;
};

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function isGender(value: string): value is Gender {
  return (GENDERS as readonly string[]).includes(value);
}

function isFamily(value: string): value is FragranceFamilyId {
  return FRAGRANCE_FAMILIES.some((family) => family.id === value);
}

export function parseFragranceQuery(
  searchParams: Record<string, string | string[] | undefined>,
): FragranceQuery {
  const type = first(searchParams.tipo);
  const concentration = first(searchParams.concentracion);
  const family = first(searchParams.familia);
  const page = Number(first(searchParams.pagina));
  return {
    gender: isGender(first(searchParams.genero)) ? first(searchParams.genero) as Gender : "",
    type: type === "designer" || type === "arabic" ? type : "",
    concentration: (FRAGRANCE_CONCENTRATIONS as readonly string[]).includes(concentration) ? concentration : "",
    family: isFamily(family) ? family : "",
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

export function fragranceHref(query: FragranceQuery, page = query.page): string {
  const params = new URLSearchParams();
  if (query.gender) params.set("genero", query.gender);
  if (query.type) params.set("tipo", query.type);
  if (query.concentration) params.set("concentracion", query.concentration);
  if (query.family) params.set("familia", query.family);
  if (page > 1) params.set("pagina", String(page));
  const search = params.toString();
  return search ? `/encontrar?${search}` : "/encontrar";
}

function familyTerms(id: FragranceFamilyId): readonly string[] {
  const family = FRAGRANCE_FAMILIES.find((item) => item.id === id);
  if (!family) throw new Error(`Familia sin términos: ${id}`);
  return family.terms;
}

export function matchesFragranceFamily(product: Pick<FinderProduct, "name" | "description" | "tags" | "category">, family: FragranceFamilyId): boolean {
  const haystack = [product.name, product.description, product.category, ...product.tags].join(" ");
  return matchesAnyTerm(haystack, familyTerms(family));
}

export function filterFragrances<T extends FinderProduct>(
  products: readonly T[],
  query: FragranceQuery,
): { items: T[]; total: number; pages: number; page: number } {
  const list = orderByFame(products.filter((product) => {
    if (product.isReference || catalogSection(product.type) !== "perfumes") return false;
    if (query.gender && product.gender !== query.gender) return false;
    if (query.type && product.type !== query.type) return false;
    if (query.concentration && product.category !== query.concentration) return false;
    if (query.family && !matchesFragranceFamily(product, query.family)) return false;
    return true;
  }));
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(query.page, pages);
  const start = (page - 1) * PAGE_SIZE;
  return { items: list.slice(start, start + PAGE_SIZE), total, pages, page };
}
