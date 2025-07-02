"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountPage() {
  const { isLoggedIn, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn || role !== "user") {
      router.push("/login");
    }
  }, [isLoggedIn, role, router]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Mi cuenta</h1>
      <p>Bienvenido/a, usuario simulado.</p>
    </div>
  );
}
