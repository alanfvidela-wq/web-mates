import Link from "next/link";
import { Voluta } from "./Ilustraciones";
import styles from "./Logo.module.css";

// Sello ovalado con volutas de fileteado a los costados.
export default function Logo({ className = "" }) {
  return (
    <Link href="/" className={`${styles.logo} ${className}`}>
      <Voluta className={styles.voluta} />
      <span className={styles.sello}>La Montañita</span>
      <Voluta className={styles.voluta} espejada />
    </Link>
  );
}
