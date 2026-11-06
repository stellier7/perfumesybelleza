import type { Gender, ProductType } from "@/types/catalog";

/** Respaldo si un producto no trae tipo. El margen real está en MARKUP_BY_TYPE. */
export const PRICE_MARKUP = 1.5;
export const PRICE_ROUND_TO = 10;

/**
 * Multiplicador sobre el precio mayorista.
 * Lo caro (diseñador) sube 50%. Lo barato (árabe y belleza) se vende al doble.
 * Una fila puede traer su propio precio y entonces este margen no se usa.
 */
export const MARKUP_BY_TYPE: Record<ProductType, number> = {
  designer: 1.5,
  arabic: 2,
  beauty: 2,
};

/** Ganancia mínima en lempiras, sumada al mayorista, antes de redondear. */
export const MIN_PROFIT_BY_TYPE: Record<ProductType, number> = {
  designer: 0,
  arabic: 0,
  beauty: 0,
};

export const PAGE_SIZE = 12;

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);

export const store = {
  name: "Perfumes y Belleza",
  description:
    "Perfumes de diseñador, alternativas árabes y belleza, con envío a todo Honduras.",
  url: siteUrl,
  locale: "es_HN",
  city: "Honduras",
  /** Número con código de país, sin + ni espacios. Reemplázalo por el real. */
  whatsappNumber: "50400000000",
  whatsappGreeting: "Hola, vi Perfumes y Belleza y quiero información.",
  email: "hola@perfumesybelleza.com",
  hours: "Lunes a sábado, 8:00 a.m. – 6:00 p.m. (hora de Honduras)",
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",
  shippingDays: "1 a 2 días hábiles",
  carrier: "CAEX (Cargo Expreso)",
} as const;

export const bank = {
  bankName: "Banco (completar)",
  accountName: "Perfumes y Belleza",
  accountType: "Cuenta de ahorro",
  accountNumber: "000-000-0000",
  identity: "0000-0000-00000",
} as const;

export const DEPARTMENTS = [
  "Atlántida",
  "Choluteca",
  "Colón",
  "Comayagua",
  "Copán",
  "Cortés",
  "El Paraíso",
  "Francisco Morazán",
  "Gracias a Dios",
  "Intibucá",
  "Islas de la Bahía",
  "La Paz",
  "Lempira",
  "Ocotepeque",
  "Olancho",
  "Santa Bárbara",
  "Valle",
  "Yoro",
] as const;

export type Department = (typeof DEPARTMENTS)[number];

/** Lempiras. Los departamentos que no aparecen usan la tarifa base. */
export const SHIPPING_DEFAULT_LPS = 95;

export const SHIPPING_BY_DEPARTMENT: Partial<Record<Department, number>> = {
  "Francisco Morazán": 80,
  Cortés: 80,
  "Gracias a Dios": 180,
  "Islas de la Bahía": 160,
};

/** Evento de Meta cuando el pedido se abre en WhatsApp. Cámbialo a "Purchase" si quieres optimizar por compra. */
export const PIXEL_ORDER_EVENT = "Lead" as const;

export const TYPE_LABEL: Record<ProductType, string> = {
  designer: "Diseñador",
  arabic: "Árabe",
  beauty: "Belleza",
};

/** Categoría de las brumas dentro de perfumería. El tipo (y el margen) no cambia. */
export const BRUMA_CATEGORY = "Brumas";

export const GENDER_LABEL: Record<Gender, string> = {
  hombre: "Hombre",
  mujer: "Mujer",
  unisex: "Unisex",
};

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];

export const UTM_STORAGE_KEY = "pyb_utm";
export const CART_STORAGE_KEY = "pyb_cart";
