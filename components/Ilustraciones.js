// Ilustraciones dibujadas a mano: trazo de tinta, relleno plano.
// El color del relleno llega por `color`; el trazo usa currentColor.

const TRAZO = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function Lienzo({ children, titulo, className, viewBox = "0 0 200 200" }) {
  return (
    <svg
      viewBox={viewBox}
      className={className}
      role={titulo ? "img" : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
      focusable="false"
    >
      <g {...TRAZO}>{children}</g>
    </svg>
  );
}

export function Mate({ color = "#7a3b22", yerba = "#6d7a36", ...props }) {
  return (
    <Lienzo {...props}>
      <path
        d="M57 93c-13 19-12 57 11 75 18 14 47 15 65 0 22-18 24-55 10-75"
        fill={color}
      />
      <path d="M60 112c26 6 54 6 82 0" strokeDasharray="3 7" />
      <path d="M54 92c1-13 91-14 93 0 1 12-92 14-93 0Z" fill="#e8e3d6" />
      <path d="M66 91c6-7 63-8 68 0-6 6-62 7-68 0Z" fill={yerba} />
      <path d="M110 90 135 30c2-5 7-8 13-7" strokeWidth="5" stroke="#9a9a92" />
      <path d="M110 90 135 30c2-5 7-8 13-7" />
    </Lienzo>
  );
}

export function Termo({ color = "#2f5a26", ...props }) {
  return (
    <Lienzo {...props}>
      <path
        d="M70 58c-2 40-2 82 1 115 1 6 6 9 12 9h35c6 0 11-3 12-9 3-33 3-75 1-115Z"
        fill={color}
      />
      <path
        d="M75 50c-1-9 4-13 11-13h28c8 0 12 4 11 13l1 8H74Z"
        fill="#e8e3d6"
      />
      <path d="M90 37c0-7 4-10 10-10s10 3 10 10" />
      <path d="M131 75c14 1 17 10 17 28s-3 26-17 27" />
      <path d="M80 78v76M120 82v70" strokeOpacity="0.35" />
    </Lienzo>
  );
}

export function PaqueteYerba({ color = "#5b7f2e", ...props }) {
  return (
    <Lienzo {...props}>
      <path d="M58 40c26-3 58-3 84 0l4 140c-31 3-62 3-92 0Z" fill="#efe7d6" />
      <path d="M58 40l-4-14c30-4 62-4 92 0l-4 14" fill="#e2d6bd" />
      <path d="M57 84c28 3 57 3 86 0l1 40c-29 3-58 3-88 0Z" fill={color} />
      <path d="M74 60h52M80 68h40" />
      <path d="M100 140c-12 7-14 20-4 27 10-8 13-19 4-27Z" fill={color} />
      <path d="M100 145v20" />
      <path d="M76 101h48M84 109h32" stroke="#f3ecdc" />
    </Lienzo>
  );
}

export function Pava(props) {
  return (
    <Lienzo {...props}>
      <path d="M60 96c-4 30 2 60 14 74h56c12-14 18-44 14-74Z" fill="#c9cbc4" />
      <path d="M60 96c10-8 74-8 84 0" />
      <path d="M88 86c0-7 6-10 12-10s12 3 12 10" />
      <path d="M144 112c18-4 26-14 32-30l-4-3c-6 12-14 18-27 20" />
      <path d="M70 92c0-26 64-26 64 0" strokeWidth="4" />
      <path
        className="vapor"
        d="M160 64c-6-8 6-12 0-20M172 58c-6-8 6-12 0-20"
      />
    </Lienzo>
  );
}

export function TermoVolcado(props) {
  return (
    <Lienzo {...props}>
      <path d="M30 150c40 6 90 8 140 2" />
      <path
        d="M44 118c38-4 76-4 108 0 5 1 8 6 7 12-1 5-5 8-10 8-34 2-68 2-102-1-6 0-9-5-9-10 0-5 2-8 6-9Z"
        fill="#2c4b6b"
      />
      <path d="M152 118c10-1 13 4 13 10s-3 11-13 10Z" fill="#e8e3d6" />
      <path d="M168 132c8 6 16 10 18 18-10 4-24 2-30-4" fill="#a9c4d8" />
      <path d="M176 112c2-6 6-8 10-6M182 120c4-2 7-1 8 2" />
    </Lienzo>
  );
}

export function Hojita({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g {...TRAZO} strokeWidth="2">
        <path
          d="M5 19C4 11 9 5 19 4c1 9-5 15-14 15Z"
          fill="currentColor"
          fillOpacity="0.25"
        />
        <path d="M5 19 14 10" />
      </g>
    </svg>
  );
}

// Hoja de yerba: elíptica y con punta, con la nervadura al medio.
// Mide 64 de largo y nace en (0, 0) hacia la derecha.
const HOJA = "M0 0C12-15 44-19 64-3 46 9 15 11 0 0Z";
const NERVIO = "M3 0C22-3 42-5 60-3";

// Las hojas de la rama, alternadas a los dos lados del tallo
const HOJAS_RAMA = [
  { x: 52, y: 160, giro: -100, escala: 0.62 },
  { x: 84, y: 150, giro: 12, escala: 0.8 },
  { x: 124, y: 133, giro: -72, escala: 0.95 },
  { x: 168, y: 113, giro: 22, escala: 1 },
  { x: 210, y: 90, giro: -58, escala: 0.9 },
  { x: 248, y: 67, giro: 30, escala: 0.74 },
  { x: 290, y: 40, giro: -24, escala: 0.62 },
];

// Rama de yerba mate (Ilex paraguariensis) dibujada con trazos sueltos, como
// un grabado de botánica. Cada trazo lleva pathLength="1" para que el CSS lo
// pueda dibujar de punta a punta (ver .rama en las hojas de estilo).
export function RamaYerba({ className, relleno = "currentColor" }) {
  return (
    <svg
      viewBox="0 0 330 190"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g {...TRAZO} strokeWidth="2">
        <path
          className="trazo"
          pathLength="1"
          d="M14 178C70 160 140 132 200 98S280 44 314 26"
        />
        {HOJAS_RAMA.map(({ x, y, giro, escala }, i) => (
          <g
            key={`${x}-${y}`}
            className="ramita"
            transform={`translate(${x} ${y}) rotate(${giro}) scale(${escala})`}
            style={{ "--orden": i }}
          >
            <path
              className="trazo hoja"
              pathLength="1"
              d={HOJA}
              fill={relleno}
              fillOpacity="0.14"
            />
            <path className="trazo" pathLength="1" d={NERVIO} />
          </g>
        ))}
        {/* Racimo de frutitos al pie de una hoja */}
        <path className="trazo" pathLength="1" d="M104 143c2 8 0 14-5 19" />
        <circle className="fruto" cx="98" cy="165" r="4.5" fill={relleno} />
        <circle className="fruto" cx="108" cy="163" r="4" fill={relleno} />
        <circle className="fruto" cx="102" cy="173" r="3.5" fill={relleno} />
      </g>
    </svg>
  );
}

// El Cimarrón: el mate de la casa, con cara. Parpadea y le sale vapor
// (las animaciones viven en el CSS de quien lo usa: .ojo y .vapor).
export function Cimarron({ className, color = "#8a3b1e" }) {
  return (
    <svg
      viewBox="0 0 160 190"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g {...TRAZO} strokeWidth="3">
        <path className="vapor" d="M58 40c-8-9 6-14-1-24" />
        <path className="vapor" d="M74 34c-8-9 6-14-1-24" />
        <path d="M100 74 122 16c2-5 6-7 11-6" strokeWidth="7" stroke="#b9b7ad" />
        <path d="M100 74 122 16c2-5 6-7 11-6" />
        <path
          d="M34 82c-14 22-13 62 12 82 19 15 50 16 69 0 23-20 25-60 10-82Z"
          fill={color}
        />
        <path
          d="M30 80c1-14 99-15 101 0 1 13-100 15-101 0Z"
          fill="#e3e1d8"
        />
        <path d="M44 79c7-7 66-8 72 0-7 6-65 7-72 0Z" fill="#6d7a36" />
        <ellipse className="ojo" cx="62" cy="116" rx="4.5" ry="7" fill="currentColor" />
        <ellipse className="ojo" cx="98" cy="116" rx="4.5" ry="7" fill="currentColor" />
        <path d="M70 134c6 7 14 7 20 0" />
        <ellipse cx="50" cy="132" rx="7" ry="4.5" fill="#e98a6b" stroke="none" />
        <ellipse cx="110" cy="132" rx="7" ry="4.5" fill="#e98a6b" stroke="none" />
      </g>
    </svg>
  );
}

// Sello redondo con texto en círculo, como el de un paquete viejo. El texto
// gira (clase .giro); la hojita del centro queda quieta.
export function SelloRedondo({ texto, className }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <path id="circulo-sello" d="M100 100m-72 0a72 72 0 1 1 144 0a72 72 0 1 1-144 0" />
      </defs>
      <circle cx="100" cy="100" r="98" fill="var(--fondo-sello, currentColor)" />
      <g className="giro">
        <text className="textoSello">
          <textPath href="#circulo-sello" textLength="448">
            {texto}
          </textPath>
        </text>
      </g>
      <g transform="translate(70 70) scale(2.5)" {...TRAZO} strokeWidth="1.6">
        <path
          d="M5 19C4 11 9 5 19 4c1 9-5 15-14 15Z"
          fill="currentColor"
          fillOpacity="0.25"
        />
        <path d="M5 19 14 10" />
      </g>
    </svg>
  );
}

export function FlechaAbajo(props) {
  return (
    <Lienzo viewBox="0 0 24 32" {...props}>
      <path
        d="M12 3c-1 8 1 16 0 24M5 20c3 3 5 6 7 8 2-3 4-5 7-8"
        strokeWidth="2"
      />
    </Lienzo>
  );
}
