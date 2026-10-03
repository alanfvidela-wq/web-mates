import styles from "./EstadoBadge.module.css";

const ETIQUETAS = {
  disponible: "Disponible",
  proximo: "Próximo drop",
  agotado: "Agotado",
};

export default function EstadoBadge({ estado }) {
  return (
    <span className={`${styles.badge} ${styles[estado]}`}>
      {ETIQUETAS[estado]}
    </span>
  );
}
