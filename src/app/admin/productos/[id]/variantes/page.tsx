"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import {
  Plus,
  Trash2,
  Save,
  Loader2,
  ArrowLeft,
  X,
} from "lucide-react";
import { useParams } from "next/navigation";
import { VariantesService, ProductService, Producto } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { TableVariants } from "@/app/admin/components/TableVariants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// ─── tipos ────────────────────────────────────────────────────────────────────

type VarianteForm = {
  color: string;
  memoria: string;
  precio: number;
  stock: number;
  esUsado: boolean;
  detalleEstado: string;
  imagenesStock: string[];   // renders/fotos de marketing del color
  imagenesReales: string[];  // fotos del equipo físico (solo usados)
};

const MEMORIAS = ["64GB", "128GB", "256GB", "512GB", "1TB"];

const VARIANTE_DEFAULT: VarianteForm = {
  color: "",
  memoria: "128GB",
  precio: 0,
  stock: 1,
  esUsado: false,
  detalleEstado: "100%",
  imagenesStock: [],
  imagenesReales: [],
};

// ─── componente de lista de URLs con miniaturas ───────────────────────────────

function UrlListField({
  label,
  hint,
  urls,
  onChange,
  theme,
}: {
  label: string;
  hint: string;
  urls: string[];
  onChange: (next: string[]) => void;
  theme: "blue" | "amber";
}) {
  const [input, setInput] = useState("");

  const s = {
    blue: {
      label: "text-color-principal",
      inputRing: "focus:border-color-principal focus:ring-color-principal/20",
      btn: "bg-color-principal hover:bg-[#043a68]",
      item: "bg-blue-50 border-blue-100",
    },
    amber: {
      label: "text-amber-600",
      inputRing: "focus:border-amber-500 focus:ring-amber-400/20",
      btn: "bg-amber-500 hover:bg-amber-600",
      item: "bg-amber-50 border-amber-200",
    },
  }[theme];

  const add = () => {
    const url = input.trim();
    if (!url || urls.includes(url)) return;
    onChange([...urls, url]);
    setInput("");
  };

  const remove = (i: number) => onChange(urls.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <p className={`text-sm font-bold ${s.label}`}>{label}</p>
      <p className="text-xs text-gray-400 leading-relaxed">{hint}</p>

      <div className="flex gap-2">
        <input
          type="url"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="https://..."
          className={`flex-1 text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none ring-2 ring-transparent transition-all ${s.inputRing}`}
        />
        <button
          type="button"
          onClick={add}
          className={`${s.btn} text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors`}
        >
          + Agregar
        </button>
      </div>

      {urls.length > 0 && (
        <ul className="space-y-2 pt-1">
          {urls.map((url, i) => (
            <li key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-xs ${s.item}`}>
              <div className="w-12 h-12 flex-shrink-0 rounded-md border border-white overflow-hidden bg-white shadow-sm">
                <div className="relative w-full h-full">
                  <Image src={url} alt={`foto-${i + 1}`} fill className="object-contain p-0.5" />
                </div>
              </div>
              <span className="flex-1 truncate font-mono text-[10px] opacity-60">{url}</span>
              <button type="button" onClick={() => remove(i)} className="text-gray-400 hover:text-red-500 flex-shrink-0 transition-colors">
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── card de una variante ─────────────────────────────────────────────────────

function VarianteCard({
  index,
  register,
  control,
  setValue,
  onRemove,
}: {
  index: number;
  register: any;
  control: any;
  setValue: any;
  onRemove: () => void;
}) {
  const esUsado: boolean = useWatch({ control, name: `variantes.${index}.esUsado` });
  const imagenesStock = (useWatch({ control, name: `variantes.${index}.imagenesStock` as any }) as string[]) ?? [];
  const imagenesReales = (useWatch({ control, name: `variantes.${index}.imagenesReales` as any }) as string[]) ?? [];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Cabecera */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
        <span className="text-sm font-bold text-gray-600">Variante #{index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded"
          title="Eliminar variante"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Fila de campos base */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Color *</label>
            <input
              {...register(`variantes.${index}.color`)}
              placeholder="ej: Negro Titanio"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-color-principal focus:ring-2 focus:ring-color-principal/20 outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Memoria *</label>
            <select
              {...register(`variantes.${index}.memoria`)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-color-principal outline-none"
            >
              {MEMORIAS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Condición *</label>
            <select
              {...register(`variantes.${index}.esUsado`, {
                setValueAs: (v: string) => v === "true",
              })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-color-principal outline-none"
            >
              <option value="false">🆕 Nuevo</option>
              <option value="true">📦 Usado</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Batería %</label>
            <input
              {...register(`variantes.${index}.detalleEstado`)}
              placeholder="ej: 87"
              disabled={!esUsado}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-color-principal outline-none disabled:bg-gray-50 disabled:text-gray-300 transition-colors"
            />
          </div>
        </div>

        {/* Precio + Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Precio (USD) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">$</span>
              <input
                type="number"
                {...register(`variantes.${index}.precio`)}
                className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-color-principal focus:ring-2 focus:ring-color-principal/20 outline-none font-semibold"
                required
                min={0}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Stock (u.) *</label>
            <input
              type="number"
              {...register(`variantes.${index}.stock`)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-color-principal focus:ring-2 focus:ring-color-principal/20 outline-none"
              required
              min={0}
            />
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* 📸 Fotos de stock del color */}
        <UrlListField
          label="📸 Fotos de stock del color"
          hint="Renders o fotos oficiales de este color (ej: imagen de Apple del iPhone Negro Titanio). La primera foto se usa como imagen principal en la tienda."
          urls={imagenesStock}
          onChange={(next) => setValue(`variantes.${index}.imagenesStock`, next)}
          theme="blue"
        />

        {/* 📷 Fotos reales — solo si es usado */}
        {esUsado && (
          <>
            <hr className="border-gray-100" />
            <UrlListField
              label="📷 Fotos reales del equipo"
              hint="Fotos del equipo físico que estás vendiendo: pantalla, dorso, laterales, detalle de la batería, etc."
              urls={imagenesReales}
              onChange={(next) => setValue(`variantes.${index}.imagenesReales`, next)}
              theme="amber"
            />
          </>
        )}
      </div>
    </div>
  );
}

// ─── página ───────────────────────────────────────────────────────────────────

export default function GestionVariantesPage() {
  const { id } = useParams();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [loadingProducto, setLoadingProducto] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [varianteToDelete, setVarianteToDelete] = useState<number | null>(null);

  const cargarInformacion = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await ProductService.getById(Number(id));
      setProducto(data);
    } catch {
      toast.error("Error al cargar el producto");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    setLoadingProducto(true);
    ProductService.getById(Number(id))
      .then(setProducto)
      .catch(() => toast.error("No se pudo cargar el producto"))
      .finally(() => { setLoadingProducto(false); setLoading(false); });
  }, [id]);

  const { register, control, handleSubmit, setValue } = useForm<{ variantes: VarianteForm[] }>({
    defaultValues: { variantes: [{ ...VARIANTE_DEFAULT }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "variantes" });

  const onSubmit = async (data: { variantes: VarianteForm[] }) => {
    if (!id) return toast.error("No se encontró el ID del producto");
    setIsSubmitting(true);

    const savePromise = async () => {
      const peticiones = data.variantes.map((v) => {
        // Compatibilidad hacia atrás: fotoEstadoUrl = primera foto real (o primera de stock)
        const fotoEstadoUrl = v.esUsado
          ? (v.imagenesReales?.[0] ?? v.imagenesStock?.[0] ?? "")
          : (v.imagenesStock?.[0] ?? "");

        const payload = {
          productoId: Number(id),
          color: v.color,
          memoria: v.memoria,
          precio: Number(v.precio),
          stock: Number(v.stock),
          esUsado: v.esUsado,
          detalleEstado: v.esUsado ? `Batería: ${v.detalleEstado}` : "Nuevo",
          fotoEstadoUrl,
          // Campo nuevo — el backend lo ignorará hasta estar implementado
          imagenes: [...(v.imagenesStock ?? []), ...(v.imagenesReales ?? [])],
        };
        return VariantesService.create(payload);
      });
      return await Promise.all(peticiones);
    };

    toast.promise(savePromise(), {
      loading: "Sincronizando con el servidor...",
      success: () => {
        setIsSubmitting(false);
        cargarInformacion();
        return "Variantes guardadas correctamente";
      },
      error: (err) => {
        setIsSubmitting(false);
        return `Error: ${err.message || "Revisa la consola"}`;
      },
    });
  };

  const handleDeleteVariante = (varianteId: number) => {
    setVarianteToDelete(varianteId);
  };

  const confirmDelete = () => {
    if (varianteToDelete === null) return;
    toast.promise(VariantesService.delete(varianteToDelete), {
      loading: "Eliminando...",
      success: () => {
        setProducto((prev) =>
          prev ? { ...prev, variantes: prev.variantes.filter((v) => v.id !== varianteToDelete) } : null
        );
        setVarianteToDelete(null);
        return "Variante eliminada";
      },
      error: "No se pudo eliminar la variante",
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/productos" className="text-gray-400 hover:text-color-principal transition-colors">
          <ArrowLeft size={22} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-color-principal">
            {loadingProducto ? "Cargando..." : `Variantes de "${producto?.nombre} ${producto?.modelo}"`}
          </h1>
          {!loadingProducto && <p className="text-xs text-gray-400 mt-0.5">ID Base: #{id}</p>}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((field, index) => (
          <VarianteCard
            key={field.id}
            index={index}
            register={register}
            control={control}
            setValue={setValue}
            onRemove={() => remove(index)}
          />
        ))}

        {/* Agregar variante */}
        <button
          type="button"
          onClick={() => append({ ...VARIANTE_DEFAULT })}
          className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-gray-400 hover:border-color-principal hover:text-color-principal transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Agregar otra variante
        </button>

        {/* Guardar */}
        <button
          type="submit"
          disabled={isSubmitting || loadingProducto}
          className="w-full bg-color-principal text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg hover:bg-[#043a68] transition-all disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {isSubmitting ? "Guardando..." : "Guardar Variantes"}
        </button>
      </form>

      {/* Tabla de stock actual */}
      <section className="mt-12 space-y-4">
        <h2 className="text-xl font-bold text-gray-700">Stock Actual</h2>
        <TableVariants
          variantes={producto?.variantes || []}
          loading={loading}
          onDelete={handleDeleteVariante}
        />
      </section>

      <AlertDialog open={varianteToDelete !== null} onOpenChange={(open) => !open && setVarianteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar variante?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La variante será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
