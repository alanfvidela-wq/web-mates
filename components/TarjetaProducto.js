import Link from "next/link";
import EstadoBadge from "./EstadoBadge";
import PlaceholderZapatilla from "./PlaceholderZapatilla";
import { formatearPrecio } from "@/lib/formato";
import styles from "./TarjetaProducto.module.css";

export default function TarjetaProducto({ producto, estado }) {
  return (
    <Link href={`/zapatillas/${producto.slug}`} className={styles.tarjeta}>
      <div className={styles.imagen}>
        <PlaceholderZapatilla
          color={producto.colorPrincipal}
          nombre={producto.nombre}
        />
        <div className={styles.badge}>
          <EstadoBadge estado={estado} />
        </div>
      </div>
      <div className={styles.info}>
        <p className={styles.marca}>{producto.marca}</p>
        <h3 className={styles.nombre}>{producto.nombre}</h3>
        <p className={styles.precio}>{formatearPrecio(producto.precio)}</p>
      </div>
    </Link>
  );
}
