// src/app/layout.tsx (El NUEVO raíz)
import React from "react";
import "./globals.css"; // (Tus estilos globales)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
