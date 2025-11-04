import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white p-5">
        Sidebar (Pronto será un componente)
      </div>

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
