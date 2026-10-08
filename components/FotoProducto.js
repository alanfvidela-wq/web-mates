import Image from "next/image";
import styles from "./FotoProducto.module.css";

// Foto de producto sin fondo (public/productos, npm run fotos:productos).
// Llena su contenedor, que tiene que ser cuadrado y con position: relative.
export default function FotoProducto({
  src,
  alt = "",
  sizes,
  prioridad = false,
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      fetchPriority={prioridad ? "high" : undefined}
      loading={prioridad ? "eager" : undefined}
      className={styles.foto}
    />
  );
}
