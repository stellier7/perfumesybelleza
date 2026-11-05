import { Shell } from "@/components/shell";
import { store } from "@/config";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Términos",
  description: "Condiciones de compra en Perfumes y Belleza.",
  path: "/terminos",
});

export default function TermsPage() {
  return (
    <Shell className="max-w-3xl py-8 md:py-12">
      <h1 className="font-serif text-4xl md:text-5xl">Términos</h1>
      <div className="mt-6 space-y-4 leading-7">
        <p>
          Los precios están en lempiras e incluyen el margen publicado en la tienda. El envío se suma según
          el departamento. Un pedido queda confirmado cuando recibimos la transferencia por el total del
          mensaje de WhatsApp y el comprobante cuadra.
        </p>
        <p>
          La existencia de la página es la que mantenemos a mano. Si un producto se agota entre el mensaje y
          el pago, te avisamos y puedes cambiarlo o recibir el reembolso de lo que ya transferiste.
        </p>
        <p>
          Las alternativas árabes se describen como opciones para quienes buscan un aroma similar. No son el
          perfume de la casa de diseño y no garantizamos que la duración o el olor coincidan.
        </p>
        <p>
          Los envíos los hace {store.carrier} dentro de Honduras. El rastreo se comparte por WhatsApp. Las
          devoluciones se rigen por la política publicada en este sitio.
        </p>
      </div>
    </Shell>
  );
}
