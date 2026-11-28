import Link from "next/link";
import { SalePrice } from "@/components/sale-price";
import { Shell } from "@/components/shell";
import { getComparisonPairs } from "@/lib/catalog";
import { displayTitle } from "@/lib/catalog-model";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Comparaciones",
  description:
    "Compara perfumes de diseñador con alternativas para quienes buscan un aroma similar. Precios en lempiras y envío a Honduras.",
  path: "/comparaciones",
});

export default function ComparisonsPage() {
  const pairs = getComparisonPairs();
  const groups = new Map<string, typeof pairs>();
  for (const pair of pairs) {
    const current = groups.get(pair.original.id) ?? [];
    current.push(pair);
    groups.set(pair.original.id, current);
  }

  return (
    <Shell className="py-8 md:py-12">
      <h1 className="font-serif text-4xl md:text-5xl">Comparaciones</h1>
      <p className="mt-3 max-w-2xl leading-7 text-muted">
        Cada ficha pone lado a lado un perfume de referencia y una alternativa de nuestro catálogo.
        Sirve para ver precio, tamaño y estilo de uso. No prometemos que huelan igual.
      </p>
      {groups.size === 0 ? (
        <p className="mt-10 max-w-2xl leading-7 text-muted">
          Todavía no hay comparaciones. Cuando un perfume del catálogo tenga una alternativa, aparece aquí.
        </p>
      ) : (
      <div className="mt-10 space-y-10">
        {[...groups.values()].map((group) => (
          <section key={group[0]?.original.id}>
            <h2 className="break-words font-serif text-3xl">
              {group[0] ? displayTitle(group[0].original) : ""}
            </h2>
            <div className="mt-4 grid min-w-0 gap-4 md:grid-cols-2">
              {group.map((pair) => (
                <Link
                  key={pair.slug}
                  href={`/comparar/${pair.slug}`}
                  className="min-w-0 rounded-3xl border border-line bg-paper p-5 shadow-soft transition duration-300 motion-safe:hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-gold">Alternativa</p>
                  <p className="mt-2 break-words font-serif text-3xl leading-tight">{displayTitle(pair.alternative)}</p>
                  <p className="mt-3 flex flex-wrap items-baseline gap-x-2 text-sm">
                    {pair.original.isReference || !pair.original.inStock ? (
                      <span>Referencia no disponible para compra</span>
                    ) : (
                      <SalePrice list={pair.original.price} className="text-sm" />
                    )}
                    <span aria-hidden="true">·</span>
                    <SalePrice list={pair.alternative.price} className="text-sm" />
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
      )}
    </Shell>
  );
}
