"use client";

import Dashboard from "@/app/admin/components/Dashboard";

export default function AdminPage() {
  return (
    <div className="my-12 px-2 md:px-8">
      <h1 className="text-3xl font-bold mb-6 text-[#05467d] text-center">
        Bienvenido a la seccion de Administración Wave
      </h1>
      <Dashboard />
    </div>
  );
}
