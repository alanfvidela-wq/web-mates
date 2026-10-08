import Link from "next/link";
import { Mate, PaqueteYerba, Termo } from "./Ilustraciones";
import Marca from "./Marca";
import styles from "./Portada.module.css";

// Hero estático de la home: marca, propuesta y CTA.
export default function Portada() {
  return (
    <section className={styles.portada} aria-labelledby="portada-titulo">
      <div className={styles.contenido}>
        <div className={styles.texto}>
          <h1 id="portada-titulo" className={styles.marca}>
            <Marca />
          </h1>
          <p className={styles.propuesta}>
            Todo para el mate en un solo almacén: elegís mate, bombilla, termo y
            yerba, y te llevás el combo con descuento.
          </p>
          <Link href="/arma-tu-combo" className={`boton ${styles.cta}`}>
            Armá tu combo
          </Link>
        </div>

        <div className={styles.bodegon} aria-hidden="true">
          <Termo className={styles.termo} color="#1f5135" />
          <PaqueteYerba className={styles.paquete} color="#e9ae1b" />
          <Mate className={styles.mate} color="#8a3b1e" />
          <p className={styles.sello}>Cebado con paciencia</p>
        </div>
      </div>
    </section>
  );
}
