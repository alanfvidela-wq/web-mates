# Amargo — Sistema de diseño

Amargo es un almacén de mate que se lee como un recetario: la limpieza y la
tipografía gigante de graza.co, las fotos de cocina con luz de mañana de
alisoneroman.com y las manchas de color, los dibujos botánicos y el humor de
palais.bio. Bloques de color plano, mucho aire, nada de bordes. Lo que llama la
atención son las fotos propias (la mesa de la portada, la ronda, los momentos),
la rama de yerba que se dibuja sola y el Cimarrón, el mate con cara del pie.
Todo lo demás es tinta sobre papel, ordenado.

## Reglas de la estética

La vara es el header y el hero. Todo el sitio cumple estas reglas; si algo no
las cumple, se corrige.

1. **Sin líneas.** Nada de bordes, contornos, líneas divisorias, subrayados
   de sección ni cajas con sombra. La única línea permitida es el contorno de
   foco del teclado.
2. **Bloques de color a todo el ancho.** Cada sección es un bloque de fondo
   de lado a lado, con el contenido alineado a `--ancho-max` y `--gutter`. Los
   fondos alternan entre el claro de base (avena o papel), el verde yerba, la
   tinta y el acento de la categoría. **Nunca dos secciones seguidas con el
   mismo fondo** (el header sólido cuenta como papel). En la home, los bloques
   que siguen al manifiesto entran con **ola** (`.ola`): el borde de arriba
   ondulado, del mismo color del bloque. No es una línea, es el bloque que se
   asoma sobre el anterior.
3. **Aire generoso.** Las secciones llevan al menos `--espacio-16` arriba y
   `--espacio-24` abajo; dentro, los elementos se separan con espacio, no con
   cajas.
4. **Títulos grandes.** Instrument Serif 400, sentence case, interlineado 0.9
   y tracking `-0.02em`. Los títulos de página usan `--t-titulo-1`, la misma
   escala que el titular del hero, y los de sección `--t-titulo-2`, apenas
   menor: un título de sección nunca es mediano.
5. **La máquina hace cosas.** Navegación, botones, links, migas y etiquetas
   chicas (`.dato`: marcas, contadores, stock) van en Courier Prime bold. Los
   precios también van en Courier Prime. El texto para leer va en Work Sans.
6. **Botones en píldora, sin borde.** `.boton` es la acción principal: verde
   yerba vivo con texto en tinta. `.boton-secundario` es la secundaria: papel
   con texto en tinta. Mínimo 48px de alto (56px en el hero).
7. **El patrón del hero.** Cada bloque importante dice una cosa: un título,
   una frase corta (34–46ch como máximo) y, si hace falta, una acción.
8. **Productos sin recuadro.** La foto (sin fondo) va sobre una **mancha**
   suave del color de su categoría (una forma orgánica, distinta en cada
   tarjeta de la fila), sin borde, con una sombra de contacto sutil debajo del
   producto. Debajo, el nombre en Instrument Serif
   (dos líneas como máximo, alto fijo), la marca como `.dato` y el precio en
   Courier Prime: marca y precio quedan alineados en toda la fila.
9. **Listas sin líneas.** «Qué hay en el almacén», la ficha de producto y
   cualquier lista se separan con espacio o con fondos alternados.
10. **Footer como bloque.** Verde yerba sólido, el logo «Amargo» grande, los
    links en Courier Prime, sin líneas.
11. **La voz del hero.** Textos cortos, rioplatenses, con humor matero sin
    forzar. Una frase por lugar.

## Estructura de la home

1. **Portada**: a pantalla completa (100svh), con el header flotando
   transparente encima. La foto de la mesa de la mañana (mate, termo, yerba y
   medialunas junto a una cortina con sombras de hojas), con un loop de video
   encima cuando está. El titular «Que no se corte la ronda» va en tinta sobre
   la cortina clara, abajo a la izquierda, con una frase corta, la píldora
   «Armá tu combo» y un sello amarillo que gira. Ver «Portada».
2. **Marquesina** (verde): las leyendas de la casa corriendo de derecha a
   izquierda, separadas por hojitas. Se frena con el mouse encima.
