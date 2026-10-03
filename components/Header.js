import Link from "next/link";
import { CATEGORIAS } from "@/lib/productos";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.contenido}>
        <Link href="/" className={styles.logo}>
          La Montañita
        </Link>

        <nav className={styles.nav} aria-label="Categorías">
          {CATEGORIAS.map((categoria) => (
            <Link key={categoria.slug} href={`/categoria/${categoria.slug}`}>
              {categoria.nombre}
            </Link>
          ))}
        </nav>

        <Link href="/carrito" className={styles.carrito} aria-label="Carrito">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 7h12l-1 13H7L6 7Z" />
            <path d="M9 7V5a3 3 0 0 1 6 0v2" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
