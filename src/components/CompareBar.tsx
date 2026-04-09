"use client";

import { useCompare } from "@/context/CompareContext";
import { useRouter } from "next/navigation";
import { X, Plus, Search, Loader2, ArrowLeftRight } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { getProductos } from "@/lib/api";
import { Producto } from "@/interfaces/producto";

const MAX_COMPARE = 3;

// ── Dropdown de swap/add ─────────────────────────────────────────────────────

type SlotDropdownProps = {
  slotIndex: number;
  currentId?: number;             // id del producto en este slot (si está ocupado)
  excludedIds: number[];          // ids ya en otros slots
  onSelect: (product: Producto) => void;
  onClose: () => void;
};

function SlotDropdown({ currentId, excludedIds, onSelect, onClose }: SlotDropdownProps) {
  const [query, setQuery] = useState("");
  const [all, setAll] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cargar productos la primera vez que se abre
  useEffect(() => {
    getProductos()
      .then(setAll)
      .finally(() => setLoading(false));
  }, []);

  // Foco en el input al abrir
  useEffect(() => {
    inputRef.current?.focus();
  }, [loading]);

  // Cerrar con Escape o click fuera
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClose]);

  const filtered = all.filter((p) => {
    if (p.id === currentId) return false;           // el mismo que hay ahora
    if (excludedIds.includes(p.id)) return false;   // ya en otro slot
    if (query) return p.nombre.toLowerCase().includes(query.toLowerCase());
    return true;
  });

  return (
    <div
      ref={ref}
      className="absolute bottom-full mb-2 left-0 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
    >
      {/* Buscador */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100">
        <Search size={14} className="text-gray-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar modelo..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 text-sm outline-none placeholder:text-gray-400"
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600">
            <X size={12} />
          </button>
        )}
      </div>

      {/* Lista */}
      <ul className="max-h-56 overflow-y-auto">
        {loading ? (
          <li className="flex items-center justify-center gap-2 py-6 text-gray-400 text-sm">
            <Loader2 size={16} className="animate-spin" />
            Cargando...
          </li>
        ) : filtered.length === 0 ? (
          <li className="py-6 text-center text-sm text-gray-400">
            Sin resultados
          </li>
        ) : (
          filtered.map((p) => {
            const img = p.imagenes?.[0];
            const price = p.variantes?.[0]?.precio;
            return (
              <li key={p.id}>
                <button
                  onClick={() => { onSelect(p); onClose(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
                >
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt={p.nombre} className="w-9 h-9 object-contain rounded-lg bg-gray-100 shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-color-principal/10 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.nombre}</p>
                    {price != null && (
                      <p className="text-xs text-color-principal font-semibold">
                        ${price.toLocaleString("es-AR")}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

// ── Chip de producto ─────────────────────────────────────────────────────────

type ProductChipProps = {
  product: Producto;
  slotIndex: number;
  excludedIds: number[];
  onRemove: () => void;
  onSwap: (newProduct: Producto) => void;
};

function ProductChip({ product, slotIndex, excludedIds, onRemove, onSwap }: ProductChipProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const img = product.imagenes?.[0];

  return (
    <div className="relative flex items-center">
      {/* Chip body — click abre dropdown de swap */}
      <button
        onClick={() => setDropdownOpen((v) => !v)}
        title="Cambiar modelo"
        className="flex items-center gap-2 pl-1.5 pr-2 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors max-w-[160px] group"
      >
        {/* Thumbnail */}
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={product.nombre} className="w-7 h-7 object-contain rounded-lg bg-white shrink-0" />
        ) : (
          <div className="w-7 h-7 rounded-lg bg-color-principal/10 shrink-0" />
        )}

        {/* Nombre + swap hint */}
        <div className="min-w-0 text-left">
          <p className="text-xs font-semibold text-gray-800 truncate leading-tight">{product.nombre}</p>
          <p className="text-[10px] text-gray-400 flex items-center gap-0.5 leading-tight">
            <ArrowLeftRight size={9} />
            Cambiar
          </p>
        </div>
      </button>

      {/* Botón × para quitar */}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        aria-label={`Quitar ${product.nombre}`}
        className="ml-1 w-5 h-5 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 transition-colors shrink-0"
      >
        <X size={11} />
      </button>

      {/* Dropdown */}
      {dropdownOpen && (
        <SlotDropdown
          slotIndex={slotIndex}
          currentId={product.id}
          excludedIds={excludedIds}
          onSelect={onSwap}
          onClose={() => setDropdownOpen(false)}
        />
      )}
    </div>
  );
}

// ── Slot vacío ───────────────────────────────────────────────────────────────

type EmptySlotProps = {
  slotIndex: number;
  excludedIds: number[];
  onAdd: (product: Producto) => void;
  disabled: boolean;
};

function EmptySlot({ slotIndex, excludedIds, onAdd, disabled }: EmptySlotProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (disabled) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-gray-300 hover:border-color-principal hover:text-color-principal text-gray-400 rounded-xl text-xs font-medium transition-colors"
      >
        <Plus size={13} />
        <span className="hidden sm:inline">Agregar</span>
      </button>

      {dropdownOpen && (
        <SlotDropdown
          slotIndex={slotIndex}
          currentId={undefined}
          excludedIds={excludedIds}
          onSelect={onAdd}
          onClose={() => setDropdownOpen(false)}
        />
      )}
    </div>
  );
}

// ── CompareBar principal ─────────────────────────────────────────────────────

export default function CompareBar() {
  const { compareList, clearCompare, setModoComparacion, removeProduct, swapProduct, toggleCompare } = useCompare();
  const router = useRouter();

  if (compareList.length === 0) return null;

  const count = compareList.length;
  const canCompare = count >= 2;
  const slotsVacios = MAX_COMPARE - count;
  const excludedIds = compareList.map((p) => p.id);

  const cancelarSeleccion = () => {
    clearCompare();
    setModoComparacion(false);
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center pointer-events-none"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div
        className="pointer-events-auto bg-white shadow-2xl border border-gray-100 rounded-t-2xl md:rounded-2xl mx-0 md:mx-4 md:mb-4 w-full md:w-auto"
      >
        <div className="flex items-center gap-2 px-4 py-3 flex-wrap md:flex-nowrap">

          {/* ── Chips de productos ocupados ── */}
          {compareList.map((product, idx) => (
            <ProductChip
              key={product.id}
              product={product}
              slotIndex={idx}
              excludedIds={excludedIds}
              onRemove={() => removeProduct(product.id)}
              onSwap={(newProduct) => swapProduct(product.id, newProduct)}
            />
          ))}

          {/* ── Slots vacíos ── */}
          {Array.from({ length: slotsVacios }).map((_, i) => (
            <EmptySlot
              key={`empty-${i}`}
              slotIndex={count + i}
              excludedIds={excludedIds}
              onAdd={(p) => toggleCompare(p)}
              disabled={false}
            />
          ))}

          {/* ── Divisor ── */}
          <div className="hidden md:block w-px h-8 bg-gray-200 mx-1" />

          {/* ── CTA ── */}
          <div className="flex items-center gap-2 ml-auto md:ml-0">
            <div className="flex flex-col items-end">
              <button
                onClick={() => canCompare && router.push("/compare")}
                disabled={!canCompare}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${
                  canCompare
                    ? "bg-color-principal text-white hover:bg-color-principal-oscuro"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Ver comparación
              </button>
              {!canCompare && (
                <span className="text-[10px] text-gray-400 mt-0.5">
                  Seleccioná 1 modelo más
                </span>
              )}
            </div>

            {/* Cancelar */}
            <button
              onClick={cancelarSeleccion}
              aria-label="Cancelar comparación"
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors shrink-0"
            >
              <X size={16} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
