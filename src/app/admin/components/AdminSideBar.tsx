"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Package, Users } from "lucide-react";

const navLinks = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    name: "Productos",
    href: "/admin/products",
    icon: ShoppingBag,
  },
  {
    name: "Pedidos",
    href: "/admin/orders",
    icon: Package,
  },
  {
    name: "Usuarios",
    href: "/admin/users",
    icon: Users,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <div className="mb-8 text-center">
        <Link href="/admin">
          <Image
            src="/waves6.svg"
            alt="Logo Wave Argentina Admin"
            width={150}
            height={40}
            // Le decimos a Next.js que esta imagen es crítica
            // y la cargue de inmediato (desactiva lazy loading).
            priority={true}
            // 'mx-auto' es de Tailwind para centrar la imagen (margin-x: auto)
            className="mx-auto"
          />
        </Link>
      </div>

      <nav>
        <ul>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            const Icon = link.icon;

            return (
              <li key={link.name} className="mb-2">
                <Link href={link.href}>
                  <span
                    className={`
                      flex items-center p-3 rounded-lg
                      transition-colors duration-200 ease-in-out
                      hover:bg-gray-700 group
                      ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:text-white"
                      }
                    `}
                  >
                    <Icon
                      size={20}
                      className={`mr-3 ${
                        isActive
                          ? "text-white"
                          : "text-gray-400 group-hover:text-white"
                      }`}
                    />
                    {link.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
