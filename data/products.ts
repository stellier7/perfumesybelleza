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
    }
];
