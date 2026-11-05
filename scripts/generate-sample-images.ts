import { mkdir } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

type PaintedProduct = {
  name: string;
  brand: string;
  type: string;
  images: string[];
};

function parseProducts(source: string): PaintedProduct[] {
  const chunks = source.split(/\n  \{/).slice(1);
  return chunks.flatMap((chunk) => {
    const name = chunk.match(/name: ("(?:\\.|[^"\\])*")/)?.[1];
    const brand = chunk.match(/brand: ("(?:\\.|[^"\\])*")/)?.[1];
    const type = chunk.match(/type: ("(?:\\.|[^"\\])*")/)?.[1];
    const images = chunk.match(/images: \[([^\]]*)\]/)?.[1] ?? "";
    if (!name || !brand || !type) return [];
    const files = [...images.matchAll(/"(\/products\/[^"]+\.webp)"/g)].map((match) => match[1]);
    return [
      {
        name: JSON.parse(name) as string,
        brand: JSON.parse(brand) as string,
        type: JSON.parse(type) as string,
        images: files,
      },
    ];
  });
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function palette(type: string, variant: number): { from: string; to: string; ink: string; metal: string } {
  if (type === "arabic") {
    return variant === 0
      ? { from: "#241814", to: "#100c0b", ink: "#f3e6d4", metal: "#d4b483" }
      : { from: "#3a2418", to: "#1a1210", ink: "#f6efe4", metal: "#e7c99a" };
  }
  if (type === "beauty") {
    return variant === 0
      ? { from: "#f8ece6", to: "#e7cfc4", ink: "#3a2a26", metal: "#c98984" }
      : { from: "#fbf6f1", to: "#efd5cc", ink: "#3a2a26", metal: "#c4a36a" };
  }
  return variant === 0
    ? { from: "#f7efe6", to: "#e7d0c4", ink: "#2a211c", metal: "#b08a4f" }
    : { from: "#f3e4dc", to: "#ddc2b4", ink: "#2a211c", metal: "#8c6733" };
}

function svg(product: PaintedProduct, variant: number): string {
  const colors = palette(product.type, variant);
  const title = escapeXml(product.name);
  const brand = escapeXml(product.brand.toUpperCase());
  const shift = variant === 0 ? 0 : 26;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${colors.from}"/>
      <stop offset="1" stop-color="${colors.to}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#bg)"/>
  <circle cx="${240 + shift}" cy="230" r="180" fill="${colors.metal}" opacity="0.18"/>
  <g transform="translate(${250 + shift} 150)" fill="none" stroke="${colors.metal}" stroke-width="7" stroke-linejoin="round">
    <rect x="118" y="8" width="64" height="46" rx="8" fill="${colors.from}"/>
    <path d="M92 54h116l36 78v470c0 18-16 32-36 32H92c-20 0-36-14-36-32V132z" fill="${colors.to}" opacity="0.55"/>
    <path d="M128 150h44M118 210h84M112 430h96"/>
  </g>
  <text x="400" y="860" text-anchor="middle" font-family="Liberation Serif, DejaVu Serif, serif" font-size="46" fill="${colors.ink}">${title}</text>
  <text x="400" y="910" text-anchor="middle" font-family="Liberation Sans, DejaVu Sans, sans-serif" font-size="20" letter-spacing="5" fill="${colors.metal}">${brand}</text>
</svg>`;
}

export async function generateSampleImages(): Promise<void> {
  const source = readFileSync(path.join(process.cwd(), "data", "products.ts"), "utf8");
  const products = parseProducts(source);
  const directory = path.join(process.cwd(), "public", "products");
  await mkdir(directory, { recursive: true });
  const force = process.argv.includes("--force");
  let written = 0;
  for (const product of products) {
    for (const [index, imagePath] of product.images.entries()) {
      const filename = path.basename(imagePath);
      const output = path.join(directory, filename);
      if (!force && existsSync(output)) continue;
      const buffer = await sharp(Buffer.from(svg(product, index))).webp({ quality: 80 }).toFile(output);
      if (!buffer.size) throw new Error(`Imagen vacía: ${filename}`);
      written += 1;
    }
  }
  console.log(
    written === 0
      ? "Las imágenes de muestra ya existían."
      : `Imágenes de muestra nuevas: ${written}`,
  );
}

if (process.argv[1]?.endsWith("generate-sample-images.ts")) {
  generateSampleImages().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "No se pudieron crear las imágenes.");
    process.exit(1);
  });
}
