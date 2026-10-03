"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";
import Mate3D, { alturaYerba } from "@/components/mate3d/Mate3D";
import { aleatorio } from "@/components/mate3d/geometria";

const ALTURA_PISO = -0.55;
const DURACION_CAIDA = 0.08;

function tramo(desde, hasta, p) {
  return THREE.MathUtils.smoothstep(p, desde, hasta);
}

// Qué pasa en cada tramo del scroll (p de 0 a 1).
function valoresAnimacion(p) {
  return {
    yerba: tramo(0.12, 0.66, p),
    montanita: tramo(0.52, 0.84, p),
    bombilla: tramo(0.82, 0.96, p),
  };
}

function crearParticulas(cantidad) {
  const azar = aleatorio(42);
  const tonos = ["#4f6b27", "#6f8f3a", "#7d9b48", "#b3ab72"];
  return Array.from({ length: cantidad }, () => {
    const radio = Math.sqrt(azar()) * 0.32;
    const angulo = azar() * Math.PI * 2;
    return {
      x: Math.cos(angulo) * radio,
      z: Math.sin(angulo) * radio,
      inicioY: 2 + azar() * 0.8,
      inicio: 0.1 + azar() * (0.66 - DURACION_CAIDA - 0.1),
      giro: [azar() * 6, azar() * 6, azar() * 6],
      escala: [0.015 + azar() * 0.02, 0.008, 0.012 + azar() * 0.02],
      color: new THREE.Color(tonos[Math.floor(azar() * tonos.length)]),
    };
  });
}

function YerbaCayendo({ suaveRef, cantidad }) {
  const malla = useRef(null);
  const particulas = useMemo(() => crearParticulas(cantidad), [cantidad]);
  const auxiliar = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    particulas.forEach((p, i) => malla.current.setColorAt(i, p.color));
    malla.current.instanceColor.needsUpdate = true;
  }, [particulas]);

  useFrame(() => {
    const p = suaveRef.current;
    const destino = alturaYerba(valoresAnimacion(p).yerba);

    particulas.forEach((particula, i) => {
      const q = (p - particula.inicio) / DURACION_CAIDA;
      if (q <= 0 || q >= 1) {
        auxiliar.scale.setScalar(0);
      } else {
        auxiliar.position.set(
          particula.x,
          THREE.MathUtils.lerp(particula.inicioY, destino, q * q),
          particula.z,
        );
        auxiliar.rotation.set(
          particula.giro[0] * q,
          particula.giro[1] * q,
          particula.giro[2] * q,
        );
        auxiliar.scale.set(...particula.escala);
      }
      auxiliar.updateMatrix();
      malla.current.setMatrixAt(i, auxiliar.matrix);
    });
    malla.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={malla}
      args={[undefined, undefined, cantidad]}
      frustumCulled={false}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={1} />
    </instancedMesh>
  );
}

function Animacion({ progresoRef, lavadoRef, reducido, cantidadParticulas }) {
  const grupoMate = useRef(null);
  // Sin animaciones arranca ya en el estado final, sin esperar un frame.
  const suave = useRef(reducido ? 1 : 0);
  const animacion = useRef({
    ...valoresAnimacion(reducido ? 1 : 0),
    lavado: 0,
  });

  useFrame((estado, delta) => {
    const objetivo = reducido ? 1 : progresoRef.current;
    const anterior = suave.current;
    // Interpolación suave hacia el progreso real del scroll.
    let p = reducido
      ? 1
      : THREE.MathUtils.damp(anterior, objetivo, 3.5, Math.min(delta, 0.1));
    if (Math.abs(p - objetivo) < 0.0005) p = objetivo;
    suave.current = p;

    grupoMate.current.rotation.y = 0.3 + (p - 1) * Math.PI * 2;
    Object.assign(animacion.current, valoresAnimacion(p));

    // La yerba se lava de a poco y vuelve rápido al cambiarla.
    const lavadoAnterior = animacion.current.lavado;
    const lavadoObjetivo = lavadoRef.current;
    let lavado = reducido
      ? lavadoObjetivo
      : THREE.MathUtils.damp(
          lavadoAnterior,
          lavadoObjetivo,
          2.5,
          Math.min(delta, 0.1),
        );
    if (Math.abs(lavado - lavadoObjetivo) < 0.002) lavado = lavadoObjetivo;
    animacion.current.lavado = lavado;

    // Con frameloop="demand" pedimos otro frame mientras haya cambios.
    if (p !== anterior || lavado !== lavadoAnterior) estado.invalidate();
  });

  return (
    <group position={[0, ALTURA_PISO, 0]}>
      <group ref={grupoMate}>
        <Mate3D material="calabaza" animacionRef={animacion} />
      </group>
      <YerbaCayendo
        key={cantidadParticulas}
        suaveRef={suave}
        cantidad={cantidadParticulas}
      />
    </group>
  );
}

