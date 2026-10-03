import { connection } from "next/server";

const DIA = 24 * 60 * 60 * 1000;

// Fechas relativas al arranque del servidor, para que siempre haya drops próximos.
function enDias(dias, hora = 12) {
  const fecha = new Date(Date.now() + dias * DIA);
  fecha.setHours(hora, 0, 0, 0);
  return fecha.toISOString();
}

function talles(stocks) {
  return stocks.map((stock, i) => ({ talle: 38 + i, stock }));
}

const productos = [
  {
    id: 1,
    slug: "nike-air-force-1-07",
    marca: "Nike",
    nombre: "Air Force 1 '07",
    descripcion:
      "El clásico de básquet que se volvió ícono de la calle. Capellada de cuero, suela de goma y amortiguación Air encapsulada.",
    precio: 189999,
    colorPrincipal: "#e8e6e1",
    talles: talles([4, 6, 8, 10, 7, 3, 2]),
    fechaLanzamiento: enDias(-120),
  },
  {
    id: 2,
    slug: "adidas-samba-og",
    marca: "Adidas",
    nombre: "Samba OG",
    descripcion:
      "Nacida para el fútbol indoor, adoptada por la cultura urbana. Cuero suave, puntera de gamuza y suela de goma natural.",
    precio: 164999,
    colorPrincipal: "#1d1d1f",
    talles: talles([2, 0, 5, 4, 0, 3, 1]),
    fechaLanzamiento: enDias(-60),
  },
  {
    id: 3,
    slug: "new-balance-550",
    marca: "New Balance",
    nombre: "550",
    descripcion:
      "Revival de un modelo de básquet de los 80. Perfil bajo, cuero perforado y detalles en verde.",
    precio: 209999,
    colorPrincipal: "#2f6b4f",
    talles: talles([5, 5, 8, 8, 6, 4, 2]),
    fechaLanzamiento: enDias(2, 11),
  },
  {
    id: 4,
    slug: "nike-dunk-low-panda",
    marca: "Nike",
    nombre: "Dunk Low Panda",
    descripcion:
      "Bloques de color blanco y negro sobre cuero liso. El drop más buscado de la temporada.",
    precio: 199999,
    colorPrincipal: "#f2f2f2",
    talles: talles([0, 0, 0, 0, 0, 0, 0]),
    fechaLanzamiento: enDias(-14),
  },
  {
    id: 5,
    slug: "asics-gel-kayano-14",
    marca: "Asics",
    nombre: "Gel-Kayano 14",
    descripcion:
      "Running de los 2000 reinterpretado. Malla técnica, overlays metalizados y amortiguación GEL.",
    precio: 229999,
    colorPrincipal: "#b9bcc2",
    talles: talles([1, 3, 4, 2, 2, 1, 0]),
    fechaLanzamiento: enDias(-30),
  },
  {
    id: 6,
    slug: "puma-suede-classic",
    marca: "Puma",
    nombre: "Suede Classic",
    descripcion:
      "Gamuza, suela de goma y más de cinco décadas en la calle. Simple y vigente.",
    precio: 129999,
    colorPrincipal: "#8a1c2b",
    talles: talles([3, 4, 6, 6, 5, 2, 1]),
    fechaLanzamiento: enDias(-200),
  },
  {
    id: 7,
    slug: "boldy-volt-runner",
    marca: "Boldy",
    nombre: "Volt Runner",
    descripcion:
      "Primer runner de la línea propia Boldy. Malla respirable, plataforma de espuma liviana y talón de TPU translúcido.",
    precio: 149999,
    colorPrincipal: "#c6ff00",
    talles: talles([10, 10, 12, 12, 10, 8, 6]),
    fechaLanzamiento: enDias(5, 18),
  },
  {
    id: 8,
    slug: "boldy-bloque-low",
    marca: "Boldy",
    nombre: "Bloque Low",
    descripcion:
      "Low top de la línea Boldy con paneles geométricos superpuestos y suela dentada. Diseño original de la casa.",
    precio: 139999,
    colorPrincipal: "#5b3cff",
    talles: talles([2, 4, 5, 3, 0, 2, 1]),
    fechaLanzamiento: enDias(-7),
  },
];

export async function getProductos() {
  // Simula una consulta a la base: se resuelve en cada request, no en el build.
  await connection();
  return structuredClone(productos);
}

export async function getProductoPorSlug(slug) {
  await connection();
  const producto = productos.find((p) => p.slug === slug);
  return producto ? structuredClone(producto) : null;
}

export function getEstado(producto, ahora = Date.now()) {
  if (new Date(producto.fechaLanzamiento).getTime() > ahora) return "proximo";
  const stockTotal = producto.talles.reduce((total, t) => total + t.stock, 0);
  return stockTotal > 0 ? "disponible" : "agotado";
}
