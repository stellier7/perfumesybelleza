import { BankDetails } from "@/components/bank-details";
import { Shell } from "@/components/shell";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cómo pagar",
  description: "El pago es por transferencia. Envía el comprobante por WhatsApp para despachar tu pedido.",
  path: "/como-pagar",
});

export default function PaymentPage() {
  return (
    <Shell className="max-w-3xl py-8 md:py-12">
      <h1 className="font-serif text-4xl md:text-5xl">Cómo pagar</h1>
      <p className="mt-4 leading-7 text-muted">
        Trabajamos con transferencia bancaria. El pedido se aparta cuando vemos el comprobante en WhatsApp.
        Los datos de la cuenta todavía son de ejemplo: cámbialos en la configuración antes de publicar la tienda.
      </p>
      <div className="mt-8">
        <BankDetails />
      </div>
      <ol className="mt-8 list-decimal space-y-3 pl-5 leading-7">
        <li>Confirma el total del mensaje, con envío incluido.</li>
        <li>Transfiere ese monto a la cuenta.</li>
        <li>Responde el chat de WhatsApp con la captura o el número de referencia.</li>
        <li>En cuanto cuadre el pago, despachamos con CAEX y te mandamos la guía.</li>
      </ol>
    </Shell>
  );
}
