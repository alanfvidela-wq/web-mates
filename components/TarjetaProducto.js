import Link from "next/link";
import FotoProducto from "./FotoProducto";
import { formatearPrecio } from "@/lib/formato";
import { tieneStock, tienePreciosDistintos } from "@/lib/productos";
import styles from "./TarjetaProducto.module.css";

// Producto: foto sobre un fondo suave del color de su categoría y, debajo,
// nombre, marca y precio. Sin recuadro.
export default function TarjetaProducto({ producto }) {
  const disponible = tieneStock(producto);

  return (
    <Link
      href={`/producto/${producto.slug}`}
      className={styles.producto}
      data-categoria={producto.categoria}
    >
      <div className={styles.fondo}>
        <div className={styles.foto}>
          <FotoProducto
            src={producto.imagen}
            sizes="(max-width: 640px) 45vw, (max-width: 1000px) 30vw, 260px"
          />
        </div>
        {!disponible && <span className={styles.sinStock}>Sin stock</span>}
      </div>
      <h3 className={styles.nombre}>{producto.nombre}</h3>
      <p className={`dato ${styles.marca}`}>{producto.marca}</p>
      <p className={styles.precio}>
        {tienePreciosDistintos(producto) && "desde "}
        {formatearPrecio(producto.precioBase)}
      </p>
    </Link>
  );
}
