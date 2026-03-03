"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/app/admin/components/AdminSideBar";
import AdminHeader from "@/app/admin/components/AdminHeader";
import { Toaster } from "@/components/ui/sonner";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Cerrar con Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Overlay oscuro — solo en mobile cuando sidebar está abierto */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="flex-shrink-0">
          <AdminHeader onMenuToggle={() => setSidebarOpen((v) => !v)} />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        <Toaster />
      </div>
    </div>
  );
}
