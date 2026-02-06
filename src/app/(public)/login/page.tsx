"use client";

import { LoginForm } from "@/components/LoginComponent";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { token, user, isLoggedIn } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (isLoggedIn && (token || user)) {
      router.replace("/account/profile");
    }
  }, [mounted, isLoggedIn, token, user, router]);

  if (!mounted) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F4F8FB] p-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="animate-spin w-6 h-6" />
          <span>Cargando...</span>
        </div>
      </main>
    );
  }

  if (isLoggedIn && (token || user)) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F4F8FB] p-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="animate-spin w-6 h-6" />
          <span>Redirigiendo a tu cuenta...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F4F8FB] p-4">
      <LoginForm />
    </main>
  );
}
