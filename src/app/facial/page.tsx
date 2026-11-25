import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Shell } from "@/components/shell";
import { getSellableProducts } from "@/lib/catalog";
import { pickFamous } from "@/lib/fame";
import { pageMetadata } from "@/lib/seo";
import { FACIAL_CATEGORIES, KOREAN_CATEGORY } from "@/lib/routine-finder";
import type { PublicProduct } from "@/types/catalog";

export const metadata = pageMetadata({
  title: "Cuidado facial",
  description: "Limpieza, tónico, sérum, crema, protector solar y skincare coreano disponibles en la tienda.",
  path: "/facial",
});

function categoryHref(category: string): string {
  const params = new URLSearchParams({ seccion: "cuidado", categoria: category });
  return `/tienda?${params.toString()}`;
}

export default function FacialPage() {
  const products = getSellableProducts().filter((product) => product.inStock);
  const groups = FACIAL_CATEGORIES.map((category) => ({
    category,
    products: pickFamous(
      products.filter((product) => product.category === category),
      4,
    ),
  })).filter((group) => group.products.length > 0);
  const korean = pickFamous(
    products.filter((product) => product.category === KOREAN_CATEGORY),
    4,
  );

  return (
    <Shell className="py-8 md:py-12">
      <p className="text-[0.7rem] uppercase tracking-[0.22em] text-gold">Rostro</p>
      <h1 className="mt-3 font-serif text-4xl md:text-6xl">Cuidado facial</h1>
      <p className="mt-4 max-w-2xl leading-7 text-muted">
        Cada bloque usa la categoría real del producto. El skincare coreano tiene su propia ficha y una rutina
        aparte.
      </p>
      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link href="/rutina" className="inline-flex h-11 items-center rounded-full border border-ink px-4">
          Armar una rutina
        </Link>
      </div>
      <div className="mt-12 space-y-14">
        {korean.length > 0 ? <Group title="Skincare coreano" href={categoryHref(KOREAN_CATEGORY)} products={korean} /> : null}
        {groups.map((group) => (
          <Group key={group.category} title={group.category} href={categoryHref(group.category)} products={group.products} />
        ))}
      </div>
    </Shell>
  );
}

function Group({ title, href, products }: { title: string; href: string; products: PublicProduct[] }) {
  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-serif text-3xl">{title}</h2>
        <Link href={href} className="text-sm text-muted underline-offset-4 hover:underline">
          Ver todo
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
