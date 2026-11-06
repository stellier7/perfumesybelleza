"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { BankDetails } from "@/components/bank-details";
import { useCart } from "@/components/cart/cart-provider";
import { DEPARTMENTS, PIXEL_ORDER_EVENT, UTM_STORAGE_KEY } from "@/config";
import { formatPrice } from "@/lib/pricing";
import { trackPixel } from "@/lib/pixel";
import { shippingCost } from "@/lib/shipping";
import { sanitizeUtm } from "@/lib/utm";
import { buildOrderMessage, whatsappUrl } from "@/lib/whatsapp";

type SubmittedOrder = {
  total: number;
  department: string;
};

export function Checkout() {
  const { lines, hydrated, subtotal, setQty, remove, clear } = useCart();
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState<SubmittedOrder | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    if (!hydrated || fired.current || lines.length === 0 || submitted) return;
    fired.current = true;
    trackPixel("InitiateCheckout", {
      content_ids: lines.map((line) => line.id),
      value: subtotal,
      currency: "HNL",
      num_items: lines.reduce((sum, line) => sum + line.qty, 0),
    });
  }, [hydrated, lines, subtotal, submitted]);

  if (!hydrated) return <p className="text-muted">Cargando carrito…</p>;

  if (submitted) {
    return (
      <div className="max-w-xl">
        <h1 className="font-serif text-4xl">Pedido listo para WhatsApp</h1>
        <p className="mt-4 leading-7">
          Abrimos el chat con el detalle. Cuando hagas la transferencia, responde ese mensaje con el
          comprobante. El total es {formatPrice(submitted.total)}, con envío a {submitted.department}.
        </p>
        <div className="mt-6">
          <BankDetails />
        </div>
        <Link href="/tienda" className="mt-6 inline-flex h-12 items-center rounded-full bg-ink px-5 text-sm text-ivory">
          Seguir viendo
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div>
        <h1 className="font-serif text-4xl">Tu carrito está vacío</h1>
        <Link href="/tienda" className="mt-6 inline-flex h-12 items-center rounded-full bg-ink px-5 text-sm text-ivory">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  const shipping = department ? shippingCost(department) : null;
  const total = subtotal + (shipping ?? 0);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const customer = {
      name: String(data.get("name") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      department: String(data.get("department") ?? ""),
      city: String(data.get("city") ?? "").trim(),
      address: String(data.get("address") ?? "").trim(),
      notes: String(data.get("notes") ?? "").trim(),
    };
    const digits = customer.phone.replace(/\D/g, "");
    if (digits.length < 8) {
      setError("Escribe un teléfono con al menos 8 dígitos.");
      return;
    }
    setError("");
    let utm: Record<string, string> = {};
    try {
      utm = sanitizeUtm(JSON.parse(localStorage.getItem(UTM_STORAGE_KEY) ?? "{}"));
    } catch {
      utm = {};
    }
    const shippingAmount = shippingCost(customer.department);
    const orderTotal = subtotal + shippingAmount;
    const message = buildOrderMessage({ lines, shipping: shippingAmount, customer, utm });
    trackPixel(PIXEL_ORDER_EVENT, {
      content_ids: lines.map((line) => line.id),
      content_type: "product",
      value: orderTotal,
      currency: "HNL",
    });
    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
    setSubmitted({ total: orderTotal, department: customer.department });
    clear();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <h1 className="font-serif text-4xl md:text-5xl">Carrito</h1>
        <ul className="mt-6 divide-y divide-line">
          {lines.map((line) => (
            <li key={line.id} className="flex gap-3 py-4">
              <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-blush/50">
                {line.image ? <Image src={line.image} alt="" fill sizes="80px" className="object-cover" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-[0.14em] text-muted">{line.brand}</p>
                <p className="font-medium">{line.name}</p>
                <p className="text-sm">{formatPrice(line.price)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button type="button" className="h-9 w-9 rounded-full border border-line" onClick={() => setQty(line.id, line.qty - 1)} aria-label="Quitar uno">
                    −
                  </button>
                  <span className="w-6 text-center text-sm">{line.qty}</span>
                  <button type="button" className="h-9 w-9 rounded-full border border-line" onClick={() => setQty(line.id, line.qty + 1)} aria-label="Agregar uno">
                    +
                  </button>
                  <button type="button" className="ml-auto text-xs text-muted" onClick={() => remove(line.id)}>
                    Quitar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={submit} className="h-fit rounded-3xl border border-line bg-paper p-5 shadow-soft">
        <h2 className="font-serif text-3xl">Datos de envío</h2>
        <div className="mt-4 grid gap-3">
          <Field label="Nombre" name="name" required autoComplete="name" />
          <Field label="Teléfono" name="phone" required autoComplete="tel" inputMode="tel" />
          <label className="grid gap-1 text-sm">
            Departamento
            <select
              name="department"
              required
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              className="h-12 rounded-xl border border-line bg-ivory px-3"
            >
              <option value="">Elige un departamento</option>
              {DEPARTMENTS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <Field label="Ciudad" name="city" required autoComplete="address-level2" />
          <Field label="Dirección" name="address" required autoComplete="street-address" />
          <label className="grid gap-1 text-sm">
            Notas
            <textarea name="notes" rows={3} className="rounded-xl border border-line bg-ivory px-3 py-2" />
          </label>
        </div>
        {error ? <p className="mt-3 text-sm text-blush-deep">{error}</p> : null}
        <dl className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Envío</dt>
            <dd>{shipping === null ? "Elige el departamento" : formatPrice(shipping)}</dd>
          </div>
          <div className="flex justify-between text-base font-medium">
            <dt>Total</dt>
            <dd>{shipping === null ? "—" : formatPrice(total)}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs leading-5 text-muted">Pago por transferencia. El mensaje incluye el pedido y tus datos.</p>
        <button type="submit" className="mt-4 h-12 w-full rounded-full bg-ink text-sm text-ivory">
          Pedir por WhatsApp
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  required,
  autoComplete,
  inputMode,
}: {
  label: string;
  name: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "tel" | "text";
}) {
  return (
    <label className="grid gap-1 text-sm">
      {label}
      <input
        name={name}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="h-12 rounded-xl border border-line bg-ivory px-3"
      />
    </label>
  );
}
