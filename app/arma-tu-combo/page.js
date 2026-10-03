import Link from "next/link";
import { Mate } from "@/components/Ilustraciones";
import styles from "../estados.module.css";

export const metadata = {
  title: "Armá tu combo",
  description:
    "Elegí mate, bombilla, termo y yerba, y llevate todo con descuento. Muy pronto.",
};

export default function ArmaTuCombo() {
  return (
    <main className={styles.estado}>
      <Mate className={styles.dibujo} />
      <p className={styles.codigo}>Próximamente</p>
      <h1 className={styles.titulo}>Armá tu combo</h1>
      <p className={styles.texto}>
        Estamos preparando el armador: vas a poder elegir mate, bombilla, termo
        y yerba paso a paso, y llevarte todo junto con descuento.
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
