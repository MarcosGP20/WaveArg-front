import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white">
      <p className="text-8xl font-black text-[#05467D] mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Página no encontrada
      </h1>
      <p className="text-gray-500 max-w-sm mb-8">
        La página que buscás no existe o fue movida.
      </p>
      <Link
        href="/"
        className="bg-[#05467D] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#063c68] transition"
      >
        Ir al inicio
      </Link>
    </div>
  );
}
