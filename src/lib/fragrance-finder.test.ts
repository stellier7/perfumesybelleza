import assert from "node:assert/strict";
import test from "node:test";
import {
  filterFragrances,
  fragranceHref,
  matchesFragranceFamily,
  parseFragranceQuery,
  type FinderProduct,
} from "./fragrance-finder";

function perfume(overrides: Partial<FinderProduct> & Pick<FinderProduct, "id" | "name">): FinderProduct {
  return {
    brand: "Dior",
    type: "designer",
    gender: "mujer",
    category: "Eau de Parfum",
    description: "Eau de parfum de 100 ml.",
    tags: [],
    isReference: false,
    ...overrides,
  };
}

test("la familia floral usa el nombre y no una ficha genérica", () => {
  assert.equal(
    matchesFragranceFamily(perfume({ id: "rose", name: "Rose Passion" }), "floral"),
    true,
  );
  assert.equal(
    matchesFragranceFamily(perfume({ id: "plain", name: "Asad" }), "floral"),
    false,
  );
});

test("el buscador respeta tipo, género, concentración y descarta referencias", () => {
  const products = [
    perfume({ id: "dior", name: "Rose", type: "designer", gender: "mujer", category: "Eau de Parfum" }),
    perfume({ id: "lattafa", name: "Rose", type: "arabic", gender: "mujer" }),
    perfume({ id: "edt", name: "Rose", category: "Eau de Toilette" }),
    perfume({ id: "ref", name: "Rose", isReference: true }),
    perfume({ id: "crema", name: "Crema", type: "beauty", category: "Crema facial" }),
  ];
  const query = parseFragranceQuery({
    genero: "mujer",
    tipo: "designer",
    concentracion: "Eau de Parfum",
    familia: "floral",
  });
  const result = filterFragrances(products, query);
  assert.deepEqual(
    result.items.map((item) => item.id),
    ["dior"],
  );
  assert.equal(fragranceHref(query), "/encontrar?genero=mujer&tipo=designer&concentracion=Eau+de+Parfum&familia=floral");
});

test("una familia desconocida no filtra el catálogo", () => {
  const query = parseFragranceQuery({ familia: "oud-inventado" });
  assert.equal(query.family, "");
});
