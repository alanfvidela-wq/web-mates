import Link from "next/link";
import Bodegon from "@/components/Bodegon";
import styles from "../estados.module.css";

export const metadata = {
  title: "Armá tu combo",
  description:
    "Elegí mate, bombilla, termo y yerba, y llevate todo con descuento. Muy pronto.",
};

export default function ArmaTuCombo() {
  return (
    <main className={styles.estado}>
      <Bodegon className={`${styles.dibujo} ${styles.dibujoAncho}`} />
      <p className={styles.codigo}>Próximamente</p>
      <h1 className={styles.titulo}>Armá tu combo</h1>
      <p className={styles.texto}>
        Estamos afilando el armador. Muy pronto elegís mate, bombilla, termo y
        yerba, y te llevás todo con descuento.
      </p>
      <div className={styles.acciones}>
        <Link href="/categoria/mates" className="boton">
          Ver mates
        </Link>
        <Link href="/" className="boton boton-secundario">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
