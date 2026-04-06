import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión | Wave ARG",
  description: "Iniciá sesión en Wave ARG para gestionar tus pedidos y acceder a tu cuenta.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
