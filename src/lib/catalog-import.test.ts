import assert from "node:assert/strict";
import test from "node:test";
import { extractProductsFromHtml, htmlLooksLikeEmptyShell, parseCatalogCsv } from "./catalog-import.ts";

test("lee un CSV con el precio como costo", () => {
  const csv = [
    "name,brand,price,image path,category,type,gender,inspiredBy",
    'Tag Him,Armaf,"L 1,250.00",/tmp/tag.jpg,Eau de Parfum,arabic,hombre,bleu-de-chanel',
  ].join("\n");
  const [product] = parseCatalogCsv(csv);
  assert.equal(product?.cost, 1250);
  assert.equal(product?.type, "arabic");
  assert.equal(product?.gender, "hombre");
  assert.deepEqual(product?.inspiredBy, ["bleu-de-chanel"]);
  assert.deepEqual(product?.imageSources, ["/tmp/tag.jpg"]);
});

test("lee productos desde JSON-LD y detecta una página vacía", () => {
  const html = `<!doctype html><html><head>
    <script type="application/ld+json">
      {"@type":"Product","name":"Yara","brand":{"@type":"Brand","name":"Lattafa"},"offers":{"@type":"Offer","price":"440","priceCurrency":"HNL"},"image":"https://example.com/yara.jpg"}
    </script>
  </head><body><h1>Yara</h1></body></html>`;
  const [product] = extractProductsFromHtml(html);
  assert.equal(product?.name, "Yara");
  assert.equal(product?.brand, "Lattafa");
  assert.equal(product?.cost, 440);
  assert.equal(htmlLooksLikeEmptyShell(html), false);

  const shell = "<html><body><app-root></app-root></body></html>";
  assert.deepEqual(extractProductsFromHtml(shell), []);
  assert.equal(htmlLooksLikeEmptyShell(shell), true);
});
