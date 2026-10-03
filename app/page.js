import Link from "next/link";
import HeroMate from "@/components/hero3d/HeroMate";
import GrillaProductos from "@/components/GrillaProductos";
import { CATEGORIAS, getProductos } from "@/lib/productos";
import styles from "./page.module.css";

export default async function Home() {
  const productos = await getProductos();
  const destacados = productos.filter((p) => p.destacado);

  return (
    <main className={styles.home}>
      <HeroMate />

      <div className={styles.contenido}>
        <section id="categorias" className={styles.seccion}>
          <h2 className={styles.subtitulo}>Categorías</h2>
          <ul className={styles.categorias}>
            {CATEGORIAS.map((categoria) => (
              <li key={categoria.slug}>
                <Link
                  href={`/categoria/${categoria.slug}`}
                  className={`${styles.categoria} ${styles[categoria.slug]}`}
                >
                  <span className={styles.categoriaNombre}>
                    {categoria.nombre}
                  </span>
                  <span className={styles.categoriaCantidad}>
                    {productos.filter((p) => p.categoria === categoria.slug).length}{" "}
                    productos →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
  
        <section className={styles.seccion}>
          <h2 className={styles.subtitulo}>Destacados</h2>
          <GrillaProductos productos={destacados} />
        </section>
        </div>
      </main>
    );
  }
