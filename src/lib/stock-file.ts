export type StockRow = {
  slug: string;
  name: string;
  inStock: boolean;
};

export type StockMode = "toggle" | "on" | "off";

function productBlock(source: string, slug: string): { start: number; end: number; block: string } | null {
  const token = `slug: ${JSON.stringify(slug)}`;
  const start = source.indexOf(token);
  if (start < 0) return null;
  const rest = source.slice(start + token.length);
  const relative = rest.search(/\n\s*slug:/);
  const end = relative === -1 ? source.length : start + token.length + relative;
  return { start, end, block: source.slice(start, end) };
}

export function listStock(source: string): StockRow[] {
  const rows: StockRow[] = [];
  const re = /slug:\s*"([^"]+)"/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(source))) {
    const found = productBlock(source, match[1]);
    if (!found) continue;
    const stockMatch = found.block.match(/inStock:\s*(true|false)/);
    if (!stockMatch) continue;
    const nameMatch = found.block.match(/name:\s*"((?:\\.|[^"\\])*)"/);
    const name = nameMatch ? (JSON.parse(`"${nameMatch[1]}"`) as string) : match[1];
    rows.push({
      slug: match[1],
      name,
      inStock: stockMatch[1] === "true",
    });
  }
  return rows;
}

export function setProductStock(
  source: string,
  slug: string,
  mode: StockMode,
): { source: string; inStock: boolean } {
  const found = productBlock(source, slug);
  if (!found) {
    throw new Error(`No existe un producto con el slug "${slug}".`);
  }
  const stockMatch = found.block.match(/inStock:\s*(true|false)/);
  if (!stockMatch || stockMatch.index === undefined) {
    throw new Error(`El producto "${slug}" no tiene inStock.`);
  }
  const current = stockMatch[1] === "true";
  const inStock = mode === "on" ? true : mode === "off" ? false : !current;
  const absolute = found.start + stockMatch.index;
  const nextSource =
    source.slice(0, absolute) +
    `inStock: ${inStock}` +
    source.slice(absolute + stockMatch[0].length);
  return { source: nextSource, inStock };
}
