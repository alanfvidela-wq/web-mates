"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { toCreasedNormals } from "three/addons/utils/BufferGeometryUtils.js";
import { FONDO_PANZA, quitarPie } from "./cuerpo";
import { crearYerba } from "./yerba";

const RUTA_MODELO = "/models/mate.glb";

// El GLB (exportado de Sketchfab) no tiene nombres útiles en los nodos:
// identificamos cada parte por el nombre de su material.
const PARTES = {
  MateFull3: "cuerpo",
  MateFull2: "yerba",
  MateFull1: "virola",
  MateFull: "bombilla",
};

// Escala del modelo original (el cuerpo con el pie medía 0.943 → 1.1).
const ESCALA_MODELO = 1.1 / 0.943;
// Cuánto baja la yerba (en unidades del modelo original) cuando el mate está vacío.
const DESCENSO_YERBA = 0.35;
// Cuánto sale la bombilla (en unidades del modelo original) cuando no está puesta.
const SALIDA_BOMBILLA = 1.2;

// Gestos del ritual (unidades de la escena).
const PIVOTE = 0.6; // altura del centro de giro al dar vuelta o inclinar
const ALZADO = 0.45; // cuánto se levanta el mate para darlo vuelta
const ANGULO_INCLINADO = 0.85; // radianes
const AMPLITUD_SACUDIDA = 0.07;
const ALTURA_CHORRO = 2.2;
const EJE_VOLTEO = new THREE.Vector3(0, 0, 1);

// Medidas del modelo original (unidades del GLB).
const MODELO_BORDE_VIROLA = 0.065;
const MODELO_RADIO_YERBA = 0.306; // un poco menos que el interior de la virola
const MODELO_ALTURA_YERBA = 0.045; // yerba plana, justo bajo el borde

// Altura de la superficie de la yerba en la escena (el mate apoya en y = 0).
export function alturaYerba(nivel) {
  const y = MODELO_ALTURA_YERBA - (1 - nivel) * DESCENSO_YERBA - FONDO_PANZA;
  return y * ESCALA_MODELO;
}

export const MATERIALES = {
  // "calabaza" usa el material original del modelo (calabaza forrada en cuero).
  calabaza: null,
  madera: { color: "#a0673a", roughness: 0.55, metalness: 0 },
  ceramica: { color: "#ece3d0", roughness: 0.18, metalness: 0, clearcoat: 1 },
  acero: { color: "#c3c6c9", roughness: 0.2, metalness: 1 },
};

// Cuero de la calabaza: marrón cálido. lumaMedia es la luminancia media
// (lineal) de la textura original, para normalizarla alrededor de 1.
const CUERO = {
  color: "#9c6236",
  lumaMedia: 0.035,
  relieve: 2.2,
  rugosidadMinima: 0.5, // cuero semimate, sin brillo de plástico
};

// Alpaca: metal plateado claro con reflejos suaves.
const VIROLA = {
  color: "#e4e2dc",
  metalness: 1,
  roughness: 0.3,
  envMapIntensity: 1.8,
};

function extraerPartes(escena) {
  escena.updateMatrixWorld(true);
  const partes = {};
  escena.traverse((objeto) => {
    const parte = objeto.isMesh && PARTES[objeto.material.name];
    if (!parte) return;
    const geometria = objeto.geometry.clone().applyMatrix4(objeto.matrixWorld);
    const material = objeto.material.clone();
    // Sketchfab exporta todo como BLEND; son piezas opacas.
    material.transparent = false;
    material.depthWrite = true;
    partes[parte] = { geometria, material };
  });
  return partes;
}

// Punto (x, z) donde el eje de la bombilla cruza la altura y.
function entradaBombilla(geometria, y) {
  const posiciones = geometria.attributes.position;
  const punto = new THREE.Vector2();
  let cantidad = 0;
  for (let i = 0; i < posiciones.count; i++) {
    if (Math.abs(posiciones.getY(i) - y) < 0.12) {
      punto.x += posiciones.getX(i);
      punto.y += posiciones.getZ(i);
      cantidad++;
    }
  }
  return punto.divideScalar(Math.max(cantidad, 1));
}

