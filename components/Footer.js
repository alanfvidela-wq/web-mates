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
          <br />
          Modelo 3D{" "}
          <a href="https://sketchfab.com/3d-models/mate-uruguayo-e2fd6553b7b144f8afe2dc51929f95a3">
            «Mate Uruguayo.»
          </a>{" "}
          de Ermolli, licencia{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>
          . HDRI de Poly Haven (CC0).
        </p>
      </div>
    </footer>
  );
}
