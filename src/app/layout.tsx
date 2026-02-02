// src/app/layout.tsx — único lugar con <html> y <body>
import type { Metadata } from "next";
import { Atkinson_Hyperlegible } from "next/font/google";
import { Work_Sans } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/iso3.svg" />
      </head>
      <body className={`${atkinson.variable} ${workSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
