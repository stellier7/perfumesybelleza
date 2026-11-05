import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import {
  extractProductsFromHtml,
  htmlLooksLikeEmptyShell,
  parseCatalogCsv,
  type ImportedProduct,
} from "../src/lib/catalog-import.ts";
import { listStock } from "../src/lib/stock-file.ts";
import { serializeProducts } from "../src/lib/serialize-catalog.ts";
import { slugify } from "../src/lib/text.ts";
import type { RawProduct } from "../src/types/catalog.ts";

function loadEnvLocal(): void {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator < 0) continue;
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function argValue(flag: string): string | null {
  const index = process.argv.indexOf(flag);
  if (index < 0) return null;
  return process.argv[index + 1] ?? null;
}

async function readSource(): Promise<{ products: ImportedProduct[]; label: string }> {
  const csvPath = argValue("--csv");
  if (csvPath) {
    const text = await readFile(csvPath, "utf8");
    const products = parseCatalogCsv(text);
    if (products.length === 0) {
      throw new Error(
        "El CSV no tiene productos válidos. Revisa las columnas name, brand, price, image path, category y type.",
      );
    }
    return { products, label: "CSV" };
  }

  const catalogUrl = process.env.CATALOG_URL?.trim();
  if (!catalogUrl) {
    throw new Error(
      "Indica un CSV con --csv o define CATALOG_URL en .env.local. Ejemplo: npm run import:catalog -- --csv datos.csv",
    );
  }

  let response: Response;
  try {
    response = await fetch(catalogUrl, {
      headers: {
        "user-agent": "PerfumesYBellezaCatalogImport/1.0",
        accept: "text/html,application/xhtml+xml",
      },
    });
  } catch {
    throw new Error("No se pudo conectar con el catálogo.");
  }
  if (!response.ok) {
    throw new Error(`No se pudo leer el catálogo (respuesta ${response.status}).`);
  }
  const html = await response.text();
  const products = extractProductsFromHtml(html);
  if (products.length === 0) {
    const shell = htmlLooksLikeEmptyShell(html);
    throw new Error(
      shell
        ? "No se encontraron productos: la página llega vacía y arma el catálogo en el navegador, sin un listado público en el HTML. Pasa un CSV: npm run import:catalog -- --csv datos.csv"
        : "No se encontraron productos en el HTML. Pasa un CSV: npm run import:catalog -- --csv datos.csv",
    );
  }
  return { products, label: "HTML" };
}

async function saveImage(source: string, filename: string): Promise<string> {
  const targetDir = path.join(process.cwd(), "public", "products");
  await mkdir(targetDir, { recursive: true });
  const bytes = source.startsWith("http://") || source.startsWith("https://")
    ? Buffer.from(await (await fetch(source)).arrayBuffer())
    : await readFile(source);
  const output = path.join(targetDir, filename);
  await sharp(bytes)
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(output);
  return `/products/${filename}`;
}

function uniqueSlug(base: string, used: Set<string>): string {
  let slug = base;
  let suffix = 2;
  while (used.has(slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  used.add(slug);
  return slug;
}

async function toRawProduct(
  product: ImportedProduct,
  slug: string,
  previousStock: Map<string, boolean>,
): Promise<RawProduct> {
  const images: string[] = [];
  for (const [index, source] of product.imageSources.entries()) {
    const filename = index === 0 ? `${slug}.webp` : `${slug}-${index + 1}.webp`;
    try {
      images.push(await saveImage(source, filename));
    } catch {
      console.warn(`No se pudo guardar una imagen de ${product.name}.`);
    }
  }
  return {
    id: slug,
    slug,
    name: product.name,
    brand: product.brand,
    type: product.type,
    gender: product.gender,
    cost: product.cost,
    images,
    description: product.description,
    notes: product.notes,
    sizeMl: product.sizeMl,
    inStock: product.inStock ?? previousStock.get(slug) ?? true,
    category: product.category,
    tags: product.tags,
    inspiredBy: product.inspiredBy.length > 0 ? product.inspiredBy : undefined,
  };
}

async function main(): Promise<void> {
  loadEnvLocal();
  const { products, label } = await readSource();
  const dataPath = path.join(process.cwd(), "data", "products.ts");
  const previousStock = existsSync(dataPath)
    ? new Map(listStock(readFileSync(dataPath, "utf8")).map((row) => [row.slug, row.inStock]))
    : new Map<string, boolean>();
  const used = new Set<string>();
  const raw: RawProduct[] = [];
  for (const product of products) {
    const slug = uniqueSlug(slugify(product.name), used);
    raw.push(await toRawProduct(product, slug, previousStock));
  }
  await mkdir(path.dirname(dataPath), { recursive: true });
  await writeFile(dataPath, serializeProducts(raw));
  console.log(`Listo. ${raw.length} productos importados desde ${label} en data/products.ts.`);
  console.log("Las imágenes quedaron en public/products/. El precio público usa PRICE_MARKUP.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "No se pudo importar el catálogo.";
  console.error(message);
  process.exit(1);
});
