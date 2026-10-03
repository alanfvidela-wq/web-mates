import * as THREE from "three";
import { aleatorio } from "./geometria";

// Yerba del mate GLB, generada en código. Todas las medidas están en unidades
// del modelo original (radio interno de la virola ≈ 0.31).

const ANILLOS = 56;
const SEGMENTOS = 160; // ANILLOS × SEGMENTOS ≈ 9000 vértices

// Montañita: pico del lado opuesto a la bombilla y hueco donde entra ella.
const ALTURA_PICO = 0.1;
const POSICION_PICO = -0.35; // sobre el eje hacia la bombilla, en radios
const ANCHO_PICO = 0.5;
const INCLINACION = 0.03;
const PROFUNDIDAD_HUECO = 0.035;
const ANCHO_HUECO = 0.2;

const CANTIDAD_HOJAS = 650;
const CANTIDAD_PALITOS = 90;

const COLORES = ["#7b8240", "#858a46", "#6d7536", "#8f9152", "#747c3b"];
const COLOR_HUMEDO = new THREE.Color("#3d4519");
const COLORES_HOJAS = ["#66702f", "#7c8540", "#57602a", "#8d9049", "#4c5524"];
const COLOR_PALITO = new THREE.Color("#a99a62");

function campana(d2, ancho) {
  return Math.exp(-d2 / (2 * ancho * ancho));
}

// Ruido de valor 2D suave: grumos de la yerba.
function crearRuido(semilla, tamano = 32) {
  const azar = aleatorio(semilla);
  const valores = Float32Array.from({ length: tamano * tamano }, () => azar());
  const v = (i, j) =>
    valores[
      (((j % tamano) + tamano) % tamano) * tamano +
        (((i % tamano) + tamano) % tamano)
    ];
  return (x, y) => {
    const i = Math.floor(x);
    const j = Math.floor(y);
    const fx = x - i;
    const fy = y - j;
    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);
    const a = v(i, j) + (v(i + 1, j) - v(i, j)) * sx;
    const b = v(i, j + 1) + (v(i + 1, j + 1) - v(i, j + 1)) * sx;
    return a + (b - a) * sy - 0.5;
  };
}

// Granulado fino: se usa como mapa de color y de relieve.
function crearTexturaGrano() {
  const tamano = 256;
  const datos = new Uint8Array(tamano * tamano * 4);
  const azar = aleatorio(11);
  for (let i = 0; i < tamano * tamano; i++) {
    let valor = 0.62 + azar() * 0.38;
    if (azar() < 0.04) valor = 1; // motas claras de palo
    const byte = Math.round(valor * 255);
    datos.set([byte, byte, byte, 255], i * 4);
  }
  const textura = new THREE.DataTexture(datos, tamano, tamano);
  textura.wrapS = textura.wrapT = THREE.RepeatWrapping;
  textura.repeat.set(1.5, 1.5);
  textura.colorSpace = THREE.SRGBColorSpace;
  textura.magFilter = THREE.LinearFilter;
  textura.minFilter = THREE.LinearMipmapLinearFilter;
  textura.generateMipmaps = true;
  textura.needsUpdate = true;
  return textura;
}

// Ajusta el shader estándar de three:
// - humedad: junto a la bombilla la yerba está mojada (más brillo).
// - lavado: uniform de 0 a 1 que aclara y apaga el verde (yerba lavada).
function prepararMaterial(material, lavado, { humedad = false } = {}) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uLavado = lavado;
    if (humedad) {
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          "#include <common>\nattribute float humedad;\nvarying float vHumedad;",
        )
        .replace(
          "#include <begin_vertex>",
          "#include <begin_vertex>\nvHumedad = humedad;",
        );
    }
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>\nuniform float uLavado;${humedad ? "\nvarying float vHumedad;" : ""}`,
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        float luz = dot(diffuseColor.rgb, vec3(0.3, 0.59, 0.11));
        vec3 lavada = luz * vec3(1.15, 1.25, 0.8) + vec3(0.2, 0.19, 0.12);
        diffuseColor.rgb = mix(diffuseColor.rgb, lavada, uLavado * 0.85);`,
      );
    if (humedad) {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <roughnessmap_fragment>",
        "#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 0.55, vHumedad * (1.0 - uLavado));",
      );
    }
  };
  // Programas distintos para la superficie (con humedad) y las partículas.
  material.customProgramCacheKey = () =>
    humedad ? "yerba-superficie" : "yerba-particulas";
  return material;
}

/**
 * Crea la yerba con forma de montañita dentro de la virola.
 * - centro: Vector2 (x, z) del eje del mate.
 * - radio: radio interno de la virola.
 * - alturaBase: altura de la yerba plana (montanita = 0).
 * - alturaBorde: altura del borde de la virola.
 * - entrada: Vector2 (x, z) donde la bombilla entra en la yerba.
 * Devuelve { grupo, deformar(montanita), lavar(0 a 1), dispose() }.
 */
