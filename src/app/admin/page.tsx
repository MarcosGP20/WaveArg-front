"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const { isLoggedIn, role } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true); // <-- controla el primer render

  useEffect(() => {
    if (!isLoggedIn || role !== "admin") {
      router.push("/login");
    } else {
      setLoading(false); // <-- ya está todo OK
    }
  }, [isLoggedIn, role, router]);

  if (loading) return null; // o un spinner si querés

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Panel de Admin</h1>
      <p>Solo visible si estás logueado como admin.</p>
    </div>
  );
}
