import Link from "next/link";
import { notFound } from "next/navigation";
import GrillaProductos from "@/components/GrillaProductos";
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
    <main>
      <nav className={styles.migas} aria-label="Ubicación">
        <Link href="/">Inicio</Link> / <span>{categoria.nombre}</span>
      </nav>
      <header className={styles.encabezado}>
        <h1 className={styles.titulo}>{categoria.nombre}</h1>
        <p className={styles.descripcion}>{categoria.descripcion}</p>
      </header>
      <GrillaProductos productos={productos} />
    </main>
  );
}
