import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { SearchBox } from "@/components/search-box";
import { Shell } from "@/components/shell";
import { GENDER_LABEL } from "@/config";
import { getCatalog, getComparisonPairs, getSearchRecords } from "@/lib/catalog";
import { nameWithBrand } from "@/lib/catalog-model";
import { isCatalogSection, sectionLabel, type CatalogSection } from "@/lib/catalog-section";
import {
  narrowSearch,
  parseSearchNarrowing,
  queryNamesOriginal,
  searchCatalog,
  searchFacetRecords,
  searchNarrowingActive,
  searchSections,
  type SearchNarrowing,
  type SearchPresentation,
} from "@/lib/search";
import { pageMetadata } from "@/lib/seo";
import { GENDERS, type PublicProduct, type SearchRecord } from "@/types/catalog";

export const metadata = pageMetadata({
  title: "Buscar",
  description: "Busca perfumes o cuidado personal. Cada sección muestra sus propias marcas.",
  path: "/buscar",
  index: false,
});

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<Shell className="py-12">Buscando…</Shell>}>
      <SearchResults searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchResults({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = params.q;
  const query = (Array.isArray(raw) ? raw[0] : raw) ?? "";
  const seccionRaw = params.seccion;
  const requested = (Array.isArray(seccionRaw) ? seccionRaw[0] : seccionRaw) ?? "";
  const locked = isCatalogSection(requested) ? requested : undefined;
  const filters = parseSearchNarrowing(params);
  const records = getSearchRecords();
  const catalog = new Map(getCatalog().map((product) => [product.id, product]));
  const pairs = getComparisonPairs();
  const sections = query.trim().length < 2 ? [] : searchSections(records, query, locked);
  const found = sections
    .map((section) => ({ section, presentation: searchCatalog(records, query, section) }))
    .filter((block) => hasSearchResults(block.presentation));
  const facets = found.flatMap((block) => searchFacetRecords(block.presentation));
  const blocks = found
    .map((block) => ({ ...block, presentation: narrowSearch(block.presentation, filters) }))
    .filter((block) => hasSearchResults(block.presentation));
  const showSectionTitle = found.length > 1;
  const ready = query.trim().length >= 2;

  return (
    <Shell className="py-8 md:py-12">
      <h1 className="font-serif text-4xl md:text-5xl">Buscar</h1>
      <div className="mt-6 max-w-xl">
        <SearchBox variant="hero" initialQuery={query} />
      </div>
      {ready && found.length > 0 ? (
        <SearchRefine query={query} section={locked} filters={filters} records={facets} />
      ) : null}
      {!ready ? (
        <p className="mt-8 text-muted">Escribe al menos dos letras. Puedes buscar por nombre, marca o producto.</p>
      ) : found.length === 0 ? (
        <p className="mt-10">No encontramos eso. Prueba con la marca o con menos palabras.</p>
      ) : blocks.length === 0 ? (
        <p className="mt-10">No hay productos con esos filtros.</p>
      ) : (
        <div className="mt-10 space-y-16">
          {blocks.map((block) => (
            <section key={block.section} className="space-y-12">
              {showSectionTitle || block.section === "cuidado" ? (
                <h2 className="font-serif text-3xl">{sectionLabel(block.section)}</h2>
              ) : null}
              <SectionResults
                query={query}
                presentation={block.presentation}
                catalog={catalog}
                pairs={pairs}
              />
            </section>
          ))}
        </div>
      )}
    </Shell>
  );
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right, "es"));
}

