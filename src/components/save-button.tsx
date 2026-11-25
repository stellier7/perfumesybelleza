"use client";

import { toggleWishlist, useSaved } from "@/components/saved-store";
import type { SavedItem } from "@/lib/saved";

export function SaveButton({ item, className }: { item: SavedItem; className?: string }) {
  const saved = useSaved("wishlist").some((entry) => entry.id === item.id);
  return (
    <button
      type="button"
      className={className}
      aria-pressed={saved}
      aria-label={saved ? `Quitar ${item.name} de favoritos` : `Guardar ${item.name} en favoritos`}
      onClick={() => toggleWishlist(item)}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M12 19.2 5.4 13a3.8 3.8 0 0 1 5.4-5.4L12 8.8l1.2-1.2a3.8 3.8 0 0 1 5.4 5.4L12 19.2Z"
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
