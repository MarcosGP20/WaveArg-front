import AdminSideBar from "@/app/admin/components/AdminSideBar";
import AdminHeader from "@/app/admin/components/AdminHeader";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decodeJWT } from "@/lib/jwt";

interface DecodedToken {
  rol?: string;
  exp?: number;
  [k: string]: any;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side protection: validar cookie antes de renderizar
  const tokenCookie = await cookies().get("auth-token");
  const token = tokenCookie?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const decoded = decodeJWT(token!) as DecodedToken | null;
    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp && decoded.exp < now) {
      // token expirado
      redirect("/login");
    }

    if (decoded.rol !== "Admin") {
      // no tiene permisos de admin
      redirect("/account/profile");
    }
  } catch (err) {
    // token inválido
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSideBar />

      {/* Contenido Principal  */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex-shrink-0">
          <AdminHeader />
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
