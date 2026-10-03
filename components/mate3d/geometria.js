import * as THREE from "three";

// Unidades: el mate mide ~1.1 de alto, con la base en y = 0.

// Perfiles [radio, altura] de la calabaza, de abajo hacia arriba.
const PERFIL_EXTERIOR = [
  [0, 0],
  [0.3, 0.004],
  [0.55, 0.06],
  [0.72, 0.2],
  [0.79, 0.4],
  [0.77, 0.6],
  [0.69, 0.79],
  [0.6, 0.93],
  [0.55, 1.02],
];

const PERFIL_INTERIOR = [
  [0, 0.08],
  [0.28, 0.085],
  [0.5, 0.11],
  [0.67, 0.22],
  [0.74, 0.41],
  [0.72, 0.6],
  [0.64, 0.79],
  [0.555, 0.92],
  [0.5, 1.02],
];

export const ALTURA_BOCA = 1.02;
export const ALTURA_VIROLA = 1.1;

function suavizar(control, divisiones) {
  const puntos = control.map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.SplineCurve(puntos).getPoints(divisiones);
}

const puntosExterior = suavizar(PERFIL_EXTERIOR, 48);
const puntosInterior = suavizar(PERFIL_INTERIOR, 40);

// Radio del perfil a una altura dada (los puntos están ordenados por altura).
function radioEn(puntos, y) {
  if (y <= puntos[0].y) return puntos[0].x;
  for (let i = 1; i < puntos.length; i++) {
    const a = puntos[i - 1];
    const b = puntos[i];
    if (y <= b.y) {
      const t = b.y === a.y ? 1 : (y - a.y) / (b.y - a.y);
      return a.x + (b.x - a.x) * t;
    }
  }
  return puntos[puntos.length - 1].x;
}

// Generador pseudoaleatorio con semilla: mismo resultado en cada render.
export function aleatorio(semilla) {
  let s = semilla >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Calabaza: pared exterior + borde + pared interior en un solo perfil de revolución.
export function crearGeometriaCalabaza() {
  const perfil = [...puntosExterior, ...[...puntosInterior].reverse()];
  return new THREE.LatheGeometry(perfil, 72);
}

// Virola: anillo metálico que abraza la boca de la calabaza.
export function crearGeometriaVirola() {
  const perfil = [
    [0.495, 0.9],
    [0.63, 0.9],
    [0.655, 0.93],
    [0.655, 1.07],
    [0.63, ALTURA_VIROLA],
    [0.495, ALTURA_VIROLA],
    [0.495, 0.9],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(perfil, 72);
}

// Franja frontal (120°) apenas por fuera de la calabaza, donde va el grabado.
// phiStart = -60° deja el centro de la textura (u = 0.5) mirando hacia +z.
export function crearGeometriaBanda(desde = 0.3, hasta = 0.64) {
  const puntos = [];
  for (let i = 0; i <= 16; i++) {
    const y = desde + ((hasta - desde) * i) / 16;
    puntos.push(new THREE.Vector2(radioEn(puntosExterior, y) + 0.004, y));
  }
  return new THREE.LatheGeometry(puntos, 48, -Math.PI / 3, (2 * Math.PI) / 3);
}

export function crearGeometriaBombilla() {
  const curva = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.05, 0),
    new THREE.Vector3(0, 0.8, 0),
    new THREE.Vector3(0, 1.3, 0),
    new THREE.Vector3(0.04, 1.48, 0),
    new THREE.Vector3(0.15, 1.58, 0),
  ]);
  return new THREE.TubeGeometry(curva, 64, 0.022, 10, false);
}

// Altura de la superficie de la yerba según el nivel de llenado (0 a 1).
export function alturaYerba(nivel) {
  return 0.1 + nivel * 0.62;
}

const COLORES_YERBA = ["#5f7f2f", "#6f8f3a", "#7d9b48", "#4f6b27", "#a9a46a"];

// Superficie de la yerba: disco polar que se adapta a la pared interior.
// `actualizar(nivel, montanita)` la llena e inclina hacia -x para formar la montañita.
export function crearSuperficieYerba(anillos = 14, segmentos = 48) {
  const cantidad = 1 + anillos * segmentos;
  const posiciones = new Float32Array(cantidad * 3);
  const colores = new Float32Array(cantidad * 3);
  const polares = new Float32Array(cantidad * 3); // u, w, s de cada vértice
  const ruido = new Float32Array(cantidad);
  const azar = aleatorio(7);
  const color = new THREE.Color();

  for (let i = 0; i < cantidad; i++) {
    let u = 0;
    let w = 0;
    let s = 0;
    if (i > 0) {
      const anillo = Math.floor((i - 1) / segmentos) + 1;
      const angulo = (((i - 1) % segmentos) / segmentos) * Math.PI * 2;
      s = anillo / anillos;
      u = Math.cos(angulo) * s;
      w = Math.sin(angulo) * s;
    }
    polares.set([u, w, s], i * 3);
    ruido[i] = azar() - 0.5;
    color.set(COLORES_YERBA[Math.floor(azar() * COLORES_YERBA.length)]);
    color.toArray(colores, i * 3);
  }

  const indice = (anillo, segmento) =>
    1 + (anillo - 1) * segmentos + (segmento % segmentos);
  const indices = [];
  for (let j = 0; j < segmentos; j++) {
    indices.push(0, indice(1, j + 1), indice(1, j));
    for (let k = 2; k <= anillos; k++) {
      const p = indice(k - 1, j);
      const q = indice(k, j);
      const r = indice(k, j + 1);
      const s = indice(k - 1, j + 1);
      indices.push(p, r, q, p, s, r);
    }
  }

  const geometria = new THREE.BufferGeometry();
  geometria.setAttribute("position", new THREE.BufferAttribute(posiciones, 3));
  geometria.setAttribute("color", new THREE.BufferAttribute(colores, 3));
  geometria.setIndex(indices);

  function actualizar(nivel, montanita) {
    const base = alturaYerba(nivel);
    for (let i = 0; i < cantidad; i++) {
      const u = polares[i * 3];
      const w = polares[i * 3 + 1];
      const s = polares[i * 3 + 2];
      let y =
        base +
        montanita * 0.3 * -u +
        montanita * 0.06 * (1 - s * s) +
        ruido[i] * 0.03;
      y = Math.min(y, ALTURA_BOCA - 0.04);
      const r = radioEn(puntosInterior, y) * 0.985;
      posiciones[i * 3] = u * r;
      posiciones[i * 3 + 1] = y;
      posiciones[i * 3 + 2] = w * r;
    }
    geometria.attributes.position.needsUpdate = true;
    geometria.computeVertexNormals();
    geometria.computeBoundingSphere();
  }

  actualizar(0, 0);
  return { geometria, actualizar };
}
