"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// Header fijo: transparente mientras flota sobre el hero ([data-hero]) y con
// fondo sólido cuando se scrollea. Cambia un poco antes del final del hero,
// antes de que el titular y el botón pasen por debajo del header transparente.
// También publica su alto en --alto-header.
export default function CabeceraFlotante({ className, children }) {
  const ref = useRef(null);
  const pathname = usePathname();
  // Solo la home tiene hero; ahí arranca transparente hasta medir el scroll
  const [heroALaVista, setHeroALaVista] = useState(true);
  const transparente = pathname === "/" && heroALaVista;

  useEffect(() => {
    const header = ref.current;
    const raiz = document.documentElement;
    const observador = new ResizeObserver(() => {
      raiz.style.setProperty("--alto-header", `${header.offsetHeight}px`);
    });
    observador.observe(header);
    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    const hero = document.querySelector("[data-hero]");
    if (!hero) return;
    let cuadro = 0;
    function medir() {
      cuadro = 0;
      const alto = ref.current.offsetHeight;
      const { bottom, height } = hero.getBoundingClientRect();
      setHeroALaVista(bottom - alto > height * 0.6);
    }
    function alScrollear() {
      if (!cuadro) cuadro = requestAnimationFrame(medir);
    }
    alScrollear();
    window.addEventListener("scroll", alScrollear, { passive: true });
    window.addEventListener("resize", alScrollear);
    return () => {
      cancelAnimationFrame(cuadro);
      window.removeEventListener("scroll", alScrollear);
      window.removeEventListener("resize", alScrollear);
    };
  }, [pathname]);

  return (
    <header
      ref={ref}
      className={className}
      data-transparente={transparente || undefined}
    >
      {children}
    </header>
  );
}
