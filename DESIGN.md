# Amargo — Sistema de diseño

Amargo es un almacén de mate con la limpieza de graza.co: bloques de color
plano, mucho aire y nada de bordes. Las referencias siguen siendo los paquetes
de yerba y la lista de precios escrita a máquina, pero ahora sin filetes ni
estantes dibujados. Hay dos cosas que llaman la atención: el video del mate
cebándose en la portada y el mate 3D de «La montañita, paso a paso». Todo lo
demás es tinta sobre papel, ordenado.

## Estructura de la home

1. **Portada con video**: a pantalla completa (100svh), con el header
   flotando transparente encima. Un video en loop de un mate cebándose; encima,
   un degradado oscuro desde abajo y, abajo a la izquierda, el titular «Que no
   se corte la ronda» en Instrument Serif, una frase corta y la píldora «Armá tu
   combo» en verde yerba claro. Ver «Video de la portada».
2. **Leyendas** (bloque verde) y **Lo que más sale** (sobre kraft): solo los
   productos destacados, en una fila. Todas las ilustraciones tienen la misma
   altura, y precios y nombres comparten línea base.
3. **La montañita, paso a paso**: sección sticky guiada por el scroll, a mitad
   de página. El nombre es un paso del ritual (la montañita de yerba), no la
   marca. El mate 3D muestra el ritual de cebar en seis pasos y cierra con «¿Te
   falta algo? Armá tu combo». three.js, el modelo y el HDRI se cargan recién
   cuando la sección está a media pantalla de distancia; hasta entonces se ve
   un mate dibujado.
4. **Qué hay en el almacén** (sobre papel): la única sección de categorías de
   la home.

## Header

- **Fijo y flotante.** En la home arranca transparente sobre el video, con el
  texto en papel. Cuando se scrollea (un poco antes de terminar el hero, para
  que el titular no pase por debajo) pasa a fondo papel con texto en tinta, con
  una transición de 300ms. En las demás páginas es sólido desde el principio.
  Mide su alto y lo publica en `--alto-header`; el contenido arranca debajo.
- **Sin franjas.** No hay líneas de color abajo ni arriba.
- **Navegación** en Courier Prime bold; al pasar el mouse se subraya.
- **Carrito**: píldora clara con el texto «Carrito [0]» y la cantidad, en
  lugar de un ícono. La cantidad se lee en el servidor (`lib/carrito.js`).

## Video de la portada

- **Fuente**: `public/videos/fuente(s)/`, fuera de git. `npm run video:hero`
  (`scripts/video-hero.mjs`, usa ffmpeg) genera todo en `public/videos/`. Si
  cambia el video fuente, se ajustan el tramo y los recortes al principio del
  script y se vuelve a correr.
- **Dos versiones**, H.264 sin audio, de menos de 4 MB y sin escalar por
  encima del original: `hero-desktop` horizontal (espejada para que el mate
  quede a la derecha, lejos del texto) y `hero-mobile` vertical 9:16 recortada
  sobre el mate. Los recortes dejan afuera la marca de agua.
- **Loop**: el final se funde medio segundo con el principio, así no se nota
  el corte.
- **Poster**: el primer frame de cada versión en webp. Lo pinta el servidor en
  un `<picture>`, así se ve desde el primer momento y sin saltos; el video se
  monta encima desde un componente cliente (`VideoFondo`), que elige la
  versión según el ancho (corte en 760px).
- **Control**: círculo claro sin borde, con el ícono de pausa/play en tinta,
  abajo a la derecha, con etiqueta accesible.

## Concepto: «bloques, aire y etiquetas»

- **Bloques en vez de bordes.** Las secciones se separan con color de fondo
  (kraft, papel, verde, tinta, el acento de la categoría) y con espacio
  generoso. No hay bordes, contornos, filetes ni estantes.
- **El producto en su bloque.** Cada producto va dibujado sobre un bloque
  papel con esquinas redondeadas (verde yerba claro al pasar el mouse). El
  precio va abajo, en una etiqueta troquelada escrita a máquina.
- **La etiqueta.** La ficha de producto se lee como el dorso de un paquete:
  un bloque papel con filas alternadas, sin líneas.
