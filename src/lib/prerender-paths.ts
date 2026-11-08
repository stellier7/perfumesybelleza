/**
 * El plan gratis de Vercel se iba a ~35 min porque el build generaba cada ficha
 * y cada comparación. Estas páginas siguen existiendo: se arman en la primera
 * visita y quedan guardadas. Aquí solo se adelantan las que salen al entrar.
 */
export const BUILD_PRODUCT_PAGES = 48;
export const BUILD_COMPARISON_PAGES = 12;

export type PrerenderProduct = {
  slug: string;
  featured?: boolean;
  inStock: boolean;
  isReference?: boolean;
};

function rank(product: PrerenderProduct): number {
  if (product.featured && product.inStock && !product.isReference) return 0;
  if (product.inStock && !product.isReference) return 1;
  if (!product.isReference) return 2;
  return 3;
}

export function prerenderProductParams(
  products: PrerenderProduct[],
  limit = BUILD_PRODUCT_PAGES,
): { slug: string }[] {
  const seen = new Set<string>();
  const ranked = products
    .map((product, index) => ({ product, index }))
    .sort((left, right) => rank(left.product) - rank(right.product) || left.index - right.index);
  const params: { slug: string }[] = [];
  for (const entry of ranked) {
    if (seen.has(entry.product.slug)) continue;
    seen.add(entry.product.slug);
    params.push({ slug: entry.product.slug });
    if (params.length >= limit) break;
  }
  return params;
}

export function prerenderComparisonParams(
  slugs: string[],
  limit = BUILD_COMPARISON_PAGES,
): { pair: string }[] {
  const params = slugs.slice(0, limit).map((pair) => ({ pair }));
  if (params.length > 0) return params;
  return [{ pair: "sin-comparaciones" }];
}
