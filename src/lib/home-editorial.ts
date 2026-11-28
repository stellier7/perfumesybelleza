import { catalogFilterQuery, type CatalogFilters } from "@/lib/catalog-query";
import { catalogSection } from "@/lib/catalog-section";
import { homeImage } from "@/lib/home-images";
import { FACIAL_CATEGORIES, KOREAN_CATEGORY } from "@/lib/routine-finder";
import type { ProductType } from "@/types/catalog";

export type TileTone = "night" | "sage" | "rose" | "stone" | "paper";

export type EditorialTile = {
  id: string;
  title: string;
  text: string;
  href: string;
  image: string | null;
  tone: TileTone;
};

type ShelfProduct = {
  type: ProductType;
  category: string;
  brand: string;
  isReference?: boolean;
};

function shopHref(filters: Pick<CatalogFilters, "seccion"> & Partial<CatalogFilters>): string {
  return `/tienda${catalogFilterQuery({
    seccion: filters.seccion,
    tipo: filters.tipo ?? "",
    marca: filters.marca ?? "",
    genero: filters.genero ?? "",
    categoria: filters.categoria ?? "",
    min: filters.min ?? null,
    max: filters.max ?? null,
    stock: filters.stock ?? false,
    orden: filters.orden ?? "destacados",
    pagina: 1,
  })}`;
}

function hasCategory(products: readonly ShelfProduct[], category: string): boolean {
  return products.some((product) => product.category === category);
}

export function editorialTiles(products: readonly ShelfProduct[]): EditorialTile[] {
  const tiles: Array<EditorialTile & { visible: boolean }> = [
    {
      id: "perfumes",
      title: "Perfumes",
      text: "Diseñador, casas árabes y sets.",
      href: shopHref({ seccion: "perfumes" }),
      image: homeImage("perfumes"),
      tone: "night",
      visible: products.some((product) => catalogSection(product.type) === "perfumes"),
    },
    {
      id: "skincare",
      title: "Korean Skincare",
      text: "Cuidado coreano para la piel.",
      href: shopHref({ seccion: "cuidado", categoria: KOREAN_CATEGORY }),
      image: homeImage("skincare-coreano"),
      tone: "sage",
      visible: hasCategory(products, KOREAN_CATEGORY),
    },
    {
      id: "maquillaje",
      title: "Maquillaje",
      text: "Color, rostro y ojos.",
      href: shopHref({ seccion: "cuidado", categoria: "Maquillaje" }),
      image: homeImage("belleza"),
      tone: "rose",
      visible: hasCategory(products, "Maquillaje"),
    },
    {
      id: "facial",
      title: "Cuidado facial",
      text: "Limpieza, sérum, crema y sol.",
      href: "/facial",
      image: homeImage("cuidado-crema-facial"),
      tone: "paper",
      visible: products.some(
        (product) =>
          (FACIAL_CATEGORIES as readonly string[]).includes(product.category) ||
          product.category === KOREAN_CATEGORY,
      ),
    },
    {
      id: "unas",
      title: "Uñas",
      text: "Cuidado y color para uñas.",
      href: shopHref({ seccion: "cuidado", categoria: "Uñas" }),
      image: homeImage("cuidado-unas"),
      tone: "stone",
      visible: hasCategory(products, "Uñas"),
    },
    {
      id: "esenciales",
      title: "Esenciales",
      text: "Cabello, cuerpo y el cuidado de todos los días.",
      href: shopHref({ seccion: "cuidado" }),
      image: homeImage("cuidado"),
      tone: "stone",
      visible: products.some((product) => catalogSection(product.type) === "cuidado"),
    },
    {
      id: "todos",
      title: "Todos",
      text: "Perfumes y cuidado personal.",
      href: shopHref({ seccion: "perfumes" }),
      image: homeImage("perfumes-sets"),
      tone: "night",
      visible: products.length > 0,
    },
  ];
  return tiles.flatMap((tile) => {
    if (!tile.visible) return [];
    return [
      {
        id: tile.id,
        title: tile.title,
        text: tile.text,
        href: tile.href,
        image: tile.image,
        tone: tile.tone,
      },
    ];
  });
}

export function topBrands(
  products: readonly ShelfProduct[],
  type: ProductType,
  limit: number,
): Array<{ brand: string; count: number }> {
  const counts = new Map<string, number>();
  for (const product of products) {
    if (product.isReference || product.type !== type) continue;
    const brand = product.brand.trim();
    if (!brand) continue;
    counts.set(brand, (counts.get(brand) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], "es"))
    .slice(0, limit)
    .map(([brand, count]) => ({ brand, count }));
}
