"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "./estados.module.css";

export default function Error({ error, retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={styles.estado}>
      <p className={styles.codigo}>Ups</p>
      <h1 className={styles.titulo}>Algo salió mal</h1>
      <p className={styles.texto}>
        No pudimos cargar esta página. Probá de nuevo en unos segundos.
      </p>
      <div className={styles.acciones}>
        <button type="button" className="boton" onClick={() => retry()}>
          Reintentar
        </button>
        <Link href="/" className="boton boton-secundario">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
