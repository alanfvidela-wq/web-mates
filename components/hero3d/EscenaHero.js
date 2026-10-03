"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import Mate3D from "@/components/mate3d/Mate3D";
import { aleatorio, alturaYerba } from "@/components/mate3d/geometria";

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

function Animacion({ progresoRef, reducido, cantidadParticulas }) {
  const grupoMate = useRef(null);
  const suave = useRef(0);
  const animacion = useRef(valoresAnimacion(0));

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

    // Con frameloop="demand" pedimos otro frame mientras haya cambios.
    if (p !== anterior) estado.invalidate();
  });

  return (
    <group position={[0, ALTURA_PISO, 0]}>
      <group ref={grupoMate}>
        <Mate3D
          material="calabaza"
          color="#5e3620"
          grabado="La Montañita"
          animacionRef={animacion}
        />
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
    const distancia = Math.max(6.2, 4.6 / aspecto);
    // En vertical el texto va abajo, así que el mate sube un poco.
    const objetivoY = aspecto < 0.8 ? -0.6 : 0.1;
    // Cámara elevada para ver la yerba dentro del mate.
    camara.position.set(0, objetivoY + distancia * 0.62, distancia);
    camara.lookAt(0, objetivoY, 0);
    camara.updateProjectionMatrix();
  }, [camara, ancho, alto]);

  return null;
}

export default function EscenaHero({ progresoRef, reducido, activo, esMobile }) {
  return (
    <Canvas
      dpr={esMobile ? [1, 1.5] : [1, 2]}
      frameloop={activo && !reducido ? "always" : "demand"}
      camera={{ fov: 32, near: 0.1, far: 50, position: [0, 4, 6.2] }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <CamaraAjustada />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} color="#fff1dc" />
      <directionalLight position={[-4, 2, -2]} intensity={0.5} color="#dbe6c4" />
      <Environment resolution={128} frames={1}>
        {/* Fondo crema para que los metales reflejen la marca y no negro */}
        <color attach="background" args={["#efe3c8"]} />
        <Lightformer
          form="rect"
          intensity={2}
          position={[0, 3, 3]}
          scale={[5, 1.5, 1]}
          color="#fff4e0"
        />
        <Lightformer
          form="rect"
          intensity={1}
          position={[-3, 1, -1]}
          scale={[3, 2, 1]}
          color="#dbe6c4"
        />
        <Lightformer
          form="ring"
          intensity={1.5}
          position={[3, 2, 2]}
          scale={1.5}
          color="#ffffff"
        />
      </Environment>

      <Animacion
        progresoRef={progresoRef}
        reducido={reducido}
        cantidadParticulas={esMobile ? 120 : 220}
      />

      <ContactShadows
        position={[0, ALTURA_PISO, 0]}
        opacity={0.4}
        scale={3.5}
        blur={2.4}
        far={1.6}
        resolution={512}
        color="#5e3620"
        frames={reducido ? 1 : Infinity}
      />
    </Canvas>
  );
}