function ejeBombilla(geometria) {
  const posiciones = geometria.attributes.position;
  const abajo = new THREE.Vector3();
  const arriba = new THREE.Vector3();
  let nAbajo = 0;
  let nArriba = 0;
  for (let i = 0; i < posiciones.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(posiciones, i);
    if (v.y < -0.2) {
      abajo.add(v);
      nAbajo++;
    } else if (v.y > 0.8) {
      arriba.add(v);
      nArriba++;
    }
  }
  abajo.divideScalar(Math.max(nAbajo, 1));
  arriba.divideScalar(Math.max(nArriba, 1));
  return arriba.sub(abajo).normalize();
}

// La textura original es un bordó casi negro. Se usa solo su luminancia
// (veta, costuras) sobre un color de cuero, y se refuerza el normal map.
function crearMaterialCuero(original, color) {
  const copia = original.clone();
  const uniforms = {
    uCuero: { value: new THREE.Color(color) },
    uLumaMedia: { value: CUERO.lumaMedia },
  };
  copia.normalScale.multiplyScalar(CUERO.relieve);
  copia.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nuniform vec3 uCuero;\nuniform float uLumaMedia;",
      )
      .replace(
        "#include <roughnessmap_fragment>",
        `#include <roughnessmap_fragment>
        roughnessFactor = max( roughnessFactor, ${CUERO.rugosidadMinima.toFixed(2)} );`,
      )
      .replace(
        "#include <map_fragment>",
        `#ifdef USE_MAP
          vec4 texelCuero = texture2D( map, vMapUv );
          float lumaCuero = dot( texelCuero.rgb, vec3( 0.2126, 0.7152, 0.0722 ) );
          diffuseColor.rgb *= uCuero * clamp( lumaCuero / uLumaMedia, 0.45, 2.2 );
        #endif`,
      );
  };
  copia.customProgramCacheKey = () => "cuero";
  return copia;
}

// La virola del GLB es un anillo de pocos lados con normales planas: se ven
// las aristas. Se subdivide cada triángulo llevando los puntos nuevos al
// círculo (el perfil no cambia, la circunferencia queda redonda) y después se
// suavizan las normales respetando solo los quiebres del perfil.
const SUBDIVISIONES_VIROLA = 2;

function puntoEnAnillo(a, b, centro) {
  const anguloA = Math.atan2(a.z - centro.y, a.x - centro.x);
  let anguloB = Math.atan2(b.z - centro.y, b.x - centro.x);
  if (anguloB - anguloA > Math.PI) anguloB -= Math.PI * 2;
  if (anguloA - anguloB > Math.PI) anguloB += Math.PI * 2;
  const angulo = (anguloA + anguloB) / 2;
  const radio =
    (Math.hypot(a.x - centro.x, a.z - centro.y) +
      Math.hypot(b.x - centro.x, b.z - centro.y)) /
    2;
  return new THREE.Vector3(
    centro.x + Math.cos(angulo) * radio,
    (a.y + b.y) / 2,
    centro.y + Math.sin(angulo) * radio,
  );
}

