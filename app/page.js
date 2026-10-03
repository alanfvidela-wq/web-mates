import Link from "next/link";
import Portada from "@/components/Portada";
import RitualMate from "@/components/ritual/RitualMate";
import TarjetaProducto from "@/components/TarjetaProducto";
import { Hojita, IlustracionProducto } from "@/components/Ilustraciones";
import { CATEGORIAS, getProductos } from "@/lib/productos";
import styles from "./page.module.css";

const LEYENDAS = [
  "Elaborada con palo",
  "Estacionada sin apuro",
  "Para la ronda larga",
  "Cebada con paciencia",
];

export default async function Home() {
  const productos = await getProductos();
  const gondolas = CATEGORIAS.map((categoria) => ({
    categoria,
    destacados: productos.filter(
      (p) => p.destacado && p.categoria === categoria.slug,
    ),
  })).filter(({ destacados }) => destacados.length > 0);

  return (
    <main className={styles.home}>
      <Portada />

      <ul className={styles.franja} aria-label="Leyendas de la casa">
        {LEYENDAS.map((leyenda, i) => (
          <li key={leyenda}>
            {i > 0 && <Hojita className={styles.hojita} />}
            {leyenda}
          </li>
        ))}
      </ul>

      <section
        className={`${styles.contenido} ${styles.seccion}`}
        aria-labelledby="titulo-destacados"
      >
        <h2 id="titulo-destacados" className={styles.subtitulo}>
          Lo que más sale, góndola por góndola
        </h2>
        <div className={styles.gondolas}>
          {gondolas.map(({ categoria, destacados }) => (
            <section
              key={categoria.slug}
              className={styles.gondola}
              data-categoria={categoria.slug}
              style={{ "--cantidad": destacados.length }}
              aria-labelledby={`gondola-${categoria.slug}`}
            >
              <header className={styles.cartel}>
                <h3 id={`gondola-${categoria.slug}`}>{categoria.nombre}</h3>
                <Link href={`/categoria/${categoria.slug}`}>
                  Ver toda la góndola
                </Link>
              </header>
              <div className={styles.productos}>
                {destacados.map((producto) => (
                  <TarjetaProducto
                    key={producto.id}
                    producto={producto}
                    Titulo="h4"
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <RitualMate />

      <section
        id="categorias"
        className={`${styles.contenido} ${styles.seccion}`}
        aria-labelledby="titulo-categorias"
      >
        <h2 id="titulo-categorias" className={styles.subtitulo}>
          Qué hay en el almacén
        </h2>
        <ul className={styles.categorias}>
          {CATEGORIAS.map((categoria) => {
            const cantidad = productos.filter(
              (p) => p.categoria === categoria.slug,
            ).length;
            return (
              <li key={categoria.slug} data-categoria={categoria.slug}>
                <Link
                  href={`/categoria/${categoria.slug}`}
                  className={styles.categoria}
                >
                  <span className={styles.categoriaNombre}>
                    {categoria.nombre}
                  </span>
                  <span className={styles.categoriaDescripcion}>
                    {categoria.descripcion}
                  </span>
                  <span className={styles.categoriaCantidad}>
                    {cantidad} productos
                  </span>
                  <IlustracionProducto
                    categoria={categoria.slug}
                    className={styles.categoriaDibujo}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
