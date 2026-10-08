// Genera las fotos de producto en public/productos/<slug>.webp.
// Uso: npm run fotos:productos  (o con slugs: npm run fotos:productos -- matera-cuero)
//
// Para cada producto: baja la foto original (si no está ya en
// public/productos/fuente/, que queda fuera de git), le saca el fondo, la recorta
// al contorno del producto y la centra en 1000x1000 con fondo transparente, a la
// misma escala y con el mismo margen que las demás. FUENTES es también el
// registro de dónde sale cada foto.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { removeBackground } from "@imgly/background-removal-node";

// Se usa el sharp que trae @imgly/background-removal-node: si se cargan dos
// versiones de sharp (libvips) en el mismo proceso, Node se cae.
const requerir = createRequire(import.meta.url);
const sharp = createRequire(requerir.resolve("@imgly/background-removal-node"))(
  "sharp",
);

const RAIZ = path.resolve(import.meta.dirname, "..");
const SALIDA = path.join(RAIZ, "public", "productos");
const FUENTE = path.join(SALIDA, "fuente");

const LADO = 1000;
// Caja donde entra el producto: el resto es margen transparente
const CAJA = 820;

const CARREFOUR = "https://carrefourar.vteximg.com.br/arquivos/ids";
const JUMBO = "https://jumboargentina.vteximg.com.br/arquivos/ids";
const YVY = "https://cdn.shopify.com/s/files/1/0418/8759/6707/files";

