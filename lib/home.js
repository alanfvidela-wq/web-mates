// Contenido editorial de la home. Es presentación: no toca precios ni stock.

export const LEYENDAS = [
  "Elaborada con palo",
  "Estacionada sin apuro",
  "Para la ronda larga",
  "Cebada con paciencia",
  "Agua a 80, nunca hervida",
];

// La receta de la casa, como en un recetario
export const RECETA = {
  datos: [
    ["Rinde", "Una ronda larga"],
    ["Tiempo", "Lo que dure la charla"],
    ["Dificultad", "Menos de la que dicen"],
  ],
  ingredientes: [
    "Un mate curado",
    "Yerba hasta tres cuartos",
    "Una bombilla que no se tape",
    "Agua a 80 grados, en termo o pava",
  ],
  pasos: [
    {
      titulo: "Llená hasta tres cuartos",
      texto: "Yerba hasta los tres cuartos del mate. Ni más, ni menos.",
    },
    {
      titulo: "Sacudí y formá la montañita",
      texto:
        "Tapá con la mano, dalo vuelta y sacudí. Después ladealo: la yerba queda en pendiente.",
    },
    {
      titulo: "Agua tibia en el hueco",
      texto:
        "Un chorrito tibio al pie de la montañita, para que la yerba se hidrate sin quemarse.",
    },
    {
      titulo: "Clavá la bombilla",
      texto:
        "Tapando el pico con el dedo, en el hueco mojado y hasta el fondo. Después no se mueve más.",
    },
    {
      titulo: "Cebá y pasalo",
      texto:
        "Agua a 80, que no hierva. El primero es tuyo; después, que gire la ronda.",
    },
  ],
};

// Una ronda para cada momento, con la categoría que la resuelve.
// Fotos generadas con Higgsfield (ver DESIGN.md, «Fotos y video»).
export const MOMENTOS = [
  {
    titulo: "La de la mañana",
    texto: "Yerba suave, agua a punto y el diario abierto. Sin apuro.",
    foto: "/fotos/la-de-la-manana.webp",
    alt: "Un mate de calabaza en la mesada de la cocina, junto a un paquete de yerba y el diario",
    categoria: "yerbas",
    accion: "Ver yerbas",
  },
  {
    titulo: "La de la ruta",
    texto: "Un termo que aguante caliente hasta el próximo peaje.",
    foto: "/fotos/la-de-la-ruta.webp",
    alt: "Un mate y un termo verde sobre el tablero de un auto, frente a un campo al atardecer",
    categoria: "termos",
    accion: "Ver termos",
  },
  {
    titulo: "La de la plaza",
    texto: "Matera al hombro y una manta en el pasto. Lo demás se arregla.",
    foto: "/fotos/la-de-la-plaza.webp",
    alt: "Una matera de cuero, un termo y un mate sobre una manta a rayas en el pasto",
    categoria: "accesorios",
    accion: "Ver accesorios",
  },
];
