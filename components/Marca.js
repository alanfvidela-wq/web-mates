import styles from "./Marca.module.css";

// Wordmark «La Montañita»: la tilde de la ñ es una montañita de yerba.
// El texto real queda para lectores de pantalla y buscadores.
export default function Marca({ className = "" }) {
  return (
    <span className={`${styles.marca} ${className}`}>
      <span className={styles.oculto}>La Montañita</span>
      <span aria-hidden="true">
        La{" "}
        <span className={styles.palabra}>
          Monta
          <span className={styles.enie}>
            n
            <svg
              className={styles.montanita}
              viewBox="0 0 48 22"
              focusable="false"
            >
              <path d="M2 21C7 20 10 13 15 8c4-4 7-6 11-5 5 1 7 6 11 10 3 3 6 6 9 8Z" />
              <path
                className={styles.palito}
                d="M14 15l5-4M24 9l4 2M31 15l4-3"
              />
            </svg>
          </span>
          ita
        </span>
      </span>
    </span>
  );
}
