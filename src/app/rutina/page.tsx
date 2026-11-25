import Link from "next/link";
import { Suspense } from "react";
import { Pager } from "@/components/pager";
import { ProductCard } from "@/components/product-card";
import { Shell } from "@/components/shell";
import { getSellableProducts } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";
import {
  INGREDIENT_PREFS,
  ROUTINE_STEPS,
  SKIN_TYPES,
  filterRoutine,
  parseRoutineQuery,
  routineHref,
  type RoutineQuery,
} from "@/lib/routine-finder";

export const metadata = pageMetadata({
  title: "Rutina de skincare",
  description:
    "Arma una rutina con los productos faciales y de skincare coreano que ya están en el catálogo.",
  path: "/rutina",
});

export default function RoutinePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<Shell className="py-12">Preparando la rutina…</Shell>}>
      <Routine searchParams={searchParams} />
    </Suspense>
  );
}

async function Routine({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = parseRoutineQuery(await searchParams);
  const result = filterRoutine(getSellableProducts(), query);
  return (
    <Shell className="py-8 md:py-12">
      <p className="text-[0.7rem] uppercase tracking-[0.22em] text-gold">K-Beauty</p>
      <h1 className="mt-3 max-w-2xl font-serif text-4xl md:text-6xl">Rutina de cuidado</h1>
      <p className="mt-4 max-w-2xl leading-7 text-muted">
        El paso de un producto facial sale de su categoría. En skincare coreano, el paso sale del nombre
        (limpiador, sérum, crema, solar). El tipo de piel y el ingrediente solo aparecen si la ficha los
        menciona.
      </p>
      <form action="/rutina" className="mt-8 grid gap-3 md:grid-cols-4">
        <label className="grid gap-1 text-sm">
          Paso
          <select name="paso" defaultValue={query.step} className="h-11 border border-line bg-paper px-3">
            <option value="">Todos</option>
            {ROUTINE_STEPS.map((step) => (
              <option key={step.id} value={step.id}>
                {step.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Piel, si la ficha lo dice
          <select name="piel" defaultValue={query.skin} className="h-11 border border-line bg-paper px-3">
            <option value="">Sin filtrar</option>
            {SKIN_TYPES.map((skin) => (
              <option key={skin.id} value={skin.id}>
                {skin.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Ingrediente en la ficha
          <select name="ingrediente" defaultValue={query.ingredient} className="h-11 border border-line bg-paper px-3">
            <option value="">Cualquiera</option>
            {INGREDIENT_PREFS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-end gap-2 pb-3 text-sm">
          <input type="checkbox" name="coreano" value="1" defaultChecked={query.korean} />
          Solo skincare coreano
        </label>
        <button type="submit" className="h-11 bg-ink text-sm text-ivory md:col-span-4 md:w-fit md:px-6">
          Ver rutina
        </button>
      </form>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {ROUTINE_STEPS.map((step) => {
          const next: RoutineQuery = { ...query, step: query.step === step.id ? "" : step.id, page: 1 };
          const current = query.step === step.id;
          return (
            <Link
              key={step.id}
              href={routineHref(next, 1)}
              aria-current={current ? "true" : undefined}
              className={`inline-flex h-10 shrink-0 items-center px-3 text-sm ${current ? "bg-ink text-ivory" : "border border-line"}`}
            >
              {step.label}
            </Link>
          );
        })}
      </div>
      <p className="mt-8 text-sm text-muted">
        {result.total} {result.total === 1 ? "producto" : "productos"}
      </p>
      {result.items.length === 0 ? (
        <p className="mt-4 max-w-xl leading-7">
          No hay productos con esa combinación en el catálogo. Quita el tipo de piel o el ingrediente: la mayoría
          de las fichas todavía no los declara.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {result.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      <Pager page={result.page} pages={result.pages} hrefFor={(page) => routineHref(query, page)} label="Páginas de la rutina" />
    </Shell>
  );
}
