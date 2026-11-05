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

`cost` en `data/products.ts` es el precio mayorista. No se envía al navegador.

Si el producto no trae `price`, el precio de venta se calcula en el servidor con `MARKUP_BY_TYPE` y `MIN_PROFIT_BY_TYPE` en `src/config.ts`, y se redondea a la decena (`PRICE_ROUND_TO`):

- Diseñador: 50% sobre el mayorista.
- Árabe y belleza: el doble del mayorista.

Si `price` está puesto, ese es el precio de venta y el margen no se aplica. También se redondea a la decena.

Si `cost` es 0 y no hay `price`, el producto todavía no tiene precio. La tienda muestra «Precio por confirmar» y no deja agregarlo al carrito. Lo que falta de las fotos está en `data/pendientes.md`.

## Existencia

`inStock` es la única existencia. Edítalo en `data/products.ts` o desde la terminal:

```bash
npm run stock
npm run stock -- asad
npm run stock -- asad off
```

## Cargar muchos productos

La plantilla de Excel está en `data/catalogo-plantilla.xlsx`. Una fila por producto. Las fotos van en una carpeta `imagenes`, y en la columna `imagen` se escribe el nombre del archivo (`tag-him.jpg`). La segunda foto va en `imagen 2`.

```bash
npm run import:catalog -- --csv data/catalogo-plantilla.xlsx --images imagenes
```

Columnas obligatorias: `nombre`, `marca`, `precio mayorista`, `categoria`, `tipo`. `precio` es opcional. `tipo` acepta Diseñador, Árabe, Belleza, o `designer`, `arabic`, `beauty`. También sirve un CSV con los mismos encabezados: `data/catalogo-plantilla.csv`.

Si el slug ya existe, se conserva `inStock` salvo que el CSV traiga la columna `stock`. Las imágenes se copian a `public/products/` en WebP, con el nombre del slug.

`inspiredBy` acepta el id de un perfume de diseñador del catálogo o un texto `Nombre (Marca)`. Si ese diseñador no está en el inventario, la tienda crea una referencia agotada para búsqueda y comparaciones. Las alternativas de cada diseñador se calculan solas.

## Pedidos

El checkout arma un mensaje de WhatsApp con el pedido, el envío y los datos de la persona. El número, el banco y las tarifas están en `src/config.ts`. Hay que reemplazar los valores de ejemplo antes de vender.
