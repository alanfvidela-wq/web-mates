import styles from "./PlaceholderZapatilla.module.css";

// Placeholder de color hasta tener fotos reales.
export default function PlaceholderZapatilla({ color, nombre, grande = false }) {
  return (
    <div
      className={`${styles.placeholder} ${grande ? styles.grande : ""}`}
      style={{ "--color-producto": color }}
      role="img"
      aria-label={`Imagen de ${nombre}`}
    >
      <span className={styles.nombre} aria-hidden="true">
        {nombre}
      </span>
    </div>
  );
}
