// components/CompareBar.tsx
"use client";

import { useCompare } from "@/context/CompareContext";
import { useRouter } from "next/navigation";

export default function CompareBar() {
  const { compareList } = useCompare();
  const router = useRouter();

  if (compareList.length < 2) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white shadow-xl px-6 py-3 rounded-full z-50 flex items-center gap-4">
      <span className="text-sm text-[#333]">
        Comparando {compareList.length} modelos
      </span>
      <button
        onClick={() => router.push("/compare")}
        className="bg-[#05467D] text-white px-4 py-2 rounded hover:bg-[#0F3C64] transition"
      >
        Ver comparación
      </button>
    </div>
  );
}
