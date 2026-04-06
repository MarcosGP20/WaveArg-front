import { Suspense } from "react";
import type { Metadata } from "next";
import AccesoriosContent from "./AccesoriosContent";

export const metadata: Metadata = {
  title: "Accesorios | Wave ARG",
  description: "Cases, cargadores, cables y más accesorios para tu iPhone. Envíos a todo el país.",
};

export default function AccesoriosPage() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center font-bold">
          Cargando accesorios...
        </div>
      }
    >
      <AccesoriosContent />
    </Suspense>
  );
}
