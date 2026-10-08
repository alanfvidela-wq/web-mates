import Link from "next/link";
import { IlustracionProducto } from "./Ilustraciones";
import { formatearPrecio } from "@/lib/formato";
import { tieneStock, tienePreciosDistintos } from "@/lib/productos";
import styles from "./TarjetaProducto.module.css";

// Producto: dibujo sobre un fondo suave del color de su categoría y, debajo,
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
        <IlustracionProducto
          categoria={producto.categoria}
          color={producto.colorPlaceholder}
          className={styles.dibujo}
        />
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
