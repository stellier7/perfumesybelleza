import assert from "node:assert/strict";
import test from "node:test";
import { filterRoutine, routineStep, type RoutineProduct } from "./routine-finder";

function item(overrides: Partial<RoutineProduct> & Pick<RoutineProduct, "id" | "name" | "category">): RoutineProduct {
  return {
    brand: "Anua",
    description: "",
    isReference: false,
    ...overrides,
  };
}

test("el paso sale de la categoría facial o del nombre coreano", () => {
  assert.equal(routineStep(item({ id: "crema", name: "Bean Essence", category: "Crema facial" })), "hidratar");
  assert.equal(
    routineStep(item({ id: "essence", name: "Bean Essence 50ml", category: "Skincare coreano" })),
    "tratar",
  );
  assert.equal(routineStep(item({ id: "sun", name: "Relief Sun 50ml", category: "Skincare coreano" })), "proteger");
  assert.equal(routineStep(item({ id: "shampoo", name: "Shampoo", category: "Shampoo" })), null);
});

test("una descripción genérica de crema no cambia el paso de un sérum coreano", () => {
  const serum = item({
    id: "serum",
    name: "Advanced Snail 96 Mucin Power Essence",
    category: "Skincare coreano",
    description: "Crema facial de 100 ml.",
  });
  assert.equal(routineStep(serum), "tratar");
});

test("coreano, piel e ingrediente solo usan lo escrito en la ficha", () => {
  const products = [
    item({
      id: "anua",
      name: "Niacinamide Serum",
      category: "Skincare coreano",
      description: "Ayuda a pieles mixtas. Activos destacados: niacinamida.",
    }),
    item({
      id: "bio",
      name: "Crema",
      category: "Crema facial",
      description: "Para pieles mixtas con niacinamida.",
    }),
    item({
      id: "sun",
      name: "Relief Sun",
      category: "Skincare coreano",
      description: "Protector solar.",
    }),
  ];
  const korean = filterRoutine(products, { step: "", korean: true, skin: "", ingredient: "", page: 1 });
  assert.deepEqual(
    korean.items.map((product) => product.id).sort(),
    ["anua", "sun"],
  );
  const mixed = filterRoutine(products, { step: "tratar", korean: true, skin: "mixta", ingredient: "niacinamida", page: 1 });
  assert.deepEqual(
    mixed.items.map((product) => product.id),
    ["anua"],
  );
});