3. **Manifiesto** (avena): «Un mate bien cebado / arregla casi todo.» en dos
   líneas gigantes, la segunda corrida a la derecha y en verde, como en un
   afiche. Debajo, una rama de yerba que se dibuja sola y una frase.
4. **Lo que más sale** (papel, con ola): los destacados en una fila, cada uno
   sobre su mancha.
5. **Cómo cebar un buen mate** (tinta, con ola): la receta de la casa. La foto
   de la ronda (dos manos pasándose el mate) queda fija a la izquierda
   mientras se leen, a la derecha, los datos (rinde, tiempo, dificultad), lo
   que hace falta y los cinco pasos con su número en un sello amarillo. Cierra
   con «¿Te falta algo? Armá tu combo».
6. **Para cada ronda** (avena, con ola): la mañana, la ruta y la plaza, con
   una foto cada una y el link a la categoría que la resuelve. En mobile se
   pasan de costado.
7. **Qué hay en el almacén** (papel, con ola): la única sección de
   categorías de la home. Cada categoría es una fila en un bloque suave de su
   color; al pasar el mouse el producto se ladea.
8. **Footer** (verde, con ola).

El contenido editorial (leyendas, receta, momentos) está en `lib/home.js`.

Secuencia de fondos de la home: foto → verde → avena → papel → tinta → avena
→ papel → verde. En las demás páginas: header papel → acento de la categoría
(solo en categoría) → avena → verde.

## Header

- **Aire arriba.** `--espacio-6` de margen superior en escritorio y mobile:
  ni el logo ni la píldora del carrito tocan el borde. Logo a 2.75rem.
- **Fijo y flotante.** En la home arranca transparente sobre la foto, con el
  mismo texto en tinta (la foto es clara arriba). Cuando se scrollea (un poco
  antes de terminar el hero, para que el titular no pase por debajo) pasa a
  fondo papel, con una transición de 300ms. En las demás páginas es sólido
  desde el principio.
  Mide su alto y lo publica en `--alto-header`; el contenido arranca debajo.
- **Sin franjas.** No hay líneas de color abajo ni arriba.
- **Navegación** en Courier Prime bold; al pasar el mouse se subraya.
- **Carrito**: píldora clara con el texto «Carrito [0]» y la cantidad, en
  lugar de un ícono. La cantidad se lee en el servidor (`lib/carrito.js`).

## Portada

- **Foto**: la mesa de la mañana, generada con Higgsfield (ver «Fotos y
  video» y `MEDIOS.md`). Composición pensada para el texto: el mate a la
  derecha y la cortina clara a la izquierda.
- **Velo de avena**: un degradado de avena desde la izquierda (desde abajo en
  mobile) que aclara la cortina lo justo para que el titular en tinta se lea.
  Es la única excepción a los colores planos.
- **Loop**: 5 segundos de Kling 2.5 Turbo Pro (Artlist) con la foto como
  primer y último cuadro: el vapor sube y las sombras de las hojas se mueven
  en la cortina, con la cámara quieta. Primer y último cuadro casi idénticos
  (SSIM 0,994) y sin cortes adentro. `npm run video:hero`
  (`scripts/video-hero.mjs`) arma dos versiones H.264 sin audio, sin escalar
  y de menos de 4 MB: `hero-desktop` entera (1920×1076) y `hero-mobile`, un
  recorte 9:16 centrado en el mate. Corta el último cuadro, que repite el
  primero, para que el loop no se trabe.
- **Poster**: el primer cuadro de cada versión en WebP. Lo pinta el servidor
  en un `<picture>`, así se ve desde el primer momento y sin saltos; el video
  se monta encima desde un componente cliente (`VideoFondo`), que elige la
  versión según el ancho (corte en 760px).
- **Sello**: círculo amarillo con «Elaborada con palo, cebada con paciencia,»
  en máquina de escribir, girando despacio al lado del botón.
- **Control**: si hay video, círculo claro sin borde con el ícono de
  pausa/play en tinta, abajo a la derecha (arriba en mobile), con etiqueta
  accesible.

## Concepto: «bloques, aire y etiquetas»

- **Bloques en vez de bordes.** Las secciones se separan con color de fondo
  (avena, papel, verde, tinta, el acento de la categoría) y con espacio
  generoso. No hay bordes, contornos, filetes ni estantes.
