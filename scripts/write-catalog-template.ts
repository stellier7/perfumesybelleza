import ExcelJS from "exceljs";
import path from "node:path";

const HEADERS = [
  ["nombre", "Obligatorio. El nombre como quieres que se vea en la tienda."],
  ["marca", "Obligatorio. Por ejemplo Chanel, Armaf o Lattafa."],
  ["precio mayorista", "Obligatorio. Lo que te cuesta, en lempiras, sin el símbolo."],
  ["precio", "Opcional. Lo que quieres cobrar. Si lo dejas vacío, diseñador sube 50% y árabe o belleza se vende al doble."],
  ["imagen", "Nombre del archivo, por ejemplo tag-him.jpg. La foto va en la carpeta imagenes."],
  ["imagen 2", "Opcional. Segunda foto del mismo producto."],
  ["categoria", "Obligatorio. Por ejemplo Eau de Parfum, Bruma corporal o Labios."],
  ["tipo", "Obligatorio. Diseñador, Árabe o Belleza."],
  ["genero", "Hombre, Mujer o Unisex. Si lo dejas vacío, queda unisex."],
  ["descripcion", "Una o dos frases. Si lo dejas vacío, se arma con el nombre y la marca."],
  ["ml", "Mililitros. Solo el número, por ejemplo 100."],
  ["stock", "si o no. Si lo dejas vacío, entra como disponible."],
  ["inspirado en", "Para un árabe: el diseñador, por ejemplo Bleu de Chanel (Chanel). Varios separados con |."],
  ["etiquetas", "Palabras separadas con |. Por ejemplo fresco|oficina."],
  ["salida", "Notas de salida, separadas con |."],
  ["corazon", "Notas de corazón, separadas con |."],
  ["fondo", "Notas de fondo, separadas con |."],
  ["precio sugerido", "No lo llenes. Muestra lo que cobrará la tienda con la regla de arriba."],
] as const;

const SUGGESTED_PRICE =
  'IF(OR(C{row}="",H{row}=""),"",IF(D{row}<>"",ROUND(D{row}/10,0)*10,IF(OR(H{row}="Diseñador",H{row}="designer"),ROUND(C{row}*1.5/10,0)*10,ROUND(C{row}*2/10,0)*10)))';

async function main(): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Perfumes y Belleza";
  workbook.title = "Catálogo para cargar";

  const sheet = workbook.addWorksheet("Productos", {
    views: [{ state: "frozen", ySplit: 1, activeCell: "A2" }],
  });
  sheet.columns = HEADERS.map(([header], index) => ({
    header,
    key: `c${index}`,
    width: index === 9 || index === 12 ? 42 : index === 3 || index === 17 ? 22 : 20,
  }));

  const header = sheet.getRow(1);
  header.height = 24;
  header.font = { bold: true, color: { argb: "FF211915" }, name: "Calibri", size: 12 };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFC4A36A" } };
  header.alignment = { vertical: "middle", wrapText: true };
  HEADERS.forEach(([, note], index) => {
    const cell = header.getCell(index + 1);
    cell.note = note;
  });

  for (let rowNumber = 2; rowNumber <= 300; rowNumber += 1) {
    sheet.getCell(rowNumber, 3).numFmt = "#,##0.00";
    sheet.getCell(rowNumber, 4).numFmt = "#,##0.00";
    sheet.getCell(rowNumber, 18).numFmt = '"L "#,##0.00';
    sheet.getCell(rowNumber, 18).value = { formula: SUGGESTED_PRICE.replaceAll("{row}", String(rowNumber)) };
    sheet.getCell(rowNumber, 18).font = { color: { argb: "FF72655D" } };
    sheet.getCell(rowNumber, 8).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: ['"Diseñador,Árabe,Belleza"'],
      showErrorMessage: true,
      errorTitle: "Tipo",
      error: "Elige Diseñador, Árabe o Belleza.",
    };
    sheet.getCell(rowNumber, 9).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: ['"Hombre,Mujer,Unisex"'],
    };
    sheet.getCell(rowNumber, 12).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: ['"si,no"'],
    };
  }

  sheet.autoFilter = { from: "A1", to: "R1" };
  sheet.getColumn(18).width = 18;

  const help = workbook.addWorksheet("Instrucciones");
  help.getColumn(1).width = 24;
  help.getColumn(2).width = 96;
  const lines: Array<[string, string]> = [
    ["Qué me mandas", "Este archivo lleno y una carpeta llamada imagenes con las fotos. Una fila es un producto. Puedes pegar 100 filas o más."],
    ["Fotos", "En imagen escribe el nombre exacto del archivo, por ejemplo 01-tag-him.jpg. Si hay otra foto del mismo frasco, ponla en imagen 2. Sirve jpg, png o webp."],
    ["Precio", "precio mayorista es lo que te cuesta. Si dejas precio vacío, un diseñador se vende 50% arriba y un árabe o una belleza al doble, redondeado a la decena. La columna precio sugerido te lo muestra. Si quieres otro precio, escríbelo en precio."],
    ["Listas", "tipo, genero y stock tienen una lista. Árabe es la alternativa. inspirado en lleva el nombre del diseñador, por ejemplo Bleu de Chanel (Chanel)."],
    ["Notas", "salida, corazon y fondo son las notas del perfume. Varias notas van separadas con una barra: Bergamota|Limón."],
    ["Ejemplo", "Tag Him, Armaf, mayorista 460, sin precio, imagen tag-him.jpg, tipo Árabe, inspirado en Bleu de Chanel (Chanel). La tienda lo vende en L 920.00."],
    ["Otro ejemplo", "Bleu de Chanel, Chanel, mayorista 1860, precio 3200. Ese 3200 reemplaza el 50% y se vende en L 3,200.00."],
  ];
  lines.forEach(([title, text], index) => {
    const row = help.getRow(index + 1);
    row.getCell(1).value = title;
    row.getCell(1).font = { bold: true };
    row.getCell(2).value = text;
    row.getCell(2).alignment = { wrapText: true, vertical: "top" };
    row.height = 48;
  });

  const output = path.join(process.cwd(), "data", "catalogo-plantilla.xlsx");
  await workbook.xlsx.writeFile(output);
  console.log(output);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "No se pudo crear la plantilla.");
  process.exit(1);
});
