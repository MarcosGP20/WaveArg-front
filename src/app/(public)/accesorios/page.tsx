import { Suspense } from "react";
import AccesoriosContent from "./AccesoriosContent";

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
