import Link from "next/link";
import { IlustracionProducto } from "./Ilustraciones";
import { formatearPrecio } from "@/lib/formato";
import { tieneStock, tienePreciosDistintos } from "@/lib/productos";
import styles from "./TarjetaProducto.module.css";

// Producto apoyado en la góndola: dibujo sobre el estante y etiqueta de precio.
export default function TarjetaProducto({ producto }) {
  const disponible = tieneStock(producto);

  return (
    <Link href={`/producto/${producto.slug}`} className={styles.producto}>
      <div className={styles.estante}>
        <IlustracionProducto
          categoria={producto.categoria}
          color={producto.colorPlaceholder}
          className={styles.dibujo}
        />
        {!disponible && <span className={styles.sinStock}>Sin stock</span>}
      </div>
      <p className={styles.precio}>
        {tienePreciosDistintos(producto) && "desde "}
        {formatearPrecio(producto.precioBase)}
      </p>
      <h3 className={styles.nombre}>{producto.nombre}</h3>
      <p className={styles.marca}>{producto.marca}</p>
    </Link>
  );
}
