import { FavoritesList } from "@/components/favorites-list";
import { Shell } from "@/components/shell";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Favoritos",
  description: "Productos que guardaste en este dispositivo.",
  path: "/favoritos",
  index: false,
});

export default function FavoritesPage() {
  return (
    <Shell className="py-8 md:py-12">
      <p className="text-[0.7rem] uppercase tracking-[0.22em] text-gold">Guardados</p>
      <h1 className="mt-3 font-serif text-4xl md:text-6xl">Favoritos</h1>
      <div className="mt-8">
        <FavoritesList />
      </div>
    </Shell>
  );
}
