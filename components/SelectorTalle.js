"use client";

import { useState } from "react";
import styles from "./SelectorTalle.module.css";

export default function SelectorTalle({
  talles,
  agotado = false,
  soloLectura = false,
}) {
  const [seleccionado, setSeleccionado] = useState(null);

  return (
    <div className={styles.selector}>
      <fieldset className={styles.fieldset} disabled={soloLectura || agotado}>
        <legend className={styles.legend}>
          {soloLectura ? "Talles del drop" : "Elegí tu talle"}
        </legend>
        <div className={styles.grilla}>
          {talles.map(({ talle, stock }) => {
            const sinStock = stock === 0;
            const activo = seleccionado === talle;
            return (
              <button
                key={talle}
                type="button"
                className={`${styles.talle} ${activo ? styles.activo : ""}`}
                disabled={sinStock}
                aria-pressed={activo}
                aria-label={`Talle ${talle}${sinStock ? ", sin stock" : ""}`}
                onClick={() => setSeleccionado(talle)}
              >
                {talle}
              </button>
            );
          })}
        </div>
      </fieldset>

      {!soloLectura && (
        <>
          <button
            type="button"
            className={`boton ${styles.comprar}`}
            disabled={agotado || seleccionado === null}
          >
            {agotado
              ? "Agotado"
              : seleccionado === null
                ? "Elegí un talle"
                : `Agregar talle ${seleccionado} al carrito`}
          </button>
          {seleccionado !== null && (
            <p className={styles.nota}>El carrito llega pronto.</p>
          )}
        </>
      )}
    </div>
  );
}
