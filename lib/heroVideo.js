// Videos del hero de la home (generados con npm run video:hero).
// Mientras `src` sea null se ve solo el poster.
// El corte también está en components/Hero.module.css.
export const CORTE_MOBILE = "(max-width: 760px)";

export const VIDEOS_HERO = {
  desktop: { src: null, poster: "/videos/hero-desktop.webp" },
  mobile: { src: null, poster: "/videos/hero-mobile.webp" },
};
