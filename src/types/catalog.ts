export const PRODUCT_TYPES = ["designer", "arabic", "beauty"] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

export const GENDERS = ["hombre", "mujer", "unisex"] as const;
export type Gender = (typeof GENDERS)[number];

export type FragranceNotes = {
  top: string[];
  heart: string[];
  base: string[];
};

/** Registro editable del inventario. `cost` no sale del servidor. */
export type RawProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  type: ProductType;
  gender: Gender;
  /** Precio mayorista. No sale del servidor. */
  cost: number;
  /** Precio de venta fijado a mano. Si falta, se calcula con el margen del tipo. */
  price?: number;
  images: string[];
  description: string;
  notes: FragranceNotes;
  sizeMl: number | null;
  /** Medida que no cabe en mililitros, como 1000 g o 3 × 80 ml. */
  sizeLabel?: string;
  inStock: boolean;
  category: string;
  tags: string[];
  inspiredBy?: string[];
  longevity?: number;
  projection?: number;
  bestFor?: string[];
  pros?: string[];
  cons?: string[];
  verdict?: string;
  featured?: boolean;
};

export type FragranceRef = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  inStock: boolean;
  isReference: boolean;
};

/** Producto listo para la tienda. El costo de compra no forma parte de este tipo. */
export type PublicProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  type: ProductType;
  gender: Gender;
  price: number;
  images: string[];
  description: string;
  notes: FragranceNotes;
  sizeMl: number | null;
  sizeLabel?: string;
  inStock: boolean;
  category: string;
  tags: string[];
  longevity?: number;
  projection?: number;
  bestFor?: string[];
  pros?: string[];
  cons?: string[];
  verdict?: string;
  featured?: boolean;
  isReference: boolean;
  inspiredBy: FragranceRef[];
  alternatives: FragranceRef[];
};

export type SearchRecord = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  type: ProductType;
  gender: Gender;
  price: number;
  image: string | null;
  inStock: boolean;
  isReference: boolean;
  category: string;
  tags: string[];
  haystack: string;
  alternativeIds: string[];
  inspiredNames: string[];
};
