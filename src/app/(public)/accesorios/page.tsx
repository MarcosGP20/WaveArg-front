import { Suspense } from "react";
import type { Metadata } from "next";
import AccesoriosContent from "./AccesoriosContent";

export const metadata: Metadata = {
  title: "Accesorios | Wave ARG",
  description: "Cases, cargadores, cables y más accesorios para tu iPhone. Envíos a todo el país.",
};

function AccesoriosSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Barra superior */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div className="h-7 w-40 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-9 w-28 bg-gray-200 rounded-full animate-pulse lg:hidden" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar (solo desktop) */}
        <div className="hidden lg:flex flex-col gap-3 w-56 flex-shrink-0">
          <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" />
          {[75, 60, 80, 55, 70, 65].map((w, i) => (
            <div key={i} className="h-4 bg-gray-100 rounded-full animate-pulse" style={{ width: `${w}%` }} />
          ))}
          <div className="h-px bg-gray-100 my-2" />
          <div className="h-5 w-24 bg-gray-200 rounded-full animate-pulse" />
          {[65, 50, 72, 58].map((w, i) => (
            <div key={i} className="h-4 bg-gray-100 rounded-full animate-pulse" style={{ width: `${w}%` }} />
          ))}
        </div>

        {/* Grid de cards */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 flex flex-col animate-pulse">
              <div className="h-52 bg-gray-200" />
              <div className="p-5 flex flex-col gap-3">
                <div className="h-4 bg-gray-200 rounded-full w-2/3 mx-auto" />
                <div className="h-3 bg-gray-100 rounded-full w-1/2 mx-auto" />
                <div className="h-3 bg-gray-100 rounded-full w-3/4 mx-auto" />
                <div className="h-7 bg-gray-200 rounded-full w-1/3 mx-auto" />
                <div className="h-10 bg-gray-200 rounded-full mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AccesoriosPage() {
  return (
    <Suspense fallback={<AccesoriosSkeleton />}>
      <AccesoriosContent />
    </Suspense>
  );
}
