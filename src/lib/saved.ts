export const WISHLIST_STORAGE_KEY = "pyb_wishlist";
export const RECENT_STORAGE_KEY = "pyb_recent";
export const RECENT_LIMIT = 8;
const WISHLIST_LIMIT = 60;

export type SavedItem = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  image: string | null;
  inStock: boolean;
  sizeLabel?: string;
};

function normalize(entry: unknown): SavedItem | null {
  if (!entry || typeof entry !== "object") return null;
  const item = entry as Partial<SavedItem>;
  if (!item.id || !item.slug || !item.name || !item.brand || typeof item.price !== "number") return null;
  const sizeLabel = typeof item.sizeLabel === "string" ? item.sizeLabel.trim() : "";
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    brand: item.brand,
    price: item.price,
    image: typeof item.image === "string" ? item.image : null,
    inStock: item.inStock !== false,
    sizeLabel: sizeLabel || undefined,
  };
}

export function parseSaved(raw: string): SavedItem[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((entry) => {
      const item = normalize(entry);
      return item ? [item] : [];
    });
  } catch {
    return [];
  }
}

export function toggleSaved(items: readonly SavedItem[], item: SavedItem): SavedItem[] {
  if (items.some((entry) => entry.id === item.id)) return items.filter((entry) => entry.id !== item.id);
  return [item, ...items].slice(0, WISHLIST_LIMIT);
}

export function rememberRecent(
  items: readonly SavedItem[],
  item: SavedItem,
  limit = RECENT_LIMIT,
): SavedItem[] {
  return [item, ...items.filter((entry) => entry.id !== item.id)].slice(0, limit);
}
