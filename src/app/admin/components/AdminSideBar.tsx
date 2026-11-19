"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  Headphones,
  LayoutDashboard,
  Smartphone,
  Users,
  X,
} from "lucide-react";

const navLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Productos", href: "/admin/productos", icon: Smartphone },
  { name: "Accesorios", href: "/admin/accesorios", icon: Headphones },
  { name: "Pedidos", href: "/admin/orders", icon: ClipboardList },
  { name: "Usuarios", href: "/admin/users", icon: Users },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  // El inicio solo se marca en /admin; el resto también en sus subrutas (editar, variantes).
  const estaActivo = (href: string) =>
    href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30
        w-64 bg-color-principal text-white
        transform transition-transform duration-500 ease-ola
        md:relative md:translate-x-0 md:flex md:flex-col md:shrink-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      aria-label="Menú de administración"
    >
      {/* Logo + botón cerrar (solo en mobile) */}
      <div className="mb-4 flex items-center justify-between p-4">
        <Link href="/admin" onClick={onClose}>
          <Image
            src="/waves6.svg"
            alt="Logo Wave Argentina Admin"
            width={130}
            height={36}
            priority
            className="mx-auto"
          />
        </Link>

        <button
          onClick={onClose}
          className="rounded-control p-2 text-white/80 transition-colors duration-300 ease-ola hover:bg-white/10 hover:text-white md:hidden"
          aria-label="Cerrar menú"
        >
          <X size={20} strokeWidth={1.75} />
        </button>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3" aria-label="Secciones del panel">
        <ul className="space-y-1">
          {navLinks.map((link) => {
            const activo = estaActivo(link.href);
            const Icon = link.icon;

            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  aria-current={activo ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-control px-3 py-3 text-sm font-medium transition-colors duration-300 ease-ola ${
                    activo
                      ? "bg-white text-color-principal"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={20} strokeWidth={1.75} />
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer del sidebar */}
      <div className="border-t border-white/15 p-4">
        <p className="text-center text-xs text-white/70">Wave Arg · Panel Admin</p>
      </div>
    </aside>
  );
}
