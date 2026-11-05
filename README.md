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

- Diseñador: 35% sobre el mayorista.
- Árabe: el doble del mayorista, con al menos L 120 de ganancia.
- Belleza: 70% sobre el mayorista, con al menos L 80 de ganancia.

Si `price` está puesto, ese es el precio de venta y el margen no se aplica. También se redondea a la decena.

## Existencia

`inStock` es la única existencia. Edítalo en `data/products.ts` o desde la terminal:

```bash
npm run stock
npm run stock -- tag-him
npm run stock -- tag-him off
```

## Importar un CSV

La plantilla está en `data/catalogo-plantilla.csv`. Columnas obligatorias: `nombre`, `marca`, `precio mayorista`, `categoria`, `tipo`.

`precio mayorista` es lo que pagas. `precio` es opcional: si lo dejas vacío, la tienda usa el margen del tipo. `tipo` es `designer`, `arabic` o `beauty` (también acepta diseñador, árabe y belleza). Opcionales: `ruta de imagen`, `genero`, `descripcion`, `ml`, `stock`, `inspirado en`, `etiquetas`, `salida`, `corazon`, `fondo`.

```bash
npm run import:catalog -- --csv data/catalogo-plantilla.csv
```

Si el slug ya existe, se conserva `inStock` salvo que el CSV traiga la columna `stock`. Las imágenes se copian a `public/products/` en WebP, con el nombre del slug.

`inspiredBy` acepta el id de un perfume de diseñador del catálogo o un texto `Nombre (Marca)`. Si ese diseñador no está en el inventario, la tienda crea una referencia agotada para búsqueda y comparaciones. Las alternativas de cada diseñador se calculan solas.

## Pedidos

El checkout arma un mensaje de WhatsApp con el pedido, el envío y los datos de la persona. El número, el banco y las tarifas están en `src/config.ts`. Hay que reemplazar los valores de ejemplo antes de vender.
