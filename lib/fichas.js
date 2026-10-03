// Datos de etiqueta para la ficha de producto y leyendas de cada categoría.
// Es contenido de presentación: no cambia precios, stock ni variantes.

export const SELLOS = {
  yerbas: "Para la ronda larga",
  mates: "Hecho para cebar",
  bombillas: "Que no se tape",
  termos: "Agua a punto",
  accesorios: "Todo a mano",
};

const FICHAS = {
  "mate-imperial-calabaza-alpaca": [
    ["Material", "Calabaza forrada en cuero vacuno"],
    ["Virola", "Alpaca cincelada a mano"],
    ["Curado", "Necesita curado"],
  ],
  "mate-camionero-calabaza": [
    ["Material", "Calabaza de boca ancha"],
    ["Virola", "Lisa, de acero o alpaca"],
    ["Curado", "Necesita curado"],
  ],
  "mate-algarrobo": [
    ["Material", "Madera de algarrobo torneada"],
    ["Origen", "Norte argentino"],
    ["Curado", "Simple"],
  ],
  "stanley-mate-system": [
    ["Material", "Acero inoxidable, doble pared"],
    ["Curado", "No necesita"],
    ["Incluye", "Tapa"],
  ],
  "bombilla-alpaca-pico-de-loro": [
    ["Material", "Alpaca labrada, pico de bronce"],
    ["Filtro", "Desmontable"],
    ["Forma", "Pico de loro"],
  ],
  "bombilla-acero-resorte": [
    ["Material", "Acero inoxidable"],
    ["Filtro", "De resorte"],
    ["Forma", "Recta o curva"],
  ],
  "bombilla-cana": [
    ["Material", "Caña natural"],
    ["Filtro", "Tejido"],
    ["Sabor", "Sin gusto metálico"],
  ],
  "bombilla-plana-alpaca-bronce": [
    ["Material", "Alpaca con detalles de bronce"],
    ["Filtro", "De paleta"],
    ["Ideal para", "Mates imperiales"],
  ],
  "stanley-clasico": [
    ["Material", "Acero inoxidable, doble pared"],
    ["Capacidad", "1 L y 1,4 L"],
    ["Tapón", "Cebador"],
  ],
  "lumilagro-luminox": [
    ["Material", "Acero"],
    ["Capacidad", "1 L"],
    ["Pico", "Cebador"],
  ],
  "waterdog-tropero": [
    ["Material", "Acero, con manija"],
    ["Capacidad", "1 L y 1,3 L"],
    ["Pico", "Cebador de precisión"],
  ],
  "termolar-r-evolution": [
    ["Material", "Ampolla de vidrio, cuerpo plástico"],
    ["Capacidad", "1 L"],
    ["Tapón", "Cebador de vertido controlado"],
  ],
  "playadito-suave": [
    ["Origen", "Colonia Liebig, Corrientes"],
    ["Palo", "Con palo"],
    ["Sabor", "Suave y parejo"],
  ],
  "taragui-con-palo": [
    ["Palo", "Con palo"],
    ["Estacionamiento", "Natural"],
    ["Sabor", "Intenso"],
  ],
  "cbse-hierbas-serranas": [
    ["Tipo", "Compuesta"],
    ["Hierbas", "Peperina, menta, poleo y burrito"],
    ["Sabor", "Aromático"],
  ],
  "rosamonte-especial": [
    ["Corte", "Molienda fina"],
    ["Estacionamiento", "Prolongado"],
    ["Sabor", "Potente"],
  ],
  "canarias-tradicional": [
    ["Corte", "Molienda fina"],
    ["Palo", "Sin palo"],
    ["Estilo", "Uruguayo"],
  ],
  "matera-cuero": [
    ["Material", "Cuero vacuno, costuras a mano"],
    ["Capacidad", "Termo de 1 L, mate, yerbera y azucarera"],
  ],
  "set-yerbera-azucarera": [
    ["Material", "Lata con tapa hermética"],
    ["Incluye", "Yerbera y azucarera con pico vertedor"],
  ],
  "cepillo-limpia-bombillas": [
    ["Material", "Cerdas de nylon"],
    ["Uso", "Limpieza de bombillas"],
  ],
};

export function getFicha(slug) {
  return FICHAS[slug] ?? [];
}
