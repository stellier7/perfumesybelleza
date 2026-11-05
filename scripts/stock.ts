import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { listStock, setProductStock, type StockMode } from "../src/lib/stock-file";

const filePath = path.join(process.cwd(), "data", "products.ts");

function isMode(value: string): value is StockMode {
  return value === "toggle" || value === "on" || value === "off";
}

const source = readFileSync(filePath, "utf8");
const [slug, modeArg] = process.argv.slice(2);

if (!slug) {
  const rows = listStock(source);
  if (rows.length === 0) {
    console.log("No hay productos en data/products.ts.");
    process.exit(0);
  }
  for (const row of rows) {
    console.log(`${row.inStock ? "disponible" : "agotado   "}  ${row.slug}  ${row.name}`);
  }
  console.log("\nUso: npm run stock -- <slug> [on|off]");
  process.exit(0);
}

const mode = modeArg ?? "toggle";
if (!isMode(mode)) {
  console.error('El segundo argumento debe ser "on" u "off". Sin argumento, alterna la existencia.');
  process.exit(1);
}

try {
  const updated = setProductStock(source, slug, mode);
  writeFileSync(filePath, updated.source);
  console.log(`${slug}: ${updated.inStock ? "disponible" : "agotado"}`);
} catch (error) {
  const message = error instanceof Error ? error.message : "No se pudo actualizar la existencia.";
  console.error(message);
  process.exit(1);
}
