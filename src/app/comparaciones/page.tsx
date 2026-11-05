import Link from "next/link";
import { Shell } from "@/components/shell";
import { getComparisonPairs } from "@/lib/catalog";
import { formatPrice } from "@/lib/pricing";
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
      <div className="mt-10 space-y-10">
        {[...groups.values()].map((group) => (
          <section key={group[0]?.original.id}>
            <h2 className="font-serif text-3xl">
              {group[0]?.original.name}
              {group[0]?.original.brand ? ` · ${group[0].original.brand}` : ""}
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {group.map((pair) => (
                <Link key={pair.slug} href={`/comparar/${pair.slug}`} className="rounded-3xl border border-line bg-paper p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-gold">Alternativa</p>
                  <p className="mt-2 font-serif text-3xl">{pair.alternative.name}</p>
                  <p className="mt-1 text-sm text-muted">{pair.alternative.brand}</p>
                  <p className="mt-3 text-sm">
                    {pair.original.isReference || !pair.original.inStock
                      ? "Referencia no disponible para compra"
                      : formatPrice(pair.original.price)}
                    {" · "}
                    {formatPrice(pair.alternative.price)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Shell>
  );
}
