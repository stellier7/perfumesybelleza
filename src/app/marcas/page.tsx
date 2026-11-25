import { BrandDirectory, type BrandLink } from "@/components/brand-directory";
import { Shell } from "@/components/shell";
import { getSellableProducts } from "@/lib/catalog";
import { catalogSection } from "@/lib/catalog-section";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Marcas",
  description: "Todas las marcas del catálogo de Perfumes y Belleza, con acceso a sus productos.",
  path: "/marcas",
});

export default function BrandsPage() {
  const counts = new Map<string, { perfumes: number; cuidado: number }>();
  for (const product of getSellableProducts()) {
    if (product.isReference) continue;
    const name = product.brand.trim();
    if (!name) continue;
    const current = counts.get(name) ?? { perfumes: 0, cuidado: 0 };
    current[catalogSection(product.type)] += 1;
    counts.set(name, current);
  }
  const brands: BrandLink[] = [...counts.entries()]
    .sort((left, right) => left[0].localeCompare(right[0], "es"))
    .map(([name, tally]) => {
      const section = tally.perfumes >= tally.cuidado ? "perfumes" : "cuidado";
      const params = new URLSearchParams({ seccion: section, marca: name });
      return {
        name,
        count: tally.perfumes + tally.cuidado,
        href: `/tienda?${params.toString()}`,
        section,
      };
    });

  return (
    <Shell className="py-8 md:py-12">
      <p className="text-[0.7rem] uppercase tracking-[0.22em] text-gold">Catálogo</p>
      <h1 className="mt-3 font-serif text-4xl md:text-6xl">Marcas</h1>
      <p className="mt-4 max-w-2xl leading-7 text-muted">
        Cada marca abre la sección donde tiene más productos: perfumes o cuidado personal.
      </p>
      <div className="mt-8">
        <BrandDirectory brands={brands} />
      </div>
    </Shell>
  );
}
