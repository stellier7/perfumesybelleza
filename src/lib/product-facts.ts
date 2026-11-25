import { GENDER_LABEL } from "@/config";
import { catalogSection } from "@/lib/catalog-section";
import { formatSize } from "@/lib/catalog-model";
import { assertNever } from "@/lib/text";
import type { FragranceNotes, Gender, ProductType } from "@/types/catalog";

const CONCENTRATIONS = new Set([
  "Eau de Parfum",
  "Eau de Toilette",
  "Parfum",
  "Extrait de Parfum",
  "Eau de Cologne",
  "Pure Parfum",
  "Perfume",
  "Aceite concentrado",
]);

export type ProductFact = {
  label: string;
  value: string;
};

export type FactSource = {
  type: ProductType;
  gender: Gender;
  category: string;
  description: string;
  sizeMl: number | null;
  sizeLabel?: string;
  notes: FragranceNotes;
  inStock: boolean;
};

export function highlightedActives(description: string): string | null {
  const match = description.match(/Activos destacados:\s*([^.]*)/i);
  const value = match?.[1]?.replace(/\s+/g, " ").trim();
  return value ? value : null;
}

export function hasFragranceNotes(notes: FragranceNotes): boolean {
  return notes.top.length + notes.heart.length + notes.base.length > 0;
}

export function productFacts(product: FactSource): ProductFact[] {
  const size = formatSize(product);
  const facts: ProductFact[] = [];
  const section = catalogSection(product.type);
  switch (section) {
    case "perfumes":
      facts.push({
        label: CONCENTRATIONS.has(product.category) ? "Concentración" : "Categoría",
        value: product.category,
      });
      facts.push({ label: "Público", value: GENDER_LABEL[product.gender] });
      break;
    case "cuidado":
      facts.push({ label: "Tipo", value: product.category });
      break;
    default:
      return assertNever(section);
  }
  if (size) facts.push({ label: "Tamaño", value: size });
  facts.push({ label: "Disponibilidad", value: product.inStock ? "Disponible" : "Agotado" });
  if (section === "cuidado") {
    const actives = highlightedActives(product.description);
    if (actives) facts.push({ label: "Activos en la ficha", value: actives });
  }
  return facts;
}
