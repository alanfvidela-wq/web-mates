import { notFound } from "next/navigation";
import EstadoBadge from "@/components/EstadoBadge";
import PlaceholderZapatilla from "@/components/PlaceholderZapatilla";
import SelectorTalle from "@/components/SelectorTalle";
import CuentaRegresiva from "@/components/CuentaRegresiva";
import { getProductoPorSlug, getEstado } from "@/lib/productos";
import { formatearPrecio, formatearFecha } from "@/lib/formato";
import styles from "./page.module.css";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const producto = await getProductoPorSlug(slug);
  if (!producto) return { title: "Zapatilla no encontrada" };
  return {
    title: `${producto.marca} ${producto.nombre}`,
    description: producto.descripcion,
  };
}

export default async function PaginaZapatilla({ params }) {
  const { slug } = await params;
  const producto = await getProductoPorSlug(slug);
  if (!producto) notFound();

  const estado = getEstado(producto);

  return (
    <main className={styles.detalle}>
      <PlaceholderZapatilla
        color={producto.colorPrincipal}
        nombre={producto.nombre}
        grande
      />

      <div className={styles.info}>
        <EstadoBadge estado={estado} />
        <p className={styles.marca}>{producto.marca}</p>
        <h1 className={styles.nombre}>{producto.nombre}</h1>
        <p className={styles.precio}>{formatearPrecio(producto.precio)}</p>
        <p className={styles.descripcion}>{producto.descripcion}</p>

        {estado === "proximo" ? (
          <div className={styles.drop}>
            <p className={styles.dropTitulo}>
              Se lanza el {formatearFecha(producto.fechaLanzamiento)}
            </p>
            <CuentaRegresiva fecha={producto.fechaLanzamiento} />
            <div className={styles.tallesPrevios}>
              <SelectorTalle talles={producto.talles} soloLectura />
            </div>
          </div>
        ) : (
          <SelectorTalle
            talles={producto.talles}
            agotado={estado === "agotado"}
          />
        )}
      </div>
    </main>
  );
}
