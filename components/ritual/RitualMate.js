"use client";

import { Component, useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import PlaceholderMate from "./PlaceholderMate";
import { CIERRE, PASOS } from "./pasos";
import { FlechaAbajo } from "@/components/Ilustraciones";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import styles from "./RitualMate.module.css";

// three.js, el modelo y el HDRI viven en este chunk: se pide recién cuando la
// sección se acerca al viewport (ver `cerca`).
const EscenaRitual = dynamic(() => import("./EscenaRitual"), {
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

const BLOQUES = [...PASOS, CIERRE];
const FUNDIDO = 0.025;

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

export default function RitualMate() {
  const seccionRef = useRef(null);
  const recorridoRef = useRef(null);
  const bloquesRef = useRef([]);
  const pistaRef = useRef(null);
  const progresoRef = useRef(0);
  const lavadoRef = useRef(0);
  const avisoRef = useRef(null);
  const [cerca, setCerca] = useState(false);
  const [activo, setActivo] = useState(false);
  const [lavada, setLavada] = useState(false);
  const [aviso, setAviso] = useState("");
  const [cebadas, setCebadas] = useState(0);
  const [carga, setCarga] = useState("cargando"); // cargando | lista | fallo
  const alListo = useCallback(() => setCarga("lista"), []);
  const alFallar = useCallback(() => setCarga("fallo"), []);
  const reducido = useMediaQuery("(prefers-reduced-motion: reduce)");
  const esMobile = useMediaQuery("(max-width: 768px)");

  // Carga diferida: monta la escena cuando falta media pantalla para llegar.
  useEffect(() => {
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setCerca(true);
          observador.disconnect();
        }
      },
      { rootMargin: "50% 0px" },
    );
    observador.observe(seccionRef.current);
    return () => observador.disconnect();
  }, []);

  // Pausa el render 3D cuando la sección sale de pantalla.
  useEffect(() => {
    const observador = new IntersectionObserver(([entrada]) =>
      setActivo(entrada.isIntersecting),
    );
    observador.observe(recorridoRef.current);
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

  // Progreso del scroll dentro del recorrido. Se escribe en refs y estilos
  // para no re-renderizar React en cada scroll.
  useEffect(() => {
    if (reducido) {
      progresoRef.current = 1;
      return;
    }

    let frame = 0;
    const actualizar = () => {
      frame = 0;
      const rect = recorridoRef.current.getBoundingClientRect();
      const recorrido = rect.height - window.innerHeight;
      const p = recorrido > 0 ? limitar(-rect.top / recorrido) : 0;
      progresoRef.current = p;

      BLOQUES.forEach((bloque, i) => {
        const el = bloquesRef.current[i];
        const opacidad = opacidadBloque(p, bloque);
        el.style.setProperty("--opacidad", opacidad.toFixed(3));
        el.style.pointerEvents = opacidad > 0.5 ? "auto" : "none";
      });
      pistaRef.current.style.opacity = String(limitar(1 - p / 0.03));
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
      className={styles.ritual}
      aria-labelledby="ritual-titulo"
    >
      <header className={styles.cabecera}>
        <h2 id="ritual-titulo" className={styles.cabeceraTitulo}>
          La montañita, paso a paso
        </h2>
        <p className={styles.cabeceraTexto}>
          Seis pasos para cebar como corresponde.
        </p>
      </header>

      <div ref={recorridoRef} className={styles.recorrido}>
        <div className={styles.sticky}>
          <div className={styles.escena}>
            {cerca && (
              <LimiteEscena alFallar={alFallar}>
                <EscenaRitual
                  progresoRef={progresoRef}
                  reducido={reducido}
                  activo={activo}
                  esMobile={esMobile}
                  alListo={alListo}
                  lavadoRef={lavadoRef}
                />
              </LimiteEscena>
            )}
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

          <ol className={styles.bloques} role="list">
            {PASOS.map((paso, i) => (
              <li
                key={paso.titulo}
                ref={(el) => {
                  bloquesRef.current[i] = el;
                }}
                className={`${styles.bloque} ${i % 2 ? styles.derecha : styles.izquierda}`}
                data-inicial={i === 0 ? "" : undefined}
              >
                <h3 className={styles.titulo}>
                  <span className={styles.numero} aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className={styles.oculto}>Paso {i + 1}: </span>
                  {paso.titulo}
                </h3>
                <p className={styles.texto}>{paso.texto}</p>
              </li>
            ))}
            <li
              ref={(el) => {
                bloquesRef.current[PASOS.length] = el;
              }}
              className={`${styles.bloque} ${styles.izquierda} ${styles.cierre}`}
            >
              <h3 className={styles.titulo}>¿Te falta algo?</h3>
              <Link href="/arma-tu-combo" className="boton">
                Armá tu combo
              </Link>
            </li>
          </ol>

          <p ref={pistaRef} className={styles.pista} aria-hidden="true">
            Deslizá
            <FlechaAbajo className={styles.flecha} />
          </p>
        </div>
      </div>
    </section>
  );
}
