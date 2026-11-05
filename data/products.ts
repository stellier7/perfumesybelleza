import "server-only";
import type { RawProduct } from "../src/types/catalog";

/**
 * Inventario de la tienda.
 * `cost` es el precio mayorista y no debe usarse en componentes de cliente.
 * Un costo en cero significa que el precio todavía no está definido.
 * `price`, si está, es el precio de venta. Si falta y hay costo, se calcula con el margen del tipo.
 * `inStock` es la única fuente de existencia. Cámbialo aquí o con `npm run stock`.
 */
export const rawProducts: RawProduct[] = [
  {
      id: "philos-centro",
      slug: "philos-centro",
      name: "Philos Centro",
      brand: "Philos",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/philos-centro.webp"],
      description: "Eau de parfum de 100 ml. La foto lo marca en liquidación. El texto de arriba escribe el nombre como Piloso.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: ["liquidación"]
    },
  {
      id: "the-secret-antonio-banderas",
      slug: "the-secret-antonio-banderas",
      name: "The Secret",
      brand: "Antonio Banderas",
      type: "designer",
      gender: "hombre",
      cost: 0,
      images: ["/products/the-secret-antonio-banderas.webp"],
      description: "Desodorante en spray. La foto no indica los mililitros.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Desodorante",
      tags: []
    },
  {
      id: "hypnotic-poison",
      slug: "hypnotic-poison",
      name: "Hypnotic Poison",
      brand: "Dior",
      type: "designer",
      gender: "mujer",
      cost: 0,
      images: ["/products/hypnotic-poison.webp"],
      description: "Eau de toilette. La caja impresa dice 30 ml. El texto encima de la foto dice 100 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 30,
      inStock: true,
      category: "Eau de Toilette",
      tags: ["liquidación"]
    },
  {
      id: "gorgeous-michael-kors",
      slug: "gorgeous-michael-kors",
      name: "Gorgeous",
      brand: "Michael Kors",
      type: "designer",
      gender: "mujer",
      cost: 0,
      images: ["/products/gorgeous-michael-kors.webp"],
      description: "Eau de parfum de 100 ml para mujer.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: ["liquidación"],
      featured: true
    },
  {
      id: "linterdit-rouge",
      slug: "linterdit-rouge",
      name: "L'Interdit Rouge",
      brand: "Givenchy",
      type: "designer",
      gender: "mujer",
      cost: 0,
      images: ["/products/linterdit-rouge.webp"],
      description: "Eau de parfum Rouge de 80 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 80,
      inStock: true,
      category: "Eau de Parfum",
      tags: ["liquidación"],
      featured: true
    },
  {
      id: "sexy-amber",
      slug: "sexy-amber",
      name: "Sexy Amber",
      brand: "Michael Kors",
      type: "designer",
      gender: "mujer",
      cost: 0,
      images: ["/products/sexy-amber.webp"],
      description: "Eau de parfum de 100 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: ["liquidación"]
    },
  {
      id: "galatea",
      slug: "galatea",
      name: "Galatea",
      brand: "Alhambra",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/galatea.webp"],
      description: "Eau de parfum de 100 ml. El frasco dice Alhambra.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: ["liquidación"]
    },
  {
      id: "delina",
      slug: "delina",
      name: "Delina",
      brand: "Parfums de Marly",
      type: "designer",
      gender: "mujer",
      cost: 0,
      images: ["/products/delina.webp"],
      description: "Eau de parfum de 75 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 75,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "amber-oud-ultra-violet",
      slug: "amber-oud-ultra-violet",
      name: "Amber Oud Ultra Violet",
      brand: "Al Haramain",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/amber-oud-ultra-violet.webp"],
      description: "Amber Oud Ultra Violet. La foto no indica mililitros ni concentración.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "eros-energy",
      slug: "eros-energy",
      name: "Eros Energy",
      brand: "Versace",
      type: "designer",
      gender: "hombre",
      cost: 0,
      images: ["/products/eros-energy.webp"],
      description: "Eau de parfum pour homme de 100 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: [],
      featured: true
    },
  {
      id: "la-belle",
      slug: "la-belle",
      name: "La Belle",
      brand: "Jean Paul Gaultier",
      type: "designer",
      gender: "mujer",
      cost: 0,
      images: ["/products/la-belle.webp"],
      description: "Eau de parfum de 100 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: [],
      featured: true
    },
  {
      id: "acqua-di-gio",
      slug: "acqua-di-gio",
      name: "Acqua di Gio",
      brand: "Giorgio Armani",
      type: "designer",
      gender: "hombre",
      cost: 0,
      images: ["/products/acqua-di-gio.webp"],
      description: "Acqua di Gio de 100 ml. El frasco es el clásico color agua.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Toilette",
      tags: [],
      featured: true
    },
  {
      id: "linterdit",
      slug: "linterdit",
      name: "L'Interdit",
      brand: "Givenchy",
      type: "designer",
      gender: "mujer",
      cost: 0,
      images: ["/products/linterdit.webp"],
      description: "Eau de parfum de 80 ml. Es el frasco transparente, distinto del Rouge.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 80,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "set-eros-energy",
      slug: "set-eros-energy",
      name: "Set Eros Energy",
      brand: "Versace",
      type: "designer",
      gender: "hombre",
      cost: 0,
      images: ["/products/set-eros-energy.webp"],
      description: "Set con eau de parfum de 50 ml, gel de baño de 50 ml y bálsamo para después del afeitado de 50 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 50,
      inStock: true,
      category: "Set",
      tags: []
    },
  {
      id: "game-of-spades-jackpot",
      slug: "game-of-spades-jackpot",
      name: "Jackpot",
      brand: "Game of Spades",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/game-of-spades-jackpot.webp"],
      description: "Frasco de 100 ml. El texto de la foto dice eau de parfum y el frasco dice parfum.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Parfum",
      tags: []
    },
  {
      id: "set-versace-man-eau-fraiche",
      slug: "set-versace-man-eau-fraiche",
      name: "Set Man Eau Fraîche",
      brand: "Versace",
      type: "designer",
      gender: "hombre",
      cost: 0,
      images: ["/products/set-versace-man-eau-fraiche.webp"],
      description: "Set con el eau de toilette Man Eau Fraîche, un atomizador de viaje y un estuche. El tamaño del frasco principal no se lee.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Set",
      tags: []
    },
  {
      id: "omnia-amethyst",
      slug: "omnia-amethyst",
      name: "Omnia Amethyst",
      brand: "Bvlgari",
      type: "designer",
      gender: "mujer",
      cost: 0,
      images: ["/products/omnia-amethyst.webp"],
      description: "Eau de toilette de 100 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Toilette",
      tags: [],
      featured: true
    },
  {
      id: "amber-oud-carbon-edition-60",
      slug: "amber-oud-carbon-edition-60",
      name: "Amber Oud Carbon Edition 60 ml",
      brand: "Al Haramain",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/amber-oud-carbon-edition-60.webp"],
      description: "Eau de parfum Carbon Edition de 60 ml. Hay otra foto del mismo nombre en 100 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 60,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "bharara-goddess",
      slug: "bharara-goddess",
      name: "Goddess",
      brand: "Bharara",
      type: "arabic",
      gender: "mujer",
      cost: 0,
      images: ["/products/bharara-goddess.webp"],
      description: "Eau de parfum de 100 ml. El texto de la foto dice Goddess Women.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "ombre-oud-intense-black",
      slug: "ombre-oud-intense-black",
      name: "Ombre Oud Intense Black",
      brand: "Armaf",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/ombre-oud-intense-black.webp"],
      description: "Parfum de 100 ml. La caja dice Intense Black by Armaf.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Parfum",
      tags: []
    },
  {
      id: "oros-donna",
      slug: "oros-donna",
      name: "Oros Donna",
      brand: "Oros",
      type: "arabic",
      gender: "mujer",
      cost: 0,
      images: ["/products/oros-donna.webp"],
      description: "Eau de parfum de 100 ml. El estuche dice que incluye cristales.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "armaf-christian-provenzano-ii",
      slug: "armaf-christian-provenzano-ii",
      name: "Christian Provenzano II",
      brand: "Armaf",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/armaf-christian-provenzano-ii.webp"],
      description: "Pure parfum, edición II, frasco rojo.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Pure Parfum",
      tags: []
    },
  {
      id: "armaf-christian-provenzano-iii",
      slug: "armaf-christian-provenzano-iii",
      name: "Christian Provenzano III",
      brand: "Armaf",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/armaf-christian-provenzano-iii.webp"],
      description: "Pure parfum, edición III, frasco azul.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Pure Parfum",
      tags: []
    },
  {
      id: "armaf-christian-provenzano-iv",
      slug: "armaf-christian-provenzano-iv",
      name: "Christian Provenzano IV",
      brand: "Armaf",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/armaf-christian-provenzano-iv.webp"],
      description: "Pure parfum, edición IV, frasco café.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Pure Parfum",
      tags: []
    },
  {
      id: "armaf-christian-provenzano-i",
      slug: "armaf-christian-provenzano-i",
      name: "Christian Provenzano I",
      brand: "Armaf",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/armaf-christian-provenzano-i.webp"],
      description: "Pure parfum, edición I, frasco dorado.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Pure Parfum",
      tags: []
    },
  {
      id: "polo-red-rush",
      slug: "polo-red-rush",
      name: "Polo Red Rush",
      brand: "Ralph Lauren",
      type: "designer",
      gender: "hombre",
      cost: 0,
      images: ["/products/polo-red-rush.webp"],
      description: "Eau de toilette de 125 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 125,
      inStock: true,
      category: "Eau de Toilette",
      tags: []
    },
  {
      id: "tonino-lamborghini-acqua",
      slug: "tonino-lamborghini-acqua",
      name: "Acqua",
      brand: "Tonino Lamborghini",
      type: "designer",
      gender: "hombre",
      cost: 0,
      images: ["/products/tonino-lamborghini-acqua.webp"],
      description: "Eau de toilette de 125 ml. La caja dice tester.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 125,
      inStock: true,
      category: "Eau de Toilette",
      tags: ["tester"]
    },
  {
      id: "so-candid",
      slug: "so-candid",
      name: "So Candid Pour Homme",
      brand: "Maison Alhambra",
      type: "arabic",
      gender: "hombre",
      cost: 0,
      images: ["/products/so-candid.webp"],
      description: "Eau de parfum pour homme de 100 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "bint-hooran-rose-passion",
      slug: "bint-hooran-rose-passion",
      name: "Rose Passion",
      brand: "Bint Hooran",
      type: "arabic",
      gender: "mujer",
      cost: 0,
      images: ["/products/bint-hooran-rose-passion.webp"],
      description: "Rose Passion de Bint Hooran. La foto no indica mililitros ni concentración.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Perfume",
      tags: []
    },
  {
      id: "ralph",
      slug: "ralph",
      name: "Ralph",
      brand: "Ralph Lauren",
      type: "designer",
      gender: "mujer",
      cost: 0,
      images: ["/products/ralph.webp"],
      description: "Eau de toilette de 100 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Toilette",
      tags: []
    },
  {
      id: "anoud",
      slug: "anoud",
      name: "Anoud",
      brand: "Anoud",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/anoud.webp"],
      description: "Frasco turquesa con el nombre Anoud en árabe y en latín. No se lee casa, tamaño ni concentración.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Perfume",
      tags: []
    },
  {
      id: "aser",
      slug: "aser",
      name: "Aser",
      brand: "Niche Avenue",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/aser.webp"],
      description: "Eau de parfum. La caja parece indicar 100 ml, pero el número no se lee completo.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "polo-red",
      slug: "polo-red",
      name: "Polo Red",
      brand: "Ralph Lauren",
      type: "designer",
      gender: "hombre",
      cost: 0,
      images: ["/products/polo-red.webp"],
      description: "Eau de toilette de 200 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 200,
      inStock: true,
      category: "Eau de Toilette",
      tags: []
    },
  {
      id: "game-of-spades-queen",
      slug: "game-of-spades-queen",
      name: "Queen",
      brand: "Game of Spades",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/game-of-spades-queen.webp"],
      description: "Parfum. La foto no indica los mililitros.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Parfum",
      tags: []
    },
  {
      id: "set-espectro",
      slug: "set-espectro",
      name: "Set Espectro",
      brand: "Dubai Niche",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/set-espectro.webp"],
      description: "Set con el eau de parfum, loción corporal de 100 ml, atomizador de 15 ml y un vial pequeño. El tamaño del frasco principal no se lee.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Set",
      tags: []
    },
  {
      id: "mawj",
      slug: "mawj",
      name: "Mawj",
      brand: "Niche Avenue",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/mawj.webp"],
      description: "Eau de parfum. El tamaño de la caja no se lee.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "aventus-for-her",
      slug: "aventus-for-her",
      name: "Aventus For Her",
      brand: "Creed",
      type: "designer",
      gender: "mujer",
      cost: 0,
      images: ["/products/aventus-for-her.webp"],
      description: "Eau de parfum For Her de 75 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 75,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "fakhar",
      slug: "fakhar",
      name: "Fakhar",
      brand: "Lattafa",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/fakhar.webp"],
      description: "Eau de parfum de 100 ml, frasco blanco con tapa oro rosa. Es distinto del Fakhar Black.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "ciao-vince-camuto",
      slug: "ciao-vince-camuto",
      name: "Ciao",
      brand: "Vince Camuto",
      type: "beauty",
      gender: "mujer",
      cost: 0,
      images: ["/products/ciao-vince-camuto.webp"],
      description: "Bruma perfumada de 236 ml (8 fl oz).",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 236,
      inStock: true,
      category: "Bruma corporal",
      tags: []
    },
  {
      id: "odyssey-revolution-ultra",
      slug: "odyssey-revolution-ultra",
      name: "Odyssey Revolution Ultra Edition",
      brand: "Armaf",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/odyssey-revolution-ultra.webp"],
      description: "Eau de parfum Ultra Edition de 100 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "club-de-nuit-milestone",
      slug: "club-de-nuit-milestone",
      name: "Club de Nuit Milestone",
      brand: "Armaf",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/club-de-nuit-milestone.webp"],
      description: "Eau de parfum de 105 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 105,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "odyssey-artisto-red",
      slug: "odyssey-artisto-red",
      name: "Odyssey Artisto The Red",
      brand: "Armaf",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/odyssey-artisto-red.webp"],
      description: "Eau de parfum The Red Edition de 100 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "odyssey-eau-montagne",
      slug: "odyssey-eau-montagne",
      name: "Odyssey Eau Montagne",
      brand: "Armaf",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/odyssey-eau-montagne.webp"],
      description: "Eau de parfum Mountain Edition de 100 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "ck-in2u-him",
      slug: "ck-in2u-him",
      name: "CK IN2U Him",
      brand: "Calvin Klein",
      type: "designer",
      gender: "hombre",
      cost: 0,
      images: ["/products/ck-in2u-him.webp"],
      description: "Eau de toilette de 150 ml, versión Him.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 150,
      inStock: true,
      category: "Eau de Toilette",
      tags: []
    },
  {
      id: "kismet-magic",
      slug: "kismet-magic",
      name: "Kismet Magic",
      brand: "Maison Alhambra",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/kismet-magic.webp"],
      description: "Eau de parfum de 100 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "amber-oud-carbon-edition-100",
      slug: "amber-oud-carbon-edition-100",
      name: "Amber Oud Carbon Edition 100 ml",
      brand: "Al Haramain",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/amber-oud-carbon-edition-100.webp"],
      description: "Eau de parfum Carbon Edition de 100 ml. Hay otra foto del mismo nombre en 60 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "odyssey-homme",
      slug: "odyssey-homme",
      name: "Odyssey Homme",
      brand: "Armaf",
      type: "arabic",
      gender: "hombre",
      cost: 0,
      images: ["/products/odyssey-homme.webp"],
      description: "Eau de parfum de 100 ml. La tapa dice Armaf.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "club-de-nuit-iconic",
      slug: "club-de-nuit-iconic",
      name: "Club de Nuit Iconic",
      brand: "Armaf",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/club-de-nuit-iconic.webp"],
      description: "Eau de parfum de 200 ml. El medallón dice Armaf.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 200,
      inStock: true,
      category: "Eau de Parfum",
      tags: [],
      featured: true
    },
  {
      id: "212-vip",
      slug: "212-vip",
      name: "212 VIP",
      brand: "Carolina Herrera",
      type: "designer",
      gender: "mujer",
      cost: 0,
      images: ["/products/212-vip.webp"],
      description: "Eau de parfum de 80 ml, frasco cápsula dorado.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 80,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "boss-selection",
      slug: "boss-selection",
      name: "Selection",
      brand: "Hugo Boss",
      type: "designer",
      gender: "hombre",
      cost: 0,
      images: ["/products/boss-selection.webp"],
      description: "Eau de toilette de 100 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Toilette",
      tags: []
    },
  {
      id: "le-male",
      slug: "le-male",
      name: "Le Male",
      brand: "Jean Paul Gaultier",
      type: "designer",
      gender: "hombre",
      cost: 0,
      images: ["/products/le-male.webp"],
      description: "Eau de toilette de 125 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 125,
      inStock: true,
      category: "Eau de Toilette",
      tags: []
    },
  {
      id: "paco-rabanne-xs",
      slug: "paco-rabanne-xs",
      name: "XS",
      brand: "Paco Rabanne",
      type: "designer",
      gender: "hombre",
      cost: 0,
      images: ["/products/paco-rabanne-xs.webp"],
      description: "Eau de toilette de 100 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Toilette",
      tags: []
    },
  {
      id: "set-guess-man-gold",
      slug: "set-guess-man-gold",
      name: "Set Man Gold",
      brand: "Guess",
      type: "designer",
      gender: "hombre",
      cost: 0,
      images: ["/products/set-guess-man-gold.webp"],
      description: "Set con body spray de 170 ml (6 fl oz), gel de ducha de 200 ml (7 fl oz) y el eau de toilette. El tamaño del eau de toilette no se lee.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Set",
      tags: []
    },
  {
      id: "the-black-92",
      slug: "the-black-92",
      name: "The Black 92",
      brand: "Emper",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/the-black-92.webp"],
      description: "Eau de parfum de 100 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "toy-2-pearl",
      slug: "toy-2-pearl",
      name: "Toy 2 Pearl",
      brand: "Moschino",
      type: "designer",
      gender: "mujer",
      cost: 0,
      images: ["/products/toy-2-pearl.webp"],
      description: "Eau de parfum de 100 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "cuba-fierce",
      slug: "cuba-fierce",
      name: "Fierce",
      brand: "Cuba",
      type: "designer",
      gender: "hombre",
      cost: 0,
      images: ["/products/cuba-fierce.webp"],
      description: "Eau de toilette de 100 ml. La lata dice for men.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Toilette",
      tags: []
    },
  {
      id: "asad",
      slug: "asad",
      name: "Asad",
      brand: "Lattafa",
      type: "arabic",
      gender: "hombre",
      cost: 0,
      images: ["/products/asad.webp"],
      description: "Eau de parfum de 100 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: [],
      featured: true
    },
  {
      id: "atheeri",
      slug: "atheeri",
      name: "Atheeri",
      brand: "Lattafa",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/atheeri.webp"],
      description: "Eau de parfum de 100 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "fakhar-black",
      slug: "fakhar-black",
      name: "Pride Fakhar Black",
      brand: "Lattafa",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/fakhar-black.webp"],
      description: "Eau de parfum de 100 ml. La caja dice Pride of Lattafa. Es distinto del Fakhar blanco.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "scandal-absolu",
      slug: "scandal-absolu",
      name: "Scandal Absolu",
      brand: "Jean Paul Gaultier",
      type: "designer",
      gender: "hombre",
      cost: 0,
      images: ["/products/scandal-absolu.webp"],
      description: "Parfum pour homme. La caja impresa dice 50 ml. El texto encima de la foto dice 100 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 50,
      inStock: true,
      category: "Parfum",
      tags: []
    },
  {
      id: "star-wars-the-force-awakens",
      slug: "star-wars-the-force-awakens",
      name: "The Force Awakens",
      brand: "Star Wars",
      type: "designer",
      gender: "unisex",
      cost: 0,
      images: ["/products/star-wars-the-force-awakens.webp"],
      description: "Mini de Star Wars The Force Awakens, con lonchera de metal. No se lee la casa del perfume ni los mililitros.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Perfume",
      tags: []
    },
  {
      id: "le-parfait-mon-amour",
      slug: "le-parfait-mon-amour",
      name: "Le Parfait Mon Amour",
      brand: "Armaf",
      type: "arabic",
      gender: "mujer",
      cost: 0,
      images: ["/products/le-parfait-mon-amour.webp"],
      description: "Eau de parfum pour femme de 100 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "ombre-dor",
      slug: "ombre-dor",
      name: "Ombre D'or",
      brand: "Armaf",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/ombre-dor.webp"],
      description: "Ombre D'or de Armaf. El texto de la caja no se lee completo y no indica un tamaño claro.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Parfum",
      tags: []
    },
  {
      id: "sherif",
      slug: "sherif",
      name: "Sherif",
      brand: "Lattafa",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/sherif.webp"],
      description: "Eau de parfum de 100 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "set-club-de-nuit-sillage",
      slug: "set-club-de-nuit-sillage",
      name: "Set Club de Nuit Sillage",
      brand: "Armaf",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/set-club-de-nuit-sillage.webp"],
      description: "Estuche de colección con el eau de parfum, un frasco plateado, desodorante, spray corporal y dos atomizadores de viaje. Los mililitros de cada pieza no se leen con claridad.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Set",
      tags: []
    },
  {
      id: "360-collection-noir",
      slug: "360-collection-noir",
      name: "360° Collection Noir",
      brand: "Perry Ellis",
      type: "designer",
      gender: "hombre",
      cost: 0,
      images: ["/products/360-collection-noir.webp"],
      description: "Eau de toilette de 100 ml para hombre. La caja dice Noir y 360° Collection for Men.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Toilette",
      tags: []
    },
  {
      id: "360-collection",
      slug: "360-collection",
      name: "360° Collection",
      brand: "Perry Ellis",
      type: "designer",
      gender: "hombre",
      cost: 0,
      images: ["/products/360-collection.webp"],
      description: "Eau de toilette de 100 ml para hombre. El frasco es plateado. La caja dice 3.4 fl oz y 100 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Toilette",
      tags: []
    },
  {
      id: "boss-number-one",
      slug: "boss-number-one",
      name: "Number One",
      brand: "Hugo Boss",
      type: "designer",
      gender: "hombre",
      cost: 0,
      images: ["/products/boss-number-one.webp"],
      description: "Eau de toilette de 100 ml. El frasco dice Boss Number One. El texto de la foto dice Número One.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Toilette",
      tags: []
    },
  {
      id: "ch-hc-men-sport",
      slug: "ch-hc-men-sport",
      name: "CH HC Men Sport",
      brand: "Carolina Herrera",
      type: "designer",
      gender: "hombre",
      cost: 0,
      images: ["/products/ch-hc-men-sport.webp"],
      description: "Eau de toilette de 100 ml. El frasco dice CH HC y el texto de la foto dice CH HC Men Sport.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Toilette",
      tags: []
    },
  {
      id: "guess-seductive-homme-red",
      slug: "guess-seductive-homme-red",
      name: "Seductive Homme Red",
      brand: "Guess",
      type: "designer",
      gender: "hombre",
      cost: 0,
      images: ["/products/guess-seductive-homme-red.webp"],
      description: "Eau de toilette de 100 ml. La caja dice 3.4 fl oz / 100 ml, Seductive Homme Red y Men / Homme.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Toilette",
      tags: []
    },
  {
      id: "ck-one-shock-for-him",
      slug: "ck-one-shock-for-him",
      name: "CK One Shock for Him",
      brand: "Calvin Klein",
      type: "designer",
      gender: "hombre",
      cost: 0,
      images: ["/products/ck-one-shock-for-him.webp"],
      description: "Eau de toilette. El texto de la foto dice 100 ml. La caja dice 3.3 fl oz.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Toilette",
      tags: []
    },
  {
      id: "ishq-al-shuyukh-gold",
      slug: "ishq-al-shuyukh-gold",
      name: "Ishq Al Shuyukh Gold",
      brand: "Lattafa",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/ishq-al-shuyukh-gold.webp"],
      description: "Eau de parfum de 100 ml. La caja dice Lattafa Pride e Ishq Al Shuyukh Gold.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "galaxy-concept-gossip",
      slug: "galaxy-concept-gossip",
      name: "Gossip",
      brand: "Galaxy Concept",
      type: "beauty",
      gender: "mujer",
      cost: 0,
      images: ["/products/galaxy-concept-gossip.webp"],
      description: "Perfume en spray. La etiqueta dice Galaxy Concept y Gossip. No se leen los mililitros.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Perfume en spray",
      tags: []
    },
  {
      id: "odyssey-spectra",
      slug: "odyssey-spectra",
      name: "Odyssey Spectra",
      brand: "Armaf",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/odyssey-spectra.webp"],
      description: "Eau de parfum de 50 ml, 1.7 fl oz. Rainbow Edition. La caja no imprime Armaf.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 50,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "gold-crystal-oudh",
      slug: "gold-crystal-oudh",
      name: "Gold Crystal Oudh",
      brand: "Al Haramain",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/gold-crystal-oudh.webp"],
      description: "Extract de parfum de 100 ml, 3.33 fl oz. La caja dice Al Haramain Since 1970 y Haramain Gold Crystal Oudh.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Extrait de Parfum",
      tags: []
    },
  {
      id: "odyssey-homme-white-edition",
      slug: "odyssey-homme-white-edition",
      name: "Odyssey Homme White Edition",
      brand: "Armaf",
      type: "arabic",
      gender: "hombre",
      cost: 0,
      images: ["/products/odyssey-homme-white-edition.webp"],
      description: "Eau de parfum de 100 ml. La tapa dice Armaf. White Edition.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "kenneth-cole-black",
      slug: "kenneth-cole-black",
      name: "Black",
      brand: "Kenneth Cole",
      type: "designer",
      gender: "mujer",
      cost: 0,
      images: ["/products/kenneth-cole-black.webp"],
      description: "Bruma corporal de 236 ml, 8 fl oz. El frasco dice Body Mist / Brume Corporelle y For Her. El título Splash de la foto no es la marca.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 236,
      inStock: true,
      category: "Bruma corporal",
      tags: ["splash"]
    },
  {
      id: "kenneth-cole-white",
      slug: "kenneth-cole-white",
      name: "White",
      brand: "Kenneth Cole",
      type: "designer",
      gender: "mujer",
      cost: 0,
      images: ["/products/kenneth-cole-white.webp"],
      description: "Bruma corporal de 236 ml, 8 fl oz. El frasco dice Fragrance Mist / Brume Parfumée y For Her. El título Splash de la foto no es la marca.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 236,
      inStock: true,
      category: "Bruma corporal",
      tags: ["splash"]
    },
  {
      id: "sofia-vergara-tempting",
      slug: "sofia-vergara-tempting",
      name: "Tempting",
      brand: "Sofia Vergara",
      type: "designer",
      gender: "mujer",
      cost: 0,
      images: ["/products/sofia-vergara-tempting.webp"],
      description: "Bruma corporal de 236 ml. El frasco dice Fragrance Mist y Tempting Sofia Vergara. El título Splash de la foto no es la marca.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 236,
      inStock: true,
      category: "Bruma corporal",
      tags: ["splash"]
    },
  {
      id: "sofia-vergara-lost-in-paradise",
      slug: "sofia-vergara-lost-in-paradise",
      name: "Lost in Paradise",
      brand: "Sofia Vergara",
      type: "designer",
      gender: "mujer",
      cost: 0,
      images: ["/products/sofia-vergara-lost-in-paradise.webp"],
      description: "Bruma corporal de 236 ml. El frasco dice Fragrance Mist y Lost in Paradise Sofia Vergara. El título Splash de la foto no es la marca.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 236,
      inStock: true,
      category: "Bruma corporal",
      tags: ["splash"]
    },
  {
      id: "pitbull-woman",
      slug: "pitbull-woman",
      name: "Woman",
      brand: "Pitbull",
      type: "designer",
      gender: "mujer",
      cost: 0,
      images: ["/products/pitbull-woman.webp"],
      description: "Bruma corporal de 236 ml. El frasco dice Body Mist / Brume Corporelle y Pitbull Woman. El título Splash de la foto no es la marca.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 236,
      inStock: true,
      category: "Bruma corporal",
      tags: ["splash"]
    },
  {
      id: "hawas-eclat",
      slug: "hawas-eclat",
      name: "Hawas Éclat",
      brand: "Hawas",
      type: "arabic",
      gender: "mujer",
      cost: 0,
      images: ["/products/hawas-eclat.webp"],
      description: "Eau de parfum de 100 ml, 3.38 fl oz. El frasco dice Hawas For Her y Éclat.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "odyssey-marshmallow",
      slug: "odyssey-marshmallow",
      name: "Odyssey Marshmallow",
      brand: "Armaf",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/odyssey-marshmallow.webp"],
      description: "Eau de parfum de 100 ml. Gourmand Edition. La caja dice Eau de Parfum.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "spectre",
      slug: "spectre",
      name: "Spectre",
      brand: "Spectre",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/spectre.webp"],
      description: "Eau de parfum de 80 ml. El frasco y la caja solo dicen Spectre.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 80,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "tag-donna-di-terra",
      slug: "tag-donna-di-terra",
      name: "Tag Donna di Terra",
      brand: "Armaf",
      type: "arabic",
      gender: "mujer",
      cost: 0,
      images: ["/products/tag-donna-di-terra.webp"],
      description: "Eau de parfum de 100 ml, 3.4 fl oz. El frasco dice Donna di Terra. La caja también dice 80% vol.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "set-maahir-legacy",
      slug: "set-maahir-legacy",
      name: "Set Maahir Legacy",
      brand: "Maahir",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/set-maahir-legacy.webp"],
      description: "Set Maahir Legacy. Incluye el perfume con tapa de caballo, una loción o light cologne de 200 ml y un air freshener de 150 ml. Los mililitros del perfume no se leen.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Set",
      tags: []
    },
  {
      id: "aura-fresh",
      slug: "aura-fresh",
      name: "Aura Fresh",
      brand: "Armaf",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/aura-fresh.webp"],
      description: "Eau de parfum de 100 ml. El frasco y la caja dicen Armaf Aura Fresh.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "set-club-de-nuit-parfum",
      slug: "set-club-de-nuit-parfum",
      name: "Set Club de Nuit Parfum",
      brand: "Armaf",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/set-club-de-nuit-parfum.webp"],
      description: "Set de tres frascos: Club de Nuit Iconic, Club de Nuit Untold y Club de Nuit Impériale. Los mililitros de cada uno no se leen.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Set",
      tags: []
    },
  {
      id: "private-key-to-my-love",
      slug: "private-key-to-my-love",
      name: "Private Key To My Love",
      brand: "Armaf",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/private-key-to-my-love.webp"],
      description: "Extrait de parfum de 100 ml. La caja dice Armaf Club de Nuit, Private Key To my Love.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Extrait de Parfum",
      tags: []
    },
  {
      id: "esraa",
      slug: "esraa",
      name: "Esraa",
      brand: "Lattafa",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/esraa.webp"],
      description: "Aceite concentrado de 20 ml, 0.68 fl oz. La caja dice Pure Concentrated Oil.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 20,
      inStock: true,
      category: "Aceite concentrado",
      tags: []
    },
  {
      id: "ego-exotic",
      slug: "ego-exotic",
      name: "Ego Exotic",
      brand: "Armaf",
      type: "arabic",
      gender: "mujer",
      cost: 0,
      images: ["/products/ego-exotic.webp"],
      description: "Eau de parfum de 100 ml. La caja dice Exotic Parfum for Women y Pour Femme.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "craze",
      slug: "craze",
      name: "Craze",
      brand: "Armaf",
      type: "arabic",
      gender: "hombre",
      cost: 0,
      images: ["/products/craze.webp"],
      description: "Eau de parfum de 100 ml para hombre. El frasco dice Armaf Luxe. La caja dice Craze for Men.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "tag-donna-colorata",
      slug: "tag-donna-colorata",
      name: "Tag Donna Colorata",
      brand: "Armaf",
      type: "arabic",
      gender: "mujer",
      cost: 0,
      images: ["/products/tag-donna-colorata.webp"],
      description: "Eau de parfum de 100 ml. El frasco dice Donna Colorata.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "eternity-aqua",
      slug: "eternity-aqua",
      name: "Eternity Aqua",
      brand: "Calvin Klein",
      type: "designer",
      gender: "hombre",
      cost: 0,
      images: ["/products/eternity-aqua.webp"],
      description: "Eau de toilette para hombre. La placa dice 100 ml. La caja dice 3.3 fl oz.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Toilette",
      tags: []
    },
  {
      id: "whipped-pleasure",
      slug: "whipped-pleasure",
      name: "Whipped Pleasure",
      brand: "Lattafa",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/whipped-pleasure.webp"],
      description: "Eau de parfum. El texto de la foto dice 75 ml y 2.5 fl oz. La caja imprime «180 ML OZ», que no coincide.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 75,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "set-club-de-nuit-30",
      slug: "set-club-de-nuit-30",
      name: "Set Club de Nuit",
      brand: "Armaf",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/set-club-de-nuit-30.webp"],
      description: "Set de tres perfumes de 30 ml: Milestone en frasco oro rosa, Intense en frasco negro y un tercer frasco rosa cuyo nombre no se lee.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 30,
      inStock: true,
      category: "Set",
      tags: []
    },
  {
      id: "oros-fleur",
      slug: "oros-fleur",
      name: "Oros Fleur",
      brand: "Oros",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/oros-fleur.webp"],
      description: "Eau de parfum de 100 ml. La caja dice Oros Fleur y menciona elementos Swarovski.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "hadi",
      slug: "hadi",
      name: "Hadi",
      brand: "Niche Avenue",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/hadi.webp"],
      description: "Eau de parfum de 100 ml. El frasco y la caja dicen Hadi y Niche Avenue.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "odyssey-black-forest",
      slug: "odyssey-black-forest",
      name: "Odyssey Black Forest",
      brand: "Armaf",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/odyssey-black-forest.webp"],
      description: "Eau de parfum de 100 ml, 3.4 fl oz. La tapa dice Armaf. La caja dice Med by Sterling Parfums.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "tool-box",
      slug: "tool-box",
      name: "Tool Box",
      brand: "Emper",
      type: "arabic",
      gender: "hombre",
      cost: 0,
      images: ["/products/tool-box.webp"],
      description: "La caja dice The Emper Product, Tool Box, for Men y Eau de Toilette. El texto de la foto dice eau de parfum de 100 ml. El frasco también imprime 0.05 ml y 0.02 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Toilette",
      tags: []
    },
  {
      id: "the-lions-club-monarque",
      slug: "the-lions-club-monarque",
      name: "The Lion's Club Monarque",
      brand: "Armaf",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/the-lions-club-monarque.webp"],
      description: "Eau de parfum de 100 ml. El frasco dice Armaf, The Lion's Club y Monarque.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "cuba-jungle-zebra",
      slug: "cuba-jungle-zebra",
      name: "Jungle Zebra",
      brand: "Cuba",
      type: "designer",
      gender: "hombre",
      cost: 0,
      images: ["/products/cuba-jungle-zebra.webp"],
      description: "Eau de toilette de 100 ml para hombre. El envase también dice By Parfums des Champs.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Toilette",
      tags: []
    },
  {
      id: "masculin-leather",
      slug: "masculin-leather",
      name: "Masculin Leather",
      brand: "Riiffs",
      type: "arabic",
      gender: "hombre",
      cost: 0,
      images: ["/products/masculin-leather.webp"],
      description: "Eau de parfum. La caja dice 160 ml. El texto de la foto dice 100 ml. El frasco dice Riiffs.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 160,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "johara",
      slug: "johara",
      name: "Johara",
      brand: "Hamidi",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/johara.webp"],
      description: "Eau de parfum de 12 ml. La caja dice Johara.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 12,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "luxe-bold",
      slug: "luxe-bold",
      name: "Luxe Bold",
      brand: "Maison Alhambra",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/luxe-bold.webp"],
      description: "Eau de parfum de 100 ml. El frasco dice Maison Alhambra Luxe Bold.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "luxe-emerald",
      slug: "luxe-emerald",
      name: "Luxe Emerald",
      brand: "Maison Alhambra",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/luxe-emerald.webp"],
      description: "Eau de parfum de 100 ml, 3.4 fl oz. El empaque dice Emerald.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "cookie-crave",
      slug: "cookie-crave",
      name: "Cookie Crave",
      brand: "Lattafa",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/cookie-crave.webp"],
      description: "Eau de parfum Give Me Gourmand. La caja imprime 10MLC y también 2.53 fl oz. Esos dos números no coinciden.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "set-milestone-collector",
      slug: "set-milestone-collector",
      name: "Set Milestone",
      brand: "Armaf",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/set-milestone-collector.webp"],
      description: "Estuche Milestone, a collector's pride. Incluye un spray corporal oro rosa, el perfume Club de Nuit Milestone, un jabón y un desodorante dorado. Los mililitros de cada pieza no se leen con claridad.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Set",
      tags: []
    },
  {
      id: "thouq",
      slug: "thouq",
      name: "Thouq",
      brand: "Lattafa",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/thouq.webp"],
      description: "Eau de parfum de 80 ml. La caja dice Thouq by Lattafa.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 80,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "turathi",
      slug: "turathi",
      name: "Turathi",
      brand: "Afnan",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/turathi.webp"],
      description: "Eau de parfum de 90 ml. El frasco dice Turathi y Afnan.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 90,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "woody-delight",
      slug: "woody-delight",
      name: "Woody Delight",
      brand: "Maison Luxe",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/woody-delight.webp"],
      description: "Parfum de 110 ml, 3.8 fl oz. La caja y la placa coinciden.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 110,
      inStock: true,
      category: "Parfum",
      tags: []
    },
  {
      id: "la-rosa-gold-edition",
      slug: "la-rosa-gold-edition",
      name: "La Rosa Gold Edition",
      brand: "Armaf",
      type: "arabic",
      gender: "mujer",
      cost: 0,
      images: ["/products/la-rosa-gold-edition.webp"],
      description: "Eau de parfum de 100 ml, 3.4 fl oz. La caja dice Pour Femme y Gold Edition.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "turbo-gts",
      slug: "turbo-gts",
      name: "Turbo #GTS",
      brand: "Zakat",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/turbo-gts.webp"],
      description: "Eau de parfum. El texto de la foto dice 100 ml. La caja imprime «5T230ML / 3.4 FL.OZ». 3.4 fl oz coincide con 100 ml.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "farah-paradise",
      slug: "farah-paradise",
      name: "Farah Paradise",
      brand: "Zakat",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/farah-paradise.webp"],
      description: "Eau de parfum de 100 ml. El frasco dice Farah Paradise.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "exotic-amber",
      slug: "exotic-amber",
      name: "Exotic Amber",
      brand: "Maison Luxe",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/exotic-amber.webp"],
      description: "Parfum de 110 ml, 3.8 fl oz. La caja dice Maison Luxe Exotic Amber.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 110,
      inStock: true,
      category: "Parfum",
      tags: []
    },
  {
      id: "magnate-10",
      slug: "magnate-10",
      name: "10! Pour Homme",
      brand: "Magnate",
      type: "arabic",
      gender: "hombre",
      cost: 0,
      images: ["/products/magnate-10.webp"],
      description: "Eau de toilette de 100 ml. La caja dice Magnate Collection, 10! Pour Homme, 80% vol y 3.3 fl oz. La foto dice «Asimila: Joop! Homme».",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Toilette",
      tags: []
    },
  {
      id: "lana-dazzle",
      slug: "lana-dazzle",
      name: "Lana Dazzle",
      brand: "Camara",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/lana-dazzle.webp"],
      description: "Eau de parfum de 100 ml. El texto de la foto dice Camara Lana Dazzle.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "lana-divine",
      slug: "lana-divine",
      name: "Lana Divine",
      brand: "Camara",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/lana-divine.webp"],
      description: "Eau de parfum de 100 ml. El frasco y el texto de la foto dicen Camara Lana Divine.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "lana-bliss",
      slug: "lana-bliss",
      name: "Lana Bliss",
      brand: "Camara",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/lana-bliss.webp"],
      description: "Eau de parfum de 100 ml. El frasco y el texto de la foto dicen Camara Lana Bliss.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "cuir-edition-noir",
      slug: "cuir-edition-noir",
      name: "Cuir Édition Noir",
      brand: "Orientica",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/cuir-edition-noir.webp"],
      description: "La caja dice Cuir de Orientica, Édition Noir. No se leen los mililitros ni la concentración.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Perfume",
      tags: []
    },
  {
      id: "dynasty",
      slug: "dynasty",
      name: "Dynasty",
      brand: "Lattafa",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/dynasty.webp"],
      description: "Eau de parfum de 100 ml, 3.4 fl oz. La caja dice Lattafa.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "viking-rio",
      slug: "viking-rio",
      name: "Viking Rio",
      brand: "Bharara",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/viking-rio.webp"],
      description: "Parfum. La caja dice Bharara Viking Rio. Viene con un atomizador de viaje naranja. Los mililitros del frasco y del atomizador no se leen.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Parfum",
      tags: []
    },
  {
      id: "club-de-nuit-imperiale",
      slug: "club-de-nuit-imperiale",
      name: "Club de Nuit Impériale",
      brand: "Armaf",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/club-de-nuit-imperiale.webp"],
      description: "Eau de parfum. La caja dice 200 ml y 6.8 fl oz. Es el frasco blanco con tapa dorada, suelto.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 200,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "ejaazi-intensive-silver",
      slug: "ejaazi-intensive-silver",
      name: "Ejaazi Intensive Silver",
      brand: "Lattafa",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/ejaazi-intensive-silver.webp"],
      description: "Eau de parfum. La caja imprime 20 ml y también 100 ml. El frasco se ve de tamaño completo.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "ejaazi",
      slug: "ejaazi",
      name: "Ejaazi",
      brand: "Lattafa",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/ejaazi.webp"],
      description: "Eau de parfum de 100 ml, 3.4 fl oz. La etiqueta dorada dice Ejaazi y الرمال. No es el Intensive Silver.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "areej-hanaan",
      slug: "areej-hanaan",
      name: "Areej Hanaan",
      brand: "Orientica",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/areej-hanaan.webp"],
      description: "El frasco y la caja dicen Areej Hanaan y Orientica. No se leen los mililitros ni la concentración.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Perfume",
      tags: []
    },
  {
      id: "areej-oud-anaqa",
      slug: "areej-oud-anaqa",
      name: "Areej Oud Anaqa",
      brand: "Orientica",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/areej-oud-anaqa.webp"],
      description: "Eau de parfum de 100 ml. El texto de la foto dice Orientica Areej Oud Anaqa.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "areej-shaza",
      slug: "areej-shaza",
      name: "Areej Shaza",
      brand: "Orientica",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/areej-shaza.webp"],
      description: "El frasco y la caja dicen Areej Shaza y Orientica. No se leen los mililitros ni la concentración.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Perfume",
      tags: []
    },
  {
      id: "raed-luxe",
      slug: "raed-luxe",
      name: "Ra'ed Luxe",
      brand: "Lattafa",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/raed-luxe.webp"],
      description: "Eau de parfum de 100 ml, 3.4 fl oz. La caja dice Ra'ed Luxe y Lattafa.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "haya",
      slug: "haya",
      name: "Haya",
      brand: "Lattafa",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/haya.webp"],
      description: "Eau de parfum de 100 ml. La caja dice Lattafa Haya.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "set-sky",
      slug: "set-sky",
      name: "Set Sky",
      brand: "Dubri Niche",
      type: "arabic",
      gender: "hombre",
      cost: 0,
      images: ["/products/set-sky.webp"],
      description: "Set para hombre. Incluye una loción corporal de 100 ml, el perfume en envase azul con tapa naranja, un spray chico cuya etiqueta parece decir OT55 ML y un atomizador de viaje dorado. La caja dice Dubri Niche.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Set",
      tags: []
    },
  {
      id: "dubai-way",
      slug: "dubai-way",
      name: "Dubai Way",
      brand: "Dubai Niche",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/dubai-way.webp"],
      description: "Eau de parfum. La caja dice Dubai Niche, 60% vol y 2.4 fl oz. No imprime mililitros.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "dangerous-me",
      slug: "dangerous-me",
      name: "Dangerous Me",
      brand: "Paco Rabanne",
      type: "designer",
      gender: "unisex",
      cost: 0,
      images: ["/products/dangerous-me.webp"],
      description: "Eau de parfum de 62 ml. El frasco y la caja dicen Paco Rabanne Dangerous Me. La foto dice liquidación.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 62,
      inStock: true,
      category: "Eau de Parfum",
      tags: ["liquidación"]
    },
  {
      id: "lahdath",
      slug: "lahdath",
      name: "Lahdath",
      brand: "Lattafa",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/lahdath.webp"],
      description: "Eau de parfum. El texto de la foto dice 80 ml y la caja dice 2.7 fl oz. La caja también imprime 30 ml. La foto dice liquidación y Lattafa Pride.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 80,
      inStock: true,
      category: "Eau de Parfum",
      tags: ["liquidación"]
    },
  {
      id: "ajayeb-dubai",
      slug: "ajayeb-dubai",
      name: "Ajayeb Dubai",
      brand: "Lattafa",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/ajayeb-dubai.webp"],
      description: "Eau de parfum de 100 ml. Frasco claro con jugo amarillo y tapa dorada. La caja dice 100 ml dos veces. La foto dice liquidación.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: ["liquidación"]
    },
  {
      id: "ajayeb-dubai-negro",
      slug: "ajayeb-dubai-negro",
      name: "Ajayeb Dubai Negro",
      brand: "Lattafa",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/ajayeb-dubai-negro.webp"],
      description: "Eau de parfum de 100 ml, 3.4 fl oz. Frasco negro veteado. La foto dice liquidación y trae el número 1010.631.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: ["liquidación"]
    },
  {
      id: "al-areeq-silver",
      slug: "al-areeq-silver",
      name: "Al Areeq Silver",
      brand: "Lattafa",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/al-areeq-silver.webp"],
      description: "Eau de parfum de 100 ml. La caja dice Lattafa Pride y Al Areeq Silver. La foto dice liquidación.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: ["liquidación"]
    },
  {
      id: "wajood",
      slug: "wajood",
      name: "Wajood",
      brand: "Lattafa",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/wajood.webp"],
      description: "Eau de parfum de 100 ml. El texto de la foto dice Lattafa Wajood. La foto dice liquidación.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: ["liquidación"]
    },
  {
      id: "royal-bleu",
      slug: "royal-bleu",
      name: "Royal Bleu",
      brand: "Orientica",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/royal-bleu.webp"],
      description: "Eau de parfum de 80 ml. Luxury Collection. La foto dice liquidación.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 80,
      inStock: true,
      category: "Eau de Parfum",
      tags: ["liquidación"]
    },
  {
      id: "velvet-gold",
      slug: "velvet-gold",
      name: "Velvet Gold",
      brand: "Orientica",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/velvet-gold.webp"],
      description: "Eau de parfum de 150 ml. Luxury Collection. La foto dice liquidación.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 150,
      inStock: true,
      category: "Eau de Parfum",
      tags: ["liquidación"]
    },
  {
      id: "historic-doria",
      slug: "historic-doria",
      name: "Historic Doria",
      brand: "Afnan",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/historic-doria.webp"],
      description: "Eau de parfum de 100 ml. La caja también dice 3.3 fl oz. La foto dice liquidación.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: ["liquidación"]
    },
  {
      id: "cuba-red",
      slug: "cuba-red",
      name: "Red",
      brand: "Cuba",
      type: "designer",
      gender: "hombre",
      cost: 0,
      images: ["/products/cuba-red.webp"],
      description: "Eau de toilette de 100 ml, 3.3 fl oz, para hombre. La foto dice liquidación.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Toilette",
      tags: ["liquidación"]
    },
  {
      id: "afaq",
      slug: "afaq",
      name: "Afaq",
      brand: "Lattafa",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/afaq.webp"],
      description: "Eau de parfum de 100 ml, 3.4 fl oz. La caja dice Lattafa Pride. La foto dice liquidación.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: ["liquidación"]
    },
  {
      id: "ana-al-awwal",
      slug: "ana-al-awwal",
      name: "Ana Al Awwal",
      brand: "Nusuk",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/ana-al-awwal.webp"],
      description: "Eau de parfum de 100 ml, 3.4 fl oz. El frasco dice Ana Al Awwal y Nusuk. El texto de la foto trae «anq» en lugar de Ana. La foto dice liquidación.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: ["liquidación"]
    },
  {
      id: "mon-lumiere",
      slug: "mon-lumiere",
      name: "Mon Lumière",
      brand: "Riiffs",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/mon-lumiere.webp"],
      description: "Eau de parfum de 100 ml. El frasco dice Mon Lumière y Riiffs. La foto dice liquidación.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: ["liquidación"]
    },
  {
      id: "al-jamal",
      slug: "al-jamal",
      name: "Al Jamal",
      brand: "Al Jamal",
      type: "arabic",
      gender: "mujer",
      cost: 0,
      images: ["/products/al-jamal.webp"],
      description: "La caja dice Jamal, Al Jamal y Pour Femme. No se leen los mililitros ni la concentración. No aparece otra casa.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Perfume",
      tags: []
    },
  {
      id: "perry-ellis-18",
      slug: "perry-ellis-18",
      name: "18",
      brand: "Perry Ellis",
      type: "designer",
      gender: "unisex",
      cost: 0,
      images: ["/products/perry-ellis-18.webp"],
      description: "Eau de toilette de 100 ml. El frasco dice Perry Ellis 18.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Toilette",
      tags: []
    },
  {
      id: "gold-rush-man",
      slug: "gold-rush-man",
      name: "Gold Rush Man",
      brand: "Paris Hilton",
      type: "designer",
      gender: "hombre",
      cost: 0,
      images: ["/products/gold-rush-man.webp"],
      description: "Eau de toilette. La caja dice Man y 3.4 fl oz. No imprime mililitros.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Toilette",
      tags: []
    },
  {
      id: "dior-edt-rayado",
      slug: "dior-edt-rayado",
      name: "Eau de Toilette",
      brand: "Dior",
      type: "designer",
      gender: "unisex",
      cost: 0,
      images: ["/products/dior-edt-rayado.webp"],
      description: "Eau de toilette de 100 ml, 3.4 fl oz. Frasco de vidrio rayado. La banda dice Parfums Christian Dior y Made in France. El nombre de la fragancia no se lee.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Toilette",
      tags: []
    },
  {
      id: "skye",
      slug: "skye",
      name: "Skye",
      brand: "Skye",
      type: "beauty",
      gender: "mujer",
      cost: 0,
      images: ["/products/skye.webp"],
      description: "Eau de parfum de 100 ml, 3.4 fl oz. El frasco y la caja dicen Skye Pour Femme. No aparece otra casa.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: 100,
      inStock: true,
      category: "Eau de Parfum",
      tags: []
    },
  {
      id: "acqua-di-parisis-al-kabir",
      slug: "acqua-di-parisis-al-kabir",
      name: "Acqua di Parisis Al Kabir",
      brand: "L'Atelier Oriental",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/acqua-di-parisis-al-kabir.webp"],
      description: "El frasco dice Acqua di Parisis Al Kabir y L'Atelier Oriental. No se leen con claridad los mililitros ni la concentración.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Perfume",
      tags: []
    },
  {
      id: "acqua-di-parisis-al-amana",
      slug: "acqua-di-parisis-al-amana",
      name: "Acqua di Parisis Al Amana",
      brand: "L'Atelier Oriental",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/acqua-di-parisis-al-amana.webp"],
      description: "El frasco dice Acqua di Parisis Al Amana y L'Atelier Oriental. No se leen con claridad los mililitros ni la concentración.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Perfume",
      tags: []
    },
  {
      id: "acqua-di-parisis-al-baraka",
      slug: "acqua-di-parisis-al-baraka",
      name: "Acqua di Parisis Al Baraka",
      brand: "L'Atelier Oriental",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/acqua-di-parisis-al-baraka.webp"],
      description: "El frasco dice Acqua di Parisis Al Baraka y L'Atelier Oriental. No se leen con claridad los mililitros ni la concentración.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Perfume",
      tags: []
    },
  {
      id: "insignia-gules",
      slug: "insignia-gules",
      name: "Insignia Gules",
      brand: "Hamidi",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/insignia-gules.webp"],
      description: "Frasco rojo con atomizador de viaje rojo. La caja dice Insignia Gules. No se leen los mililitros ni la concentración. El atomizador tampoco trae mililitros.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Perfume",
      tags: []
    },
  {
      id: "insignia-purpure",
      slug: "insignia-purpure",
      name: "Insignia Purpure",
      brand: "Hamidi",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/insignia-purpure.webp"],
      description: "Frasco morado con atomizador de viaje. La caja dice Insignia Purpure. No se leen los mililitros ni la concentración.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Perfume",
      tags: []
    },
  {
      id: "insignia-sable",
      slug: "insignia-sable",
      name: "Insignia Sable",
      brand: "Hamidi",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/insignia-sable.webp"],
      description: "Frasco oscuro con atomizador negro. La caja dice Insignia Sable y Hamidi. No se leen los mililitros ni la concentración.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Perfume",
      tags: []
    },
  {
      id: "insignia-ermine",
      slug: "insignia-ermine",
      name: "Insignia Ermine",
      brand: "Hamidi",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/insignia-ermine.webp"],
      description: "Frasco claro con atomizador dorado. La caja dice Insignia Ermine y Hamidi. No se leen los mililitros ni la concentración.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Perfume",
      tags: []
    },
  {
      id: "insignia-vert",
      slug: "insignia-vert",
      name: "Insignia Vert",
      brand: "Hamidi",
      type: "arabic",
      gender: "unisex",
      cost: 0,
      images: ["/products/insignia-vert.webp"],
      description: "Frasco verde con atomizador verde. La caja dice Insignia Vert y Hamidi. No se leen los mililitros ni la concentración.",
      notes: {
        top: [],
        heart: [],
        base: []
      },
      sizeMl: null,
      inStock: true,
      category: "Perfume",
      tags: []
    }
];
