import React from "react";
import AdminSideBar from "@/components/admin/AdminSideBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSideBar></AdminSideBar>

      {/* Contenido Principal  */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-md p-4">
          Header (Componente)
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
