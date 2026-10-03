import TarjetaProducto from "@/components/TarjetaProducto";
import { getProductos, getEstado } from "@/lib/productos";
import styles from "./page.module.css";

export default async function Home() {
  const productos = await getProductos();
  const conEstado = productos.map((producto) => ({
    producto,
    estado: getEstado(producto),
  }));
  const proximos = conEstado.filter(({ estado }) => estado === "proximo");

  return (
    <main>
      <section className={styles.hero}>
        <p className={styles.kicker}>Drops limitados · Multimarca</p>
        <h1 className={styles.titulo}>
          Pisá <span className={styles.acento}>fuerte</span>.
        </h1>
        <p className={styles.bajada}>
          Los modelos más buscados de las grandes marcas y nuestra línea propia
          Boldy. Stock limitado, sin reposición.
        </p>
      </section>

      {proximos.length > 0 && (
        <section id="drops" className={styles.seccion}>
          <h2 className={styles.subtitulo}>Próximos drops</h2>
          <div className={styles.grilla}>
            {proximos.map(({ producto, estado }) => (
              <TarjetaProducto
                key={producto.id}
                producto={producto}
                estado={estado}
              />
            ))}
          </div>
        </section>
      )}

      <section id="catalogo" className={styles.seccion}>
        <h2 className={styles.subtitulo}>Catálogo</h2>
        <div className={styles.grilla}>
          {conEstado.map(({ producto, estado }) => (
            <TarjetaProducto
              key={producto.id}
              producto={producto}
              estado={estado}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
