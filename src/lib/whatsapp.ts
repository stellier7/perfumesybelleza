import { store } from "@/config";
import { formatPrice } from "@/lib/pricing";
import type { UtmKey } from "@/config";
import { UTM_KEYS } from "@/config";

export type OrderLine = {
  name: string;
  brand: string;
  qty: number;
  price: number;
};

export type CustomerDetails = {
  name: string;
  phone: string;
  department: string;
  city: string;
  address: string;
  notes: string;
};

export function trackingLine(utm: Record<string, string>): string | null {
  const parts = UTM_KEYS.flatMap((key: UtmKey) => {
    const value = utm[key];
    return value ? [`${key}=${value}`] : [];
  });
  if (parts.length === 0) return null;
  return `Seguimiento: ${parts.join(" | ")}`;
}

export function buildOrderMessage(input: {
  lines: OrderLine[];
  shipping: number;
  customer: CustomerDetails;
  utm?: Record<string, string>;
}): string {
  const subtotal = input.lines.reduce((sum, line) => sum + line.price * line.qty, 0);
  const total = subtotal + input.shipping;
  const items = input.lines
    .map(
      (line, index) =>
        `${index + 1}. ${line.name} (${line.brand}) × ${line.qty} — ${formatPrice(line.price * line.qty)}`,
    )
    .join("\n");
  const notes = input.customer.notes.trim();
  const lines = [
    `Hola, quiero hacer este pedido en ${store.name}:`,
    "",
    items,
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    `Envío (${input.customer.department}): ${formatPrice(input.shipping)}`,
    `Total: ${formatPrice(total)}`,
    "",
    "Datos de envío:",
    `Nombre: ${input.customer.name.trim()}`,
    `Teléfono: ${input.customer.phone.trim()}`,
    `Departamento: ${input.customer.department}`,
    `Ciudad: ${input.customer.city.trim()}`,
    `Dirección: ${input.customer.address.trim()}`,
    notes ? `Notas: ${notes}` : null,
    "",
    "Pago por transferencia.",
    trackingLine(input.utm ?? {}),
  ];
  return lines.filter((line): line is string => line !== null).join("\n");
}

export function buildProductInquiry(input: {
  name: string;
  brand: string;
  price: number;
  sizeMl: number | null;
  sizeLabel?: string;
  utm?: Record<string, string>;
}): string {
  const sizeText = input.sizeLabel ?? (input.sizeMl ? `${input.sizeMl} ml` : "");
  const size = sizeText ? `\nTamaño: ${sizeText}` : "";
  const price = input.price > 0 ? formatPrice(input.price) : "por confirmar";
  return [
    `Hola, me interesa este producto de ${store.name}:`,
    "",
    `${input.name} (${input.brand})`,
    `Precio: ${price}${size}`,
    "",
    "¿Me confirmas disponibilidad y envío?",
    trackingLine(input.utm ?? {}),
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

export function buildRestockMessage(input: {
  name: string;
  brand: string;
  utm?: Record<string, string>;
}): string {
  return [
    `Hola, quiero que me avisen cuando haya existencia de ${input.name} (${input.brand}) en ${store.name}.`,
    trackingLine(input.utm ?? {}),
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

export function buildGreeting(utm?: Record<string, string>): string {
  return [store.whatsappGreeting, trackingLine(utm ?? {})]
    .filter((line): line is string => line !== null)
    .join("\n");
}

export function whatsappUrl(message: string, number: string = store.whatsappNumber): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
