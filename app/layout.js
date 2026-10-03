import { Archivo } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Boldy — Zapatillas y drops",
    template: "%s | Boldy",
  },
  description:
    "Tienda multimarca de zapatillas: drops limitados de las mejores marcas y la línea propia Boldy.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={archivo.variable}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