- **El producto en su mancha.** Cada producto es una foto real sobre una
  mancha suave del color de su categoría (acento al 16% sobre papel; al 30% al
  pasar el mouse, cuando además cambia de forma). Debajo: nombre, marca y precio a
  máquina. Ver «Fotos de producto».
- **La etiqueta.** La ficha de producto se lee como el dorso de un paquete:
  un bloque papel con filas alternadas, sin líneas.
- **Sellos** ovalados y rellenos (no contorneados), en serif itálica:
  «Sin stock», «Próximamente», «404», el sello de la categoría y el número de
  cada paso de la receta.

## Paleta

Seis colores planos y dos verdes derivados, sin gradientes (la única
excepción es el degradado de tinta sobre el video de la portada, para que el
texto y el header se lean). Las variantes más claras u oscuras salen de
mezclarlos (`color-mix`), no son colores nuevos.

| Token        | Nombre           | Hex       | Uso                                               |
| ------------ | ---------------- | --------- | ------------------------------------------------- |
| `--kraft`    | Avena            | `#EFE4CF` | Fondo general, con una textura de papel muy sutil |
| `--tinta`    | Tinta            | `#1F1A14` | Texto y bloque de la receta                       |
| `--verde`    | Verde yerba      | `#1F5135` | Logo, leyendas, footer, categoría Yerbas          |
| `--rojo`     | Rojo almacén     | `#BF3A1E` | Sellos, «sin stock», categoría Mates              |
| `--amarillo` | Amarillo paquete | `#E9AE1B` | Categoría Bombillas                               |
| `--azul`     | Azul enlozado    | `#2C4B6B` | Categoría Termos, links en el texto               |

Derivados: `--papel` (avena con blanco: header sólido, bloques de producto,
ficha, botones secundarios), `--kraft-oscuro` (avena con tinta: texto
secundario), `--verde-vivo` (`#7DC243`, verde yerba vivo y saturado: la acción
principal, `.boton`) y `--verde-claro` (verde yerba aclarado, ≈ `#A3C388`:
hover del carrito y de los botones secundarios, hojitas).

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

Contrastes medidos (WCAG): tinta sobre avena 13:1, tinta sobre verde vivo
7,95:1, tinta sobre verde claro 8,8:1, papel sobre rojo 6,9:1, tinta sobre amarillo 8,6:1, papel sobre azul
7,8:1, papel sobre verde 9:1 y rojo sobre avena 4,6:1 (solo texto grande o en
negrita).

## Tipografía

Inspirada en Graza: una serif gorda para la marca, una serif de libro
estrecha para los títulos, una sans amable para leer y una máquina de
escribir para la navegación, los botones y las etiquetas. **Todo va en
sentence case**: no hay mayúsculas sostenidas en ningún lado.

| Rol     | Fuente           | Uso                                                                                                 |
| ------- | ---------------- | --------------------------------------------------------------------------------------------------- |
| Logo    | Fraunces         | Solo el wordmark «Amargo»: peso 900 y eje `SOFT` al máximo                                          |
| Títulos | Instrument Serif | Un solo peso (400), tracking `-0.02em`. Los principales van muy grandes. Itálica solo en los sellos |
| Texto   | Work Sans        | Solo texto para leer: bajadas, descripciones, legales                                               |
| Máquina | Courier Prime    | Bold: navegación, migas, botones, links, carrito y etiquetas chicas (`.dato`). Precios y ficha      |

### Logo

El logo es el wordmark «Amargo» en Fraunces 900 con `SOFT` 100: gordo y de
terminales redondeadas, como el de Graza. Es solo texto, sin dibujo (se sacó
la montañita que hacía de tilde de la ñ). Va en verde yerba sobre el header
claro y en papel sobre el video. En el footer va gigante (hasta 11rem), en
papel sobre verde.

### Escala

