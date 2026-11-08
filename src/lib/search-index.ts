"use client";

import type { SearchRecord } from "@/types/catalog";

let recordsPromise: Promise<SearchRecord[]> | null = null;

/** El índice se pide una vez. No viaja otra vez en cada visita a la tienda. */
export function loadSearchRecords(): Promise<SearchRecord[]> {
  if (!recordsPromise) {
    recordsPromise = fetch("/api/busqueda")
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json() as Promise<SearchRecord[]>;
      })
      .catch((error: unknown) => {
        recordsPromise = null;
        throw error;
      });
  }
  return recordsPromise;
}
