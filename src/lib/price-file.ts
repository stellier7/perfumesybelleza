export type PriceRow = {
  slug: string;
  name: string;
  brand: string;
  type: string;
  sizeMl: number | null;
  cost: number;
  price: number | null;
};

export const PRICE_BATCH = 10;

function productBlock(source: string, slug: string): { start: number; end: number; block: string } | null {
  const token = `slug: ${JSON.stringify(slug)}`;
  const start = source.indexOf(token);
  if (start < 0) return null;
  const rest = source.slice(start + token.length);
  const relative = rest.search(/\n\s*slug:/);
  const end = relative === -1 ? source.length : start + token.length + relative;
  return { start, end, block: source.slice(start, end) };
}

function quoted(block: string, field: string): string {
  const match = block.match(new RegExp(`${field}:\\s*"((?:\\\\.|[^"\\\\])*)"`));
  if (!match) return "";
  return JSON.parse(`"${match[1]}"`) as string;
}

function money(block: string, field: string): number | null {
  const match = block.match(new RegExp(`${field}:\\s*(\\d+)`));
  if (!match) return null;
  return Number(match[1]);
}

export function listPrices(source: string): PriceRow[] {
  const rows: PriceRow[] = [];
  const re = /slug:\s*"([^"]+)"/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(source))) {
    const found = productBlock(source, match[1]);
    if (!found) continue;
    const sizeMatch = found.block.match(/sizeMl:\s*(null|\d+)/);
    const price = money(found.block, "price");
    rows.push({
      slug: match[1],
      name: quoted(found.block, "name") || match[1],
      brand: quoted(found.block, "brand"),
      type: quoted(found.block, "type"),
      sizeMl: sizeMatch && sizeMatch[1] !== "null" ? Number(sizeMatch[1]) : null,
      cost: money(found.block, "cost") ?? 0,
      price,
    });
  }
  return rows;
}

export function needsPrice(row: PriceRow): boolean {
  return row.cost <= 0 && (row.price === null || row.price <= 0);
}

export function nextUnpriced(source: string, limit = PRICE_BATCH): PriceRow[] {
  return listPrices(source).filter(needsPrice).slice(0, limit);
}

function replaceBlock(source: string, slug: string, nextBlock: string): string {
  const found = productBlock(source, slug);
  if (!found) throw new Error(`No existe un producto con el slug "${slug}".`);
  return source.slice(0, found.start) + nextBlock + source.slice(found.end);
}

export function setProductPrice(source: string, slug: string, price: number): string {
  if (!Number.isInteger(price) || price <= 0) {
    throw new Error(`El precio de "${slug}" tiene que ser un entero mayor que cero.`);
  }
  const found = productBlock(source, slug);
  if (!found) throw new Error(`No existe un producto con el slug "${slug}".`);
  if (/price:\s*\d+/.test(found.block)) {
    return replaceBlock(source, slug, found.block.replace(/price:\s*\d+/, `price: ${price}`));
  }
  const costMatch = found.block.match(/^([ \t]*)cost:\s*\d+,?\s*$/m);
  if (!costMatch || costMatch.index === undefined) {
    throw new Error(`El producto "${slug}" no tiene cost.`);
  }
  const indent = costMatch[1] ?? "";
  const lineEnd = costMatch.index + costMatch[0].length;
  const nextBlock = `${found.block.slice(0, lineEnd)}\n${indent}price: ${price},${found.block.slice(lineEnd)}`;
  return replaceBlock(source, slug, nextBlock);
}

export function setProductCost(source: string, slug: string, cost: number): string {
  if (!Number.isInteger(cost) || cost <= 0) {
    throw new Error(`El mayorista de "${slug}" tiene que ser un entero mayor que cero.`);
  }
  const found = productBlock(source, slug);
  if (!found) throw new Error(`No existe un producto con el slug "${slug}".`);
  if (!/cost:\s*\d+/.test(found.block)) {
    throw new Error(`El producto "${slug}" no tiene cost.`);
  }
  return replaceBlock(source, slug, found.block.replace(/cost:\s*\d+/, `cost: ${cost}`));
}

export type BatchEntry = { kind: "sale" | "cost"; amount: number } | null;

export function applyPriceBatch(
  source: string,
  entries: BatchEntry[],
): { source: string; applied: Array<{ slug: string; kind: "sale" | "cost"; amount: number }> } {
  if (entries.length === 0 || entries.length > PRICE_BATCH) {
    throw new Error(`Un lote lleva de 1 a ${PRICE_BATCH} precios.`);
  }
  const pending = nextUnpriced(source, entries.length);
  if (pending.length < entries.length) {
    throw new Error(`Solo quedan ${pending.length} productos sin precio.`);
  }
  let next = source;
  const applied: Array<{ slug: string; kind: "sale" | "cost"; amount: number }> = [];
  entries.forEach((entry, index) => {
    const row = pending[index];
    if (entry === null || !row) return;
    next = entry.kind === "sale" ? setProductPrice(next, row.slug, entry.amount) : setProductCost(next, row.slug, entry.amount);
    applied.push({ slug: row.slug, kind: entry.kind, amount: entry.amount });
  });
  return { source: next, applied };
}
