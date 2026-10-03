import styles from "./PlaceholderMate.module.css";

// Se muestra mientras carga la escena 3D (o si WebGL no está disponible).
export default function PlaceholderMate({ texto = "Cebando el mate…" }) {
  return (
    <div className={styles.placeholder}>
      <div className={styles.mate} aria-hidden="true">
        <span className={styles.yerba} />
      </div>
      <p className={styles.texto}>{texto}</p>
    </div>
  );
}
