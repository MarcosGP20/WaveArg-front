"use client";

import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AdminFloatingButton() {
  const user = useAuthStore((s) => s.user);

  if (user?.rol !== "Admin") return null;

  return (
    <Link
      href="/admin"
      title="Ir al panel de administración"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#05467D] text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-lg hover:bg-[#053d70] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
    >
      <LayoutDashboard size={16} strokeWidth={1.75} />
      Admin
    </Link>
  );
}
