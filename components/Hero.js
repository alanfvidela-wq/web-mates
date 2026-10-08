import Link from "next/link";
import { CORTE_MOBILE, VIDEOS_HERO } from "@/lib/heroVideo";
import VideoFondo from "./VideoFondo";
import styles from "./Hero.module.css";

// Hero de la home: video de fondo a pantalla completa, con el header flotando
// encima y el titular abajo a la izquierda.
// El poster va en un <picture> del servidor, así se ve desde el primer pintado.
export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-titulo" data-hero>
      <picture className={styles.medio}>
        <source media={CORTE_MOBILE} srcSet={VIDEOS_HERO.mobile.poster} />
        <img
          src={VIDEOS_HERO.desktop.poster}
          alt=""
          fetchPriority="high"
          className={styles.poster}
        />
      </picture>

      <VideoFondo
        className={styles.video}
        claseBoton={styles.pausa}
        claseIcono={styles.icono}
      />

      <div className={styles.degradado} aria-hidden="true" />

      <div className={styles.texto}>
        <h1 id="hero-titulo" className={styles.titulo}>
          Que no se corte la ronda
        </h1>
        <p className={styles.frase}>
          Elegís mate, bombilla, termo y yerba, y te llevás el combo con
          descuento.
        </p>
        <Link href="/arma-tu-combo" className={`boton ${styles.cta}`}>
          Armá tu combo
        </Link>
      </div>
    </section>
  );
}
