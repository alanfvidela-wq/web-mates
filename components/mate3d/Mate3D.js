"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const RUTA_MODELO = "/models/mate.glb";

// El GLB (exportado de Sketchfab) no tiene nombres útiles en los nodos:
// identificamos cada parte por el nombre de su material.
const PARTES = {
  MateFull3: "cuerpo",
  MateFull2: "yerba",
  MateFull1: "virola",
  MateFull: "bombilla",
};

// Normalización: el cuerpo mide ALTURA_CUERPO, centrado en x/z y apoyado en y = 0.
const ALTURA_CUERPO = 1.1;
// Cuánto baja la yerba (en unidades del modelo original) cuando el mate está vacío.
const DESCENSO_YERBA = 0.35;
// Cuánto sale la bombilla (en unidades del modelo original) cuando no está puesta.
const SALIDA_BOMBILLA = 1.2;

// Medidas del modelo original, para que la escena sepa dónde cae la yerba.
const MODELO_BASE_Y = -1;
const MODELO_ALTURA_CUERPO = 0.943;
const MODELO_TOPE_YERBA = 0.03;
const ESCALA_MODELO = ALTURA_CUERPO / MODELO_ALTURA_CUERPO;

export function alturaYerba(nivel) {
  const y = MODELO_TOPE_YERBA - (1 - nivel) * DESCENSO_YERBA - MODELO_BASE_Y;
  return y * ESCALA_MODELO;
}

export const MATERIALES = {
  // "calabaza" usa el material original del modelo (calabaza forrada en cuero).
  calabaza: null,
  madera: { color: "#a0673a", roughness: 0.55, metalness: 0 },
  ceramica: { color: "#ece3d0", roughness: 0.18, metalness: 0, clearcoat: 1 },
  acero: { color: "#c3c6c9", roughness: 0.2, metalness: 1 },
};

const COLOR_YERBA = "#a9a582"; // multiplica la textura hacia un verde oliva apagado

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

// Montañita: la yerba sube del lado opuesto a la bombilla y baja del lado de ella.
function prepararYerba(geometria, geometriaBombilla) {
  // Las tangentes del modelo dejan de valer al deformar; three las aproxima.
  geometria.deleteAttribute("tangent");
  geometria.computeBoundingBox();
  const centro = geometria.boundingBox.getCenter(new THREE.Vector3());
  const radio =
    Math.max(
      geometria.boundingBox.max.x - geometria.boundingBox.min.x,
      geometria.boundingBox.max.z - geometria.boundingBox.min.z,
    ) / 2;

  // Dirección hacia donde la bombilla entra en la yerba.
  const posBombilla = geometriaBombilla.attributes.position;
  const entrada = new THREE.Vector2();
  let cantidad = 0;
  for (let i = 0; i < posBombilla.count; i++) {
    if (posBombilla.getY(i) < centro.y) {
      entrada.x += posBombilla.getX(i);
      entrada.y += posBombilla.getZ(i);
      cantidad++;
    }
  }
  entrada.divideScalar(Math.max(cantidad, 1));
  const direccion = new THREE.Vector2(
    entrada.x - centro.x,
    entrada.y - centro.z,
  ).normalize();

  // El GLB trae atributos intercalados: los pasamos a un buffer propio.
  const posiciones = geometria.attributes.position.clone();
  geometria.setAttribute("position", posiciones);
  const original = Float32Array.from(posiciones.array);

  return function deformar(montanita) {
    for (let i = 0; i < posiciones.count; i++) {
      const x = original[i * 3];
      const y = original[i * 3 + 1];
      const z = original[i * 3 + 2];
      const dx = (x - centro.x) / radio;
      const dz = (z - centro.z) / radio;
      // t = 1 del lado de la bombilla, -1 del lado opuesto.
      const t = dx * direccion.x + dz * direccion.y;
      const r2 = Math.min(1, dx * dx + dz * dz);
      const desplazamiento = -t * 0.085 + (1 - r2) * 0.03;
      posiciones.setY(i, y + montanita * desplazamiento);
    }
    posiciones.needsUpdate = true;
    geometria.computeVertexNormals();
    geometria.computeBoundingSphere();
  };
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
 * - animacionRef: ref opcional { yerba, montanita, bombilla } que se lee en cada
 *   frame, para animar sin re-renderizar React.
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
    partes.yerba.material.color.set(COLOR_YERBA);
    partes.virola.material.envMapIntensity = 1.3;
    partes.bombilla.material.envMapIntensity = 1.3;

    const caja = new THREE.Box3().setFromBufferAttribute(
      partes.cuerpo.geometria.attributes.position,
    );
    const centro = caja.getCenter(new THREE.Vector3());

    return {
      partes,
      escala: ALTURA_CUERPO / (caja.max.y - caja.min.y),
      desplazamiento: [-centro.x, -caja.min.y, -centro.z],
      deformarYerba: prepararYerba(
        partes.yerba.geometria,
        partes.bombilla.geometria,
      ),
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
    },
    [modelo],
  );
  useEffect(() => () => materialCuerpo.dispose(), [materialCuerpo]);

  const yerbaRef = useRef(null);
  const bombillaRef = useRef(null);
  const aplicado = useRef({ yerba: -1, montanita: -1, bombilla: -1 });

  useFrame(() => {
    const animacion = animacionRef?.current;
    const nivel = animacion?.yerba ?? yerba;
    const inclinacion = animacion?.montanita ?? montanita;
    const insercion = animacion?.bombilla ?? bombilla;
    const previo = aplicado.current;

    if (Math.abs(inclinacion - previo.montanita) > 0.001) {
      modelo.deformarYerba(inclinacion);
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
      <group scale={modelo.escala}>
        <group position={modelo.desplazamiento}>
          <mesh geometry={partes.cuerpo.geometria} material={materialCuerpo} />
          <mesh
            geometry={partes.virola.geometria}
            material={partes.virola.material}
          />
          <mesh
            ref={yerbaRef}
            geometry={partes.yerba.geometria}
            material={partes.yerba.material}
          />
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
