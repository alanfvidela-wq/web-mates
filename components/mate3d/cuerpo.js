import * as THREE from "three";

// El cuerpo del GLB trae un pie en cruz cuyas patas suben por la panza. Se corta
// la malla en un anillo limpio por encima de las patas y se reemplaza la parte
// de abajo por una panza redondeada, para que el mate se apoye sobre ella.

// Anillo del modelo original (unidades del GLB) donde se corta: ninguna
// cara lo atraviesa y las patas empiezan por debajo.
const ALTURA_CORTE = -0.446;

// Perfil [radio, altura] de la panza desde el corte hasta el fondo, medido
// sobre los vértices de la panza entre las patas.
const PERFIL_PANZA = [
  [0.466, -0.442],
  [0.433, -0.556],
  [0.393, -0.655],
  [0.337, -0.748],
  [0.265, -0.826],
  [0.183, -0.883],
  [0.11, -0.914],
  [0.05, -0.932],
  [0, -0.937],
];
export const FONDO_PANZA = -0.937;

const FILAS = 28;
// Cuánto se corre la textura hacia abajo a lo largo de la panza nueva.
const DESPLAZAMIENTO_UV = 0.12;

// Copia los atributos (pueden venir intercalados) a arreglos propios.
function leerAtributo(atributo) {
  const datos = [];
  for (let i = 0; i < atributo.count; i++) {
    for (let c = 0; c < atributo.itemSize; c++) {
      datos.push(atributo.getComponent(i, c));
    }
  }
  return datos;
}

export function quitarPie(geometria) {
  const posicion = geometria.attributes.position;
  const indiceOriginal = geometria.index.array;
  const nombres = Object.keys(geometria.attributes);
  const datos = Object.fromEntries(
    nombres.map((nombre) => [
      nombre,
      leerAtributo(geometria.attributes[nombre]),
    ]),
  );
  const tamanos = Object.fromEntries(
    nombres.map((nombre) => [nombre, geometria.attributes[nombre].itemSize]),
  );

  // 1. Caras de la panza que quedan por encima del corte.
  const caras = [];
  for (let t = 0; t < indiceOriginal.length; t += 3) {
    const a = indiceOriginal[t];
    const b = indiceOriginal[t + 1];
    const c = indiceOriginal[t + 2];
    if (
      Math.min(posicion.getY(a), posicion.getY(b), posicion.getY(c)) >
      ALTURA_CORTE
    ) {
      caras.push(a, b, c);
    }
  }

  // 2. Aristas del borde del corte: las que no tienen cara del otro lado.
  //    Se comparan por posición porque las costuras de UV duplican vértices.
  const clave = (i) =>
    `${posicion.getX(i).toFixed(4)},${posicion.getY(i).toFixed(4)},${posicion.getZ(i).toFixed(4)}`;
  const aristas = new Set();
  for (let t = 0; t < caras.length; t += 3) {
    for (let k = 0; k < 3; k++) {
      aristas.add(`${clave(caras[t + k])}|${clave(caras[t + ((k + 1) % 3)])}`);
    }
  }
  const borde = [];
  for (let t = 0; t < caras.length; t += 3) {
    for (let k = 0; k < 3; k++) {
      const a = caras[t + k];
      const b = caras[t + ((k + 1) % 3)];
      const enCorte =
        posicion.getY(a) < ALTURA_CORTE + 0.01 &&
        posicion.getY(b) < ALTURA_CORTE + 0.01;
      if (enCorte && !aristas.has(`${clave(b)}|${clave(a)}`))
        borde.push([a, b]);
    }
  }

  // 3. Eje del mate según el anillo del corte.
  const centro = new THREE.Vector2();
  borde.forEach(([a]) =>
    centro.add(new THREE.Vector2(posicion.getX(a), posicion.getZ(a))),
  );
  centro.divideScalar(borde.length);

  const perfil = new THREE.SplineCurve(
    PERFIL_PANZA.map(([r, y]) => new THREE.Vector2(r, y)),
  );
  const filas = Array.from({ length: FILAS + 1 }, (_, j) => {
    const s = j / FILAS;
    const punto = perfil.getPoint(s);
    const tangente = perfil.getTangent(s);
    // Normal hacia afuera del perfil (que baja): (-dy, dr).
    const normal = new THREE.Vector2(-tangente.y, tangente.x).normalize();
    return { s, radio: Math.max(punto.x, 0), y: punto.y, normal };
  });
  filas[FILAS].normal.set(0, -1);
  const radioCorte = PERFIL_PANZA[0][0];

  // 4. Una tira de la panza nueva por cada arista del borde, copiando los
  //    atributos del vértice de arriba (UV, tangente) y ajustando el resto.
  let siguiente = posicion.count;
  const nuevas = [];
  const normalOriginal = new THREE.Vector3();
  const normalPerfil = new THREE.Vector3();

  function columna(origen) {
    const dx = posicion.getX(origen) - centro.x;
    const dz = posicion.getZ(origen) - centro.y;
    const escala = Math.hypot(dx, dz) / radioCorte;
    const angulo = Math.atan2(dz, dx);
    normalOriginal.fromBufferAttribute(geometria.attributes.normal, origen);

    return filas.map(({ s, radio, y, normal }, j) => {
      if (j === 0) return origen;
      nombres.forEach((nombre) => {
        const n = tamanos[nombre];
        for (let c = 0; c < n; c++)
          datos[nombre].push(datos[nombre][origen * n + c]);
      });
      const i = siguiente++;
      const p = datos.position;
      p[i * 3] = centro.x + Math.cos(angulo) * radio * escala;
      p[i * 3 + 1] = y;
      p[i * 3 + 2] = centro.y + Math.sin(angulo) * radio * escala;
      normalPerfil.set(
        Math.cos(angulo) * normal.x,
        normal.y,
        Math.sin(angulo) * normal.x,
      );
      normalPerfil
        .lerp(normalOriginal, 1 - THREE.MathUtils.smoothstep(s, 0, 0.25))
        .normalize();
      normalPerfil.toArray(datos.normal, i * 3);
      if (datos.uv) datos.uv[i * 2 + 1] += s * DESPLAZAMIENTO_UV;
      return i;
    });
  }

  for (const [a, b] of borde) {
    const columnaA = columna(a);
    const columnaB = columna(b);
    for (let j = 0; j < FILAS; j++) {
      // Mismo sentido de giro que la cara vecina (que recorre a → b).
      nuevas.push(columnaB[j], columnaA[j], columnaA[j + 1]);
      nuevas.push(columnaB[j], columnaA[j + 1], columnaB[j + 1]);
    }
  }

  const resultado = new THREE.BufferGeometry();
  nombres.forEach((nombre) => {
    resultado.setAttribute(
      nombre,
      new THREE.Float32BufferAttribute(datos[nombre], tamanos[nombre]),
    );
  });
  resultado.setIndex([...caras, ...nuevas]);
  resultado.computeBoundingBox();
  resultado.computeBoundingSphere();
  return resultado;
}
