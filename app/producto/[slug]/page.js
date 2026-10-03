import Link from "next/link";
import { notFound } from "next/navigation";
import PlaceholderProducto from "@/components/PlaceholderProducto";
import SelectorVariante from "@/components/SelectorVariante";
import { getCategoria, getProductoPorSlug } from "@/lib/productos";
import styles from "./page.module.css";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const producto = await getProductoPorSlug(slug);
  if (!producto) return { title: "Producto no encontrado" };
  return {
    title: `${producto.nombre} ${producto.marca}`,
    description: producto.descripcion,
  };
}

export default async function PaginaProducto({ params }) {
  const { slug } = await params;
  const producto = await getProductoPorSlug(slug);
  if (!producto) notFound();

  const categoria = getCategoria(producto.categoria);

  return (
    <main>
      <nav className={styles.migas} aria-label="Ubicación">
        <Link href="/">Inicio</Link> /{" "}
        <Link href={`/categoria/${categoria.slug}`}>{categoria.nombre}</Link> /{" "}
        <span>{producto.nombre}</span>
      </nav>

      <div className={styles.detalle}>
        <PlaceholderProducto
          color={producto.colorPlaceholder}
          nombre={producto.nombre}
          grande
        />

        <div className={styles.info}>
          <p className={styles.marca}>{producto.marca}</p>
          <h1 className={styles.nombre}>{producto.nombre}</h1>
          <p className={styles.descripcion}>{producto.descripcion}</p>
          <SelectorVariante variantes={producto.variantes} />
        </div>
      </div>
    </main>
  );
}