// Aleja la cámara en pantallas angostas para que el mate entre completo.
function CamaraAjustada() {
  const camara = useThree((estado) => estado.camera);
  const ancho = useThree((estado) => estado.size.width);
  const alto = useThree((estado) => estado.size.height);

  useEffect(() => {
    const aspecto = ancho / alto;
    // Distancia con aire entre la punta de la bombilla y el header.
    const distancia = Math.max(6.5, 5.6 / aspecto);
    // En vertical el texto va abajo, así que el mate sube un poco.
    const objetivoY = aspecto < 0.8 ? 0.55 : 0.85;
    // Cámara elevada para ver la yerba dentro del mate.
    camara.position.set(0, objetivoY + distancia * 0.5, distancia);
    camara.lookAt(0, objetivoY, 0);
    camara.updateProjectionMatrix();
  }, [camara, ancho, alto]);

  return null;
}

// Con frameloop="demand" nadie pide frames: avisa cuando cambia el lavado.
function SeguirLavado({ lavadoRef }) {
  const invalidate = useThree((estado) => estado.invalidate);
  useEffect(() => {
    let previo = lavadoRef.current;
    const id = setInterval(() => {
      if (lavadoRef.current !== previo) {
        previo = lavadoRef.current;
        invalidate();
      }
    }, 250);
    return () => clearInterval(id);
  }, [lavadoRef, invalidate]);
  return null;
}

// Se monta recién cuando todo lo que está en el Suspense terminó de cargar.
function AvisarListo({ alListo }) {
  useEffect(() => {
    alListo();
  }, [alListo]);
  return null;
}

export default function EscenaHero({
  progresoRef,
  reducido,
  activo,
  esMobile,
  alListo,
  lavadoRef,
}) {
  return (
    <Canvas
      dpr={esMobile ? [1, 1.5] : [1, 2]}
      frameloop={activo && !reducido ? "always" : "demand"}
      camera={{ fov: 32, near: 0.1, far: 50, position: [0, 4, 6.2] }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1;
      }}
    >
      <CamaraAjustada />
      <SeguirLavado lavadoRef={lavadoRef} />
      {/* HDRI de estudio local (Poly Haven, CC0): ilumina y se refleja en los metales */}
      <Suspense fallback={null}>
        <Environment files="/hdri/estudio.hdr" environmentIntensity={1.1} />
        <Animacion
          progresoRef={progresoRef}
          lavadoRef={lavadoRef}
          reducido={reducido}
          cantidadParticulas={esMobile ? 120 : 220}
        />
        {/* Dentro del Suspense: con frames=1 tiene que esperar al modelo */}
        <ContactShadows
          position={[0, ALTURA_PISO, 0]}
          opacity={0.45}
          scale={3.5}
          blur={2.8}
          far={2}
          resolution={512}
          color="#5e3620"
          frames={reducido ? 1 : Infinity}
        />
        <AvisarListo alListo={alListo} />
      </Suspense>
    </Canvas>
  );
}
