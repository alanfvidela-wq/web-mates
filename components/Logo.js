import Link from "next/link";
import Marca from "./Marca";
import styles from "./Logo.module.css";

export default function Logo({ className = "" }) {
  return (
    <Link href="/" className={`${styles.logo} ${className}`}>
      <Marca />
    </Link>
  );
}
