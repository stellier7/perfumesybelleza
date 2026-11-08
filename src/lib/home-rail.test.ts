import assert from "node:assert/strict";
import test from "node:test";
import { CATALOG_SECTIONS } from "./catalog-section";
import { homeDepartments, type ShelfItem } from "./home-rail";

function item(type: ShelfItem["type"], category: string, inspired = false): ShelfItem {
  return { type, category, inspired };
}

const shelf: ShelfItem[] = [
  item("arabic", "Eau de Parfum"),
  item("designer", "Eau de Parfum"),
  item("arabic", "Set", true),
  item("designer", "Set"),
  item("beauty", "Shampoo"),
  item("beauty", "Skincare coreano"),
  item("beauty", "Skincare coreano"),
  item("beauty", "Acondicionador"),
];

test("el inicio abre perfumes en árabes, diseñador, sets e inspiraciones", () => {
  const departments = homeDepartments(shelf);
  assert.deepEqual(
    departments.map((department) => department.title),
    ["Perfumes", "Cuidado personal", "Skincare coreano"],
  );
  const perfumes = departments[0];
  assert.ok(perfumes);
  assert.deepEqual(
    perfumes.children.map((card) => card.title),
    ["Árabes", "Diseñador", "Sets", "Inspiraciones"],
  );
  const sets = perfumes.children.find((card) => card.title === "Sets");
  assert.ok(sets);
  const setsHref = decodeURIComponent(sets.href.replaceAll("+", " "));
  assert.match(setsHref, /seccion=perfumes/);
  assert.match(setsHref, /categoria=Set/);
  assert.doesNotMatch(setsHref, /tipo=/);
});

test("cuidado personal queda en cabello y cuerpo, y suma las categorías nuevas", () => {
  const cuidado = homeDepartments([...shelf, item("beauty", "Gel de baño")]).find(
    (department) => department.id === "cuidado",
  );
  assert.ok(cuidado);
  assert.deepEqual(
    cuidado.children.map((card) => card.title),
    ["Acondicionador", "Gel de baño", "Shampoo"],
  );
  assert.equal(cuidado.text, "Cabello, cuerpo y el cuidado de todos los días.");
});

test("belleza agrupa maquillaje y el resto de belleza, y skincare coreano va aparte", () => {
  const departments = homeDepartments([
    ...shelf,
    item("beauty", "Maquillaje"),
    item("beauty", "Maquillaje"),
    item("beauty", "Uñas"),
    item("beauty", "Crema facial"),
  ]);
  assert.deepEqual(
    departments.map((department) => department.title),
    ["Perfumes", "Cuidado personal", "Belleza", "Skincare coreano"],
  );
  const belleza = departments.find((department) => department.id === "belleza");
  assert.ok(belleza);
  assert.equal(belleza.image, "/home/cuidado-maquillaje.webp");
  assert.deepEqual(
    belleza.children.map((card) => card.title),
    ["Maquillaje", "Uñas", "Crema facial"],
  );
  assert.equal(belleza.children[0]?.text, "2 productos");
  const makeup = decodeURIComponent(belleza.children[0]?.href.replaceAll("+", " ") ?? "");
  assert.match(makeup, /seccion=cuidado/);
  assert.match(makeup, /categoria=Maquillaje/);
  const korean = departments.find((department) => department.id === "skincare-coreano");
  assert.ok(korean);
  assert.deepEqual(korean.children, []);
  assert.equal(korean.image, "/home/cuidado-skincare-coreano.webp");
  const href = decodeURIComponent(korean.href.replaceAll("+", " "));
  assert.match(href, /seccion=cuidado/);
  assert.match(href, /categoria=Skincare coreano/);
  const cuidado = departments.find((department) => department.id === "cuidado");
  assert.deepEqual(cuidado?.children.map((card) => card.title), ["Acondicionador", "Shampoo"]);
});

test("un estante sin sets ni inspiraciones no inventa esos botones", () => {
  const perfumes = homeDepartments([item("arabic", "Eau de Parfum")])[0];
  assert.deepEqual(
    perfumes?.children.map((card) => card.title),
    ["Árabes"],
  );
});

test("cada sección de la tienda tiene un departamento", () => {
  const ids = homeDepartments(shelf).map((department) => department.id);
  for (const section of CATALOG_SECTIONS) assert.ok(ids.includes(section));
});
