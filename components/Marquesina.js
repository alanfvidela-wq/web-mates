import { Hojita } from "./Ilustraciones";
import styles from "./Marquesina.module.css";

// Cinta verde con las leyendas de la casa, que corre sola de derecha a
// izquierda. Van dos copias seguidas para que el loop no tenga corte; la
// segunda es solo decorativa.
export default function Marquesina({ items }) {
  const cinta = (oculta) => (
    <ul className={styles.cinta} aria-hidden={oculta || undefined}>
      {items.map((item) => (
        <li key={item}>
          {item}
          <Hojita className={styles.hojita} />
        </li>
      ))}
    </ul>
  );

  return (
    <div className={styles.marquesina} role="region" aria-label="Leyendas de la casa">
      {cinta(false)}
      {cinta(true)}
    </div>
  );
}
