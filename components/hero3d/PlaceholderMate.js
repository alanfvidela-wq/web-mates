import { Mate } from "@/components/Ilustraciones";
import styles from "./PlaceholderMate.module.css";

// Se muestra mientras carga la escena 3D (o si WebGL no está disponible).
export default function PlaceholderMate({ texto = "Cebando el mate…" }) {
  return (
    <div className={styles.placeholder}>
      <Mate className={styles.mate} />
      {texto && <p className={styles.texto}>{texto}</p>}
    </div>
  );
}
