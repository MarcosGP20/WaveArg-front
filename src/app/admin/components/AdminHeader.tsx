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
  "flex items-center px-4 py-2 text-sm text-gray-700 outline-none transition-colors data-[highlighted]:bg-gray-50";

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
    <header className="flex h-16 items-center justify-between bg-white px-6 shadow-md">
      {/* Lado Izquierdo: hamburguesa (mobile) + logo */}
      <div className="flex items-center gap-3">
        {/* Botón hamburguesa — solo en mobile */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Abrir menú"
        >
          <MenuIcon size={22} />
        </button>

        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/iso3.svg" alt="Admin Logo" width={40} height={40} />
          <span className="font-semibold text-gray-900 hidden sm:block">
            Admin Panel
          </span>
        </Link>
      </div>

      {/* Centro: acceso rápido a la tienda */}
      <Link
        href="/products"
        className="hidden sm:flex items-center gap-2 text-sm font-medium text-color-principal bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-1.5 rounded-full transition-colors"
      >
        <ShoppingBag size={15} />
        <span>Ir a la tienda</span>
      </Link>

      {/* Lado Derecho */}
      <div className="flex items-center gap-3">
        {/* Nombre del usuario (visible en desktop) */}
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-medium text-gray-900">{usuario.nombre}</span>
          <span className="text-xs text-gray-500">{usuario.rol}</span>
        </div>

        {/* Dropdown Menu del Usuario */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            className="group flex items-center gap-2 rounded-full hover:bg-gray-100 p-1 pr-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            aria-label={`Menú de ${usuario.nombre}`}
          >
            {/* Avatar */}
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ring-2 ring-gray-200">
              <span className="text-white font-semibold text-sm">
                {usuario.inicial}
              </span>
            </div>

            {/* Chevron indicator */}
            <ChevronDown
              size={16}
              className="text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180"
            />
          </DropdownMenu.Trigger>

          {/* Dropdown Panel */}
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
            >
              {/* Header del menú con info del usuario */}
              <DropdownMenu.Label className="px-4 py-3">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {usuario.nombre}
                </p>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {usuario.email}
                </p>
              </DropdownMenu.Label>

              <DropdownMenu.Separator className="h-px bg-gray-100" />

              {/* Grupo 1: Cuenta */}
              <DropdownMenu.Group className="py-1">
                <DropdownMenu.Item asChild className={itemClass}>
                  <Link href="/account/profile">
                    <User size={16} className="mr-3 text-gray-400" />
                    Mi Perfil
                  </Link>
                </DropdownMenu.Item>

                <DropdownMenu.Item asChild className={itemClass}>
                  <Link href="/account/settings">
                    <Settings size={16} className="mr-3 text-gray-400" />
                    Configuración
                  </Link>
                </DropdownMenu.Item>
              </DropdownMenu.Group>


              <DropdownMenu.Separator className="h-px bg-gray-100" />

              {/* Grupo 2: Cerrar Sesión */}
              <DropdownMenu.Group className="py-1">
                <DropdownMenu.Item
                  onSelect={handleLogout}
                  className="flex w-full cursor-pointer items-center px-4 py-2 text-sm text-red-600 outline-none transition-colors data-[highlighted]:bg-red-50"
                >
                  <LogOut size={16} className="mr-3" />
                  Cerrar Sesión
                </DropdownMenu.Item>
              </DropdownMenu.Group>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
