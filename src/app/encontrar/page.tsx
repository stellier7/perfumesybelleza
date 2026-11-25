import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { Pager } from "@/components/pager";
import { ProductCard } from "@/components/product-card";
import { Shell } from "@/components/shell";
import { GENDER_LABEL } from "@/config";
import { getSellableProducts } from "@/lib/catalog";
import {
  FRAGRANCE_CONCENTRATIONS,
  FRAGRANCE_FAMILIES,
  filterFragrances,
  fragranceHref,
  parseFragranceQuery,
  type FragranceQuery,
} from "@/lib/fragrance-finder";
import { pageMetadata } from "@/lib/seo";
import { GENDERS } from "@/types/catalog";

export const metadata = pageMetadata({
  title: "Encontrar perfume",
  description:
    "Filtra fragancias del catálogo por público, casa, concentración y palabras del nombre. Sin notas inventadas.",
  path: "/encontrar",
});

export default function FinderPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<Shell className="py-12">Buscando fragancias…</Shell>}>
      <Finder searchParams={searchParams} />
    </Suspense>
  );
}

async function Finder({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = parseFragranceQuery(await searchParams);
  const result = filterFragrances(getSellableProducts(), query);
  return (
    <Shell className="py-8 md:py-12">
      <p className="text-[0.7rem] uppercase tracking-[0.22em] text-gold">Perfumería</p>
      <h1 className="mt-3 max-w-2xl font-serif text-4xl md:text-6xl">Encontrar un perfume</h1>
      <p className="mt-4 max-w-2xl leading-7 text-muted">
        Dulce, floral, fresco, amaderado, cítrico, oriental, intenso o ligero se buscan en el nombre y la
        descripción. El catálogo todavía no trae notas de salida, corazón y fondo, así que una familia vacía
        significa que ningún frasco usa esas palabras.
      </p>
      <form action="/encontrar" className="mt-8 grid gap-3 md:grid-cols-4">
        <Select label="Público" name="genero" defaultValue={query.gender}>
          <option value="">Todos</option>
          {GENDERS.map((gender) => (
            <option key={gender} value={gender}>
              {GENDER_LABEL[gender]}
            </option>
          ))}
        </Select>
        <Select label="Casa" name="tipo" defaultValue={query.type}>
          <option value="">Diseñador y árabe</option>
          <option value="designer">Diseñador</option>
          <option value="arabic">Árabe</option>
        </Select>
        <Select label="Concentración" name="concentracion" defaultValue={query.concentration}>
          <option value="">Todas</option>
          {FRAGRANCE_CONCENTRATIONS.map((concentration) => (
            <option key={concentration}>{concentration}</option>
          ))}
        </Select>
        <Select label="Familia" name="familia" defaultValue={query.family}>
          <option value="">Cualquiera</option>
          {FRAGRANCE_FAMILIES.map((family) => (
            <option key={family.id} value={family.id}>
              {family.label}
            </option>
          ))}
        </Select>
        <button type="submit" className="h-11 rounded-full bg-ink text-sm text-ivory md:col-span-4 md:w-fit md:px-6">
          Ver fragancias
        </button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {FRAGRANCE_FAMILIES.map((family) => {
          const next: FragranceQuery = { ...query, family: query.family === family.id ? "" : family.id, page: 1 };
          const current = query.family === family.id;
          return (
            <Link
              key={family.id}
              href={fragranceHref(next, 1)}
              aria-current={current ? "true" : undefined}
              className={`inline-flex h-10 items-center rounded-full px-3 text-sm ${current ? "bg-ink text-ivory" : "border border-line"}`}
            >
              {family.label}
            </Link>
          );
        })}
      </div>
      <p className="mt-8 text-sm text-muted">
        {result.total} {result.total === 1 ? "fragancia" : "fragancias"}
      </p>
      {result.items.length === 0 ? (
        <p className="mt-4 max-w-xl leading-7">
          Ningún perfume del catálogo coincide con esa combinación. Prueba otra familia o quita un filtro.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {result.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      <Pager page={result.page} pages={result.pages} hrefFor={(page) => fragranceHref(query, page)} label="Páginas de fragancias" />
    </Shell>
  );
}

function Select({
  label,
  name,
  defaultValue,
  children,
}: {
  label: string;
  name: string;
  defaultValue: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1 text-sm">
      {label}
      <select name={name} defaultValue={defaultValue} className="h-11 rounded-xl border border-line bg-paper px-3">
        {children}
      </select>
    </label>
  );
}