| Token          | Tamaño                     | Uso                                        |
| -------------- | -------------------------- | ------------------------------------------ |
| `--t-dato`     | 0.8125rem (13px)           | Datos chicos (marcas, contadores)          |
| `--t-texto`    | 1rem                       | Texto corrido                              |
| `--t-entrada`  | 1.1875rem                  | Bajadas y descripciones                    |
| `--t-titulo-3` | 2rem                       | Nombre de producto en la grilla            |
| `--t-titulo-2` | clamp(3rem, 7vw, 6.5rem)   | Títulos de sección, de producto y de carga |
| `--t-titulo-1` | clamp(3.5rem, 9vw, 8.5rem) | Hero, categoría, error y 404               |

Interlineado: 0.88–0.95 para los títulos y 1.55 para el texto.

## Formas

- **Sin bordes ni líneas.** Nada se contornea ni se subraya con filetes. La
  única línea que queda es el contorno de foco del teclado (accesibilidad).
- **Píldoras** (`border-radius: 999px`) para botones, CTA y carrito.
  `.boton` es la acción principal en verde yerba vivo; `.boton-secundario`,
  papel.
- **Manchas** para los productos: radios elípticos distintos en cada tarjeta
  de la fila (tres formas que se repiten), que cambian de forma al pasar el
  mouse.
- **Fondos redondeados** (`--radio`, 16px) para opciones del selector, ficha
  y frente del producto; `--radio-grande` (28px) para las fotos de la home y
  las filas de categorías.
- **Ola** (`.ola`) en el borde de arriba de los bloques de la home y del
  footer.
- **Círculos** para los botones de ícono (pausa del video) y el sello de la
  portada.
- **Óvalo relleno** para los sellos y los números de la receta.
- **Sin sombras de caja.** La profundidad sale de los bloques de color planos.
  La única sombra es la de contacto debajo de cada foto de producto (sigue
  la forma del producto, nunca la de la tarjeta).

## Fotos de producto

El catálogo usa fotos reales, al nivel de las fotos de la home: en las tarjetas,
en la página de producto, en el encabezado de cada categoría y en «Qué hay en
el almacén» (una foto representativa por categoría, en `CATEGORIAS`).

- **Origen.** Productos de marca: foto del modelo, de la marca o de una tienda
  conocida (Carrefour, Jumbo, Mercado Libre). Artesanales: foto del tipo de
  producto, de tiendas de mate. El detalle está en
  `public/productos/CREDITOS.md`.
- **Misma sesión.** `npm run fotos:productos` (`scripts/fotos-productos.mjs`)
  baja cada original a `public/productos/fuente/` (fuera de git), le saca el
  fondo, limpia restos sueltos, recorta al contorno y centra el producto en
  1000×1000 con fondo transparente, todos a la misma escala (caja de 820px) y
  con el mismo margen. Sale WebP en `public/productos/<slug>.webp`.
- **En pantalla.** `FotoProducto` usa `next/image` con `fill` y
  `object-fit: contain`, y le pone la sombra de contacto (`drop-shadow` en
  tinta, muy suave).

## Fotos y video

Las fotos de la home (portada, la ronda y los tres momentos) se generaron con
Higgsfield, Nano Banana Pro a 2K; el loop de la portada, con Kling 2.5 Turbo
Pro en Artlist. Las fotos comparten la misma receta: película de
35mm, grano suave, luz natural cálida, foco corto, paleta de crema, avena,
verde oliva, terracota y marrón, sin caras, sin texto y sin marcas. El mate
es siempre el mismo: calabaza forrada en cuero marrón con virola de alpaca y
bombilla de plata. Los prompts, los trabajos y los créditos están en
`MEDIOS.md`. Los originales quedan en `public/videos/fuentes/` (fuera de git);
en `public/fotos/` van los WebP.

## Ilustración

Los dibujos son SVG hechos a mano, con trazo de tinta de 2.5px, puntas
redondeadas y líneas un poco irregulares. El relleno es plano. Ya no
representan productos (para eso están las fotos): quedan el mate, el termo y
el paquete del bodegón de «Armá tu combo», la pava (pantalla de carga), el
termo volcado (error), el mate lavado (404) y la hojita separadora. Además:

- **Rama de yerba** (`RamaYerba`): tallo, siete hojas alternadas con su
  nervadura y un racimo de frutitos, como un grabado de botánica. Cada trazo
  tiene `pathLength="1"` para poder dibujarse de punta a punta.
