import type { Metadata } from "next";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "Crear cuenta | Wave ARG",
  description: "Creá tu cuenta en Wave ARG para comprar iPhones y accesorios.",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4F8FB] px-4">
      <RegisterForm />
    </main>
  );
}
