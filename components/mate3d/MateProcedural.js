"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  crearGeometriaBanda,
  crearGeometriaBombilla,
  crearGeometriaCalabaza,
  crearGeometriaVirola,
  crearSuperficieYerba,
  ALTURA_VIROLA,
} from "./geometria";
import { crearTexturaGrabado, crearTexturaVeta } from "./texturas";

export const MATERIALES = {
  calabaza: {
    color: "#6b3e26",
    roughness: 0.7,
    metalness: 0,
    virola: true,
    grabado: "#e8d3a6",
  },
  madera: {
    color: "#a0673a",
    roughness: 0.55,
    metalness: 0,
    virola: true,
    veta: true,
    grabado: "#3a2210",
  },
  ceramica: {
    color: "#ece3d0",
    roughness: 0.2,
    metalness: 0,
    clearcoat: 1,
    virola: false,
    grabado: "#3f6b2a",
  },
  acero: {
    color: "#c3c6c9",
    roughness: 0.22,
    metalness: 1,
    virola: false,
    grabado: "#2b2d30",
  },
};

const ALPACA = { color: "#d8d3c8", metalness: 1, roughness: 0.28 };
const BOMBILLA_X = 0.2;
const BOMBILLA_Y = 0.15;
const BOMBILLA_Z = 0.08;

function useTexturaGrabado(texto, color) {
  const [textura, setTextura] = useState(null);

  useEffect(() => {
    if (!texto) return;
    let cancelado = false;
    // Usa la tipografía de títulos de la marca (next/font la expone como variable CSS).
    const familia =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-fraunces")
        .trim() || "Georgia, serif";
    document.fonts
      .load(`italic 700 120px ${familia}`)
      .catch(() => {})
      .then(() => {
        if (!cancelado) setTextura(crearTexturaGrabado(texto, color, familia));
      });
    return () => {
      cancelado = true;
    };
  }, [texto, color]);

  useEffect(() => () => textura?.dispose(), [textura]);

  return texto ? textura : null;
}

/**
 * Mate 3D modelado en código (versión anterior al modelo GLB; se conserva por si hace falta). Va dentro de un <Canvas> de @react-three/fiber.
 *
 * - material: "calabaza" | "madera" | "ceramica" | "acero"
 * - color: color del cuerpo (por defecto, el del material)
 * - grabado: texto opcional grabado en el frente
 * - virola: muestra la virola de alpaca (por defecto según el material)
 * - yerba, montanita, bombilla: valores de 0 a 1 (llenado, inclinación, inserción)
 * - animacionRef: ref opcional { yerba, montanita, bombilla } que se lee en cada
 *   frame, para animar sin re-renderizar React.
 */
export default function MateProcedural({
  material = "calabaza",
  color,
  grabado,
  virola,
  yerba = 0,
  montanita = 0,
  bombilla = 1,
  animacionRef,
  ...props
}) {
  const config = MATERIALES[material] ?? MATERIALES.calabaza;
  const conVirola = virola ?? config.virola;
  const invalidate = useThree((estado) => estado.invalidate);

  const geometrias = useMemo(
    () => ({
      calabaza: crearGeometriaCalabaza(),
      virola: crearGeometriaVirola(),
      banda: crearGeometriaBanda(),
      bombilla: crearGeometriaBombilla(),
    }),
    [],
  );
  const superficieYerba = useMemo(() => crearSuperficieYerba(), []);
  const veta = useMemo(
    () => (config.veta ? crearTexturaVeta() : null),
    [config.veta],
  );
  const texturaGrabado = useTexturaGrabado(grabado, config.grabado);

  useEffect(
    () => () => {
      Object.values(geometrias).forEach((g) => g.dispose());
      superficieYerba.geometria.dispose();
    },
    [geometrias, superficieYerba],
  );
  useEffect(() => () => veta?.dispose(), [veta]);

  const yerbaRef = useRef(null);
  const bombillaRef = useRef(null);
  const aplicado = useRef({ yerba: -1, montanita: -1, bombilla: -1 });

  useFrame(() => {
    const animacion = animacionRef?.current;
    const nivel = animacion?.yerba ?? yerba;
    const inclinacion = animacion?.montanita ?? montanita;
    const insercion = animacion?.bombilla ?? bombilla;
    const previo = aplicado.current;

    if (
      Math.abs(nivel - previo.yerba) > 0.001 ||
      Math.abs(inclinacion - previo.montanita) > 0.001
    ) {
      superficieYerba.actualizar(nivel, inclinacion);
      yerbaRef.current.visible = nivel > 0.01;
      previo.yerba = nivel;
      previo.montanita = inclinacion;
    }

    if (Math.abs(insercion - previo.bombilla) > 0.001) {
      bombillaRef.current.position.set(
        BOMBILLA_X,
        BOMBILLA_Y + (1 - insercion) * 1.8,
        BOMBILLA_Z,
      );
      bombillaRef.current.visible = insercion > 0.01;
      previo.bombilla = insercion;
    }
  });

  // Con frameloop="demand", pide un frame nuevo cuando cambian las props.
  useEffect(() => {
    invalidate();
  }, [yerba, montanita, bombilla, texturaGrabado, invalidate]);

  return (
    <group {...props}>
      <mesh geometry={geometrias.calabaza}>
        <meshPhysicalMaterial
          color={color ?? config.color}
          roughness={config.roughness}
          metalness={config.metalness}
          clearcoat={config.clearcoat ?? 0}
          clearcoatRoughness={0.15}
          map={veta}
          side={THREE.DoubleSide}
        />
      </mesh>

      {conVirola && (
        <>
          <mesh geometry={geometrias.virola}>
            <meshStandardMaterial {...ALPACA} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, ALTURA_VIROLA, 0]} rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.575, 0.022, 12, 72]} />
            <meshStandardMaterial {...ALPACA} />
          </mesh>
        </>
      )}

      {texturaGrabado && (
        <mesh geometry={geometrias.banda}>
          <meshStandardMaterial
            map={texturaGrabado}
            transparent
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-2}
            roughness={config.roughness}
            metalness={config.metalness * 0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      <mesh ref={yerbaRef} geometry={superficieYerba.geometria}>
        <meshStandardMaterial vertexColors roughness={1} flatShading />
      </mesh>

      <group ref={bombillaRef} rotation-z={-0.2}>
        <mesh geometry={geometrias.bombilla}>
          <meshStandardMaterial {...ALPACA} />
        </mesh>
        <mesh position={[0, 0.07, 0]} scale={[0.075, 0.11, 0.035]}>
          <sphereGeometry args={[1, 24, 16]} />
          <meshStandardMaterial {...ALPACA} />
        </mesh>
        <mesh position={[0, 1.05, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.03, 0.012, 8, 24]} />
          <meshStandardMaterial {...ALPACA} />
        </mesh>
      </group>
    </group>
  );
}
