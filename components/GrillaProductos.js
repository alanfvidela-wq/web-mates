import TarjetaProducto from "./TarjetaProducto";
import styles from "./GrillaProductos.module.css";

export default function GrillaProductos({ productos }) {
  return (
    <div className={styles.grilla}>
      {productos.map((producto) => (
        <TarjetaProducto key={producto.id} producto={producto} />
      ))}
    </div>
  );
}
