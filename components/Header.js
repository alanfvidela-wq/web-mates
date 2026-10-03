import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.contenido}>
        <Link href="/" className={styles.logo}>
          BOLDY
        </Link>

        <nav className={styles.nav} aria-label="Principal">
          <Link href="/#drops">Drops</Link>
          <Link href="/#catalogo">Catálogo</Link>
        </nav>

        <Link href="/carrito" className={styles.carrito} aria-label="Carrito">
          <svg
            width="24"
            height="24"
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