// recorte: [izquierda, arriba, ancho, alto] en fracciones de la foto original,
// para sacar lo que no es el producto antes de quitar el fondo.
export const FUENTES = {
  "mate-imperial-calabaza-alpaca": {
    url: `${YVY}/calebasse_mate_imperial_ocre_alpaca_ciselee_yvy.jpg`,
    origen: "yvy-mate.fr: calebasse-mate-imperiale-alpaca",
  },
  "mate-camionero-calabaza": {
    url: `${YVY}/calebasse_mate_camionero_alpaca_ciselee_yvy.jpg`,
    origen: "yvy-mate.fr: calebasse-a-mate-artisanale-camionero-gravee-450ml",
  },
  "mate-algarrobo": {
    url: `${YVY}/calebasse_mate_bois_caroubier_artisanale.jpg`,
    origen: "yvy-mate.fr: calebasse-mate-camionero-bois-de-caroubier",
  },
  "stanley-mate-system": {
    url: `${CARREFOUR}/262660-1200-1200/6939236373548_01.jpg`,
    origen: "Carrefour Argentina: Mate Stanley verde 236 ml",
  },
  "bombilla-alpaca-pico-de-loro": {
    url: `${YVY}/bombilla_mate_signature_alpaca_et_bronze_pico_loro.jpg`,
    origen: "yvy-mate.fr: bombilla-mate-signature-alpaca-et-bronze (pico de loro)",
  },
  "bombilla-acero-resorte": {
    url: `${CARREFOUR}/163977-1200-1200/7797196021171_01.jpg`,
    origen: "Carrefour Argentina: Bombilla resorte de acero Cross",
  },
  "bombilla-cana": {
    url: "https://amazonasfoods.com/cdn/shop/files/9BOM10.jpg",
    origen: "Amazonas Foods: Natural Bamboo Yerba Mate Bombilla",
  },
  "bombilla-plana-alpaca-bronce": {
    url: `${YVY}/bombillamateenalpacaavecbronze.jpg`,
    origen: "yvy-mate.fr: bombilla-mate-anillo-alpaca-bronze",
  },
  "stanley-clasico": {
    url: "https://http2.mlstatic.com/D_NQ_NP_789628-MLA99961844549_112025-F.jpg",
    origen: "Mercado Libre: Stanley termo clásico 1,4 L verde (MLA15542577)",
    // El modelo casi borra la manija: sobre fondo blanco, lo que no es blanco va
    fondoBlanco: true,
  },
  "lumilagro-luminox": {
    url: `${CARREFOUR}/163949-1200-1200/7793015525929_01.jpg`,
    origen: "Carrefour Argentina: Termo de acero Lumilagro Luminox 1 L",
  },
  "waterdog-tropero": {
    url: "https://http2.mlstatic.com/D_NQ_NP_654473-MLA99448427198_112025-F.jpg",
    origen: "Mercado Libre: termo Waterdog 1 L gris (MLA24312783)",
  },
  "termolar-r-evolution": {
    url: "https://http2.mlstatic.com/D_NQ_NP_683150-MLA99962580597_112025-F.jpg",
    origen: "Mercado Libre: termo Termolar R-Evolution negro 1 L (MLA26901728)",
    // La foto trae la caja a la derecha
    recorte: [0, 0, 0.56, 1],
  },
  "playadito-suave": {
    url: `${CARREFOUR}/943363-1200-1200/7793704000911_02.jpg`,
    origen: "Carrefour Argentina: Yerba mate Playadito con palo 500 g",
  },
  "taragui-con-palo": {
    url: "https://jumbocl.vtexassets.com/arquivos/ids/352154-1200-1200/Yerba-mate-con-palo-1-kg.jpg",
    origen: "Jumbo Chile: Yerba mate Taragüí con palo 1 kg",
  },
  "cbse-hierbas-serranas": {
    url: "https://jumbocl.vtexassets.com/arquivos/ids/368297-1200-1200/Yerba-mate-hierbas-serranas-500-g-1-179236147.jpg",
    origen: "Jumbo Chile: Yerba mate CBSé hierbas serranas 500 g",
  },
  "rosamonte-especial": {
    url: `${CARREFOUR}/943303-1200-1200/7790411000029_02.jpg`,
    origen: "Carrefour Argentina: Yerba mate especial Rosamonte 500 g",
  },
  "canarias-tradicional": {
    url: `${CARREFOUR}/943344-1200-1200/7730241003654_02.jpg`,
    origen: "Carrefour Argentina: Yerba mate Canarias sin palo 1 kg",
  },
  "matera-cuero": {
    url: "https://acdn-us.mitiendanube.com/stores/006/253/435/products/porta-mate-para-palanca-de-auto-de-cuero-1290246a80fca3c1d817480049821283-1024-1024.webp",
    origen: "cebando.ar: porta mate de cuero (portamate para auto, como referencia de matera)",
  },
  "set-yerbera-azucarera": {
    url: `${JUMBO}/710307-1200-1200/Set-Latas-Azucar-Y-Yerba-Matero-Marwal-1-891567.jpg`,
    origen: "Jumbo Argentina: Set latas azúcar y yerba Matero Marwal",
  },
  "cepillo-limpia-bombillas": {
    url: "https://cdn.shopify.com/s/files/1/0709/0765/8470/files/CIRCLEOFDRINK-BOMBILLA-BRUSH-YERBA-MATE-BOMBILLA.jpg",
    origen: "Circle of Drink: Yerba Mate Bombilla Cleaning Brush",
  },
};

async function bajar(slug, { url }) {
  const destino = path.join(FUENTE, `${slug}.png`);
  if (existsSync(destino)) return destino;
  const respuesta = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!respuesta.ok) throw new Error(`${slug}: ${respuesta.status} al bajar ${url}`);
  const original = Buffer.from(await respuesta.arrayBuffer());
  await sharp(original).png().toFile(destino);
  return destino;
}

