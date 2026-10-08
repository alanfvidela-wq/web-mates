# La Montañita — Sistema de diseño

La tienda tiene que parecer un almacén de barrio que vende yerba. Nada de
plantilla de e-commerce. Las referencias son los paquetes de yerba, las
etiquetas de almacén y la lista de precios escrita a máquina. El mate 3D de
«La montañita, paso a paso» es lo único que llama la atención. Todo lo demás
es tinta sobre papel, ordenado.

## Estructura de la home

1. **Portada estática**: la marca en grande, la propuesta en una frase, el
   botón «Armá tu combo» y un bodegón dibujado. Funciona sola, sin 3D.
2. **Franja de leyendas** y **Lo que más sale**: solo los productos
   destacados, en un único estante continuo. Todas las ilustraciones tienen la
   misma altura, y precios y nombres comparten línea base.
3. **La montañita, paso a paso**: sección sticky guiada por el scroll, a mitad
   de página. El mate 3D muestra el ritual de cebar en seis pasos y cierra con
   «¿Te falta algo? Armá tu combo». three.js, el modelo y el HDRI se cargan
   recién cuando la sección está a media pantalla de distancia; hasta entonces
   se ve un mate dibujado.
4. **Qué hay en el almacén**: la única sección de categorías de la home.

## Concepto: «el paquete y la góndola»

- **El paquete.** Cada página se arma como la cara de un paquete de yerba:
  franjas de color de lado a lado, un título serif muy grande y sellos con
  datos cortos («Elaborada con palo», «Estacionada sin apuro»).
- **La góndola.** Los productos van apoyados en estantes, no en tarjetas.
  Cada fila tiene una línea gruesa de estante abajo. El precio va en una
  etiqueta troquelada, escrita a máquina.
- **La etiqueta.** La ficha de producto se lee como el dorso de un paquete:
  una tabla de datos separada por filetes finos, sin cajas ni sombras.

## Paleta

Seis colores planos, sin gradientes. Las variantes más claras u oscuras salen
de mezclarlos (`color-mix`), no son colores nuevos.

| Token        | Nombre           | Hex       | Uso                                                     |
| ------------ | ---------------- | --------- | ------------------------------------------------------- |
| `--kraft`    | Papel kraft      | `#D9C49E` | Fondo general, con una textura de papel muy sutil       |
| `--tinta`    | Tinta            | `#1F1A14` | Texto, filetes, estantes, botón principal               |
| `--verde`    | Verde yerba      | `#1F5135` | Header, franja principal, categoría Yerbas              |
| `--rojo`     | Rojo almacén     | `#BF3A1E` | Sellos, «sin stock», precio en oferta, categoría Mates  |
| `--amarillo` | Amarillo paquete | `#E9AE1B` | Franjas finas, etiquetas de precio, categoría Bombillas |
| `--azul`     | Azul enlozado    | `#2C4B6B` | Categoría Termos, links en el texto                     |

Derivados: `--papel` (kraft mezclado con blanco: superficies de etiqueta) y
`--kraft-oscuro` (kraft con tinta: filetes suaves y texto secundario sobre
kraft).

### Color por categoría

En la página de categoría y en la de producto, el color cambia según la
categoría. Hay dos variables, `--acento` y `--sobre-acento`, que se definen
en el `<main>`.

| Categoría  | `--acento` | `--sobre-acento` |
| ---------- | ---------- | ---------------- |
| Yerbas     | verde      | papel            |
| Mates      | rojo       | papel            |
| Bombillas  | amarillo   | tinta            |
| Termos     | azul       | papel            |
| Accesorios | tinta      | amarillo         |

Contrastes medidos (WCAG): tinta sobre kraft 10:1, papel sobre rojo 6,9:1,
tinta sobre amarillo 8,6:1, papel sobre azul 7,8:1, papel sobre verde 9:1 y
rojo sobre kraft 4,7:1 (solo texto grande o en negrita).

## Tipografía

Inspirada en Graza: una serif de libro, estrecha, para los títulos, una sans
amable para leer y una máquina de escribir para las etiquetas. **Todo va en
sentence case**: no hay mayúsculas sostenidas en ningún lado (navegación,
botones, títulos ni franjas).

| Rol            | Fuente           | Uso                                                                                                                                                          |
| -------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Títulos y logo | Instrument Serif | Un solo peso (400), con tracking levemente negativo (`-0.02em`). Los títulos principales van muy grandes. La itálica se usa solo en los sellos ovalados      |
| Texto          | Work Sans        | Texto corrido, navegación (500), botones (600), marcas, links, contadores, migas, stock y «Deslizá»                                                          |
| Etiquetas      | Courier Prime    | Solo precios (etiquetas de la góndola y precio del producto) y datos de la ficha de producto (origen, capacidad, material…), como etiqueta escrita a máquina |

