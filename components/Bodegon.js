import { Mate, PaqueteYerba, Termo } from "./Ilustraciones";
import styles from "./Bodegon.module.css";

// Bodegón dibujado: termo, paquete y mate apoyados en la misma línea.
// Es el combo completo, por eso ilustra «Armá tu combo».
export default function Bodegon({ className = "" }) {
  return (
    <div className={`${styles.bodegon} ${className}`} aria-hidden="true">
      <Termo className={styles.termo} color="#1f5135" />
      <PaqueteYerba className={styles.paquete} color="#e9ae1b" />
      <Mate className={styles.mate} color="#8a3b1e" />
    </div>
  );
}
