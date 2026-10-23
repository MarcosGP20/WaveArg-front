import Image from "next/image";
import { Wrench } from "lucide-react";

// Se muestra en todo el sitio mientras el back está en modo mantenimiento
// (Interruptores__Mantenimiento=true en Render).
export default function Mantenimiento() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#F4F8FB] px-4 text-center">
      <Image src="/iso3.svg" alt="Wave ARG" width={64} height={64} className="mb-8" />
      <Wrench size={40} strokeWidth={1.75} className="text-color-principal mb-4" aria-hidden="true" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Estamos haciendo mantenimiento</h1>
      <p className="text-gray-600 max-w-md">
        Volvemos en unos minutos. Si ya pagaste un pedido, quedó registrado igual.
      </p>
    </main>
  );
}
