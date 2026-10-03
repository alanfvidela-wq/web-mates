import Link from "next/link";
import { CATEGORIAS } from "@/lib/productos";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.contenido}>
        <div className={styles.marca}>
          <p className={styles.logo}>La Montañita</p>
          <p className={styles.texto}>
            Todo para el mate: de la calabaza a la última ronda.
          </p>
        </div>

        <nav aria-label="Categorías del pie">
          <ul className={styles.lista}>
            {CATEGORIAS.map((categoria) => (
              <li key={categoria.slug}>
                <Link href={`/categoria/${categoria.slug}`}>
                  {categoria.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className={styles.legal}>
          Proyecto académico — Programación Web, ITBA. Precios ficticios.
        </p>
      </div>
    </footer>
  );
}
