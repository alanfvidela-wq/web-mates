"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
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

function crearMaterialCuerpo(material, color, original) {
  const config = MATERIALES[material];
  if (!config) {
    const copia = original.clone();
    if (color) copia.color.set(color); // tiñe la textura original
    return copia;
  }
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
 * - color: color del cuerpo (con "calabaza" tiñe la textura original).
 * - yerba, montanita, bombilla: valores de 0 a 1 (llenado, inclinación, inserción).
 * - animacionRef: ref opcional { yerba, montanita, bombilla, lavado } que se lee
 *   en cada frame, para animar sin re-renderizar React. `lavado` (0 a 1) aclara
 *   la yerba como cuando ya se tomaron muchos mates.
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

    return {
      partes,
      desplazamiento: [-centro.x, -caja.min.y, -centro.z],
      yerba: crearYerba({
        centro: new THREE.Vector2(centroVirola.x, centroVirola.z),
        radio: MODELO_RADIO_YERBA,
        alturaBase: MODELO_ALTURA_YERBA,
        alturaBorde: MODELO_BORDE_VIROLA,
        entrada: entradaBombilla(
          partes.bombilla.geometria,
          MODELO_ALTURA_YERBA,
        ),
      }),
      ejeBombilla: ejeBombilla(partes.bombilla.geometria),
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
  const aplicado = useRef({
    yerba: -1,
    montanita: -1,
    bombilla: -1,
    lavado: 0,
  });

  useFrame(() => {
    const animacion = animacionRef?.current;
    const nivel = animacion?.yerba ?? yerba;
    const inclinacion = animacion?.montanita ?? montanita;
    const insercion = animacion?.bombilla ?? bombilla;
    const lavado = animacion?.lavado ?? 0;
    const previo = aplicado.current;

    if (lavado !== previo.lavado) {
      modelo.yerba.lavar(lavado);
      previo.lavado = lavado;
    }
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

  const { partes } = modelo;

  return (
    <group {...props}>
      <group scale={ESCALA_MODELO}>
        <group position={modelo.desplazamiento}>
          <mesh geometry={partes.cuerpo.geometria} material={materialCuerpo} />
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
    </group>
  );
}

useGLTF.preload(RUTA_MODELO, false, false);
