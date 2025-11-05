// src/app/layout.tsx (El NUEVO raíz)
import React from "react";
import "./globals.css"; // (Tus estilos globales)
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
