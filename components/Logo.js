import Link from "next/link";
import styles from "./Logo.module.css";

// Wordmark «Amargo»: serif gorda y redondeada, solo texto.
export default function Logo({ className = "" }) {
  return (
    <Link href="/" className={`${styles.logo} ${className}`}>
      Amargo
    </Link>
  );
}
