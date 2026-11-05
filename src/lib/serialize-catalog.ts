import type { RawProduct } from "@/types/catalog";

function literal(value: unknown, indent: number): string {
  const pad = " ".repeat(indent);
  const inner = " ".repeat(indent + 2);
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "0";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (value === null || value === undefined) return "null";
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    if (value.every((item) => typeof item === "string" || typeof item === "number")) {
      return `[${value.map((item) => literal(item, indent)).join(", ")}]`;
    }
    return `[\n${value.map((item) => `${inner}${literal(item, indent + 2)}`).join(",\n")}\n${pad}]`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value).filter(([, entry]) => entry !== undefined);
    if (entries.length === 0) return "{}";
    return `{\n${entries
      .map(([key, entry]) => `${inner}${key}: ${literal(entry, indent + 2)}`)
      .join(",\n")}\n${pad}}`;
  }
  return "null";
}

export function serializeProducts(products: RawProduct[]): string {
  for (const product of products) {
    if (product.slug.includes("-vs-")) {
      throw new Error(`El slug "${product.slug}" no puede incluir "-vs-".`);
    }
  }
  const body = products
    .map((product) =>
      literal(product, 2)
        .split("\n")
        .map((line) => `  ${line}`)
        .join("\n"),
    )
    .join(",\n");
  return `import "server-only";
import type { RawProduct } from "../src/types/catalog";

/**
 * Inventario de la tienda.
 * \`cost\` es el precio mayorista y no debe usarse en componentes de cliente.
 * \`price\`, si está, es el precio de venta. Si falta, se calcula con el margen del tipo.
 * \`inStock\` es la única fuente de existencia. Cámbialo aquí o con \`npm run stock\`.
 */
export const rawProducts: RawProduct[] = [
${body}
];
`;
}
