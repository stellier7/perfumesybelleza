import { Shell } from "@/components/shell";
import { store } from "@/config";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sobre nosotros",
  description: "Perfumes y Belleza es una tienda en Honduras de perfumes de diseñador, alternativas árabes y belleza.",
  path: "/sobre-nosotros",
});

export default function AboutPage() {
  return (
    <Shell className="max-w-3xl py-8 md:py-12">
      <h1 className="font-serif text-4xl md:text-5xl">Sobre nosotros</h1>
      <div className="mt-6 space-y-4 leading-7 text-muted">
        <p>
          {store.name} arma pedidos de perfumes y belleza para todo Honduras. La mayoría de las personas nos
          encuentra en Instagram y nos escribe desde el teléfono, así que la tienda está pensada para eso.
        </p>
        <p>
          Vendemos perfumes de diseñador cuando hay existencia, y alternativas árabes para quienes buscan un
          aroma similar a un precio más cómodo de reponer. También hay brumas y cuidado. No usamos logos de
          otras marcas y no decimos que una alternativa sea igual al perfume de la casa.
        </p>
        <p>
          La existencia la actualizamos a mano. Si un producto dice agotado, puedes pedir que te avisemos por
          WhatsApp. El envío sale con {store.carrier} después de la transferencia.
        </p>
      </div>
    </Shell>
  );
}