- **Sellos** ovalados y rellenos (no contorneados), en serif itálica:
  «Sin stock», «Próximamente», «404», el sello de la categoría y el número de
  cada paso del ritual.

## Paleta

Seis colores planos y un derivado verde claro, sin gradientes (la única
excepción es el degradado de tinta sobre el video de la portada, para que el
texto y el header se lean). Las variantes más claras u oscuras salen de
mezclarlos (`color-mix`), no son colores nuevos.

| Token        | Nombre           | Hex       | Uso                                                     |
| ------------ | ---------------- | --------- | ------------------------------------------------------- |
| `--kraft`    | Papel kraft      | `#D9C49E` | Fondo general, con una textura de papel muy sutil       |
| `--tinta`    | Tinta            | `#1F1A14` | Texto, botón principal, footer y cabecera del ritual    |
| `--verde`    | Verde yerba      | `#1F5135` | Logo, bloque de leyendas, categoría Yerbas              |
| `--rojo`     | Rojo almacén     | `#BF3A1E` | Sellos, «sin stock», categoría Mates                    |
| `--amarillo` | Amarillo paquete | `#E9AE1B` | Etiquetas de precio, categoría Bombillas                |
| `--azul`     | Azul enlozado    | `#2C4B6B` | Categoría Termos, links en el texto                     |

Derivados: `--papel` (kraft con blanco: header sólido, bloques de producto,
ficha, píldoras claras), `--kraft-oscuro` (kraft con tinta: texto secundario)
y `--verde-claro` (verde yerba aclarado, ≈ `#A3C388`: CTA principal, hover de
productos y del carrito, foco sobre fondos oscuros).

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

Contrastes medidos (WCAG): tinta sobre kraft 10:1, tinta sobre verde claro
≈ 8,9:1, papel sobre rojo 6,9:1, tinta sobre amarillo 8,6:1, papel sobre azul
7,8:1, papel sobre verde 9:1 y rojo sobre kraft 4,7:1 (solo texto grande o en
negrita).

## Tipografía

Inspirada en Graza: una serif gorda para la marca, una serif de libro
estrecha para los títulos, una sans amable para leer y una máquina de
escribir para la navegación, los botones y las etiquetas. **Todo va en
sentence case**: no hay mayúsculas sostenidas en ningún lado.

| Rol      | Fuente           | Uso                                                                                                   |
| -------- | ---------------- | ----------------------------------------------------------------------------------------------------- |
| Logo     | Fraunces         | Solo el wordmark «Amargo»: peso 900 y eje `SOFT` al máximo                                            |
| Títulos  | Instrument Serif | Un solo peso (400), tracking `-0.02em`. Los principales van muy grandes. Itálica solo en los sellos   |
| Texto    | Work Sans        | Texto corrido, marcas, migas, contadores y stock                                                      |
| Máquina  | Courier Prime    | Bold: navegación (header y footer), botones y carrito. También precios y datos de la ficha            |

### Logo

El logo es el wordmark «Amargo» en Fraunces 900 con `SOFT` 100: gordo y de
terminales redondeadas, como el de Graza. Es solo texto, sin dibujo (se sacó
la montañita que hacía de tilde de la ñ). Va en verde yerba sobre el header
claro y en papel sobre el video y sobre el footer de tinta.

### Escala

| Token          | Tamaño                       | Uso                               |
| -------------- | ---------------------------- | --------------------------------- |
| `--t-dato`     | 0.8125rem (13px)             | Datos chicos (marcas, contadores) |
| `--t-texto`    | 1rem                         | Texto corrido                     |
| `--t-entrada`  | 1.1875rem                    | Bajadas y descripciones           |
| `--t-titulo-3` | 2rem                         | Nombre de producto                |
| `--t-titulo-2` | clamp(2.75rem, 6vw, 4.75rem) | Títulos de sección                |
| `--t-titulo-1` | clamp(4.5rem, 15vw, 12rem)   | Título de categoría               |

Interlineado: 0.88–0.95 para los títulos y 1.55 para el texto.

## Formas

- **Sin bordes ni líneas.** Nada se contornea ni se subraya con filetes. La
  única línea que queda es el contorno de foco del teclado (accesibilidad).
