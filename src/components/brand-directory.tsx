"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type BrandLink = {
  name: string;
  count: number;
  href: string;
  section: "perfumes" | "cuidado";
};

export function BrandDirectory({ brands }: { brands: BrandLink[] }) {
  const [query, setQuery] = useState("");
  const [section, setSection] = useState<"" | BrandLink["section"]>("");
  const shown = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("es");
    return brands.filter((brand) => {
      if (section && brand.section !== section) return false;
      if (!needle) return true;
      return brand.name.toLocaleLowerCase("es").includes(needle);
    });
  }, [brands, query, section]);

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <label className="grid gap-1 text-sm">
          Buscar marca
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-11 rounded-full border border-line bg-paper px-4"
            placeholder="Lattafa, Anua, Dior…"
          />
        </label>
        <div className="flex items-end gap-2">
          {(
            [
              ["", "Todas"],
              ["perfumes", "Perfumes"],
              ["cuidado", "Cuidado"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value || "todas"}
              type="button"
              aria-pressed={section === value}
              onClick={() => setSection(value)}
              className={`h-11 rounded-full px-4 text-sm ${section === value ? "bg-ink text-ivory" : "border border-line"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-4 text-sm text-muted">
        {shown.length} {shown.length === 1 ? "marca" : "marcas"}
      </p>
      {shown.length === 0 ? (
        <p className="mt-6">No hay marcas con ese nombre.</p>
      ) : (
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {shown.map((brand) => (
            <li key={`${brand.section}-${brand.name}`}>
              <Link href={brand.href} className="flex items-baseline justify-between gap-4 py-3 hover:text-gold">
                <span>{brand.name}</span>
                <span className="text-sm text-muted">
                  {brand.count} {brand.count === 1 ? "producto" : "productos"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
