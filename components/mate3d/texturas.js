import * as THREE from "three";
import { aleatorio } from "./geometria";

// Vetas horizontales para el mate de madera (se multiplican por el color base).
export function crearTexturaVeta() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  const azar = aleatorio(21);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y += 2 + azar() * 6) {
    ctx.fillStyle = `rgba(90, 55, 25, ${0.08 + azar() * 0.22})`;
    ctx.fillRect(0, y, canvas.width, 1 + azar() * 3);
  }

  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  return textura;
}

// Texto del grabado sobre fondo transparente, ajustado al ancho de la franja.
export function crearTexturaGrabado(texto, color, familia) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 192;
  const ctx = canvas.getContext("2d");

  let tamano = 120;
  do {
    ctx.font = `italic 700 ${tamano}px ${familia}`;
    tamano -= 4;
  } while (ctx.measureText(texto).width > 860 && tamano > 24);

  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(texto, canvas.width / 2, canvas.height / 2 + 6);

  ctx.lineWidth = 4;
  for (const y of [14, canvas.height - 14]) {
    ctx.beginPath();
    ctx.moveTo(140, y);
    ctx.lineTo(canvas.width - 140, y);
    ctx.stroke();
  }

  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  textura.anisotropy = 4;
  return textura;
}
