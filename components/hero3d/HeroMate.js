"use client";

import { Component, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import PlaceholderMate from "./PlaceholderMate";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import styles from "./HeroMate.module.css";

const EscenaHero = dynamic(() => import("./EscenaHero"), {
  ssr: false,
  loading: () => <PlaceholderMate />,
});

// Si WebGL falla, mostramos el placeholder en lugar de romper la home.
class LimiteEscena extends Component {
  state = { fallo: false };

  static getDerivedStateFromError() {
    return { fallo: true };
  }

  render() {
    if (this.state.fallo) return <PlaceholderMate texto="" />;
    return this.props.children;
  }
}

// Tramos del scroll (0 a 1) en los que se ve cada bloque.
const BLOQUES = [
  {
    desde: 0,
    hasta: 0.3,
    lado: "izquierda",
    kicker: "Calabaza, madera, cerámica, acero",
    titulo: "Mates de todos los estilos",
    texto: "Curados, torneados a mano o listos para la mochila.",
  },
  {
    desde: 0.36,
    hasta: 0.64,
    lado: "derecha",
    kicker: "Con palo, sin palo, compuestas",
    titulo: "Las mejores yerbas",
    texto: "Playadito, Taragüí, Rosamonte, CBSé y más, siempre frescas.",
  },
  {
    desde: 0.7,
    hasta: 1,
    lado: "izquierda",
    kicker: "Mate, bombilla, termo y yerba",
    titulo: "Armá tu combo",
    texto: "Elegí cada parte a tu gusto y llevate todo con descuento.",
    link: { href: "/arma-tu-combo", texto: "Armá tu combo" },
  },
];

const FUNDIDO = 0.06;

function limitar(valor) {
  return Math.min(1, Math.max(0, valor));
}

function opacidadBloque(p, { desde, hasta }) {
  const entrada = desde === 0 ? 1 : limitar((p - desde) / FUNDIDO);
  const salida = hasta === 1 ? 1 : limitar((hasta - p) / FUNDIDO);
  return Math.min(entrada, salida);
}

export default function HeroMate() {
  const seccionRef = useRef(null);
  const bloquesRef = useRef([]);
  const pistaRef = useRef(null);
  const progresoRef = useRef(0);
  const [activo, setActivo] = useState(true);
  const reducido = useMediaQuery("(prefers-reduced-motion: reduce)");
  const esMobile = useMediaQuery("(max-width: 768px)");

  // Pausa el render 3D cuando el hero sale de pantalla.
  useEffect(() => {
    const observador = new IntersectionObserver(([entrada]) =>
      setActivo(entrada.isIntersecting),
    );
    observador.observe(seccionRef.current);
    return () => observador.disconnect();
  }, []);

  // Progreso del scroll dentro del hero. Se escribe en refs y estilos para no
  // re-renderizar React en cada scroll.
  useEffect(() => {
    if (reducido) {
      progresoRef.current = 1;
      return;
    }

    let frame = 0;
    const actualizar = () => {
      frame = 0;
      const rect = seccionRef.current.getBoundingClientRect();
      const recorrido = rect.height - window.innerHeight;
      const p = recorrido > 0 ? limitar(-rect.top / recorrido) : 0;
      progresoRef.current = p;

      BLOQUES.forEach((bloque, i) => {
        const el = bloquesRef.current[i];
        const opacidad = opacidadBloque(p, bloque);
        el.style.setProperty("--opacidad", opacidad.toFixed(3));
        el.style.pointerEvents = opacidad > 0.5 ? "auto" : "none";
      });
      pistaRef.current.style.opacity = String(limitar(1 - p / 0.05));
    };
    const alScrollear = () => {
      if (!frame) frame = requestAnimationFrame(actualizar);
    };

    actualizar();
    window.addEventListener("scroll", alScrollear, { passive: true });
    window.addEventListener("resize", alScrollear);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", alScrollear);
      window.removeEventListener("resize", alScrollear);
    };
  }, [reducido]);

  return (
    <section ref={seccionRef} className={styles.hero} aria-labelledby="hero-titulo">
      <div className={styles.sticky}>
        <h1 id="hero-titulo" className={styles.oculto}>
          La Montañita: todo para el mate
        </h1>

        <div className={styles.escena}>
          <LimiteEscena>
            <EscenaHero
              progresoRef={progresoRef}
              reducido={reducido}
              activo={activo}
              esMobile={esMobile}
            />
          </LimiteEscena>
        </div>

        <div className={styles.bloques}>
          {BLOQUES.map((bloque, i) => (
            <div
              key={bloque.titulo}
              ref={(el) => {
                bloquesRef.current[i] = el;
              }}
              className={`${styles.bloque} ${styles[bloque.lado]}`}
              data-inicial={i === 0 ? "" : undefined}
            >
              <p className={styles.kicker}>{bloque.kicker}</p>
              <h2 className={styles.titulo}>{bloque.titulo}</h2>
              <p className={styles.texto}>{bloque.texto}</p>
              {bloque.link && (
                <Link href={bloque.link.href} className={`boton ${styles.boton}`}>
                  {bloque.link.texto}
                </Link>
              )}
            </div>
          ))}
        </div>

        <p ref={pistaRef} className={styles.pista} aria-hidden="true">
          Deslizá ↓
        </p>
      </div>
    </section>
  );
}
