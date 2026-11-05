import { Shell } from "@/components/shell";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Devoluciones",
  description: "Política de cambios y devoluciones de Perfumes y Belleza en Honduras.",
  path: "/politica-de-devoluciones",
});

export default function ReturnsPage() {
  return (
    <Shell className="max-w-3xl py-8 md:py-12">
      <h1 className="font-serif text-4xl md:text-5xl">Devoluciones</h1>
      <div className="mt-6 space-y-4 leading-7">
        <p>
          Si el producto sellado no es el que pediste, o llegó dañado, escríbenos por WhatsApp dentro de las
          48 horas de recibirlo. Te pedimos fotos del paquete y coordinamos el cambio. En ese caso el envío
          de regreso corre por nuestra cuenta.
        </p>
        <p>
          Los perfumes, brumas y productos de labios o cabello abiertos no tienen cambio, por higiene. Si
          cambias de opinión con un producto todavía sellado, puedes escribirnos en esas mismas 48 horas. El
          costo de devolverlo a nosotros corre por tu cuenta y el reembolso se hace por transferencia cuando
          lo recibamos en el mismo estado.
        </p>
        <p>El tiempo de entrega de CAEX no se cuenta como defecto del producto.</p>
      </div>
    </Shell>
  );
}
