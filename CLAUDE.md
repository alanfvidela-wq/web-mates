@AGENTS.md
# Proyecto Boldy

E-commerce de Boldy, una tienda retail multimarca de zapatillas, para la materia
Programación Web (ITBA). Vende modelos de marcas reales y tiene una línea propia "Boldy".
Dos mecánicas: drops (lanzamientos limitados con fecha y stock) y, más adelante,
un personalizador que aplica SOLO a la línea propia Boldy.

## Stack
- Next.js con App Router, JavaScript (sin TypeScript), sin Tailwind.
- Estilos: CSS Modules + variables CSS en app/globals.css.
- Datos simulados en lib/ con funciones async; después se migra a Supabase.

## Cómo trabajar
- Trabajá de forma autónoma, sin pedir confirmación en cada paso. Respuestas breves.
- Al terminar cada tarea, verificá que `npm run build` no tenga errores y hacé un commit con un mensaje descriptivo.
- No instales dependencias nuevas salvo que sea imprescindible.
- Server Components por defecto; "use client" solo donde haya interactividad.
- Precios y stock siempre se validan en el servidor, nunca se confía en el cliente.
- Precios en ARS como enteros.
- La línea propia Boldy y su personalizador tienen diseño original: no reproducir siluetas ni logos de otras marcas.