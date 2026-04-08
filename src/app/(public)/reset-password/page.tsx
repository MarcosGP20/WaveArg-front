import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ResetPasswordContent from "./ResetPasswordContent";

export const metadata: Metadata = {
  title: "Restablecer contraseña | Wave ARG",
  description: "Ingresá tu nueva contraseña para recuperar el acceso a tu cuenta.",
};

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F4F8FB] p-4">
      <Suspense
        fallback={
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="animate-spin w-6 h-6" />
            <span>Cargando...</span>
          </div>
        }
      >
        <ResetPasswordContent />
      </Suspense>
    </main>
  );
}
