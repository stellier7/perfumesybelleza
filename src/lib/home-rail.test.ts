import assert from "node:assert/strict";
import test from "node:test";
import { CATALOG_SECTIONS } from "./catalog-section";
import { homeRailItems } from "./home-rail";

test("el inicio lista perfumes, cuidado, skincare y el resto de departamentos", () => {
  const items = homeRailItems();
  assert.deepEqual(
    items.map((item) => item.title),
    [
      "Perfumes",
      "Cuidado personal",
      "Skincare coreano",
      "Perfumes árabes",
      "Perfumes de diseñador",
      "Inspiraciones",
    ],
  );
  const korean = items.find((item) => item.title === "Skincare coreano");
  assert.ok(korean);
  const koreanHref = decodeURIComponent(korean.href.replaceAll("+", " "));
  assert.match(koreanHref, /seccion=cuidado/);
  assert.match(koreanHref, /categoria=Skincare coreano/);
  for (const section of CATALOG_SECTIONS) {
    assert.ok(
      items.some((item) => {
        const href = decodeURIComponent(item.href.replaceAll("+", " "));
        return href.includes(`seccion=${section}`) && !href.includes("categoria=");
      }),
    );
  }
  assert.equal(new Set(items.map((item) => item.href)).size, items.length);
});
