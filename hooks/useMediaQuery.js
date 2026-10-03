"use client";

import { useCallback, useSyncExternalStore } from "react";

// En el servidor devuelve false; en el cliente sigue los cambios de la media query.
export function useMediaQuery(query) {
  const suscribir = useCallback(
    (avisar) => {
      const lista = window.matchMedia(query);
      lista.addEventListener("change", avisar);
      return () => lista.removeEventListener("change", avisar);
    },
    [query],
  );

  return useSyncExternalStore(
    suscribir,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
