import Link from "next/link";
import type { ReactNode } from "react";
import { AutoRail } from "@/components/auto-rail";
import { ProductCard } from "@/components/product-card";
import type { PublicProduct } from "@/types/catalog";

export function ProductRail({
  id,
  eyebrow,
  title,
  href,
  products,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  href?: string;
  products: PublicProduct[];
}) {
  if (products.length === 0) return null;
  const heading = (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div>
        {eyebrow ? <p className="text-[0.7rem] uppercase tracking-[0.22em] text-gold">{eyebrow}</p> : null}
        <h2 id={id} className="mt-2 font-serif text-4xl">
          {title}
        </h2>
      </div>
      {href ? (
        <Link href={href} className="mb-1 text-sm text-muted underline-offset-4 hover:underline">
          Ver todo
        </Link>
      ) : null}
    </div>
  );
  return (
    <AutoRail label={title} title={heading}>
      {products.map((product) => (
        <div key={product.id} className="w-[16.75rem]">
          <ProductCard product={product} />
        </div>
      ))}
    </AutoRail>
  );
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex h-11 items-center rounded-full border border-current px-4 text-sm">
      {children}
    </Link>
  );
}