### Logo

El logo es el wordmark «La Montañita» en Instrument Serif. La tilde de la ñ
es una montañita de yerba dibujada en SVG, apoyada sobre la n como si fuera
la tilde. Va en verde yerba sobre kraft y en amarillo sobre el verde del
header y la tinta del footer. El mismo wordmark, en tamaño de título
principal, es el título de la portada. Se sacaron el sello ovalado y las
volutas de fileteado porque competían con la montañita: el sitio ya no tiene
fileteado.

### Escala

| Token          | Tamaño                       | Uso                               |
| -------------- | ---------------------------- | --------------------------------- |
| `--t-dato`     | 0.8125rem (13px)             | Datos chicos (marcas, contadores) |
| `--t-texto`    | 1rem                         | Texto corrido                     |
| `--t-entrada`  | 1.1875rem                    | Bajadas y descripciones           |
| `--t-titulo-3` | 2rem                         | Nombre de producto en la góndola  |
| `--t-titulo-2` | clamp(2.75rem, 6vw, 4.75rem) | Títulos de sección                |
| `--t-titulo-1` | clamp(4.5rem, 15vw, 12rem)   | Portada, título de categoría      |

Interlineado: 0.88–0.95 para los títulos y 1.55 para el texto.

## Formas

- **Rectas por defecto**: radio 0 en la estructura, los botones y los
  selectores.
- **Óvalo** solo en los sellos (en serif itálica).
- **Troquel**: la etiqueta de precio lleva esquinas cortadas con
  `clip-path`.
- **Sin sombras.** La profundidad sale de los filetes de 2px y de los
  bloques de color planos.

## Ilustración

Los dibujos son SVG hechos a mano, con trazo de tinta de 2.5px, puntas
redondeadas y líneas un poco irregulares. El relleno es plano y toma el color
del producto. Hay dibujos de mate, bombilla, termo, paquete de yerba, matera,
pava (pantalla de carga) y termo volcado (error). Reemplazan a los íconos
genéricos y a los placeholders de color.

## Voz

Rioplatense, breve y con humor matero sin forzar. Una frase por lugar, no un
chiste por línea. Ejemplos: «Elaborada con palo», «Se nos lavó el mate»,
«Cambiar la yerba», «Para la ronda larga».

## Movimiento

- La única animación orquestada es la del ritual (el mate 3D con el scroll).
- El resto solo tiene cambios de estado inmediatos: hover que invierte los
  colores y foco visible. No hay entradas con fundido.
- Easter egg: si la persona se queda un rato largo en la home, la yerba del
  mate 3D se va lavando (se aclara) y aparece el botón «Cambiar la yerba»,
  que la deja nueva otra vez.
- Con `prefers-reduced-motion` el ritual se muestra como una secuencia fija
  de pasos con el mate ya cebado, y ni el cambio de yerba ni la pantalla de
  carga se animan.

## Principios

1. **El mate es la estrella.** Nada compite con el mate 3D: ni gradientes, ni
   brillos, ni movimiento.
2. **Tinta sobre papel.** Si algo no se podría imprimir en una etiqueta con
   dos o tres tintas, sobra.
3. **El color tiene significado.** El color de acento dice en qué categoría
   estás; no está para decorar.
4. **La máquina de escribir es para etiquetas.** Solo los precios y los datos
   de la ficha se escriben a máquina. Todo lo demás va en Work Sans.
5. **Accesible siempre.** Contraste AA, foco de 3px en tinta o amarillo según
   el fondo, navegación con teclado y layout fluido desde 320px.

## Revisión contra «Evitar»

| Evitar                                                  | Cómo se resuelve                                                                                                                                     |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fondo crema + serif + píldora                           | La serif no es la única identidad: el fondo es kraft con textura, hay franjas de paquete, ilustraciones a mano, etiquetas a máquina y botones rectos |
| Etiquetas en mayúsculas con tracking sobre los títulos  | No hay antetítulos. Los datos chicos van en minúscula y abajo del título                                                                             |
| Resaltar una palabra del título                         | Cada título va en un solo color y un solo estilo                                                                                                     |
| Grillas de tarjetas iguales con el mismo radio y sombra | Góndola sin cajas, categorías como lista de almacén, radio 0, sin sombras                                                                            |
| Gradientes o resplandores                               | Solo colores planos y textura de papel. Se saca el gradiente del hero 3D y del skeleton                                                              |
| «→» en botones y «·» como separador                     | Sin flechas de texto. El separador es una hojita de yerba en SVG                                                                                     |
| Fade + slide up por sección                             | No hay. Solo se anima el ritual                                                                                                                      |
| Inter, Geist, Roboto, Playfair, Fraunces, Poppins       | Se usan Instrument Serif, Work Sans y Courier Prime                                                                                                  |
