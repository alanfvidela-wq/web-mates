import Link from "next/link";
import styles from "./estados.module.css";

export const metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <main className={styles.estado}>
      <p className={styles.codigo}>404</p>
      <h1 className={styles.titulo}>Acá no hay nada</h1>
      <p className={styles.texto}>
        La página o zapatilla que buscás no existe o ya no está disponible.
      </p>
      <div className={styles.acciones}>
        <Link href="/" className="boton">
          Ver catálogo
        </Link>
      </div>
    </main>
  );
}
