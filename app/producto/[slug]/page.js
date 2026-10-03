import Link from "next/link";
import { notFound } from "next/navigation";
import { IlustracionProducto } from "@/components/Ilustraciones";
import SelectorVariante from "@/components/SelectorVariante";
import { getFicha, SELLOS } from "@/lib/fichas";
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
  const ficha = [["Marca", producto.marca], ...getFicha(producto.slug)];

  return (
    <main data-categoria={categoria.slug}>
      <nav className="migas" aria-label="Ubicación">
        <Link href="/">Inicio</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/categoria/${categoria.slug}`}>{categoria.nombre}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{producto.nombre}</span>
      </nav>

      <div className={styles.detalle}>
        <div className={styles.frente}>
          <IlustracionProducto
            categoria={producto.categoria}
            color={producto.colorPlaceholder}
            titulo={`Dibujo de ${producto.nombre}`}
            className={styles.dibujo}
          />
          <p className={styles.sello}>{SELLOS[categoria.slug]}</p>
        </div>

        <div className={styles.info}>
          <p className={styles.marca}>{producto.marca}</p>
          <h1 className={styles.nombre}>{producto.nombre}</h1>
          <p className={styles.descripcion}>{producto.descripcion}</p>

          <section className={styles.etiqueta} aria-labelledby="titulo-ficha">
            <h2 id="titulo-ficha" className={styles.etiquetaTitulo}>
              Datos del paquete
            </h2>
            <dl className={styles.ficha}>
              {ficha.map(([dato, valor]) => (
                <div key={dato} className={styles.fila}>
                  <dt>{dato}</dt>
                  <dd>{valor}</dd>
                </div>
              ))}
            </dl>
          </section>

          <SelectorVariante variantes={producto.variantes} />
        </div>
      </div>
    </main>
  );
}
