import { ContactForm } from "@/components/contact-form";
import { Shell } from "@/components/shell";
import { store } from "@/config";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contacto",
  description: "Escríbenos por WhatsApp para pedidos, existencia y envíos en Honduras.",
  path: "/contacto",
});

export default function ContactPage() {
  return (
    <Shell className="py-8 md:py-12">
      <h1 className="font-serif text-4xl md:text-5xl">Contacto</h1>
      <p className="mt-4 max-w-xl leading-7 text-muted">
        Atendemos por WhatsApp. {store.hours}. Si ya armaste un pedido, usa el carrito para que el mensaje
        lleve los precios.
      </p>
      <ContactForm />
    </Shell>
  );
}
