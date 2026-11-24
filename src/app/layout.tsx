// src/app/layout.tsx — único lugar con <html> y <body>
import type { Metadata } from "next";
import { Archivo, Geist } from "next/font/google";
import "./globals.css";
import { GoogleProvider } from "@/components/GoogleProvider";
import PuertaMantenimiento from "@/components/PuertaMantenimiento";
import { EstadoProvider } from "@/context/EstadoContext";
import { obtenerEstado } from "@/lib/estado";

// Tipografías (DESIGN.md): Geist para el texto, Archivo para los títulos. Archivo va con el eje de
// ancho (wdth), que usa la ola tipográfica del hero.
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: "Wave ARG",
  description: "E-commerce demo built with Next.js and .NET backend",
  icons: {
    icon: "/iso3.svg",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const estado = await obtenerEstado();

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/iso3.svg" />
        {/* Oculta la intro de la home antes de pintar si ya se vio en esta sesión (HomeLoader). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("hasVisited")!==null)document.documentElement.classList.add("wave-sin-intro")}catch(e){}`,
          }}
        />
      </head>
      <body className={`${geist.variable} ${archivo.variable} font-sans antialiased overflow-x-hidden`}>
        <EstadoProvider estado={estado}>
          <GoogleProvider>
            <PuertaMantenimiento>{children}</PuertaMantenimiento>
          </GoogleProvider>
        </EstadoProvider>
      </body>
    </html>
  );
}
