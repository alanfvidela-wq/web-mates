"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./CuentaRegresiva.module.css";

function calcularRestante(objetivo) {
  const ms = Math.max(0, objetivo - Date.now());
  return {
    total: ms,
    dias: Math.floor(ms / 86_400_000),
    horas: Math.floor(ms / 3_600_000) % 24,
    minutos: Math.floor(ms / 60_000) % 60,
    segundos: Math.floor(ms / 1000) % 60,
  };
}

const UNIDADES = [
  ["dias", "Días"],
  ["horas", "Hs"],
  ["minutos", "Min"],
  ["segundos", "Seg"],
];

export default function CuentaRegresiva({ fecha }) {
  const router = useRouter();
  // Arranca en null para que el HTML del servidor y del cliente coincidan.
  const [restante, setRestante] = useState(null);

  useEffect(() => {
    const objetivo = new Date(fecha).getTime();
    const actualizar = () => {
      const nuevo = calcularRestante(objetivo);
      setRestante(nuevo);
      if (nuevo.total === 0) {
        clearInterval(intervalo);
        // El servidor decide si el drop ya está habilitado.
        router.refresh();
      }
    };
    const intervalo = setInterval(actualizar, 1000);
    actualizar();
    return () => clearInterval(intervalo);
  }, [fecha, router]);

  return (
    <div className={styles.cuenta} role="timer" aria-live="off">
      {UNIDADES.map(([clave, etiqueta]) => (
        <div key={clave} className={styles.unidad}>
          <span className={styles.numero}>
            {restante ? String(restante[clave]).padStart(2, "0") : "--"}
          </span>
          <span className={styles.etiqueta}>{etiqueta}</span>
        </div>
      ))}
    </div>
  );
}
