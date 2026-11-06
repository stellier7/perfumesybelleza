import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { Shell } from "@/components/shell";
import { GENDER_LABEL, TYPE_LABEL } from "@/config";
import { getSellableProducts } from "@/lib/catalog";
import {
  applyCatalogFilters,
  catalogFilterQuery,
  parseCatalogFilters,
  type CatalogFilters,
} from "@/lib/catalog-query";
import { pageMetadata } from "@/lib/seo";
import { GENDERS, PRODUCT_TYPES } from "@/types/catalog";

export const metadata = pageMetadata({
  title: "Tienda",
  description: "Perfumes árabes, perfumes de diseñador y belleza con envío a todo Honduras.",
  path: "/tienda",
});

export default function TiendaPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return (
    <Suspense fallback={<Shell className="py-12">Cargando la tienda…</Shell>}>
      <Catalog searchParams={searchParams} />
    </Suspense>
  );
}

async function Catalog({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseCatalogFilters(await searchParams);
  const products = getSellableProducts();
  const result = applyCatalogFilters(products, filters);
  const brands = [...new Set(products.map((product) => product.brand))].sort((a, b) =>
    a.localeCompare(b, "es"),
  );
  const categories = [...new Set(products.map((product) => product.category))].sort((a, b) =>
    a.localeCompare(b, "es"),
  );

  return (
    <Shell className="py-8 md:py-12">
      <h1 className="font-serif text-4xl md:text-5xl">Tienda</h1>
      <p className="mt-3 max-w-xl text-muted">Filtra por tipo, marca, género, precio y existencia.</p>
      <form className="mt-6 grid items-start gap-6 md:grid-cols-[16rem_1fr]" action="/tienda">
        <fieldset className="grid min-w-0 content-start gap-3 self-start rounded-3xl border border-line bg-paper p-4 text-sm shadow-soft">
          <legend className="px-1 text-xs uppercase tracking-[0.16em] text-gold">Filtros</legend>
          <label className="grid gap-1">
            Tipo
            <select name="tipo" defaultValue={filters.tipo} className="h-11 rounded-xl border border-line bg-ivory px-3">
              <option value="">Todos</option>
              {PRODUCT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {TYPE_LABEL[type]}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1">
            Marca
            <select name="marca" defaultValue={filters.marca} className="h-11 rounded-xl border border-line bg-ivory px-3">
              <option value="">Todas</option>
              {brands.map((brand) => (
                <option key={brand}>{brand}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1">
            Género
            <select name="genero" defaultValue={filters.genero} className="h-11 rounded-xl border border-line bg-ivory px-3">
              <option value="">Todos</option>
              {GENDERS.map((gender) => (
                <option key={gender} value={gender}>
                  {GENDER_LABEL[gender]}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1">
            Categoría
            <select name="categoria" defaultValue={filters.categoria} className="h-11 rounded-xl border border-line bg-ivory px-3">
              <option value="">Todas</option>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid min-w-0 gap-1">
              Mínimo
              <input name="min" inputMode="numeric" type="number" min="0" defaultValue={filters.min ?? ""} className="h-11 w-full min-w-0 rounded-xl border border-line bg-ivory px-3" />
            </label>
            <label className="grid min-w-0 gap-1">
              Máximo
              <input name="max" inputMode="numeric" type="number" min="0" defaultValue={filters.max ?? ""} className="h-11 w-full min-w-0 rounded-xl border border-line bg-ivory px-3" />
            </label>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="stock" value="1" defaultChecked={filters.stock} />
            Solo con existencia
          </label>
          <label className="grid gap-1">
            Orden
            <select name="orden" defaultValue={filters.orden} className="h-11 rounded-xl border border-line bg-ivory px-3">
              <option value="destacados">Destacados</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="nombre">Nombre</option>
            </select>
          </label>
          <button type="submit" className="h-11 rounded-full bg-ink text-ivory">
            Aplicar
          </button>
        </fieldset>
        <div>
          <p className="mb-4 text-sm text-muted">
            {result.total} {result.total === 1 ? "producto" : "productos"}
          </p>
          {result.items.length === 0 ? (
            <p>No hay productos con esos filtros.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {result.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <Pagination filters={filters} page={result.page} pages={result.pages} />
        </div>
      </form>
    </Shell>
  );
}

function Pagination({
  filters,
  page,
  pages,
}: {
  filters: CatalogFilters;
  page: number;
  pages: number;
}) {
  if (pages <= 1) return null;
  return (
    <nav className="mt-8 flex items-center justify-between text-sm" aria-label="Páginas">
      {page > 1 ? (
        <Link href={`/tienda${catalogFilterQuery(filters, page - 1)}`} className="rounded-full border border-line px-4 py-2">
          Anterior
        </Link>
      ) : (
        <span />
      )}
      <span>
        {page} de {pages}
      </span>
      {page < pages ? (
        <Link href={`/tienda${catalogFilterQuery(filters, page + 1)}`} className="rounded-full border border-line px-4 py-2">
          Siguiente
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
