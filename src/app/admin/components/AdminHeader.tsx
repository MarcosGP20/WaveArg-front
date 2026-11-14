// src/components/admin/AdminHeader.tsx

"use client";

import { Menu as MenuIcon } from "lucide-react";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogOut, Settings, User, ChevronDown, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usuarioAdmin } from "@/lib/usuario-admin";
import { useAuthStore } from "@/store/useAuthStore";

const itemClass =
  "flex items-center px-4 py-2 text-sm text-tinta outline-none transition-colors duration-300 ease-ola data-[highlighted]:bg-superficie";

interface AdminHeaderProps {
  // Sesión verificada en el servidor (app/admin/layout.tsx).
  sesion: { email: string; rol: string };
  onMenuToggle?: () => void;
}

export default function AdminHeader({ sesion, onMenuToggle }: AdminHeaderProps) {
  const router = useRouter();
  const { user: guardado, logout } = useAuthStore();

  // Zustand se hidrata desde localStorage, que el servidor no tiene: el nombre guardado se usa
  // recién después de montar, para que el primer render coincida con el HTML del servidor.
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  const usuario = usuarioAdmin(sesion, montado ? guardado : null);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-borde bg-white px-6">
      {/* Lado Izquierdo: hamburguesa (mobile) + logo */}
      <div className="flex items-center gap-3">
        {/* Botón hamburguesa — solo en mobile */}
        <button
          onClick={onMenuToggle}
          className="rounded-control p-2 text-tinta transition-colors duration-300 ease-ola hover:bg-superficie md:hidden"
          aria-label="Abrir menú"
        >
          <MenuIcon size={22} strokeWidth={1.75} />
        </button>

        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/iso3.svg" alt="Admin Logo" width={40} height={40} />
          <span className="hidden font-semibold text-tinta sm:block">Admin Panel</span>
        </Link>
      </div>

      {/* Centro: acceso rápido a la tienda */}
      <Link
        href="/products"
        className="hidden items-center gap-2 rounded-control bg-principal-suave px-3 py-2 text-sm font-semibold text-color-principal transition-colors duration-300 ease-ola hover:bg-principal-suave/60 sm:flex"
      >
        <ShoppingBag size={16} strokeWidth={1.75} />
        <span>Ir a la tienda</span>
      </Link>

      {/* Lado Derecho */}
      <div className="flex items-center gap-3">
        {/* Nombre del usuario (visible en desktop) */}
        <div className="hidden flex-col items-end md:flex">
          <span className="text-sm font-medium text-tinta">{usuario.nombre}</span>
          <span className="text-xs text-tinta-suave">{usuario.rol}</span>
        </div>

        {/* Dropdown Menu del Usuario */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            className="group flex items-center gap-2 rounded-full p-1 pr-3 transition-colors duration-300 ease-ola hover:bg-superficie focus:outline-none focus-visible:ring-2 focus-visible:ring-color-principal/40"
            aria-label={`Menú de ${usuario.nombre}`}
          >
            {/* Avatar */}
            <div className="flex size-9 items-center justify-center rounded-full bg-color-principal">
              <span className="text-sm font-semibold text-white">{usuario.inicial}</span>
            </div>

            {/* Chevron indicator */}
            <ChevronDown
              size={16}
              strokeWidth={1.75}
              className="text-tinta-suave transition-transform duration-500 ease-ola group-data-[state=open]:rotate-180"
            />
          </DropdownMenu.Trigger>

          {/* Dropdown Panel */}
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 w-56 overflow-hidden rounded-panel border border-borde bg-white focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
            >
              {/* Header del menú con info del usuario */}
              <DropdownMenu.Label className="px-4 py-3">
                <p className="truncate text-sm font-medium text-tinta">{usuario.nombre}</p>
                <p className="mt-1 truncate text-xs text-tinta-suave">{usuario.email}</p>
              </DropdownMenu.Label>

              <DropdownMenu.Separator className="h-px bg-borde" />

              {/* Grupo 1: Cuenta */}
              <DropdownMenu.Group className="py-1">
                <DropdownMenu.Item asChild className={itemClass}>
                  <Link href="/account/profile">
                    <User size={16} strokeWidth={1.75} className="mr-3 text-tinta-suave" />
                    Mi perfil
                  </Link>
                </DropdownMenu.Item>

                <DropdownMenu.Item asChild className={itemClass}>
                  <Link href="/account/settings">
                    <Settings size={16} strokeWidth={1.75} className="mr-3 text-tinta-suave" />
                    Configuración
                  </Link>
                </DropdownMenu.Item>
              </DropdownMenu.Group>

              <DropdownMenu.Separator className="h-px bg-borde" />

              {/* Grupo 2: Cerrar Sesión */}
              <DropdownMenu.Group className="py-1">
                <DropdownMenu.Item
                  onSelect={handleLogout}
                  className="flex w-full cursor-pointer items-center px-4 py-2 text-sm text-destructive outline-none transition-colors duration-300 ease-ola data-[highlighted]:bg-superficie"
                >
                  <LogOut size={16} strokeWidth={1.75} className="mr-3" />
                  Cerrar sesión
                </DropdownMenu.Item>
              </DropdownMenu.Group>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
