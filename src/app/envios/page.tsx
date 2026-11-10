import { FaqList } from "@/components/faq";
import { JsonLd } from "@/components/json-ld";
import { Shell } from "@/components/shell";
import { DEPARTMENTS, SHIPPING_LPS, store } from "@/config";
import { formatPrice } from "@/lib/pricing";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Envíos",
  description: `Enviamos a todo Honduras con ${store.carrier} por ${formatPrice(SHIPPING_LPS)}. Los pedidos se arman todos los días a las ${store.orderFillTime} y llegan en ${store.shippingDays}.`,
  path: "/envios",
});

const faqs = [
  {
    question: "¿A dónde envían?",
    answer: "A los 18 departamentos de Honduras, por CAEX (Cargo Expreso).",
  },
  {
    question: "¿Cuánto tarda?",
    answer: `Armamos los pedidos todos los días a las ${store.orderFillTime} Si el pago se confirma después de esa hora, entra al día siguiente. ${store.carrier} lo entrega en ${store.shippingDays} a partir del armado.`,
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
        Llegamos a todo Honduras con {store.carrier}. El envío cuesta {formatPrice(SHIPPING_LPS)} a cualquier
        departamento. Los pedidos se arman todos los días a las {store.orderFillTime} Lo que se confirma después de
        esa hora se arma al día siguiente. A partir del armado, la entrega tarda {store.shippingDays}.
      </p>
      <ol className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          ["1. Pedido", "Armas el carrito y nos escribes por WhatsApp con tus datos."],
          ["2. Transferencia", "Te pasamos la cuenta. Envías el comprobante en el mismo chat."],
          ["3. Despacho", `Todos los días a las ${store.orderFillTime} preparamos los pedidos confirmados y los entregamos a CAEX.`],
          ["4. Rastreo", "Te compartimos la guía para que sigas el envío."],
        ].map(([title, text]) => (
          <li key={title} className="rounded-3xl border border-line bg-paper p-5 shadow-soft">
            <h2 className="font-serif text-2xl">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
          </li>
        ))}
      </ol>
      <h2 className="mt-12 font-serif text-3xl">Tarifa</h2>
      <p className="mt-2 text-sm text-muted">
        El envío cuesta {formatPrice(SHIPPING_LPS)} en los 18 departamentos.
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
                <td className="px-4 py-3">{formatPrice(SHIPPING_LPS)}</td>
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
