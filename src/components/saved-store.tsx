"use client";

import { useSyncExternalStore } from "react";
import {
  parseSaved,
  rememberRecent,
  RECENT_STORAGE_KEY,
  toggleSaved,
  WISHLIST_STORAGE_KEY,
  type SavedItem,
} from "@/lib/saved";

type Kind = "wishlist" | "recent";

const KEYS: Record<Kind, string> = {
  wishlist: WISHLIST_STORAGE_KEY,
  recent: RECENT_STORAGE_KEY,
};

const EMPTY: SavedItem[] = [];

let snapshots: Record<Kind, SavedItem[]> = { wishlist: EMPTY, recent: EMPTY };
let loaded = false;
const listeners = new Set<() => void>();

function ensureLoaded(): void {
  if (loaded || typeof window === "undefined") return;
  snapshots = {
    wishlist: parseSaved(localStorage.getItem(KEYS.wishlist) ?? "[]"),
    recent: parseSaved(localStorage.getItem(KEYS.recent) ?? "[]"),
  };
  loaded = true;
}

function emit(): void {
  for (const listener of listeners) listener();
}

function write(kind: Kind, items: SavedItem[]): void {
  ensureLoaded();
  snapshots = { ...snapshots, [kind]: items };
  localStorage.setItem(KEYS[kind], JSON.stringify(items));
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(kind: Kind): SavedItem[] {
  ensureLoaded();
  return snapshots[kind];
}

function getServerSnapshot(): SavedItem[] {
  return EMPTY;
}

export function useSaved(kind: Kind): SavedItem[] {
  return useSyncExternalStore(subscribe, () => getSnapshot(kind), getServerSnapshot);
}

export function toggleWishlist(item: SavedItem): void {
  ensureLoaded();
  write("wishlist", toggleSaved(snapshots.wishlist, item));
}

export function rememberProduct(item: SavedItem): void {
  ensureLoaded();
  write("recent", rememberRecent(snapshots.recent, item));
}