function suavizarVirola(geometria) {
  const posicion = geometria.attributes.position;
  const caja = new THREE.Box3().setFromBufferAttribute(posicion);
  const centro = new THREE.Vector2(
    (caja.min.x + caja.max.x) / 2,
    (caja.min.z + caja.max.z) / 2,
  );
  const indice = geometria.index.array;
  let triangulos = [];
  for (let t = 0; t < indice.length; t += 3) {
    triangulos.push(
      [0, 1, 2].map((k) =>
        new THREE.Vector3().fromBufferAttribute(posicion, indice[t + k]),
      ),
    );
  }

  for (let paso = 0; paso < SUBDIVISIONES_VIROLA; paso++) {
    triangulos = triangulos.flatMap(([a, b, c]) => {
      const ab = puntoEnAnillo(a, b, centro);
      const bc = puntoEnAnillo(b, c, centro);
      const ca = puntoEnAnillo(c, a, centro);
      return [
        [a, ab, ca],
        [ab, b, bc],
        [ca, bc, c],
        [ab, bc, ca],
      ];
    });
  }

  const subdividida = new THREE.BufferGeometry();
  subdividida.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      triangulos.flat().flatMap((v) => [v.x, v.y, v.z]),
      3,
    ),
  );
  const suave = toCreasedNormals(subdividida, THREE.MathUtils.degToRad(40));
  subdividida.dispose();
  return suave;
}

function crearMaterialCuerpo(material, color, original) {
  const config = MATERIALES[material];
  if (!config) return crearMaterialCuero(original, color ?? CUERO.color);
  return new THREE.MeshPhysicalMaterial({
    color: color ?? config.color,
    roughness: config.roughness,
    metalness: config.metalness,
    clearcoat: config.clearcoat ?? 0,
    clearcoatRoughness: 0.12,
    // Conserva la oclusión del modelo para que no se vea plano.
    aoMap: original.aoMap,
    side: THREE.DoubleSide,
  });
}

/**
 * Mate uruguayo cargado desde public/models/mate.glb. Va dentro de un <Canvas>
 * (y de un <Suspense>, porque carga el modelo).
 *
 * - material: "calabaza" (original) | "madera" | "ceramica" | "acero";
 *   reemplaza solo el material del cuerpo.
 * - color: color del cuerpo (con "calabaza", el color del cuero).
 * - yerba, montanita, bombilla: valores de 0 a 1 (llenado, inclinación, inserción).
 * - animacionRef: ref opcional que se lee en cada frame, para animar sin
 *   re-renderizar React. Además de { yerba, montanita, bombilla } acepta los
 *   gestos del ritual, de 0 a 1: tapa (la palma sobre la boca), alzado,
 *   volteo (boca abajo), sacudida (-1 a 1), inclinado, agua (chorro en el
 *   hueco), humedad (la yerba se oscurece junto al hueco) y lavado (yerba
 *   lavada, como después de muchos mates).
 */
