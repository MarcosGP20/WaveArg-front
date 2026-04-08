import type { Metadata } from "next";
import { OlvideMiContrasenaForm } from "@/components/OlvideMiContrasenaForm";

export const metadata: Metadata = {
  title: "Olvidé mi contraseña | Wave ARG",
  description: "Recuperá el acceso a tu cuenta en Wave ARG.",
};

export default function OlvideMiContrasenaPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F4F8FB] p-4">
      <OlvideMiContrasenaForm />
    </main>
  );
}