function SearchRefine({
  query,
  section,
  filters,
  records,
}: {
  query: string;
  section: CatalogSection | undefined;
  filters: SearchNarrowing;
  records: SearchRecord[];
}) {
  const brands = uniqueSorted(records.map((record) => record.brand));
  const categories = uniqueSorted(records.map((record) => record.category));
  const clear = new URLSearchParams({ q: query });
  if (section) clear.set("seccion", section);
  return (
    <form action="/buscar" className="mt-6 grid gap-3 rounded-3xl border border-line bg-paper p-4 text-sm md:grid-cols-2 xl:grid-cols-4">
      <input type="hidden" name="q" value={query} />
      {section ? <input type="hidden" name="seccion" value={section} /> : null}
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
      {categories.length > 1 ? (
        <label className="grid gap-1">
          Categoría
          <select name="categoria" defaultValue={filters.categoria} className="h-11 rounded-xl border border-line bg-ivory px-3">
            <option value="">Todas</option>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
      ) : null}
      {brands.length > 1 ? (
        <label className="grid gap-1">
          Marca
          <select name="marca" defaultValue={filters.marca} className="h-11 rounded-xl border border-line bg-ivory px-3">
            <option value="">Todas</option>
            {brands.map((brand) => (
              <option key={brand}>{brand}</option>
            ))}
          </select>
        </label>
      ) : null}
      <div className="flex flex-wrap items-center gap-3 self-end">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="stock" value="1" defaultChecked={filters.stock} />
          Con existencia
        </label>
        <button type="submit" className="h-11 rounded-full bg-ink px-4 text-ivory">
          Filtrar
        </button>
        {searchNarrowingActive(filters) ? (
          <Link href={`/buscar?${clear.toString()}`} className="text-sm text-gold">
            Quitar filtros
          </Link>
        ) : null}
      </div>
    </form>
  );
}

function hasSearchResults(presentation: SearchPresentation): boolean {
  return (
    presentation.products.length > 0 ||
    presentation.groups.length > 0 ||
    presentation.missingOriginals.length > 0
  );
}

function SectionResults({
  query,
  presentation,
  catalog,
  pairs,
}: {
  query: string;
  presentation: SearchPresentation;
  catalog: Map<string, PublicProduct>;
  pairs: ReturnType<typeof getComparisonPairs>;
}) {
  const products = lookup(presentation.products.map((item) => item.id), catalog);
  const hasOriginalInResults = presentation.stockedOriginals.length > 0;
  const namedMissing = presentation.missingOriginals.filter((original) => queryNamesOriginal(query, original));
  const showBrandNote = products.length === 0 && presentation.groups.length > 0 && namedMissing.length === 0;

  return (
    <>
      {products.length > 0 ? (
        <div>
          <h3 className="font-serif text-3xl">{hasOriginalInResults ? "En el catálogo" : "Resultados"}</h3>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ) : null}
      {namedMissing.map((original) => (
        <p key={original.id} className="max-w-2xl leading-7">
          No tenemos {nameWithBrand(original.name, original.brand)} en el catálogo. Estas alternativas son para
          quienes buscan un aroma similar.
        </p>
      ))}
      {showBrandNote ? (
        <p className="max-w-2xl leading-7">
          No hay «{query.trim()}» en el catálogo. Estas inspiraciones se acercan.
        </p>
      ) : null}
      {presentation.groups.map((group) => (
        <div key={group.original.id}>
          <h3 className="font-serif text-3xl">
            Inspirado en {nameWithBrand(group.original.name, group.original.brand)}
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Del más cercano al más libre. No es el perfume de la casa.
          </p>
          {group.clones.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {group.clones.map((clone) => {
                const product = catalog.get(clone.id);
                if (!product) return null;
                const pair = pairs.find((item) => item.alternative.id === product.id && item.original.id === group.original.id);
                return (
                  <div key={product.id}>
                    <ProductCard product={product} />
                    {pair ? (
                      <Link href={`/comparar/${pair.slug}`} className="mt-2 inline-block text-sm text-gold">
                        Ver comparación
                      </Link>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : null}
          {group.sets.length > 0 ? (
            <div className="mt-8">
              <h4 className="font-serif text-2xl">Sets</h4>
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                {group.sets.map((set) => {
                  const product = catalog.get(set.id);
                  if (!product) return null;
                  return <ProductCard key={product.id} product={product} />;
                })}
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </>
  );
}

function lookup(ids: string[], catalog: Map<string, PublicProduct>): PublicProduct[] {
  return ids.flatMap((id) => {
    const product = catalog.get(id);
    return product ? [product] : [];
  });
}
