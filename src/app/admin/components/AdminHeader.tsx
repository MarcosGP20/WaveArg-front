// src/components/admin/AdminHeader.tsx

"use client";

import React from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  UserCircle,
  LogOut,
  Settings,
  User,
  Bell,
  ChevronDown,
  HelpCircle,
  Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

interface AdminHeaderProps {
  user?: {
    name: string;
    email: string;
    role?: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

export default function AdminHeader({
  user = { name: "Marcos", email: "marcos@admin.com", role: "Administrador" },
  onLogout,
}: AdminHeaderProps) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Fallback por defecto
      console.log("Cerrando sesión...");
      // window.location.href = '/login';
    }
  };

  return (
    <header className="flex h-16 items-center justify-between bg-white px-6 shadow-md">
      {/* Lado Izquierdo */}
      <div className="flex items-center gap-4">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/iso3.svg" alt="Admin Logo" width={40} height={40} />
          <span className="font-semibold text-gray-900 hidden sm:block">
            Admin Panel
          </span>
        </Link>
      </div>

      {/* Lado Derecho */}
      <div className="flex items-center gap-3">
        {/* Notificaciones */}
        <button className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>

        {/* Nombre del usuario (visible en desktop) */}
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-medium text-gray-900">{user.name}</span>
          {user.role && (
            <span className="text-xs text-gray-500">{user.role}</span>
          )}
        </div>

        {/* Dropdown Menu del Usuario */}
        <Menu as="div" className="relative z-50">
          {({ open }) => (
            <>
              <Menu.Button className="flex items-center gap-2 rounded-full hover:bg-gray-100 p-1 pr-3 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                {/* Avatar */}
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`Avatar de ${user.name}`}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-gray-200"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ring-2 ring-gray-200">
                    <span className="text-white font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Chevron indicator */}
                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </Menu.Button>

              {/* Dropdown Panel */}
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 z-50">
                  {/* Header del menú con info del usuario */}
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>

                  {/* Grupo 1: Cuenta */}
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/admin/profile"
                          className={`${
                            active ? "bg-gray-50" : ""
                          } flex items-center px-4 py-2 text-sm text-gray-700 transition-colors`}
                        >
                          <User size={16} className="mr-3 text-gray-400" />
                          Mi Perfil
                        </Link>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/admin/settings"
                          className={`${
                            active ? "bg-gray-50" : ""
                          } flex items-center px-4 py-2 text-sm text-gray-700 transition-colors`}
                        >
                          <Settings size={16} className="mr-3 text-gray-400" />
                          Configuración
                        </Link>
                      )}
                    </Menu.Item>
                  </div>

                  {/* Grupo 2: Admin */}
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/admin/security"
                          className={`${
                            active ? "bg-gray-50" : ""
                          } flex items-center px-4 py-2 text-sm text-gray-700 transition-colors`}
                        >
                          <Shield size={16} className="mr-3 text-gray-400" />
                          Seguridad
                        </Link>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/admin/help"
                          className={`${
                            active ? "bg-gray-50" : ""
                          } flex items-center px-4 py-2 text-sm text-gray-700 transition-colors`}
                        >
                          <HelpCircle
                            size={16}
                            className="mr-3 text-gray-400"
                          />
                          Centro de Ayuda
                        </Link>
                      )}
                    </Menu.Item>
                  </div>

                  {/* Grupo 3: Cerrar Sesión */}
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={handleLogout}
                          className={`${
                            active ? "bg-red-50" : ""
                          } flex w-full items-center px-4 py-2 text-sm text-red-600 transition-colors`}
                        >
                          <LogOut size={16} className="mr-3" />
                          Cerrar Sesión
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      </div>
    </header>
  );
}
