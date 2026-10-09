# Medios generados — registro

Fotos y video de la home hechos con IA. Cada trabajo queda anotado con su
modelo, su costo y su prompt, para poder rehacerlo igual. Los originales están
en `public/videos/fuentes/higgsfield/` (fuera de git); los WebP que usa el
sitio, en `public/fotos/` y `public/videos/`.

## Créditos

| Fecha      | Servicio   | Trabajo                         | Modelo                   | Costo      | Resultado                          |
| ---------- | ---------- | ------------------------------- | ------------------------ | ---------- | ---------------------------------- |
| 2026-10-09 | Higgsfield | `88e68fde` mesa de la mañana    | Nano Banana Pro 2K, 16:9 | 2          | `public/videos/hero-*.webp`        |
| 2026-10-09 | Higgsfield | `4ea471df` la ronda             | Nano Banana Pro 2K, 4:5  | 2          | `public/fotos/la-ronda.webp`       |
| 2026-10-09 | Higgsfield | loop del hero (Seedance Mini)   | Seedance 2.0 Mini 720p   | 0 (falló)  | Rechazado: el plan free no hace video |
| 2026-10-09 | Higgsfield | `31d1e547` la de la mañana      | Nano Banana Pro 2K, 4:5  | 2          | `public/fotos/la-de-la-manana.webp` |
| 2026-10-09 | Higgsfield | `396fcac0` la de la ruta        | Nano Banana Pro 2K, 4:5  | 2          | `public/fotos/la-de-la-ruta.webp`  |
| 2026-10-09 | Higgsfield | `eb94df6c` la de la plaza       | Nano Banana Pro 2K, 4:5  | 2          | `public/fotos/la-de-la-plaza.webp` |
|            |            |                                 | **Total Higgsfield**     | **10 / 10** |                                    |
| 2026-10-09 | Artlist    | `01a11ecd` loop del hero        | Kling 2.5 Turbo Pro 1080p, 5 s | 0 (video gratis) | `public/videos/hero-*.mp4` |

En Artlist, Omni 1.1 Interpolation y Seedance 2.0 Mini figuraban como gratis
pero cotizaban 1.250 y 480 créditos; Kling 2.5 Turbo Pro sí salió por el video
gratis de la prueba.

Control del loop: primer cuadro contra último, SSIM 0,994; cuadros vecinos,
SSIM mínimo 0,998 (sin cortes adentro). El clip sale a 1924×1076 y 24 fps.

## La receta común

Todas las fotos comparten: película de 35mm, grano suave, foco corto, luz
natural cálida, paleta de crema, avena, verde oliva, terracota y marrón, sin
caras, sin texto, sin logos ni marcas. El mate es siempre el mismo: calabaza
forrada en cuero marrón oscuro, virola de alpaca pulida, yerba verde y
bombilla de plata. Al lado, casi siempre, un termo verde oscuro.

## Prompts

### Mesa de la mañana (portada)

> Editorial lifestyle photograph shot on 35mm film, warm early-morning sunlight
> through a window. A rustic wooden table covered with a cream linen
> tablecloth. Slightly right of center sits a traditional Argentine mate gourd:
> a calabaza wrapped in dark brown leather with a polished silver alpaca rim,
> filled with bright green yerba mate, a silver bombilla straw standing in it,
> a soft wisp of steam rising. Beside it a vintage dark green enamel thermos
> with its cap off, a small kraft paper bag of loose yerba, and a ceramic plate
> with two medialunas. Dappled shadows of tree leaves fall across the
> tablecloth. Camera at table height, three-quarter angle, 35mm lens, shallow
> depth of field, gentle film grain. Muted warm palette: cream, oat, olive
> green, terracotta, brown. The left third of the frame is calm and
> uncluttered: soft tablecloth and blurred warm background. No people, no
> text, no logos, no labels.

Recortes: escritorio, la foto entera a 1920px; mobile, 864×1536 desde x=1357
(centrado en el mate) y bajado a 720×1280.

### La ronda (receta)

> Candid editorial photograph shot on 35mm film, warm golden late-afternoon
> light, in a leafy garden patio in Buenos Aires. Close-up of two hands passing
> a traditional mate gourd across a wooden table: one hand offers it, the
> other reaches to take it. The gourd is a calabaza wrapped in dark brown
> leather with a polished silver alpaca rim, filled with green yerba mate, with
> a silver bombilla straw. Natural relaxed fingers, realistic anatomy, linen
> shirt sleeves in cream and olive. On the table, a cream linen cloth and a
> dark green thermos, slightly out of focus. Background of soft blurred green
> plants and sun flares. Shallow depth of field, gentle film grain, muted warm
> palette of cream, olive green, terracotta. Faces not visible, no text, no
> logos, no labels.

### Momentos

Las tres empiezan con la receta común:

> Editorial lifestyle photograph shot on 35mm film, gentle film grain, shallow
> depth of field, muted warm palette of cream, oat, olive green, terracotta
> and brown, candid and unstaged like a cookbook photo. The mate gourd is a
> traditional calabaza wrapped in dark brown leather with a polished silver
> alpaca rim, filled with green yerba mate, with a silver bombilla straw. No
> faces visible, no text, no logos, no labels, no brand names.

- **La de la mañana**: Morning in a small Buenos Aires kitchen: soft window
  light falls on a tiled counter in cream and terracotta. The mate sits next
  to a kraft paper bag of loose yerba, a small enamel pot of hot water, a
  folded newspaper and a cup with spoons. One hand rests near the gourd.
  Vertical composition, the mate in the lower middle, calm empty wall above.
- **La de la ruta**: Road trip: inside a vintage car parked on a quiet country
  road in the Argentine pampas at golden hour. On the dashboard, the mate and
  a dark green thermos lean together; through the windshield, a soft blurred
  field of tall grass and a low sun. A hand on the steering wheel at the edge
  of the frame. Vertical composition.
- **La de la plaza**: Afternoon in a city park: a cream and olive striped
  picnic blanket on green grass, dappled shade from a big tree. On the
  blanket, a brown leather mate bag (matera) open, the mate, a dark green
  thermos, a small yerbera tin and a paper bag of bizcochitos. A hand reaching
  for the mate. Shot from slightly above. Vertical composition.

### Loop del hero

Kling 2.5 Turbo Pro en Artlist, 16:9, 5 s, 1080p. Primer y último cuadro: la
mesa de la mañana. Prompt negativo: «camera movement, zoom, pan, dolly,
people, hands, text, logos, objects moving, cuts, flicker».

> Locked-off static camera on a tripod, absolutely no camera movement, no
> zoom, no pan. Same framing as the image the whole time. A soft wisp of steam
> slowly rises and curls from the mate gourd. The dappled leaf shadows on the
> sheer curtain and the tablecloth sway gently, as if a light breeze moves the
> tree outside the window. The sheer curtain breathes very slightly. Warm
> morning light flickers softly. Every object stays exactly in place: the
> mate, the bombilla, the green thermos, the paper bag, the croissants. Calm,
> quiet, slow. Seamless loop: the last frame is identical to the first frame.
