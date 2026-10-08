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

export function Bombilla({ color = "#b7a37a", ...props }) {
  return (
    <Lienzo {...props}>
      <path
        d="M96 150 94 52c-1-14 6-24 19-27l9-2"
        strokeWidth="9"
        stroke={color}
      />
      <path d="M91 150 89 52c-1-17 8-29 24-32l9-2M101 150l-2-97c0-10 4-17 14-19l10-2" />
      <path d="M84 150c-4 20 4 31 15 31s20-11 16-31Z" fill={color} />
      <path d="M93 160v12M100 158v15M107 160v12" />
      <path d="M89 72c4 2 7 2 11 0" />
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

export function Matera({ color = "#7b4a2a", ...props }) {
  return (
    <Lienzo {...props}>
      <path d="M68 80c0-40 64-40 64 0" strokeWidth="6" stroke={color} />
      <path d="M64 80c0-46 72-46 72 0M72 80c0-34 56-34 56 0" />
      <path
        d="M48 80h104l-6 92c-1 6-5 9-11 9H65c-6 0-10-3-11-9Z"
        fill={color}
      />
      <path d="M56 98h88" strokeDasharray="4 6" />
      <path d="M86 120h28v22H86Z" fill="#e8e3d6" />
      <path d="M58 168h84" strokeDasharray="4 6" />
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

export function BolsaAlmacen(props) {
  return (
    <Lienzo viewBox="0 0 32 32" {...props}>
      <path
        d="M7 10h18l-1.5 17c0 1-1 2-2 2h-11c-1 0-2-1-2-2Z"
        strokeWidth="2"
      />
      <path d="M11.5 13V9c0-3 2-5 4.5-5s4.5 2 4.5 5v4" strokeWidth="2" />
      <path d="M8 15c5 1 11 1 16 0" strokeWidth="1.5" />
    </Lienzo>
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

const POR_CATEGORIA = {
  mates: Mate,
  bombillas: Bombilla,
  termos: Termo,
  yerbas: PaqueteYerba,
  accesorios: Matera,
};

export function IlustracionProducto({ categoria, color, titulo, className }) {
  const Dibujo = POR_CATEGORIA[categoria] ?? Matera;
  return <Dibujo color={color} titulo={titulo} className={className} />;
}
