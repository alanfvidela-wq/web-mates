import Link from "next/link";
import { notFound } from "next/navigation";
import GrillaProductos from "@/components/GrillaProductos";
import { IlustracionProducto } from "@/components/Ilustraciones";
import { SELLOS } from "@/lib/fichas";
import { getCategoria, getProductosPorCategoria } from "@/lib/productos";
import styles from "./page.module.css";

export async function generateMetadata({ params }) {
  const { categoria: slug } = await params;
  const categoria = getCategoria(slug);
  if (!categoria) return { title: "Categoría no encontrada" };
  return { title: categoria.nombre, description: categoria.descripcion };
}

export default async function PaginaCategoria({ params }) {
  const { categoria: slug } = await params;
  const categoria = getCategoria(slug);
  if (!categoria) notFound();

  const productos = await getProductosPorCategoria(slug);

  return (
    <main className={styles.pagina} data-categoria={slug}>
      <header className={styles.encabezado}>
        <div className={styles.encabezadoContenido}>
          <nav className="migas" aria-label="Ubicación">
            <Link href="/">Inicio</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{categoria.nombre}</span>
          </nav>
          <h1 className={styles.titulo}>{categoria.nombre}</h1>
          <p className={styles.descripcion}>{categoria.descripcion}</p>
          <p className={styles.sello}>{SELLOS[slug]}</p>
        </div>
        <IlustracionProducto categoria={slug} className={styles.dibujo} />
      </header>

      <div className={styles.contenido}>
        <p className={`dato ${styles.cuenta}`}>
          {productos.length} en la góndola
        </p>
        <GrillaProductos productos={productos} />
      </div>
    </main>
  );
}