// Afirma la máscara y borra los restos sueltos que deja el recorte del fondo (un pedazo de cartel,
// una sombra): se queda con las piezas de al menos 10% del tamaño de la mayor.
async function limpiar(png, original) {
  const { data, info } = await sharp(png)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  // Con fondo blanco, todo píxel claramente no blanco es producto
  if (original) {
    const rgb = await sharp(original)
      .resize(width, height, { fit: "fill" })
      .removeAlpha()
      .raw()
      .toBuffer();
    for (let i = 0; i < width * height; i++) {
      const distancia =
        765 - rgb[i * 3] - rgb[i * 3 + 1] - rgb[i * 3 + 2];
      if (distancia > 120) data[i * 4 + 3] = 255;
    }
  }
  // El modelo deja semitransparentes las zonas claras o lisas del producto (el
  // blanco de un paquete, una manija): se vuelven opacas y el borde queda suave.
  for (let i = 3; i < data.length; i += 4) {
    data[i] = data[i] < 24 ? 0 : Math.min(255, (data[i] - 24) * 2.5);
  }
  const etiquetas = new Int32Array(width * height);
  const areas = [0];
  const pila = [];
  for (let inicio = 0; inicio < width * height; inicio++) {
    if (etiquetas[inicio] || data[inicio * 4 + 3] <= 16) continue;
    const etiqueta = areas.length;
    let area = 0;
    etiquetas[inicio] = etiqueta;
    pila.push(inicio);
    while (pila.length) {
      const i = pila.pop();
      area++;
      const x = i % width;
      const vecinos = [
        x > 0 ? i - 1 : -1,
        x < width - 1 ? i + 1 : -1,
        i - width,
        i + width,
      ];
      for (const v of vecinos) {
        if (v < 0 || v >= width * height) continue;
        if (etiquetas[v] || data[v * 4 + 3] <= 16) continue;
        etiquetas[v] = etiqueta;
        pila.push(v);
      }
    }
    areas.push(area);
  }
  const minimo = Math.max(...areas) * 0.1;
  for (let i = 0; i < width * height; i++) {
    if (etiquetas[i] && areas[etiquetas[i]] < minimo) data[i * 4 + 3] = 0;
  }
  return sharp(data, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

// Caja mínima que contiene los píxeles visibles (alfa > 16)
async function contorno(png) {
  const { data, info } = await sharp(png)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let x0 = info.width;
  let y0 = info.height;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * 4 + 3] > 16) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) throw new Error("No quedó nada después de sacar el fondo");
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

async function procesar(slug, fuente) {
  const ruta = await bajar(slug, fuente);
  let imagen = sharp(ruta);
  if (fuente.recorte) {
    const { width, height } = await imagen.metadata();
    const [x, y, w, h] = fuente.recorte;
    imagen = imagen.extract({
      left: Math.round(x * width),
      top: Math.round(y * height),
      width: Math.round(w * width),
      height: Math.round(h * height),
    });
  }
  const entrada = await imagen.png().toBuffer();

  const sinFondo = await removeBackground(new Blob([entrada], { type: "image/png" }), {
    model: "medium",
    output: { format: "image/png" },
  });

  // Recorta al contorno del producto y lo centra en la caja, con margen igual
  const png = await limpiar(
    Buffer.from(await sinFondo.arrayBuffer()),
    fuente.fondoBlanco ? entrada : null,
  );
  const recortada = await sharp(png)
    .extract(await contorno(png))
    .resize(CAJA, CAJA, { fit: "inside" })
    .toBuffer({ resolveWithObject: true });
  const { width, height } = recortada.info;

  await sharp({
    create: {
      width: LADO,
      height: LADO,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: recortada.data,
        left: Math.round((LADO - width) / 2),
        top: Math.round((LADO - height) / 2),
      },
    ])
    .webp({ quality: 82, alphaQuality: 90 })
    .toFile(path.join(SALIDA, `${slug}.webp`));
}

mkdirSync(FUENTE, { recursive: true });
const pedidos = process.argv.slice(2);
const slugs = pedidos.length ? pedidos : Object.keys(FUENTES);
for (const slug of slugs) {
  if (!FUENTES[slug]) throw new Error(`No hay fuente para ${slug}`);
  process.stdout.write(`${slug}… `);
  await procesar(slug, FUENTES[slug]);
  console.log("listo");
}
writeFileSync(
  path.join(SALIDA, "CREDITOS.md"),
  "# Fotos de producto\n\nUso académico. Cada foto sale de la tienda o la marca indicada; " +
    "se procesan con `npm run fotos:productos` (scripts/fotos-productos.mjs).\n\n" +
    Object.entries(FUENTES)
      .map(([slug, { origen }]) => `- \`${slug}\`: ${origen}`)
      .join("\n") +
    "\n",
);
