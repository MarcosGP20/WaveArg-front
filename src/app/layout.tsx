// src/app/layout.tsx — único lugar con <html> y <body>
import type { Metadata } from "next";
import { Atkinson_Hyperlegible } from "next/font/google";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { GoogleProvider } from "@/components/GoogleProvider";
import Mantenimiento from "@/components/Mantenimiento";
import { EstadoProvider } from "@/context/EstadoContext";
import { obtenerEstado } from "@/lib/estado";

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  variable: "--font-atkinson",
  weight: ["400", "700"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
      </head>
      <body className={`${atkinson.variable} ${workSans.variable} overflow-x-hidden`}>
        {estado.mantenimiento ? (
          <Mantenimiento />
        ) : (
          <EstadoProvider estado={estado}>
            <GoogleProvider>
              {children}
            </GoogleProvider>
          </EstadoProvider>
        )}
      </body>
    </html>
  );
}
