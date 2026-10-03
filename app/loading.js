import { Pava } from "@/components/Ilustraciones";
import styles from "./estados.module.css";

export default function Loading() {
  return (
    <main className={styles.carga} aria-busy="true">
      <Pava className={styles.pava} />
      <p className={styles.cargaTexto} role="status">
        Calentando el agua…
      </p>
      <div className={styles.gondola} aria-hidden="true">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className={styles.hueco} />
        ))}
      </div>
    </main>
  );
}
