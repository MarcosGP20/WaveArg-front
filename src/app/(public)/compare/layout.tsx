import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparar equipos | Wave ARG",
  description: "Compará iPhones lado a lado para encontrar el equipo ideal para vos.",
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
