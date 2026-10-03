"use client";

import { Component, useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import PlaceholderMate from "./PlaceholderMate";
import { FlechaAbajo } from "@/components/Ilustraciones";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import styles from "./HeroMate.module.css";

// El placeholder lo maneja HeroMate hasta que el modelo termina de cargar.
const EscenaHero = dynamic(() => import("./EscenaHero"), {
  ssr: false,
  loading: () => null,
});

// Si WebGL o el modelo fallan, queda el placeholder en lugar de romper la home.
class LimiteEscena extends Component {
  state = { fallo: false };

  static getDerivedStateFromError() {
    return { fallo: true };
  }

  componentDidCatch(error) {
    console.error(error);
    this.props.alFallar();
  }

  render() {
    return this.state.fallo ? null : this.props.children;
  }
}

// Tramos del scroll (0 a 1) en los que se ve cada bloque.
const BLOQUES = [
  {
    desde: 0,
    hasta: 0.3,
    lado: "izquierda",
    titulo: "Un mate para cada cebador",
    texto:
      "Calabaza, madera, cerámica o acero. Curados, torneados a mano o listos para la mochila.",
  },
  {
    desde: 0.36,
    hasta: 0.64,
    lado: "derecha",
    titulo: "Yerba de la buena",
    texto:
      "Playadito, Taragüí, Rosamonte, CBSé y más. Con palo, sin palo o con yuyos serranos.",
  },
  {
    desde: 0.7,
    hasta: 1,
    lado: "izquierda",
    titulo: "Armá tu combo",
    texto:
      "Mate, bombilla, termo y yerba a tu gusto. Te llevás todo junto y con descuento.",
    link: { href: "/arma-tu-combo", texto: "Armá tu combo" },
  },
];

const FUNDIDO = 0.06;

// Easter egg: si te quedás mucho en la home, la yerba se lava.
const INICIO_LAVADO = 40; // segundos con la pestaña visible
const DURACION_LAVADO = 25;
const LAVADO_VISIBLE = 0.6; // desde acá aparece el botón

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
  const lavadoRef = useRef(0);
  const avisoRef = useRef(null);
  const [lavada, setLavada] = useState(false);
  const [aviso, setAviso] = useState("");
  const [cebadas, setCebadas] = useState(0);
  const [activo, setActivo] = useState(true);
  const [carga, setCarga] = useState("cargando"); // cargando | lista | fallo
  const alListo = useCallback(() => setCarga("lista"), []);
  const alFallar = useCallback(() => setCarga("fallo"), []);
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

  // Cuenta el tiempo en la home (solo con la pestaña visible) y va lavando la yerba.
  useEffect(() => {
    let segundos = 0;
    const id = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      segundos += 1;
      const valor = limitar((segundos - INICIO_LAVADO) / DURACION_LAVADO);
      lavadoRef.current = valor;
      if (valor >= LAVADO_VISIBLE) {
        setLavada(true);
        setAviso("La yerba ya está lavada.");
      }
    }, 1000);
    return () => clearInterval(id);
  }, [cebadas]);

  function cambiarYerba() {
    lavadoRef.current = 0;
    setLavada(false);
    setAviso("Yerba nueva. Buen mate.");
    setCebadas((n) => n + 1);
    avisoRef.current?.focus();
  }

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
    <section
      ref={seccionRef}
      className={styles.hero}
      aria-labelledby="hero-titulo"
    >
      <div className={styles.sticky}>
        <h1 id="hero-titulo" className={styles.oculto}>
          La Montañita: todo para el mate
        </h1>

        <div className={styles.escena}>
          <LimiteEscena alFallar={alFallar}>
            <EscenaHero
              progresoRef={progresoRef}
              reducido={reducido}
              activo={activo}
              esMobile={esMobile}
              alListo={alListo}
              lavadoRef={lavadoRef}
            />
          </LimiteEscena>
          {lavada && carga === "lista" && (
            <button
              type="button"
              className={`boton ${styles.cambiarYerba}`}
              onClick={cambiarYerba}
            >
              Cambiar la yerba
            </button>
          )}
          <p
            ref={avisoRef}
            className={styles.oculto}
            role="status"
            tabIndex={-1}
          >
            {aviso}
          </p>
          <div
            className={`${styles.cargando} ${carga === "lista" ? styles.cargado : ""}`}
            aria-hidden={carga === "lista"}
          >
            <PlaceholderMate texto={carga === "fallo" ? "" : undefined} />
          </div>
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
              <h2 className={styles.titulo}>{bloque.titulo}</h2>
              <p className={styles.texto}>{bloque.texto}</p>
              {bloque.link && (
                <Link
                  href={bloque.link.href}
                  className={`boton ${styles.boton}`}
                >
                  {bloque.link.texto}
                </Link>
              )}
            </div>
          ))}
        </div>

        <p ref={pistaRef} className={styles.pista} aria-hidden="true">
          Deslizá
          <FlechaAbajo className={styles.flecha} />
        </p>
      </div>
    </section>
  );
}
