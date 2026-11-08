"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useState, type FormEvent } from "react";
import { TYPE_LABEL } from "@/config";
import { sectionLabel } from "@/lib/catalog-section";
import { formatPrice, hasShelfPrice } from "@/lib/pricing";
import { searchPath, suggestionsForQuery } from "@/lib/search";
import { loadSearchRecords } from "@/lib/search-index";
import type { SearchRecord } from "@/types/catalog";

function suggestionKind(item: SearchRecord): string {
  if (item.section === "cuidado") return sectionLabel(item.section);
  if (item.isReference) return "Referencia";
  return TYPE_LABEL[item.type];
}

function SearchForm({
  records,
  placeholder,
}: {
  records: SearchRecord[];
  placeholder: string;
}) {
  const router = useRouter();
  const fieldId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const suggestions = useMemo(
    () => suggestionsForQuery(records, query, 6),
    [records, query],
  );

  function go(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    setOpen(false);
    router.push(searchPath(records, trimmed));
  }

  return (
    <form onSubmit={go} className="relative" role="search">
      <label htmlFor={fieldId} className="sr-only">
        Busca tu perfume favorito
      </label>
      <input
        id={fieldId}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        className="h-14 w-full rounded-full border border-line bg-paper px-5 pr-28 text-base outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      />
      <button type="submit" className="absolute right-2 top-2 h-10 rounded-full bg-ink px-4 text-sm text-ivory">
        Buscar
      </button>
      {open && query.trim().length >= 2 ? (
        <ul className="absolute z-30 mt-2 max-h-80 w-full overflow-auto rounded-2xl border border-line bg-paper shadow-lg">
          {suggestions.length === 0 ? (
            <li className="px-4 py-3 text-sm text-muted">Sin coincidencias. Prueba con la marca o el nombre.</li>
          ) : (
            suggestions.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.isReference ? searchPath(records, item.name) : `/producto/${item.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-ivory"
                >
                  <span>
                    <span className="block font-medium">{item.name}</span>
                    <span className="block text-xs text-muted">
                      {item.brand} · Tendencia {item.trending} · {suggestionKind(item)}
                      {!item.inStock && !item.isReference ? " · Agotado" : ""}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm">
                    {item.isReference
                      ? "Ver alternativas"
                      : hasShelfPrice(item.price)
                        ? formatPrice(item.price)
                        : "Precio por confirmar"}
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </form>
  );
}

export function SearchBox({ variant }: { variant: "hero" | "header" }) {
  const [records, setRecords] = useState<SearchRecord[]>([]);
  const [sheet, setSheet] = useState(false);
  useEffect(() => {
    let active = true;
    loadSearchRecords()
      .then((next) => {
        if (active) setRecords(next);
      })
      .catch(() => {
        if (active) setRecords([]);
      });
    return () => {
      active = false;
    };
  }, []);
  if (variant === "hero") {
    return <SearchForm records={records} placeholder="Busca tu perfume favorito" />;
  }
  return (
    <>
      <div className="hidden w-72 shrink-0 lg:block">
        <SearchForm records={records} placeholder="Buscar" />
      </div>
      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line lg:hidden"
        aria-label="Buscar"
        onClick={() => setSheet(true)}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path d="M16 16.5 20 20.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </button>
      {sheet ? (
        <div className="fixed inset-0 z-50 bg-ivory px-4 pt-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-serif text-2xl">Buscar</p>
            <button type="button" onClick={() => setSheet(false)} className="text-sm">
              Cerrar
            </button>
          </div>
          <SearchForm records={records} placeholder="Busca tu perfume favorito" />
        </div>
      ) : null}
    </>
  );
}
