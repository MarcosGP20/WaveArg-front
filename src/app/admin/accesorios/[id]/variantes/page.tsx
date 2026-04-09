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
import { AccesorioVariantesService, AccesoriosService, Accesorio } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { TableAccesorioVariants } from "@/app/admin/components/TableAccesorioVariants";
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

type AccesorioVarianteForm = {
  color: string;
  especificacion: string;  // ej: "Compatible iPhone 14", "Tipo-C 65W"
  precio: number;
  stock: number;
  esUsado: boolean;
  detalleEstado: string;
  imagenesStock: string[];
  imagenesReales: string[];
};

const VARIANTE_DEFAULT: AccesorioVarianteForm = {
  color: "",
  especificacion: "",
  precio: 0,
  stock: 1,
  esUsado: false,
  detalleEstado: "",
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
      btn: "bg-color-principal hover:bg-color-principal-oscuro",
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
        {/* Fila color + especificacion + condición + bateria */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Color *</label>
            <input
              {...register(`variantes.${index}.color`)}
              placeholder="ej: Negro"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-color-principal focus:ring-2 focus:ring-color-principal/20 outline-none"
              required
            />
          </div>

          <div className="space-y-1 lg:col-span-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Especificación *</label>
            <input
              {...register(`variantes.${index}.especificacion`)}
              placeholder="ej: Compatible iPhone 14/15, Tipo-C, 65W..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-color-principal focus:ring-2 focus:ring-color-principal/20 outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Condición</label>
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

        {/* Fotos de stock */}
        <UrlListField
          label="📸 Fotos del accesorio"
          hint="Imágenes oficiales o de marketing del producto. La primera se usa como foto principal."
          urls={imagenesStock}
          onChange={(next) => setValue(`variantes.${index}.imagenesStock`, next)}
          theme="blue"
        />

        {/* Fotos reales — solo si es usado */}
        {esUsado && (
          <>
            <hr className="border-gray-100" />
            <UrlListField
              label="📷 Fotos reales del accesorio"
              hint="Fotos del ítem físico que estás vendiendo."
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

export default function GestionVariantesAccesorioPage() {
  const { id } = useParams();

  const [accesorio, setAccesorio] = useState<Accesorio | null>(null);
  const [loadingAccesorio, setLoadingAccesorio] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [varianteToDelete, setVarianteToDelete] = useState<number | null>(null);

  const cargarInformacion = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await AccesoriosService.getById(Number(id));
      setAccesorio(data);
    } catch {
      toast.error("Error al cargar el accesorio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    setLoadingAccesorio(true);
    AccesoriosService.getById(Number(id))
      .then(setAccesorio)
      .catch(() => toast.error("No se pudo cargar el accesorio"))
      .finally(() => { setLoadingAccesorio(false); setLoading(false); });
  }, [id]);

  const { register, control, handleSubmit, setValue } = useForm<{ variantes: AccesorioVarianteForm[] }>({
    defaultValues: { variantes: [{ ...VARIANTE_DEFAULT }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "variantes" });

  const onSubmit = async (data: { variantes: AccesorioVarianteForm[] }) => {
    if (!id) return toast.error("No se encontró el ID del accesorio");
    setIsSubmitting(true);

    const savePromise = async () => {
      const peticiones = data.variantes.map((v) => {
        const fotoEstadoUrl = v.esUsado
          ? (v.imagenesReales?.[0] ?? v.imagenesStock?.[0] ?? "")
          : (v.imagenesStock?.[0] ?? "");

        const payload = {
          accesorioId: Number(id),
          color: v.color,
          especificacion: v.especificacion,
          precio: Number(v.precio),
          stock: Number(v.stock),
          esUsado: v.esUsado,
          detalleEstado: v.esUsado ? v.detalleEstado : null,
          fotoEstadoUrl,
          imagenes: [...(v.imagenesStock ?? []), ...(v.imagenesReales ?? [])],
        };
        return AccesorioVariantesService.create(payload);
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
        return `Error: ${err.message || "Revisá la consola"}`;
      },
    });
  };

  const handleDeleteVariante = (varianteId: number) => {
    setVarianteToDelete(varianteId);
  };

  const confirmDelete = () => {
    if (varianteToDelete === null) return;
    toast.promise(AccesorioVariantesService.delete(varianteToDelete), {
      loading: "Eliminando...",
      success: () => {
        setAccesorio((prev) =>
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
        <Link href="/admin/accesorios" className="text-gray-400 hover:text-color-principal transition-colors">
          <ArrowLeft size={22} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-color-principal">
            {loadingAccesorio ? "Cargando..." : `Variantes de "${accesorio?.nombre} ${accesorio?.modelo}"`}
          </h1>
          {!loadingAccesorio && <p className="text-xs text-gray-400 mt-0.5">ID Base: #{id}</p>}
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

        <button
          type="button"
          onClick={() => append({ ...VARIANTE_DEFAULT })}
          className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-gray-400 hover:border-color-principal hover:text-color-principal transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Agregar otra variante
        </button>

        <button
          type="submit"
          disabled={isSubmitting || loadingAccesorio}
          className="w-full bg-color-principal text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg hover:bg-color-principal-oscuro transition-all disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {isSubmitting ? "Guardando..." : "Guardar Variantes"}
        </button>
      </form>

      {/* Tabla de stock actual */}
      <section className="mt-12 space-y-4">
        <h2 className="text-xl font-bold text-gray-700">Stock Actual</h2>
        <TableAccesorioVariants
          variantes={accesorio?.variantes || []}
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
