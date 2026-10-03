// El ritual de cebar, paso a paso. `desde` y `hasta` son tramos del scroll
// (0 a 1) dentro de la sección; la escena 3D usa la misma línea de tiempo.

export const PASOS = [
  {
    desde: 0,
    hasta: 0.15,
    titulo: "Llená hasta tres cuartos",
    texto: "Yerba hasta los tres cuartos del mate. Ni más, ni menos.",
  },
  {
    desde: 0.15,
    hasta: 0.31,
    titulo: "Tapá, dalo vuelta y sacudí",
    texto:
      "Con la palma arriba, unas sacudidas: el polvo queda en la mano y no en la bombilla.",
  },
  {
    desde: 0.31,
    hasta: 0.47,
    titulo: "Inclinalo y formá la montañita",
    texto:
      "Ladeá el mate para que la yerba se junte de un lado y quede la pendiente.",
  },
  {
    desde: 0.47,
    hasta: 0.63,
    titulo: "Agua tibia en el hueco",
    texto:
      "Un chorrito tibio al pie de la montañita, para que la yerba se hidrate sin quemarse.",
  },
  {
    desde: 0.63,
    hasta: 0.78,
    titulo: "Clavá la bombilla",
    texto:
      "Tapando el pico con el dedo, en el hueco mojado y hasta el fondo. Después no se mueve más.",
  },
  {
    desde: 0.78,
    hasta: 0.9,
    titulo: "Listo para cebar",
    texto:
      "Agua caliente, a unos 80 grados. Que no hierva: si hierve, la yerba se quema.",
  },
];

// Bloque final, después del último paso.
export const CIERRE = { desde: 0.9, hasta: 1 };

function tramo(desde, hasta, p) {
  if (p <= desde) return 0;
  if (p >= hasta) return 1;
  const x = (p - desde) / (hasta - desde);
  return x * x * (3 - 2 * x);
}

// Estado del mate para un punto del scroll. Todos los valores van de 0 a 1,
// salvo `sacudida`, que es un desplazamiento lateral.
export function valoresAnimacion(p) {
  const sacudiendo = tramo(0.22, 0.23, p) * (1 - tramo(0.255, 0.265, p));
  return {
    yerba: tramo(0.02, 0.12, p),
    tapa: tramo(0.16, 0.19, p) * (1 - tramo(0.285, 0.305, p)),
    alzado: tramo(0.18, 0.21, p) * (1 - tramo(0.27, 0.3, p)),
    volteo: tramo(0.19, 0.22, p) * (1 - tramo(0.265, 0.29, p)),
    sacudida: sacudiendo * Math.sin(((p - 0.22) / 0.04) * Math.PI * 2 * 3),
    inclinado: tramo(0.33, 0.37, p) * (1 - tramo(0.42, 0.46, p)),
    montanita: tramo(0.35, 0.42, p),
    agua: tramo(0.49, 0.6, p),
    humedad: tramo(0.51, 0.61, p),
    bombilla: tramo(0.65, 0.75, p),
  };
}

// Tramo en el que cae la yerba (para las partículas que caen).
export const LLENADO = { desde: 0.01, hasta: 0.12 };
