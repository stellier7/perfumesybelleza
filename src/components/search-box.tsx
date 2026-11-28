"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { ClientSalePrice } from "@/components/client-sale-price";
import { TYPE_LABEL } from "@/config";
import { sectionLabel } from "@/lib/catalog-section";
import { displayTitle } from "@/lib/catalog-model";
import { searchPath, suggestionsForQuery } from "@/lib/search";
import { loadSearchRecords } from "@/lib/search-index";
import type { SearchRecord } from "@/types/catalog";

function suggestionKind(item: SearchRecord): string {
  if (item.section === "cuidado") return sectionLabel(item.section);
  if (item.isReference) return "Referencia";
  return TYPE_LABEL[item.type];
}

const SEARCH_PLACEHOLDER = "Perfume, skincare o belleza";

type Anchor = { top: number; left: number; width: number; maxHeight: number };

function SearchForm({
  records,
  placeholder,
  initialQuery,
  layout,
  onNavigate,
}: {
  records: SearchRecord[];
  placeholder: string;
  initialQuery: string;
  layout: "hero" | "header";
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const fieldId = useId();
  const rootRef = useRef<HTMLFormElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const suggestions = useMemo(
    () => suggestionsForQuery(records, query, 6),
    [records, query],
  );
  const stacked = layout === "hero";
  const showSuggestions = open && query.trim().length >= 2;

  function close() {
    setOpen(false);
  }

  function go(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    close();
    onNavigate?.();
    router.push(searchPath(records, trimmed));
  }

  useEffect(() => {
    if (!showSuggestions) return;
    const root = rootRef.current;
    if (!root) return;
    function place() {
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) return;
      const width = Math.min(rect.width, window.innerWidth - 16);
      const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
      const top = rect.bottom + 8;
      const reserve = window.innerWidth < 768 ? 88 : 16;
      const maxHeight = Math.min(320, Math.max(140, window.innerHeight - top - reserve));
      setAnchor((current) =>
        current &&
        current.top === top &&
        current.left === left &&
        current.width === width &&
        current.maxHeight === maxHeight
          ? current
          : { top, left, width, maxHeight },
      );
    }
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    window.visualViewport?.addEventListener("resize", place);
    window.visualViewport?.addEventListener("scroll", place);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      window.visualViewport?.removeEventListener("resize", place);
      window.visualViewport?.removeEventListener("scroll", place);
    };
  }, [showSuggestions, suggestions.length]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (rootRef.current?.contains(target) || listRef.current?.contains(target)) return;
      close();
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const suggestionList =
    showSuggestions && anchor
      ? createPortal(
          <ul
            ref={listRef}
            data-search-keep
            style={{ top: anchor.top, left: anchor.left, width: anchor.width, maxHeight: anchor.maxHeight }}
            className="fixed z-[70] overflow-auto rounded-2xl border border-line bg-paper shadow-lg"
          >
            {suggestions.length === 0 ? (
              <li className="px-4 py-3 text-sm text-muted">Sin coincidencias. Prueba con la marca o el nombre.</li>
            ) : (
              suggestions.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.isReference ? searchPath(records, item.name) : `/producto/${item.slug}`}
                    onClick={() => {
                      close();
                      onNavigate?.();
                    }}
                    className="flex items-center justify-between gap-3 px-3 py-2 hover:bg-ivory"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt=""
                        width={48}
                        height={48}
                        className="h-12 w-12 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="h-12 w-12 shrink-0 rounded-lg bg-blush/50" aria-hidden="true" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{displayTitle(item)}</span>
                      <span className="block text-xs text-muted">
                        {item.brand} · {suggestionKind(item)}
                        {!item.inStock && !item.isReference ? " · Agotado" : ""}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm">
                      {item.isReference ? "Ver alternativas" : <ClientSalePrice list={item.price} className="text-sm" />}
                    </span>
                  </Link>
                </li>
              ))
            )}
          </ul>,
          document.body,
        )
      : null;

  return (
    <form
      ref={rootRef}
      data-search-keep
      onSubmit={go}
      className={stacked ? "relative flex flex-col gap-2" : "relative"}
      role="search"
    >
      <label htmlFor={fieldId} className="sr-only">
        Buscar producto
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
        className={
          stacked
            ? "h-14 w-full rounded-full border border-line bg-paper px-4 text-base outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:px-5"
            : "h-14 w-full rounded-full border border-line bg-paper px-5 pr-28 text-base outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        }
      />
      <button
        type="submit"
        className={
          stacked
            ? "h-11 rounded-full bg-ink px-4 text-sm text-ivory"
            : "absolute right-2 top-2 h-10 rounded-full bg-ink px-4 text-sm text-ivory"
        }
      >
        Buscar
      </button>
      {suggestionList}
    </form>
  );
}

export function SearchBox({
  variant,
  initialQuery = "",
  onOpen,
}: {
  variant: "hero" | "header";
  initialQuery?: string;
  onOpen?: () => void;
}) {
  const pathname = usePathname();
  const [records, setRecords] = useState<SearchRecord[]>([]);
  const [sheet, setSheet] = useState(false);
  const [sheetPath, setSheetPath] = useState(pathname);
  if (pathname !== sheetPath) {
    setSheetPath(pathname);
    setSheet(false);
  }
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

  useEffect(() => {
    if (!sheet) return;
    function onPointerDown(event: PointerEvent) {
      const target = event.target;
      if (target instanceof Element && target.closest("[data-search-keep]")) return;
      setSheet(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setSheet(false);
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [sheet]);

  if (variant === "hero") {
    return (
      <SearchForm
        records={records}
        placeholder={SEARCH_PLACEHOLDER}
        initialQuery={initialQuery}
        layout="hero"
      />
    );
  }
  return (
    <>
      <div className="hidden w-72 shrink-0 lg:block">
        <SearchForm records={records} placeholder="Buscar" initialQuery={initialQuery} layout="header" />
      </div>
      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line lg:hidden"
        aria-label="Buscar"
        aria-expanded={sheet}
        onClick={() => {
          onOpen?.();
          setSheet(true);
        }}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path d="M16 16.5 20 20.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </button>
      {sheet
        ? createPortal(
            <div className="fixed inset-0 z-[60] bg-ivory px-4 pt-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-serif text-2xl">Buscar</p>
                <button type="button" onClick={() => setSheet(false)} className="text-sm">
                  Cerrar
                </button>
              </div>
              <SearchForm
                records={records}
                placeholder={SEARCH_PLACEHOLDER}
                initialQuery={initialQuery}
                layout="hero"
                onNavigate={() => setSheet(false)}
              />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
