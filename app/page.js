import Link from "next/link";
import HeroMate from "@/components/hero3d/HeroMate";
import GrillaProductos from "@/components/GrillaProductos";
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
  const destacados = productos.filter((p) => p.destacado);

  return (
    <main className={styles.home}>
      <HeroMate />

      <ul className={styles.franja} aria-label="Leyendas de la casa">
        {LEYENDAS.map((leyenda, i) => (
          <li key={leyenda}>
            {i > 0 && <Hojita className={styles.hojita} />}
            {leyenda}
          </li>
        ))}
      </ul>

      <div className={styles.contenido}>
        <section
          id="categorias"
          className={styles.seccion}
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

        <section className={styles.seccion} aria-labelledby="titulo-destacados">
          <h2 id="titulo-destacados" className={styles.subtitulo}>
            Lo que más sale
          </h2>
          <GrillaProductos productos={destacados} />
        </section>
      </div>
    </main>
  );
}
