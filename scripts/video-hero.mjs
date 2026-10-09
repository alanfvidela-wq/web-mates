// Genera los videos del hero de la home a partir del video fuente.
// Uso: npm run video:hero  (requiere ffmpeg; en Windows: winget install Gyan.FFmpeg)
//
// Si cambiás el video fuente, revisá la configuración de abajo (tramo y recortes)
// y volvé a correrlo.
import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import path from "node:path";

const RAIZ = path.resolve(import.meta.dirname, "..");
const SALIDA = path.join(RAIZ, "public", "videos");

const CONFIG = {
  fuente: buscarFuente(),
  // Tramo del video fuente que se usa, en segundos. El clip ya es un loop
  // (primer cuadro = último, ver MEDIOS.md): se corta antes del último cuadro
  // para que no se repita al volver a empezar.
  inicio: 0,
  fin: 121 / 24,
  // Fundido cruzado entre el final y el principio; 0 si el clip ya cierra solo
  fundido: 0,
  fps: 24,
  maxBytes: 4 * 1024 * 1024,
  // Recortes en píxeles del video fuente (x, y, ancho, alto), sobre 1924×1076
  versiones: [
    {
      nombre: "hero-desktop",
      // Entero: el mate ya está a la derecha y la cortina a la izquierda
      recorte: { x: 2, y: 0, ancho: 1920, alto: 1076 },
      espejar: false,
    },
    {
      nombre: "hero-mobile",
      // 9:16 centrado sobre el mate, a alto completo
      recorte: { x: 948, y: 0, ancho: 606, alto: 1076 },
      espejar: false,
    },
  ],
};

function buscarFuente() {
  const candidatos = [
    "public/videos/fuentes/higgsfield/hero-loop.mp4",
  ].map((p) => path.join(RAIZ, p));
  const fuente = candidatos.find((p) => existsSync(p));
  if (!fuente) {
    throw new Error(`No encontré el video fuente. Probé:\n${candidatos.join("\n")}`);
  }
  return fuente;
}

function buscarFfmpeg() {
  const links = process.env.LOCALAPPDATA
    ? path.join(process.env.LOCALAPPDATA, "Microsoft", "WinGet", "Links", "ffmpeg.exe")
    : null;
  for (const bin of ["ffmpeg", links].filter(Boolean)) {
    try {
      execFileSync(bin, ["-version"], { stdio: "ignore" });
      return bin;
    } catch {}
  }
  throw new Error("No encontré ffmpeg. En Windows: winget install Gyan.FFmpeg");
}

const FFMPEG = buscarFfmpeg();

function ffmpeg(args) {
  execFileSync(FFMPEG, ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    stdio: "inherit",
  });
}

function filtro({ recorte, espejar }) {
  const { inicio, fin, fundido, fps } = CONFIG;
  const { x, y, ancho, alto } = recorte;
  const largo = fin - inicio;
  // Nunca se escala: solo se recorta, así que queda en la resolución original
  const base = [
    `trim=${inicio}:${fin}`,
    "setpts=PTS-STARTPTS",
    `fps=${fps}`,
    `crop=${ancho}:${alto}:${x}:${y}`,
    espejar && "hflip",
    "format=yuv420p",
  ]
    .filter(Boolean)
    .join(",");

  if (!fundido) return `[0:v]${base}[v]`;

  // El cuerpo arranca en `fundido` y termina fundiéndose con los primeros
  // `fundido` segundos: al volver a empezar, el loop continúa sin salto.
  return [
    `[0:v]${base},split[a][b]`,
    `[a]trim=${fundido}:${largo},setpts=PTS-STARTPTS[cuerpo]`,
    `[b]trim=0:${fundido},setpts=PTS-STARTPTS[cola]`,
    `[cuerpo][cola]xfade=transition=fade:duration=${fundido}:offset=${largo - 2 * fundido}[v]`,
  ].join(";");
}

function codificar(version) {
  const destino = path.join(SALIDA, `${version.nombre}.mp4`);
  // Arranca con buena calidad y comprime más hasta quedar por debajo del límite
  for (let crf = 18; crf <= 36; crf += 2) {
    ffmpeg([
      "-i", CONFIG.fuente,
      "-filter_complex", filtro(version),
      "-map", "[v]",
      "-an",
      "-c:v", "libx264",
      "-preset", "slow",
      "-crf", String(crf),
      "-profile:v", "high",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      destino,
    ]);
    const bytes = statSync(destino).size;
    if (bytes < CONFIG.maxBytes) {
      console.log(`${version.nombre}.mp4: ${(bytes / 1024 / 1024).toFixed(2)} MB (crf ${crf})`);
      return destino;
    }
  }
  throw new Error(`${version.nombre}.mp4 no baja de ${CONFIG.maxBytes} bytes`);
}

function poster(version, video) {
  // El primer frame del video final, para que el cambio poster → video no se note
  const destino = path.join(SALIDA, `${version.nombre}.webp`);
  ffmpeg(["-i", video, "-frames:v", "1", "-c:v", "libwebp", "-quality", "80", destino]);
  const kb = statSync(destino).size / 1024;
  console.log(`${version.nombre}.webp: ${kb.toFixed(0)} KB`);
}

console.log(`Fuente: ${path.relative(RAIZ, CONFIG.fuente)}`);
for (const version of CONFIG.versiones) {
  poster(version, codificar(version));
}
