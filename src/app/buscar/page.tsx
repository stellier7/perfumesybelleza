import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { SearchBox } from "@/components/search-box";
import { Shell } from "@/components/shell";
import { getCatalog, getComparisonPairs, getSearchRecords } from "@/lib/catalog";
import { nameWithBrand } from "@/lib/catalog-model";
import { isCatalogSection, sectionLabel } from "@/lib/catalog-section";
import { queryNamesOriginal, searchCatalog, searchSections, type SearchPresentation } from "@/lib/search";
import { pageMetadata } from "@/lib/seo";
import type { PublicProduct } from "@/types/catalog";

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
  const records = getSearchRecords();
  const catalog = new Map(getCatalog().map((product) => [product.id, product]));
  const pairs = getComparisonPairs();
  const sections = query.trim().length < 2 ? [] : searchSections(records, query, locked);
  const blocks = sections
    .map((section) => ({ section, presentation: searchCatalog(records, query, section) }))
    .filter((block) => hasSearchResults(block.presentation));
  const showSectionTitle = blocks.length > 1;

  return (
    <Shell className="py-8 md:py-12">
      <h1 className="font-serif text-4xl md:text-5xl">Buscar</h1>
      <div className="mt-6 max-w-xl">
        <SearchBox records={records} variant="hero" />
      </div>
      {query.trim().length < 2 ? (
        <p className="mt-8 text-muted">Escribe al menos dos letras. Puedes buscar por nombre, marca o un perfume famoso.</p>
      ) : blocks.length === 0 ? (
        <p className="mt-10">No encontramos ese aroma. Prueba con la marca o con menos palabras.</p>
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
