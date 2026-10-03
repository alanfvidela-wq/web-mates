import styles from "./estados.module.css";

export default function Loading() {
  return (
    <main aria-busy="true" aria-label="Cargando">
      <div className={styles.skeletonTitulo} />
      <div className={styles.skeletonGrilla}>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className={styles.skeletonTarjeta} />
        ))}
      </div>
    </main>
  );
}
