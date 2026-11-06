import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { TYPE_LABEL } from "../src/config";
import { roundPrice, publicPrice, formatPrice } from "../src/lib/pricing";
import {
  applyPriceBatch,
  listPrices,
  needsPrice,
  nextUnpriced,
  setProductCost,
  setProductPrice,
  PRICE_BATCH,
} from "../src/lib/price-file";
import type { ProductType } from "../src/types/catalog";

const filePath = path.join(process.cwd(), "data", "products.ts");

function isType(value: string): value is ProductType {
  return value === "designer" || value === "arabic" || value === "beauty";
}

function readAmount(raw: string): number {
  const parsed = Number(raw.replace(/[^\d]/g, ""));
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`"${raw}" no es un precio en lempiras.`);
  }
  return roundPrice(parsed);
}

function printBatch(source: string): void {
  const rows = listPrices(source);
  const pending = rows.filter(needsPrice);
  const batch = nextUnpriced(source, PRICE_BATCH);
  console.log(`Sin precio: ${pending.length}.`);
  if (batch.length === 0) {
    console.log("Todos los productos ya tienen precio.");
    return;
  }
  console.log(`Siguiente lote, ${batch.length}:\n`);
  batch.forEach((row, index) => {
    const type = isType(row.type) ? TYPE_LABEL[row.type] : row.type;
    const size = row.sizeMl ? `${row.sizeMl} ml` : "tamaño por confirmar";
    console.log(`${String(index + 1).padStart(2, " ")}. ${row.name} · ${row.brand} · ${type} · ${size}`);
    console.log(`    ${row.slug}`);
  });
  console.log("\nPrecios de venta, en este orden. Un guion (-) lo deja para después.");
  console.log("m460 guarda 460 como mayorista y la tienda calcula la venta.");
  console.log(`npm run price -- lote ${batch.map(() => "-").join(" ")}`);
}

const source = readFileSync(filePath, "utf8");
const [command, ...rest] = process.argv.slice(2);

try {
  if (!command) {
    printBatch(source);
    process.exit(0);
  }

  if (command === "lote") {
    if (rest.length === 0 || rest.length > PRICE_BATCH) {
      throw new Error(`Un lote lleva de 1 a ${PRICE_BATCH} valores.`);
    }
    const entries = rest.map((token) => {
      if (token === "-") return null;
      if (/^m\d+$/i.test(token)) return { kind: "cost" as const, amount: readAmount(token.slice(1)) };
      return { kind: "sale" as const, amount: readAmount(token) };
    });
    const updated = applyPriceBatch(source, entries);
    writeFileSync(filePath, updated.source);
    for (const row of updated.applied) {
      const label = row.kind === "cost" ? "mayorista" : "venta";
      console.log(`${row.slug}: ${label} ${formatPrice(row.amount)}`);
    }
    const left = listPrices(updated.source).filter(needsPrice).length;
    console.log(`Quedan ${left} sin precio.`);
    process.exit(0);
  }

  if (command === "venta" || command === "mayorista") {
    const [slug, raw] = rest;
    if (!slug || !raw) throw new Error(`Uso: npm run price -- ${command} <slug> <lempiras>`);
    const amount = readAmount(raw);
    const next =
      command === "venta" ? setProductPrice(source, slug, amount) : setProductCost(source, slug, amount);
    writeFileSync(filePath, next);
    if (command === "mayorista") {
      const row = listPrices(next).find((item) => item.slug === slug);
      const type = row && isType(row.type) ? row.type : "designer";
      console.log(`${slug}: mayorista ${formatPrice(amount)}, venta ${formatPrice(publicPrice(amount, type))}`);
    } else {
      console.log(`${slug}: ${formatPrice(amount)}`);
    }
    process.exit(0);
  }

  throw new Error('Usa "lote", "venta" o "mayorista". Sin argumento, muestra los siguientes 10.');
} catch (error) {
  const message = error instanceof Error ? error.message : "No se pudo guardar el precio.";
  console.error(message);
  process.exit(1);
}
