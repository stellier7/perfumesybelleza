import assert from "node:assert/strict";
import test from "node:test";
import {
  BUILD_COMPARISON_PAGES,
  BUILD_PRODUCT_PAGES,
  prerenderComparisonParams,
  prerenderProductParams,
  type PrerenderProduct,
} from "./prerender-paths";

function product(slug: string, extra: Partial<PrerenderProduct> = {}): PrerenderProduct {
  return { slug, inStock: true, isReference: false, featured: false, ...extra };
}

test("el build deja listas las destacadas y un cupo fijo, no el catálogo entero", () => {
  const products = [
    product("zeta"),
    product("alfa", { featured: true }),
    product("beta"),
    ...Array.from({ length: 80 }, (_, index) => product(`otro-${index}`)),
  ];
  const params = prerenderProductParams(products);
  assert.equal(params[0]?.slug, "alfa");
  assert.equal(params.length, BUILD_PRODUCT_PAGES);
  assert.ok(params.length < products.length);
  assert.equal(params.filter((item) => item.slug === "alfa").length, 1);
});

test("un catálogo más chico que el cupo se genera completo, destacadas primero", () => {
  const params = prerenderProductParams([
    product("uno"),
    product("dos", { featured: true }),
    product("tres", { inStock: false }),
  ]);
  assert.deepEqual(
    params.map((item) => item.slug),
    ["dos", "uno", "tres"],
  );
});

test("sin productos no inventa una ficha", () => {
  assert.deepEqual(prerenderProductParams([]), []);
});

test("las comparaciones del inicio entran en el build y el resto espera la primera visita", () => {
  const slugs = Array.from({ length: 40 }, (_, index) => `par-${index}`);
  const params = prerenderComparisonParams(slugs);
  assert.equal(params.length, BUILD_COMPARISON_PAGES);
  assert.equal(params[0]?.pair, "par-0");
  assert.equal(params[3]?.pair, "par-3");
});

test("sin comparaciones deja el placeholder que el build exige", () => {
  assert.deepEqual(prerenderComparisonParams([]), [{ pair: "sin-comparaciones" }]);
});
