import {
  Courier_Prime,
  Fraunces,
  Instrument_Serif,
  Work_Sans,
} from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const titulos = Instrument_Serif({
  variable: "--font-titulos",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const texto = Work_Sans({
  variable: "--font-texto",
  subsets: ["latin"],
});

const datos = Courier_Prime({
  variable: "--font-datos",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Wordmark «Amargo»: Fraunces 900 con el eje SOFT al máximo
const logo = Fraunces({
  variable: "--font-logo",
  subsets: ["latin"],
  axes: ["SOFT"],
});

export const metadata = {
  title: {
    default: "Amargo — Todo para el mate",
    template: "%s | Amargo",
  },
  description:
    "Mates, bombillas, termos, yerbas y accesorios. Armá tu combo y cebá a tu manera.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${titulos.variable} ${texto.variable} ${datos.variable} ${logo.variable}`}
    >
      <body>
        <a href="#contenido" className="saltar">
          Ir al contenido
        </a>
        <Header />
        <div id="contenido" className="contenido-principal">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