- **El Cimarrón** (`Cimarron`): el mate de la casa con cara, cachetes y
  vapor. Vive en el footer, sentado sobre la última letra del logo.
- **Sello redondo** (`SelloRedondo`): texto en círculo alrededor de una
  hojita, como el sello de un paquete viejo.

## Voz

Rioplatense, breve y con humor matero sin forzar. Una frase por lugar, no un
chiste por línea. Ejemplos: «Que no se corte la ronda», «Elaborada con palo»,
«Se nos lavó el mate», «Cambiar la yerba», «Para la ronda larga».

## Movimiento

Cada bloque de la home tiene un movimiento propio, que tiene que ver con lo
que muestra. Nada entra con fundido y desplazamiento genérico.

- **Portada**: el loop de video (vapor y sombras de hojas) y el sello que
  gira. El video se puede pausar.
- **Marquesina**: la cinta corre sola; se frena con el mouse encima.
- **Manifiesto**: la rama de yerba se dibuja con el scroll: primero el tallo,
  después cada hoja cuando el tallo pasa por su lugar, y al final brotan los
  frutitos.
- **Lo que más sale**: la mancha cambia de forma y el producto se levanta y se
  ladea al pasar el mouse.
- **Receta**: la foto se acomoda al entrar y los números de los pasos se
  estampan como un sello de goma.
- **Para cada ronda**: las fotos se revelan como un rollo recién salido (de
  sepia lavado a color) y se acercan apenas al pasar el mouse.
- **Qué hay en el almacén**: el producto de cada fila se ladea al pasar el
  mouse.
- **Footer**: el Cimarrón parpadea, se hamaca y le sale vapor.
- El header cambia de transparente a sólido con una transición suave.
- Lo atado al scroll usa `animation-timeline: view()`. Donde el navegador no
  lo soporta, todo se ve quieto y completo.
- Con `prefers-reduced-motion` la portada muestra solo la foto, sin video,
  la marquesina queda quieta (y baja de línea si no entra) y no
  hay animaciones ni transiciones.

## Principios

1. **El mate es la estrella.** En la portada, la mesa con el mate; en la
   receta, el mate pasando de mano en mano; en el pie, el Cimarrón.
2. **Color y aire, no líneas.** Si algo necesita separarse, se le cambia el
   fondo o se le da espacio; nunca un borde.
3. **El color tiene significado.** El color de acento dice en qué categoría
   estás; no está para decorar.
4. **La máquina de escribir es para hacer cosas.** Navegación, botones,
   links, carrito, etiquetas chicas, precios y datos de la ficha. Leer, en
   Work Sans.
5. **Cada movimiento cuenta algo.** Se dibuja, se revela, se estampa, gira o
   parpadea; nunca aparece por aparecer.
6. **Accesible siempre.** Contraste AA, foco de 3px en tinta, papel o verde
   claro según el fondo, navegación con teclado y layout fluido desde 320px.

## Revisión contra «Evitar»

| Evitar                                                  | Cómo se resuelve                                                                                                               |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Fondo crema + serif + píldora                           | Avena con textura de papel, manchas de color orgánicas, olas, dibujos a mano, el Cimarrón, máquina de escribir y fotos propias |
| Etiquetas en mayúsculas con tracking sobre los títulos  | No hay antetítulos. Los datos chicos van en minúscula y abajo del título                                                       |
| Resaltar una palabra del título                         | Cada línea va en un solo color y un solo estilo (la segunda línea del manifiesto es entera verde)                              |
| Grillas de tarjetas iguales con el mismo radio y sombra | Sin sombra de tarjeta; cada producto tiene su propia mancha, y el precio, el nombre y la marca quedan afuera                    |
| Gradientes o resplandores                               | Solo colores planos y textura de papel. El único degradado es el velo de avena de la portada, por legibilidad                  |
| «→» en botones y «·» como separador                     | Sin flechas de texto. El separador es una hojita de yerba en SVG; en el sello, comas                                           |
| Fade + slide up por sección                             | No hay. Cada bloque tiene su movimiento propio (ver «Movimiento»)                                                              |
| Inter, Geist, Roboto, Playfair, Poppins                 | Se usan Fraunces (solo el logo), Instrument Serif, Work Sans y Courier Prime                                                   |
