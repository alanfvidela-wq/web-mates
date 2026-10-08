"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { CORTE_MOBILE, VIDEOS_HERO } from "@/lib/heroVideo";

const sinSuscripcion = () => () => {};

// Video del hero: elige la versión según el ancho y no se monta con
// prefers-reduced-motion (queda solo el poster del servidor).
export default function VideoFondo({ className, claseBoton, claseIcono }) {
  // En el servidor y durante la hidratación no hay video
  const montado = useSyncExternalStore(sinSuscripcion, () => true, () => false);
  const reducido = useMediaQuery("(prefers-reduced-motion: reduce)");
  const mobile = useMediaQuery(CORTE_MOBILE);
  const [pausado, setPausado] = useState(false);
  const ref = useRef(null);

  const version = VIDEOS_HERO[mobile ? "mobile" : "desktop"];
  const conVideo = montado && !reducido;

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // Por las dudas: algunos navegadores solo hacen autoplay si muted es propiedad
    video.muted = true;
    if (!pausado) video.play().catch(() => setPausado(true));
    // Al cambiar de versión se reinicia el video, respetando la pausa
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conVideo, version.src]);

  if (!conVideo) return null;

  function alternar() {
    const video = ref.current;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }

  return (
    <>
      <video
        key={version.src}
        ref={ref}
        className={className}
        src={version.src}
        poster={version.poster}
        autoPlay={!pausado}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        onPlay={() => setPausado(false)}
        onPause={() => setPausado(true)}
      />
      <button
        type="button"
        className={claseBoton}
        onClick={alternar}
        aria-label={pausado ? "Reproducir el video" : "Pausar el video"}
      >
        <svg className={claseIcono} viewBox="0 0 24 24" aria-hidden="true">
          {pausado ? (
            <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
          ) : (
            <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
          )}
        </svg>
      </button>
    </>
  );
}

