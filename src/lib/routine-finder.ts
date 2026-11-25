import { PAGE_SIZE } from "@/config";
import { orderByFame } from "@/lib/fame";
import { matchesAnyTerm } from "@/lib/match-term";

export const KOREAN_CATEGORY = "Skincare coreano";

export const FACIAL_CATEGORIES = [
  "Limpiador facial",
  "Tónico facial",
  "Suero facial",
  "Crema facial",
  "Protector solar",
  "Mascarilla facial",
  "Exfoliante facial",
] as const;

export const ROUTINE_STEPS = [
  { id: "limpiar", label: "Limpiar", detail: "Limpiadores y espumas." },
  { id: "tonificar", label: "Tonificar", detail: "Tónicos y esencias ligeras." },
  { id: "tratar", label: "Tratar", detail: "Sérums, ampollas y esencias." },
  { id: "hidratar", label: "Hidratar", detail: "Cremas y emulsiones." },
  { id: "proteger", label: "Proteger", detail: "Protectores solares." },
  { id: "mascarilla", label: "Mascarilla", detail: "Mascarillas y parches." },
  { id: "exfoliar", label: "Exfoliar", detail: "Exfoliantes." },
] as const;

export type RoutineStepId = (typeof ROUTINE_STEPS)[number]["id"];

export const SKIN_TYPES = [
  { id: "mixta", label: "Mixta", terms: ["mixta", "mixtas"] },
  { id: "seca", label: "Seca", terms: ["seca", "secas"] },
  { id: "grasa", label: "Grasa", terms: ["grasa", "grasas"] },
  { id: "sensible", label: "Sensible", terms: ["sensible", "sensibles"] },
] as const;

export type SkinTypeId = (typeof SKIN_TYPES)[number]["id"];

export const INGREDIENT_PREFS = [
  { id: "niacinamida", label: "Niacinamida", terms: ["niacinamida", "niacinamide"] },
  { id: "centella", label: "Centella", terms: ["centella"] },
  { id: "caracol", label: "Mucina de caracol", terms: ["caracol", "snail"] },
  { id: "hialuronico", label: "Ácido hialurónico", terms: ["hialurón", "hyaluron"] },
  { id: "retinol", label: "Retinol", terms: ["retinol"] },
  { id: "bakuchiol", label: "Bakuchiol", terms: ["bakuchiol"] },
] as const;

export type IngredientId = (typeof INGREDIENT_PREFS)[number]["id"];

const CATEGORY_STEP: Record<(typeof FACIAL_CATEGORIES)[number], RoutineStepId> = {
  "Limpiador facial": "limpiar",
  "Tónico facial": "tonificar",
  "Suero facial": "tratar",
  "Crema facial": "hidratar",
  "Protector solar": "proteger",
  "Mascarilla facial": "mascarilla",
  "Exfoliante facial": "exfoliar",
};

const NAME_STEPS: Array<{ id: RoutineStepId; terms: readonly string[] }> = [
  { id: "proteger", terms: ["solar", "sunscreen", "spf", "sun"] },
  { id: "exfoliar", terms: ["exfoli", "peeling", "scrub"] },
  { id: "mascarilla", terms: ["mascarilla", "mask", "parche", "patch", "hydrogel"] },
  { id: "limpiar", terms: ["limpiador", "cleans", "espuma", "foam"] },
  { id: "tonificar", terms: ["tónico", "toner"] },
  { id: "tratar", terms: ["sérum", "serum", "ampolla", "ampoule", "essence", "esencia"] },
  { id: "hidratar", terms: ["crema", "cream", "loción", "emulsión", "emulsion", "moisturizer"] },
];

export type RoutineProduct = {
  id: string;
  brand: string;
  name: string;
  category: string;
  description: string;
  isReference: boolean;
};

export type RoutineQuery = {
  step: RoutineStepId | "";
  korean: boolean;
  skin: SkinTypeId | "";
  ingredient: IngredientId | "";
  page: number;
};

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function isStep(value: string): value is RoutineStepId {
  return ROUTINE_STEPS.some((step) => step.id === value);
}

function isSkin(value: string): value is SkinTypeId {
  return SKIN_TYPES.some((skin) => skin.id === value);
}

function isIngredient(value: string): value is IngredientId {
  return INGREDIENT_PREFS.some((item) => item.id === value);
}

export function parseRoutineQuery(searchParams: Record<string, string | string[] | undefined>): RoutineQuery {
  const page = Number(first(searchParams.pagina));
  const step = first(searchParams.paso);
  const skin = first(searchParams.piel);
  const ingredient = first(searchParams.ingrediente);
  return {
    step: isStep(step) ? step : "",
    korean: first(searchParams.coreano) === "1",
    skin: isSkin(skin) ? skin : "",
    ingredient: isIngredient(ingredient) ? ingredient : "",
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

export function routineHref(query: RoutineQuery, page = query.page): string {
  const params = new URLSearchParams();
  if (query.step) params.set("paso", query.step);
  if (query.korean) params.set("coreano", "1");
  if (query.skin) params.set("piel", query.skin);
  if (query.ingredient) params.set("ingrediente", query.ingredient);
  if (page > 1) params.set("pagina", String(page));
  const search = params.toString();
  return search ? `/rutina?${search}` : "/rutina";
}

function isFacialCategory(category: string): category is (typeof FACIAL_CATEGORIES)[number] {
  return (FACIAL_CATEGORIES as readonly string[]).includes(category);
}

export function routineStep(product: Pick<RoutineProduct, "name" | "category">): RoutineStepId | null {
  if (isFacialCategory(product.category)) return CATEGORY_STEP[product.category];
  if (product.category !== KOREAN_CATEGORY) return null;
  for (const step of NAME_STEPS) {
    if (matchesAnyTerm(product.name, step.terms)) return step.id;
  }
  return null;
}

function skinTerms(id: SkinTypeId): readonly string[] {
  const skin = SKIN_TYPES.find((item) => item.id === id);
  if (!skin) throw new Error(`Tipo de piel sin términos: ${id}`);
  return skin.terms;
}

function ingredientTerms(id: IngredientId): readonly string[] {
  const ingredient = INGREDIENT_PREFS.find((item) => item.id === id);
  if (!ingredient) throw new Error(`Ingrediente sin términos: ${id}`);
  return ingredient.terms;
}

export function filterRoutine<T extends RoutineProduct>(
  products: readonly T[],
  query: RoutineQuery,
): { items: T[]; total: number; pages: number; page: number } {
  const list = orderByFame(products.filter((product) => {
    if (product.isReference) return false;
    if (query.korean && product.category !== KOREAN_CATEGORY) return false;
    const step = routineStep(product);
    if (!step) return false;
    if (query.step && step !== query.step) return false;
    if (query.skin && !matchesAnyTerm(product.description, skinTerms(query.skin))) return false;
    if (query.ingredient && !matchesAnyTerm(`${product.name} ${product.description}`, ingredientTerms(query.ingredient))) {
      return false;
    }
    return true;
  }));
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(query.page, pages);
  const start = (page - 1) * PAGE_SIZE;
  return { items: list.slice(start, start + PAGE_SIZE), total, pages, page };
}
