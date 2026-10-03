import Link from "next/link";
import PlaceholderProducto from "./PlaceholderProducto";
import { formatearPrecio } from "@/lib/formato";
import { tieneStock, tienePreciosDistintos } from "@/lib/productos";
import styles from "./TarjetaProducto.module.css";

export default function TarjetaProducto({ producto }) {
  const disponible = tieneStock(producto);

  return (
    <Link href={`/producto/${producto.slug}`} className={styles.tarjeta}>
      <div className={styles.imagen}>
        <PlaceholderProducto
          color={producto.colorPlaceholder}
          nombre={producto.nombre}
        />
        {!disponible && <span className={styles.sinStock}>Sin stock</span>}
      </div>
      <div className={styles.info}>
        <p className={styles.marca}>{producto.marca}</p>
        <h3 className={styles.nombre}>{producto.nombre}</h3>
        <p className={styles.precio}>
          {tienePreciosDistintos(producto) && (
            <span className={styles.desde}>Desde </span>
          )}
          {formatearPrecio(producto.precioBase)}
        </p>
      </div>
    </Link>
  );
}
