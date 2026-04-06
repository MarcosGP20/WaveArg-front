import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros | Wave ARG",
  description: "Conocé el equipo detrás de Wave ARG. Comprometidos con brindarte los mejores equipos Apple a tu alcance.",
};

export default function NosotrosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
