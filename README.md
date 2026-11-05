# Perfumes y Belleza

Tienda de perfumes y belleza para Honduras. Next.js, TypeScript y Tailwind. El texto está en español y los precios en lempiras.

El catálogo público de origen no trae los productos en el HTML: la página llega vacía y carga el inventario en el navegador, sin un listado que se pueda guardar. `data/products.ts` incluye un catálogo de muestra. Cuando tengas tus datos, impórtalos con un CSV.

## Puesta en marcha

```bash
npm install
npm run dev
```

Copia `.env.example` a `.env.local` y completa la URL del sitio y, si vas a medir anuncios, el pixel.

## Precio

`cost` en `data/products.ts` es el costo de compra. El precio de la tienda se calcula en el servidor con `PRICE_MARKUP` y `PRICE_ROUND_TO` en `src/config.ts` (margen 1.5 y redondeo a la decena). El costo no se envía al navegador.

## Existencia

`inStock` es la única existencia. Edítalo en `data/products.ts` o desde la terminal:

```bash
npm run stock
npm run stock -- tag-him
npm run stock -- tag-him off
```

## Importar un CSV

Columnas obligatorias: `name`, `brand`, `price`, `image path`, `category`, `type`.

`price` es el costo. `type` es `designer`, `arabic` o `beauty`. Opcionales: `gender`, `description`, `size`, `stock`, `inspiredBy`, `tags`, `top`, `heart`, `base`.

```bash
npm run import:catalog -- --csv data/catalogo.ejemplo.csv
```

Si el slug ya existe, se conserva `inStock` salvo que el CSV traiga la columna `stock`. Las imágenes se copian a `public/products/` en WebP, con el nombre del slug.

`inspiredBy` acepta el id de un perfume de diseñador del catálogo o un texto `Nombre (Marca)`. Si ese diseñador no está en el inventario, la tienda crea una referencia agotada para búsqueda y comparaciones. Las alternativas de cada diseñador se calculan solas.

## Pedidos

El checkout arma un mensaje de WhatsApp con el pedido, el envío y los datos de la persona. El número, el banco y las tarifas están en `src/config.ts`. Hay que reemplazar los valores de ejemplo antes de vender.
