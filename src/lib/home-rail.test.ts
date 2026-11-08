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
    ["Perfumes", "Cuidado personal"],
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

test("cuidado personal pone skincare primero y suma las categorías nuevas", () => {
  const cuidado = homeDepartments([...shelf, item("beauty", "Gel de baño")]).find(
    (department) => department.id === "cuidado",
  );
  assert.ok(cuidado);
  assert.deepEqual(
    cuidado.children.map((card) => card.title),
    ["Skincare coreano", "Acondicionador", "Gel de baño", "Shampoo"],
  );
  assert.equal(cuidado.children[0]?.text, "2 productos");
  const korean = decodeURIComponent(cuidado.children[0]?.href.replaceAll("+", " ") ?? "");
  assert.match(korean, /seccion=cuidado/);
  assert.match(korean, /categoria=Skincare coreano/);
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