export function crearYerba({
  centro,
  radio,
  alturaBase,
  alturaBorde,
  entrada,
}) {
  // Coordenadas normalizadas: el disco de la yerba tiene radio 1.
  const hueco = entrada.clone().sub(centro).divideScalar(radio);
  const direccion = hueco.clone().normalize();
  const pico = direccion.clone().multiplyScalar(POSICION_PICO);
  const grumos = crearRuido(5);

  function altura(x, z, montanita) {
    const rho = Math.hypot(x, z);
    const t = x * direccion.x + z * direccion.y;
    const forma =
      ALTURA_PICO * campana((x - pico.x) ** 2 + (z - pico.y) ** 2, ANCHO_PICO) -
      INCLINACION * t -
      PROFUNDIDAD_HUECO *
        campana((x - hueco.x) ** 2 + (z - hueco.y) ** 2, ANCHO_HUECO);
    const ruido =
      grumos(x * 7 + 3, z * 7 + 3) * 0.008 + grumos(x * 19, z * 19) * 0.003;
    const y = alturaBase + montanita * forma + ruido;
    // Junto a la pared la yerba baja hasta el labio de la virola: el pico
    // asoma por encima del borde, pero el canto queda escondido.
    const tope = alturaBorde - 0.004;
    const pared = THREE.MathUtils.smoothstep(rho, 0.72, 1);
    return y + (Math.min(y, tope) - y) * pared;
  }

  function humedad(x, z) {
    return campana((x - hueco.x) ** 2 + (z - hueco.y) ** 2, 0.3);
  }

  // --- Superficie: disco polar subdividido + un faldón contra la pared ---
  // Anillos 1..ANILLOS: disco. ANILLOS + 1: copia del borde (normales propias).
  // ANILLOS + 2: pie del faldón, metido en la pared de la virola.
  const azar = aleatorio(17);
  const cantidad = 1 + (ANILLOS + 2) * SEGMENTOS;
  const faldon = new Uint8Array(cantidad);
  const polares = new Float32Array(cantidad * 2);
  const grano = new Float32Array(cantidad);
  const colores = new Float32Array(cantidad * 3);
  const humedades = new Float32Array(cantidad);
  const uvs = new Float32Array(cantidad * 2);
  const color = new THREE.Color();

  for (let i = 0; i < cantidad; i++) {
    let x = 0;
    let z = 0;
    if (i > 0) {
      const anillo = Math.floor((i - 1) / SEGMENTOS) + 1;
      const angulo = ((i - 1) % SEGMENTOS) / SEGMENTOS;
      const s = anillo > ANILLOS + 1 ? 1.05 : Math.min(anillo / ANILLOS, 1);
      faldon[i] = anillo - ANILLOS > 0 ? anillo - ANILLOS : 0;
      x = Math.cos(angulo * Math.PI * 2) * s;
      z = Math.sin(angulo * Math.PI * 2) * s;
    }
    polares[i * 2] = x;
    polares[i * 2 + 1] = z;
    uvs[i * 2] = x * 0.5 + 0.5;
    uvs[i * 2 + 1] = z * 0.5 + 0.5;
    grano[i] = (azar() - 0.5) * 0.003;
    const h = humedad(x, z);
    humedades[i] = h;
    color.set(COLORES[Math.floor(azar() * COLORES.length)]);
    color.lerp(COLOR_HUMEDO, h * 0.85);
    color.toArray(colores, i * 3);
  }

  const indice = (anillo, segmento) =>
    1 +
    (anillo - 1) * SEGMENTOS +
    (((segmento % SEGMENTOS) + SEGMENTOS) % SEGMENTOS);
  const indices = [];
  for (let j = 0; j < SEGMENTOS; j++) {
    indices.push(0, indice(1, j + 1), indice(1, j));
    for (let k = 2; k <= ANILLOS + 2; k++) {
      if (k === ANILLOS + 1) continue; // el faldón no comparte vértices con el disco
      const a = indice(k - 1, j);
      const b = indice(k - 1, j + 1);
      const c = indice(k, j + 1);
      const d = indice(k, j);
      indices.push(a, b, d, b, c, d);
    }
  }

  const posiciones = new THREE.BufferAttribute(
    new Float32Array(cantidad * 3),
    3,
  );
  const geometria = new THREE.BufferGeometry();
  geometria.setAttribute("position", posiciones);
  geometria.setAttribute("color", new THREE.BufferAttribute(colores, 3));
  geometria.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometria.setAttribute("humedad", new THREE.BufferAttribute(humedades, 1));
  geometria.setIndex(indices);

  const texturaGrano = crearTexturaGrano();
  const lavado = { value: 0 };
  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    map: texturaGrano,
    bumpMap: texturaGrano,
    bumpScale: 2,
    roughness: 0.95,
    side: THREE.DoubleSide,
  });
  prepararMaterial(material, lavado, { humedad: true });
  const superficie = new THREE.Mesh(geometria, material);

  // --- Hojitas y palitos sueltos sobre la superficie ---
  function sembrar(cantidadParticulas, semilla) {
    const azarParticulas = aleatorio(semilla);
    return Array.from({ length: cantidadParticulas }, () => {
      const rho = Math.sqrt(azarParticulas()) * 0.93;
      const angulo = azarParticulas() * Math.PI * 2;
      return {
        x: Math.cos(angulo) * rho,
        z: Math.sin(angulo) * rho,
        giro: azarParticulas() * Math.PI * 2,
        inclinacion: (azarParticulas() - 0.5) * 0.6,
        tamano: azarParticulas(),
        tono: azarParticulas(),
      };
    });
  }

  const hojas = sembrar(CANTIDAD_HOJAS, 23);
  const palitos = sembrar(CANTIDAD_PALITOS, 29);
  const materialParticulas = new THREE.MeshStandardMaterial({
    roughness: 0.85,
  });
  prepararMaterial(materialParticulas, lavado);
  const mallaHojas = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 0.12, 0.65),
    materialParticulas,
    CANTIDAD_HOJAS,
  );
  const mallaPalitos = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(0.5, 0.5, 1, 5),
    materialParticulas,
    CANTIDAD_PALITOS,
  );

  hojas.forEach((hoja, i) => {
    color.set(COLORES_HOJAS[Math.floor(hoja.tono * COLORES_HOJAS.length)]);
    color.lerp(COLOR_HUMEDO, humedad(hoja.x, hoja.z) * 0.8);
    mallaHojas.setColorAt(i, color);
  });
  palitos.forEach((palito, i) => {
    color.copy(COLOR_PALITO).multiplyScalar(0.85 + palito.tono * 0.25);
    color.lerp(COLOR_HUMEDO, humedad(palito.x, palito.z) * 0.7);
    mallaPalitos.setColorAt(i, color);
  });

  const grupo = new THREE.Group();
  grupo.add(superficie, mallaHojas, mallaPalitos);

  const arriba = new THREE.Vector3(0, 1, 0);
  const normal = new THREE.Vector3();
  const rotacion = new THREE.Quaternion();
  const giro = new THREE.Quaternion();
  const base = new THREE.Quaternion();
  const eje = new THREE.Euler();
  const matriz = new THREE.Matrix4();
  const posicion = new THREE.Vector3();
  const escala = new THREE.Vector3();
  const PASO = 0.01;

  function ubicar(malla, particulas, montanita, esPalito) {
    particulas.forEach((p, i) => {
      const y = altura(p.x, p.z, montanita);
      // Normal de la superficie por diferencias finitas.
      normal
        .set(
          (altura(p.x - PASO, p.z, montanita) -
            altura(p.x + PASO, p.z, montanita)) /
            (2 * PASO * radio),
          1,
          (altura(p.x, p.z - PASO, montanita) -
            altura(p.x, p.z + PASO, montanita)) /
            (2 * PASO * radio),
        )
        .normalize();
      rotacion.setFromUnitVectors(arriba, normal);
      giro.setFromAxisAngle(arriba, p.giro);
      // Los palitos quedan acostados (eje del cilindro sobre la superficie).
      eje.set(
        p.inclinacion * 0.5,
        0,
        esPalito ? Math.PI / 2 + p.inclinacion * 0.4 : p.inclinacion,
      );
      base.setFromEuler(eje);
      rotacion.multiply(giro).multiply(base);
      if (esPalito) {
        const largo = 0.012 + p.tamano * 0.02;
        escala.set(0.0028, largo, 0.0028);
      } else {
        const lado = 0.005 + p.tamano * 0.007;
        escala.set(lado, lado, lado * (0.6 + p.tono * 0.8));
      }
      posicion.set(centro.x + p.x * radio, y + 0.0015, centro.y + p.z * radio);
      matriz.compose(posicion, rotacion, escala);
      malla.setMatrixAt(i, matriz);
    });
    malla.instanceMatrix.needsUpdate = true;
    malla.computeBoundingSphere();
  }

  function deformar(montanita) {
    for (let i = 0; i < cantidad; i++) {
      const x = polares[i * 2];
      const z = polares[i * 2 + 1];
      // El faldón baja desde el borde: tapa el hueco entre la yerba y la virola.
      const borde = faldon[i] ? Math.hypot(x, z) : 1;
      let y = altura(x / borde, z / borde, montanita);
      y += faldon[i] === 2 ? -0.07 : faldon[i] ? 0 : grano[i];
      posiciones.setXYZ(i, centro.x + x * radio, y, centro.y + z * radio);
    }
    posiciones.needsUpdate = true;
    geometria.computeVertexNormals();
    geometria.computeBoundingSphere();
    ubicar(mallaHojas, hojas, montanita, false);
    ubicar(mallaPalitos, palitos, montanita, true);
  }

  function dispose() {
    geometria.dispose();
    material.dispose();
    texturaGrano.dispose();
    mallaHojas.geometry.dispose();
    mallaPalitos.geometry.dispose();
    materialParticulas.dispose();
  }

  function lavar(valor) {
    lavado.value = valor;
  }

  return { grupo, deformar, lavar, dispose };
}
