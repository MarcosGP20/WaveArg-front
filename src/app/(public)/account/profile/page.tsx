"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PedidosService, UsuariosService } from "@/lib/api";
import {
  LogOut,
  User,
  Mail,
  Settings,
  ShoppingBag,
  Bell,
  Pencil,
  X,
  Check,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface EditForm {
  nombre: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, logout, updateUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [pedidosActivos, setPedidosActivos] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditForm>();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !token) return;
    PedidosService.getMisPedidos()
      .then((pedidos) => {
        const activos = pedidos.filter((p) =>
          ["procesando", "pendiente", "enviado"].includes(p.estado.toLowerCase())
        ).length;
        setPedidosActivos(activos);
      })
      .catch(() => setPedidosActivos(0));
  }, [mounted, token]);

  const handleEdit = () => {
    reset({ nombre: user?.nombre ?? "" });
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const onSubmit = async (data: EditForm) => {
    if (!user) return;
    setSaving(true);
    try {
      const updated = await UsuariosService.updateMe(user.id, { nombre: data.nombre });
      updateUser({ nombre: updated.nombre ?? data.nombre });
      setEditing(false);
      toast.success("Perfil actualizado");
    } catch {
      toast.error("No se pudo actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!mounted) return <ProfileSkeleton />;

  if (!token || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 mb-4">Iniciá sesión para continuar</p>
        <Button
          onClick={() => router.push("/login")}
          className="bg-color-principal rounded-full p-6"
        >
          Login
        </Button>
      </div>
    );
  }

  const displayName = user.nombre || user.email.split("@")[0];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* ASIDE */}
        <aside className="w-full lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center sticky top-24">
            <div className="w-24 h-24 bg-color-principal rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="text-white" size={48} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-5">{displayName}</h2>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 rounded-full"
                asChild
              >
                <Link href="/account/settings">
                  <Settings size={16} /> Ajustes
                </Link>
              </Button>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start gap-3 rounded-full text-red-500 hover:bg-red-50"
              >
                <LogOut size={16} /> Salir
              </Button>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-color-principal">
                Datos de contacto
              </h3>
              {!editing && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-gray-500 hover:text-color-principal rounded-full"
                  onClick={handleEdit}
                >
                  <Pencil size={14} /> Editar
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {/* Nombre */}
              {editing ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                        Nombre
                      </label>
                      <input
                        {...register("nombre", {
                          required: "El nombre es obligatorio",
                          minLength: { value: 2, message: "Mínimo 2 caracteres" },
                          maxLength: { value: 60, message: "Máximo 60 caracteres" },
                        })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-color-principal/30 focus:border-color-principal"
                        placeholder="Tu nombre"
                        autoFocus
                      />
                      {errors.nombre && (
                        <p className="text-xs text-red-500 mt-1">{errors.nombre.message}</p>
                      )}
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="rounded-full gap-2 text-gray-500"
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        <X size={14} /> Cancelar
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        className="rounded-full gap-2 bg-color-principal text-white"
                        disabled={saving}
                      >
                        <Check size={14} /> {saving ? "Guardando..." : "Guardar"}
                      </Button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="bg-white p-2 rounded-xl shadow-sm">
                    <User className="text-color-principal" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Nombre
                    </p>
                    <p className="font-semibold text-gray-800">
                      {user.nombre || <span className="text-gray-400 font-normal">Sin nombre</span>}
                    </p>
                  </div>
                </div>
              )}

              {/* Email (siempre read-only) */}
              <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="bg-white p-2 rounded-xl shadow-sm">
                  <Mail className="text-color-principal" size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Correo electrónico
                  </p>
                  <p className="font-semibold text-gray-800">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* DASHBOARD DE COMPRAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/account/orders"
              className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className="p-3 bg-blue-50 text-color-principal rounded-2xl group-hover:bg-blue-100 transition-colors">
                <ShoppingBag size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {pedidosActivos === null ? (
                    <span className="inline-block w-6 h-6 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    pedidosActivos
                  )}
                </p>
                <p className="text-xs text-gray-500">Pedidos activos</p>
              </div>
            </Link>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-color-principal rounded-2xl">
                <Bell size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-gray-500">Notificaciones</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3 h-64 bg-gray-200 rounded-2xl" />
        <div className="flex-1 h-96 bg-gray-100 rounded-2xl" />
      </div>
    </div>
  );
}
