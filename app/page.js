import Link from "next/link";
import GrillaProductos from "@/components/GrillaProductos";
import { CATEGORIAS, getProductos } from "@/lib/productos";
import styles from "./page.module.css";

export default async function Home() {
  const productos = await getProductos();
  const destacados = productos.filter((p) => p.destacado);

  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroTexto}>
          <p className={styles.kicker}>Mates · Bombillas · Termos · Yerbas</p>
          <h1 className={styles.titulo}>
            Cebá a tu <em>manera</em>.
          </h1>
          <p className={styles.bajada}>
            Elegí mate, bombilla, termo y yerba, y llevate todo junto con
            descuento. Hecho para la ronda de todos los días.
          </p>
          <div className={styles.acciones}>
            <Link href="/combo" className="boton">
              Armá tu combo
            </Link>
            <Link href="#categorias" className="boton boton-secundario">
              Ver categorías
            </Link>
          </div>
        </div>
        <div className={styles.heroDecoracion} aria-hidden="true">
          <span className={styles.circulo} />
          <span className={styles.hoja} />
        </div>
      </section>

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
    </main>
  );
}
