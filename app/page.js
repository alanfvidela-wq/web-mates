import Link from "next/link";
import Hero from "@/components/Hero";
import RitualMate from "@/components/ritual/RitualMate";
import TarjetaProducto from "@/components/TarjetaProducto";
import FotoProducto from "@/components/FotoProducto";
import { Hojita } from "@/components/Ilustraciones";
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
  const destacados = productos.filter((p) => p.destacado);

  return (
    <main className={styles.home}>
      <Hero />

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
          Lo que más sale
        </h2>
        <div className={styles.estante}>
          {destacados.map((producto) => (
            <TarjetaProducto key={producto.id} producto={producto} />
          ))}
        </div>
      </section>

      <RitualMate />

      <section
        id="categorias"
        className={styles.fondoPapel}
        aria-labelledby="titulo-categorias"
      >
        <div className={`${styles.contenido} ${styles.seccion}`}>
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
                    <span className={`dato ${styles.categoriaCantidad}`}>
                      {cantidad} productos
                    </span>
                    <span className={styles.categoriaDibujo}>
                      <FotoProducto src={categoria.imagen} sizes="140px" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </main>
  );
}
