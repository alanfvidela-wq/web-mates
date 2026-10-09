import Link from "next/link";
import { CATEGORIAS } from "@/lib/productos";
import { Cimarron } from "./Ilustraciones";
import Logo from "./Logo";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={`ola ${styles.footer}`}>
      <div className={styles.contenido}>
        {/* El Cimarrón se asoma por encima del logo gigante */}
        <div className={styles.firma}>
          <Cimarron className={styles.cimarron} />
          <Logo className={styles.logo} />
        </div>
        <p className={styles.frase}>
          Elaborada con palo, cebada con paciencia.
        </p>

        <nav aria-label="Categorías del pie">
          <ul className={styles.lista}>
            {CATEGORIAS.map((categoria) => (
              <li key={categoria.slug}>
                <Link href={`/categoria/${categoria.slug}`}>
                  {categoria.nombre}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/arma-tu-combo">Armá tu combo</Link>
            </li>
          </ul>
        </nav>

        <p className={styles.legal}>
          Proyecto académico — Programación Web, ITBA. Precios ficticios.
          <br />
          Fotos de la home generadas con Higgsfield (Nano Banana Pro) y video
          de la portada con Kling en Artlist. Fotos de producto de las marcas y
          tiendas de origen (ver /productos/CREDITOS.md).
        </p>
      </div>
    </footer>
  );
}
