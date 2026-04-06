import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto | Wave ARG",
  description: "Contactate con Wave ARG. Respondemos consultas sobre iPhones, accesorios, envíos y garantías.",
};

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
