import Link from "next/link";
import { CATEGORIAS } from "@/lib/productos";
import Logo from "./Logo";
import { BolsaAlmacen } from "./Ilustraciones";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.contenido}>
        <Logo />

        <nav className={styles.nav} aria-label="Categorías">
          {CATEGORIAS.map((categoria) => (
            <Link key={categoria.slug} href={`/categoria/${categoria.slug}`}>
              {categoria.nombre}
            </Link>
          ))}
        </nav>

        <Link href="/carrito" className={styles.carrito} aria-label="Carrito">
          <BolsaAlmacen className={styles.bolsa} />
        </Link>
      </div>
      <div className={styles.franjas} aria-hidden="true" />
    </header>
  );
}
