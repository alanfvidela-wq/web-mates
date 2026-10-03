import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.contenido}>
        <p className={styles.logo}>BOLDY</p>
        <p className={styles.texto}>
          Zapatillas multimarca, drops limitados y nuestra línea propia.
        </p>
        <p className={styles.texto}>
          Proyecto académico — Programación Web, ITBA. Precios ficticios.
        </p>
      </div>
    </footer>
  );
}
