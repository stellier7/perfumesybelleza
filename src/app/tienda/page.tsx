import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { Shell } from "@/components/shell";
import { GENDER_LABEL, TYPE_LABEL } from "@/config";
import { getSellableProducts } from "@/lib/catalog";
import {
  applyCatalogFilters,
  catalogFilterQuery,
  INSPIRATIONS_CATEGORY,
  parseCatalogFilters,
  type CatalogFilters,
} from "@/lib/catalog-query";
import { catalogSection, CATALOG_SECTIONS, sectionLabel, sectionTypes } from "@/lib/catalog-section";
import { pageMetadata } from "@/lib/seo";
import { GENDERS } from "@/types/catalog";

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
  const sectionProducts = products.filter((product) => catalogSection(product.type) === filters.seccion);
  const brands = [...new Set(sectionProducts.map((product) => product.brand))].sort((a, b) =>
    a.localeCompare(b, "es"),
  );
  const categories = [
    ...(filters.seccion === "perfumes" ? [INSPIRATIONS_CATEGORY] : []),
    ...new Set(sectionProducts.map((product) => product.category)),
  ].sort((a, b) => a.localeCompare(b, "es"));
  const types = sectionTypes(filters.seccion);
  const selectedBrand = brands.includes(filters.marca) ? filters.marca : "";
  const selectedCategory = categories.includes(filters.categoria) ? filters.categoria : "";

  return (
    <Shell className="py-8 md:py-12">
      <p className="text-xs uppercase tracking-[0.28em] text-gold">Tienda</p>
      <h1 className="mt-3 font-serif text-4xl md:text-5xl">{sectionLabel(filters.seccion)}</h1>
      <nav className="mt-5 flex flex-wrap gap-2" aria-label="Sección de la tienda">
        {CATALOG_SECTIONS.map((section) => {
          const current = section === filters.seccion;
          return (
            <Link
              key={section}
              href={`/tienda?seccion=${section}`}
              aria-current={current ? "page" : undefined}
              className={`inline-flex h-11 items-center rounded-full px-4 text-sm ${current ? "bg-ink text-ivory" : "border border-line"}`}
            >
              {sectionLabel(section)}
            </Link>
          );
        })}
      </nav>
      <p className="mt-4 max-w-xl text-muted">
        {filters.seccion === "cuidado"
          ? "Filtra por marca, categoría, precio y existencia."
          : "Filtra por tipo, marca, género, precio y existencia."}
      </p>
      <form className="mt-6 grid items-start gap-6 md:grid-cols-[16rem_1fr]" action="/tienda">
        <fieldset className="grid min-w-0 content-start gap-3 self-start rounded-3xl border border-line bg-paper p-4 text-sm shadow-soft">
          <legend className="px-1 text-xs uppercase tracking-[0.16em] text-gold">Filtros</legend>
          <input type="hidden" name="seccion" value={filters.seccion} />
          {types.length > 1 ? (
            <label className="grid gap-1">
              Tipo
              <select name="tipo" defaultValue={filters.tipo} className="h-11 rounded-xl border border-line bg-ivory px-3">
                <option value="">Todos</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {TYPE_LABEL[type]}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <label className="grid gap-1">
            Marca
            <select name="marca" defaultValue={selectedBrand} className="h-11 rounded-xl border border-line bg-ivory px-3">
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
            <select name="categoria" defaultValue={selectedCategory} className="h-11 rounded-xl border border-line bg-ivory px-3">
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
            <p>
              {sectionProducts.length === 0
                ? "Todavía no hay productos en esta sección."
                : "No hay productos con esos filtros."}
            </p>
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
