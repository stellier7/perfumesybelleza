import { Shell } from "@/components/shell";
import { store } from "@/config";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacidad",
  description: "Qué datos usa Perfumes y Belleza para preparar un pedido.",
  path: "/privacidad",
});

export default function PrivacyPage() {
  return (
    <Shell className="max-w-3xl py-8 md:py-12">
      <h1 className="font-serif text-4xl md:text-5xl">Privacidad</h1>
      <div className="mt-6 space-y-4 leading-7">
        <p>
          Para enviar un pedido usamos el nombre, el teléfono, el departamento, la ciudad y la dirección que
          escribes en el carrito. Ese mensaje llega a nuestro WhatsApp. No vendemos esa información.
        </p>
        <p>
          El carrito se guarda en tu teléfono, en el almacenamiento del navegador. También podemos guardar
          los parámetros de la campaña (por ejemplo si llegaste desde un anuncio de Instagram) para saber
          qué publicación trajo el pedido. Esos datos viajan dentro del mensaje de WhatsApp.
        </p>
        <p>
          Si configuramos el pixel de Meta, el sitio puede registrar que viste un producto, lo agregaste al
          carrito o enviaste el pedido. Puedes limitar eso desde tu navegador o desde la configuración de
          anuncios de Meta.
        </p>
        <p>
          Para pedir una corrección o el borrado de un mensaje, escríbenos por WhatsApp al {store.whatsappDisplay}{" "}
          o a {store.email}. Los datos del pago los ve el banco que uses para la transferencia.
        </p>
      </div>
    </Shell>
  );
}
