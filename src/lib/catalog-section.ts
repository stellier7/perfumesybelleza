import { assertNever } from "@/lib/text";
import { PRODUCT_TYPES, type ProductType } from "@/types/catalog";

/** La perfumería y el cuidado personal son secciones distintas. */
export const CATALOG_SECTIONS = ["perfumes", "cuidado"] as const;
export type CatalogSection = (typeof CATALOG_SECTIONS)[number];

export function isCatalogSection(value: string): value is CatalogSection {
  return (CATALOG_SECTIONS as readonly string[]).includes(value);
}

export function catalogSection(type: ProductType): CatalogSection {
  switch (type) {
    case "designer":
    case "arabic":
      return "perfumes";
    case "beauty":
      return "cuidado";
    default:
      return assertNever(type);
  }
}

export function sectionLabel(section: CatalogSection): string {
  switch (section) {
    case "perfumes":
      return "Perfumes";
    case "cuidado":
      return "Cuidado personal";
    default:
      return assertNever(section);
  }
}

export function sectionTypes(section: CatalogSection): ProductType[] {
  switch (section) {
    case "perfumes":
      return PRODUCT_TYPES.filter((type) => catalogSection(type) === "perfumes");
    case "cuidado":
      return PRODUCT_TYPES.filter((type) => catalogSection(type) === "cuidado");
    default:
      return assertNever(section);
  }
}