- **Píldoras** (`border-radius: 999px`) para botones, CTA y carrito.
  `.boton` es tinta; `.boton-secundario`, papel; `.boton-yerba`, verde yerba
  claro (el CTA de compra).
- **Bloques redondeados** (`--radio`, 16px) para productos, filas de
  categorías, ficha y frente del producto.
- **Círculos** para los botones de ícono (pausa del video).
- **Óvalo relleno** para los sellos.
- **Troquel**: la etiqueta de precio lleva una esquina cortada con
  `clip-path`.
- **Sin sombras.** La profundidad sale de los bloques de color planos.

## Ilustración

Los dibujos son SVG hechos a mano, con trazo de tinta de 2.5px, puntas
redondeadas y líneas un poco irregulares. El relleno es plano y toma el color
del producto. Hay dibujos de mate, bombilla, termo, paquete de yerba, matera,
pava (pantalla de carga) y termo volcado (error). Reemplazan a los íconos
genéricos y a los placeholders de color. El bodegón (termo, paquete y mate
juntos) ilustra «Armá tu combo», porque es el combo completo.

## Voz

Rioplatense, breve y con humor matero sin forzar. Una frase por lugar, no un
chiste por línea. Ejemplos: «Que no se corte la ronda», «Elaborada con palo»,
«Se nos lavó el mate», «Cambiar la yerba», «Para la ronda larga».

## Movimiento

- Hay dos movimientos: el video en loop de la portada y el ritual (el mate 3D
  con el scroll). El video se puede pausar.
- El header cambia de transparente a sólido con una transición suave.
- El resto solo tiene cambios de estado rápidos: hover que cambia el fondo
  y foco visible. No hay entradas con fundido.
- Easter egg: si la persona se queda un rato largo en la home, la yerba del
  mate 3D se va lavando (se aclara) y aparece el botón «Cambiar la yerba»,
  que la deja nueva otra vez.
- Con `prefers-reduced-motion` la portada muestra solo el poster, sin video,
  y no hay transiciones.
- Con `prefers-reduced-motion` el ritual se muestra como una secuencia fija
  de pasos con el mate ya cebado, y ni el cambio de yerba ni la pantalla de
  carga se animan.

## Principios

1. **El mate es la estrella.** En la portada, el mate de verdad en video; a
   mitad de página, el mate 3D. Nada más compite con ellos: ni gradientes, ni
   brillos, ni movimiento.
2. **Color y aire, no líneas.** Si algo necesita separarse, se le cambia el
   fondo o se le da espacio; nunca un borde.
3. **El color tiene significado.** El color de acento dice en qué categoría
   estás; no está para decorar.
4. **La máquina de escribir es para hacer cosas.** Navegación, botones,
   carrito, precios y datos de la ficha. Leer, en Work Sans.
5. **Accesible siempre.** Contraste AA, foco de 3px en tinta, papel o verde
   claro según el fondo, navegación con teclado y layout fluido desde 320px.

## Revisión contra «Evitar»

| Evitar                                                  | Cómo se resuelve                                                                                                        |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Fondo crema + serif + píldora                           | Fondo kraft con textura, bloques de color plenos, ilustraciones a mano, máquina de escribir y video real                |
| Etiquetas en mayúsculas con tracking sobre los títulos  | No hay antetítulos. Los datos chicos van en minúscula y abajo del título                                                |
| Resaltar una palabra del título                         | Cada título va en un solo color y un solo estilo                                                                        |
| Grillas de tarjetas iguales con el mismo radio y sombra | Sin sombras; el bloque es solo el fondo del dibujo, y el precio, el nombre y la marca quedan afuera, sobre el fondo     |
| Gradientes o resplandores                               | Solo colores planos y textura de papel. El único degradado es el de tinta sobre el video de la portada, por legibilidad |
| «→» en botones y «·» como separador                     | Sin flechas de texto. El separador es una hojita de yerba en SVG                                                        |
| Fade + slide up por sección                             | No hay. Solo se anima el ritual                                                                                         |
| Inter, Geist, Roboto, Playfair, Poppins                 | Se usan Fraunces (solo el logo), Instrument Serif, Work Sans y Courier Prime                                            |
