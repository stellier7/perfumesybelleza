import { FaqList } from "@/components/faq";
import { JsonLd } from "@/components/json-ld";
import { Shell } from "@/components/shell";
import { DEPARTMENTS, SHIPPING_DEFAULT_LPS, store } from "@/config";
import { formatPrice } from "@/lib/pricing";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { shippingCost } from "@/lib/shipping";

export const metadata = pageMetadata({
  title: "Envíos",
  description: `Enviamos a todo Honduras con ${store.carrier}. El pedido sale después de confirmar la transferencia.`,
  path: "/envios",
});

const faqs = [
  {
    question: "¿A dónde envían?",
    answer: "A los 18 departamentos de Honduras, por CAEX (Cargo Expreso).",
  },
  {
    question: "¿Cuánto tarda?",
    answer: "El despacho es en 1 a 2 días hábiles después de confirmar el comprobante. El tránsito depende de tu departamento.",
  },
  {
    question: "¿Cuándo me dan el rastreo?",
    answer: "Cuando CAEX recibe el paquete te escribimos por WhatsApp el número de guía.",
  },
];

export default function ShippingPage() {
  return (
    <Shell className="py-8 md:py-12">
      <JsonLd data={faqJsonLd(faqs)} />
      <h1 className="font-serif text-4xl md:text-5xl">Envíos</h1>
      <p className="mt-4 max-w-2xl leading-7 text-muted">
        Llegamos a todo Honduras con {store.carrier}. El tiempo habitual de entrega es de {store.shippingDays} hábiles
        después de confirmar tu transferencia.
      </p>
      <ol className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          ["1. Pedido", "Armas el carrito y nos escribes por WhatsApp con tus datos."],
          ["2. Transferencia", "Te pasamos la cuenta. Envías el comprobante en el mismo chat."],
          ["3. Despacho", "Preparamos el paquete y lo entregamos a CAEX."],
          ["4. Rastreo", "Te compartimos la guía para que sigas el envío."],
        ].map(([title, text]) => (
          <li key={title} className="rounded-3xl border border-line bg-paper p-5">
            <h2 className="font-serif text-2xl">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
          </li>
        ))}
      </ol>
      <h2 className="mt-12 font-serif text-3xl">Tarifas por departamento</h2>
      <p className="mt-2 text-sm text-muted">
        La base es {formatPrice(SHIPPING_DEFAULT_LPS)}. Estas cifras se pueden cambiar en la configuración de la tienda.
      </p>
      <div className="mt-4 overflow-hidden rounded-3xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Departamento</th>
              <th className="px-4 py-3 font-medium">Envío</th>
            </tr>
          </thead>
          <tbody>
            {DEPARTMENTS.map((department) => (
              <tr key={department} className="border-t border-line">
                <td className="px-4 py-3">{department}</td>
                <td className="px-4 py-3">{formatPrice(shippingCost(department))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-10">
        <FaqList items={faqs} />
      </div>
    </Shell>
  );
}