export default function Mate3D({
  material = "calabaza",
  color,
  yerba = 1,
  montanita = 1,
  bombilla = 1,
  animacionRef,
  ...props
}) {
  const { scene } = useGLTF(RUTA_MODELO, false, false);
  const invalidate = useThree((estado) => estado.invalidate);

  // Copias propias de geometrías y materiales: cada instancia se deforma por separado.
  const modelo = useMemo(() => {
    const partes = extraerPartes(scene);
    // El disco de yerba del GLB tiene muy pocos vértices: se reemplaza.
    partes.yerba.geometria.dispose();
    partes.yerba.material.dispose();
    delete partes.yerba;

    const sinPie = quitarPie(partes.cuerpo.geometria);
    partes.cuerpo.geometria.dispose();
    partes.cuerpo.geometria = sinPie;

    const virolaSuave = suavizarVirola(partes.virola.geometria);
    partes.virola.geometria.dispose();
    partes.virola.geometria = virolaSuave;

    // La textura de la virola trae sombras horneadas que la vuelven negra.
    const virola = partes.virola.material;
    virola.map = null;
    virola.metalnessMap = null;
    virola.roughnessMap = null;
    virola.normalMap = null;
    virola.color.set(VIROLA.color);
    virola.metalness = VIROLA.metalness;
    virola.roughness = VIROLA.roughness;
    virola.envMapIntensity = VIROLA.envMapIntensity;
    partes.bombilla.material.envMapIntensity = 1.3;

    const caja = sinPie.boundingBox;
    const centro = caja.getCenter(new THREE.Vector3());
    const cajaVirola = new THREE.Box3().setFromBufferAttribute(
      partes.virola.geometria.attributes.position,
    );
    const centroVirola = cajaVirola.getCenter(new THREE.Vector3());
    const desplazamiento = [-centro.x, -caja.min.y, -centro.z];
    // De unidades del modelo a unidades de la escena (el mate apoya en y = 0).
    const aEscena = (x, y, z) =>
      new THREE.Vector3(
        (x + desplazamiento[0]) * ESCALA_MODELO,
        (y + desplazamiento[1]) * ESCALA_MODELO,
        (z + desplazamiento[2]) * ESCALA_MODELO,
      );

    const entrada = entradaBombilla(
      partes.bombilla.geometria,
      MODELO_ALTURA_YERBA,
    );
    // Se inclina hacia el lado opuesto a la bombilla: ahí se junta la yerba.
    const haciaBombilla = new THREE.Vector2(
      entrada.x - centroVirola.x,
      entrada.y - centroVirola.z,
    ).normalize();

    return {
      partes,
      desplazamiento,
      yerba: crearYerba({
        centro: new THREE.Vector2(centroVirola.x, centroVirola.z),
        radio: MODELO_RADIO_YERBA,
        alturaBase: MODELO_ALTURA_YERBA,
        alturaBorde: MODELO_BORDE_VIROLA,
        entrada,
      }),
      ejeBombilla: ejeBombilla(partes.bombilla.geometria),
      ejeInclinado: new THREE.Vector3(-haciaBombilla.y, 0, haciaBombilla.x),
      boca: aEscena(centroVirola.x, MODELO_BORDE_VIROLA, centroVirola.z),
      hueco: aEscena(entrada.x, MODELO_ALTURA_YERBA, entrada.y),
    };
  }, [scene]);

  const materialCuerpo = useMemo(
    () => crearMaterialCuerpo(material, color, modelo.partes.cuerpo.material),
    [material, color, modelo],
  );

  useEffect(
    () => () => {
      Object.values(modelo.partes).forEach(({ geometria, material: m }) => {
        geometria.dispose();
        m.dispose();
      });
      modelo.yerba.dispose();
    },
    [modelo],
  );
  useEffect(() => () => materialCuerpo.dispose(), [materialCuerpo]);

  const yerbaRef = useRef(null);
  const bombillaRef = useRef(null);
  const poseRef = useRef(null);
  const tapaRef = useRef(null);
  const chorroRef = useRef(null);
  const giro = useMemo(
    () => ({
      volteo: new THREE.Quaternion(),
      inclinado: new THREE.Quaternion(),
    }),
    [],
  );
  const aplicado = useRef({
    yerba: -1,
    montanita: -1,
    bombilla: -1,
    lavado: 0,
    humedad: 0,
  });

  useFrame(() => {
    const animacion = animacionRef?.current;
    const nivel = animacion?.yerba ?? yerba;
    const inclinacion = animacion?.montanita ?? montanita;
    const insercion = animacion?.bombilla ?? bombilla;
    const lavado = animacion?.lavado ?? 0;
    const humedad = animacion?.humedad ?? 0;
    const previo = aplicado.current;

    if (lavado !== previo.lavado) {
      modelo.yerba.lavar(lavado);
      previo.lavado = lavado;
    }
    if (humedad !== previo.humedad) {
      modelo.yerba.mojar(humedad);
      previo.humedad = humedad;
    }

    // Pose: levantarlo, darlo vuelta, sacudirlo e inclinarlo.
    const pose = poseRef.current;
    pose.position.set(
      (animacion?.sacudida ?? 0) * AMPLITUD_SACUDIDA,
      PIVOTE + (animacion?.alzado ?? 0) * ALZADO,
      0,
    );
    giro.volteo.setFromAxisAngle(
      EJE_VOLTEO,
      (animacion?.volteo ?? 0) * Math.PI,
    );
    giro.inclinado.setFromAxisAngle(
      modelo.ejeInclinado,
      (animacion?.inclinado ?? 0) * ANGULO_INCLINADO,
    );
    pose.quaternion.copy(giro.volteo).multiply(giro.inclinado);

    // La palma baja hasta tapar la boca.
    const tapa = animacion?.tapa ?? 0;
    tapaRef.current.visible = tapa > 0.001;
    tapaRef.current.position.y = modelo.boca.y + 0.03 + (1 - tapa) * 0.9;
    tapaRef.current.material.opacity = tapa;

    // Chorro de agua: baja hasta el hueco y después se corta desde arriba.
    const agua = animacion?.agua ?? 0;
    const arriba = modelo.hueco.y + ALTURA_CHORRO;
    const frente = Math.min(1, agua / 0.35);
    const cola = Math.max(0, (agua - 0.65) / 0.35);
    const yAbajo = arriba - frente * ALTURA_CHORRO;
    const yArriba = arriba - cola * ALTURA_CHORRO;
    const chorro = chorroRef.current;
    chorro.visible = agua > 0 && agua < 1 && yArriba - yAbajo > 0.01;
    chorro.scale.y = Math.max(yArriba - yAbajo, 0.001);
    chorro.position.y = (yArriba + yAbajo) / 2;
    if (Math.abs(inclinacion - previo.montanita) > 0.001) {
      modelo.yerba.deformar(inclinacion);
      previo.montanita = inclinacion;
    }
    if (Math.abs(nivel - previo.yerba) > 0.001) {
      yerbaRef.current.position.y = -(1 - nivel) * DESCENSO_YERBA;
      yerbaRef.current.visible = nivel > 0.01;
      previo.yerba = nivel;
    }
    if (Math.abs(insercion - previo.bombilla) > 0.001) {
      bombillaRef.current.position
        .copy(modelo.ejeBombilla)
        .multiplyScalar((1 - insercion) * SALIDA_BOMBILLA);
      bombillaRef.current.visible = insercion > 0.01;
      previo.bombilla = insercion;
    }
  });

  // Con frameloop="demand", pide un frame nuevo cuando cambian las props.
  useEffect(() => {
    invalidate();
  }, [yerba, montanita, bombilla, materialCuerpo, invalidate]);

  const { partes, boca, hueco } = modelo;

  return (
    <group {...props}>
      <group ref={poseRef} position={[0, PIVOTE, 0]}>
        <group position={[0, -PIVOTE, 0]}>
          <group scale={ESCALA_MODELO}>
            <group position={modelo.desplazamiento}>
              <mesh
                geometry={partes.cuerpo.geometria}
                material={materialCuerpo}
              />
              <mesh
                geometry={partes.virola.geometria}
                material={partes.virola.material}
              />
              <primitive ref={yerbaRef} object={modelo.yerba.grupo} />
              <mesh
                ref={bombillaRef}
                geometry={partes.bombilla.geometria}
                material={partes.bombilla.material}
              />
            </group>
          </group>

          <mesh
            ref={tapaRef}
            position={[boca.x, boca.y, boca.z]}
            visible={false}
          >
            <cylinderGeometry args={[0.6, 0.6, 0.05, 48]} />
            <meshStandardMaterial color="#c99a72" roughness={0.8} transparent />
          </mesh>

          <mesh
            ref={chorroRef}
            position={[hueco.x, hueco.y, hueco.z]}
            visible={false}
          >
            <cylinderGeometry args={[0.022, 0.03, 1, 12, 1, true]} />
            <meshStandardMaterial
              color="#d9ecf2"
              roughness={0.05}
              transparent
              opacity={0.6}
              envMapIntensity={1.6}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(RUTA_MODELO, false, false);
