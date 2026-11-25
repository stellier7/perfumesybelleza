import assert from "node:assert/strict";
import test from "node:test";
import { highlightedActives, productFacts, type FactSource } from "./product-facts";

function source(overrides: Partial<FactSource>): FactSource {
  return {
    type: "designer",
    gender: "mujer",
    category: "Eau de Parfum",
    description: "Eau de parfum de 80 ml.",
    sizeMl: 80,
    notes: { top: [], heart: [], base: [] },
    inStock: true,
    ...overrides,
  };
}

test("un perfume muestra concentración, público y tamaño", () => {
  const labels = productFacts(source({})).map((fact) => fact.label);
  assert.deepEqual(labels, ["Concentración", "Público", "Tamaño", "Disponibilidad"]);
  const set = productFacts(source({ category: "Set", sizeMl: null }));
  assert.equal(set[0]?.label, "Categoría");
  assert.equal(set.some((fact) => fact.label === "Tamaño"), false);
});

test("skincare muestra activos solo si la ficha los trae", () => {
  assert.equal(highlightedActives("Crema facial de 50 ml."), null);
  assert.equal(
    highlightedActives("Sérum. Activos destacados: niacinamida al 10% y centella."),
    "niacinamida al 10% y centella",
  );
  const facts = productFacts(
    source({
      type: "beauty",
      category: "Skincare coreano",
      description: "Sérum. Activos destacados: niacinamida al 10%.",
      sizeMl: 30,
    }),
  );
  assert.equal(facts.find((fact) => fact.label === "Activos en la ficha")?.value, "niacinamida al 10%");
  assert.equal(facts.some((fact) => fact.label === "Público"), false);
});
