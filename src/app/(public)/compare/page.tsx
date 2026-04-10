"use client";

import { useCompare } from "@/context/CompareContext";
import { useCart } from "@/context/CartContext";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trash2, ArrowLeftRight, Search, X, Loader2,
  ShoppingCart, Check, ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getProductos } from "@/lib/api";
import { Producto } from "@/interfaces/producto";
import Toast from "@/components/ui/Toast";
import Breadcrumb from "@/components/Breadcrumb";

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseMemoriaGB(mem: string): number {
  if (!mem) return 0;
  const lower = mem.toLowerCase().trim();
  const num = parseFloat(lower);
  if (isNaN(num)) return 0;
  return lower.includes("tb") ? num * 1024 : num;
}

function getValue(p: Producto, label: string): string {
  const v = p.variantes?.[0];
  switch (label) {
    case "Precio":   return v?.precio != null ? `$${Number(v.precio).toLocaleString("es-AR")}` : "-";
    case "Memoria":  return v?.memoria ?? "-";
    case "Estado":   return v?.esUsado ? "Usado" : "Nuevo";
    case "Color":    return v?.color ?? "-";
    case "Stock":    return p.variantes?.some((va) => va.stock > 0) ? "En stock" : "Sin stock";
    default:         return "-";
  }
}

// ── Grupos de filas (S4) ──────────────────────────────────────────────────────

const ROW_GROUPS: { category: string; rows: string[] }[] = [
  { category: "Precio",           rows: ["Precio"] },
  { category: "Especificaciones", rows: ["Memoria", "Estado", "Color"] },
  { category: "Disponibilidad",   rows: ["Stock"] },
];

// ── Winners map (S4) ─────────────────────────────────────────────────────────

function buildWinnersMap(compareList: Producto[]): Map<string, Set<number>> {
  const map = new Map<string, Set<number>>();

  // Precio → menor gana
  const prices = compareList.map((p) => ({ id: p.id, val: p.variantes?.[0]?.precio ?? Infinity }));
  const minPrice = Math.min(...prices.map((p) => p.val));
  const priceWinners = prices.filter((p) => p.val === minPrice && p.val !== Infinity);
  if (priceWinners.length > 0 && priceWinners.length < compareList.length)
    map.set("Precio", new Set(priceWinners.map((p) => p.id)));

  // Memoria → mayor gana
  const mems = compareList.map((p) => ({ id: p.id, val: parseMemoriaGB(p.variantes?.[0]?.memoria ?? "") }));
  const maxMem = Math.max(...mems.map((m) => m.val));
  const memWinners = mems.filter((m) => m.val === maxMem && m.val > 0);
  if (memWinners.length > 0 && memWinners.length < compareList.length)
    map.set("Memoria", new Set(memWinners.map((m) => m.id)));

  return map;
}

// ── Render de celda con badges (S4) ──────────────────────────────────────────

function CellContent({ product, label, isWinner }: { product: Producto; label: string; isWinner: boolean }) {
  const value = getValue(product, label);

  if (label === "Precio") {
    return (
      <div className="flex flex-col items-center gap-1">
        <span className={`text-base font-bold ${isWinner ? "text-green-600" : "text-color-principal"}`}>
          {value}
        </span>
        {isWinner && (
          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
            💰 Más barato
          </span>
        )}
      </div>
    );
  }

  if (label === "Memoria") {
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm font-semibold">{value}</span>
        {isWinner && (
          <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
            💾 Mayor capacidad
          </span>
        )}
      </div>
    );
  }

  if (label === "Estado") {
    const isUsado = value === "Usado";
    return (
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isUsado ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
        {value}
      </span>
    );
  }

  if (label === "Stock") {
    const inStock = value === "En stock";
    return (
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${inStock ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
        {inStock ? "✓ En stock" : "✗ Sin stock"}
      </span>
    );
  }

  return <span className="text-sm text-gray-700">{value}</span>;
}

// ── Swap dropdown (S3) ───────────────────────────────────────────────────────

type SwapDropdownProps = {
  currentId?: number;
  excludedIds: number[];
  onSelect: (p: Producto) => void;
  onClose: () => void;
};

function SwapDropdown({ currentId, excludedIds, onSelect, onClose }: SwapDropdownProps) {
  const [query, setQuery]   = useState("");
  const [all, setAll]       = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const ref      = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getProductos().then(setAll).finally(() => setLoading(false));
  }, []);

  useEffect(() => { inputRef.current?.focus(); }, [loading]);

  useEffect(() => {
    const onKey   = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onClick = (e: MouseEvent)    => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [onClose]);

  const filtered = all.filter((p) => {
    if (p.id === currentId)          return false;
    if (excludedIds.includes(p.id))  return false;
    if (query) return p.nombre.toLowerCase().includes(query.toLowerCase());
    return true;
  });

  return (
    <div
      ref={ref}
      className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
    >
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
      <ul className="max-h-56 overflow-y-auto">
        {loading ? (
          <li className="flex items-center justify-center gap-2 py-6 text-gray-400 text-sm">
            <Loader2 size={16} className="animate-spin" /> Cargando...
          </li>
        ) : filtered.length === 0 ? (
          <li className="py-6 text-center text-sm text-gray-400">Sin resultados</li>
        ) : (
          filtered.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => { onSelect(p); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
              >
                {p.imagenes?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imagenes[0]} alt={p.nombre} className="w-9 h-9 object-contain rounded-xl bg-gray-100 shrink-0" />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-color-principal/10 shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{p.nombre}</p>
                  {p.variantes?.[0]?.precio != null && (
                    <p className="text-xs text-color-principal font-semibold">
                      ${p.variantes[0].precio.toLocaleString("es-AR")}
                    </p>
                  )}
                </div>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────

export default function ComparePage() {
  const { compareList, clearCompare, setModoComparacion, swapProduct } = useCompare();
  const { addToCart } = useCart();
  const router = useRouter();

  const [showToast, setShowToast]     = useState(false);
  const [toastMsg, setToastMsg]       = useState("Comparación vaciada");
  const [openSwap, setOpenSwap]       = useState<number | null>(null); // índice de columna con dropdown abierto
  const [addedIds, setAddedIds]       = useState<Set<number>>(new Set());
  const redirectTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setModoComparacion(false);
    return () => { if (redirectTimer.current) clearTimeout(redirectTimer.current); };
  }, [setModoComparacion]);

  // Winners map
  const winnersMap = useMemo(() => buildWinnersMap(compareList), [compareList]);

  // isDiff map (para highlight de fila)
  const rowsDiffMap = useMemo(() => {
    const allLabels = ROW_GROUPS.flatMap((g) => g.rows);
    const map = new Map<string, boolean>();
    for (const label of allLabels) {
      const vals = new Set(compareList.map((p) => getValue(p, label).trim().toLowerCase()));
      map.set(label, vals.size > 1);
    }
    return map;
  }, [compareList]);

  const excludedIds = compareList.map((p) => p.id);

  const handleClear = () => {
    clearCompare();
    setToastMsg("Comparación vaciada");
    setShowToast(true);
    redirectTimer.current = setTimeout(() => router.push("/products"), 200);
  };

  const handleAddToCart = (product: Producto) => {
    const variant = product.variantes
      ?.filter((v) => v.stock > 0)
      ?.sort((a, b) => a.precio - b.precio)[0];
    if (!variant) return;
    addToCart({
      id:       `${product.id}-${variant.id}`,
      name:     `${product.nombre} (${variant.color}, ${variant.memoria})`,
      price:    variant.precio,
      quantity: 1,
      image:    product.imagenes?.[0],
      type:     "producto",
    });
    setToastMsg(`${product.nombre} agregado al carrito`);
    setShowToast(true);
    setAddedIds((prev) => new Set([...prev, product.id]));
    setTimeout(() => {
      setAddedIds((prev) => { const s = new Set(prev); s.delete(product.id); return s; });
    }, 1500);
  };

  // ── Empty state ──────────────────────────────────────────────────────────
  if (compareList.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h1 className="text-3xl font-bold mb-2 text-color-principal">Comparar modelos</h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          Seleccioná al menos 2 productos desde el catálogo para ver una comparación detallada.
        </p>
        <Link
          href="/products"
          className="bg-color-principal text-white px-8 py-3 rounded-full font-medium hover:bg-color-principal-oscuro transition-colors shadow-md"
        >
          Ver productos
        </Link>
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Volver atrás
        </button>
        <Toast message={toastMsg} show={showToast} onClose={() => setShowToast(false)} />
      </div>
    );
  }

  // ── Main ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-32 md:pb-12">

      <Breadcrumb items={[
        { label: "Inicio", href: "/" },
        { label: "Productos", href: "/products" },
        { label: "Comparar modelos" },
      ]} />

      {/* Título */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Comparar modelos</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {compareList.length} modelos · las diferencias están resaltadas
          </p>
        </div>
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 size={15} />
          Limpiar
        </button>
      </div>

      {/* ── MOBILE: cards swipeables ────────────────────────────────────── */}
      <section
        className="md:hidden overflow-x-auto snap-x snap-mandatory flex gap-4 pb-4"
        aria-label="Comparación en formato móvil"
      >
        {compareList.map((p, colIdx) => {
          const hasStock = p.variantes?.some((v) => v.stock > 0);
          const isAdded  = addedIds.has(p.id);
          return (
            <article
              key={p.id}
              className="min-w-[88%] snap-center bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-4 flex flex-col gap-3"
            >
              {/* Header de la card */}
              <div className="flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.imagenes?.[0] || "/placeholder.png"}
                  alt={p.nombre}
                  className="w-16 h-16 object-contain rounded-xl bg-gray-50"
                />
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-900 leading-snug">{p.nombre}</h2>
                  <p className="text-sm font-bold text-color-principal mt-0.5">{getValue(p, "Precio")}</p>
                  {winnersMap.get("Precio")?.has(p.id) && (
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                      💰 Más barato
                    </span>
                  )}
                </div>
                {/* Swap mobile */}
                <div className="relative shrink-0">
                  <button
                    onClick={() => setOpenSwap(openSwap === colIdx ? null : colIdx)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-color-principal transition-colors px-2 py-1 rounded-full hover:bg-gray-50"
                  >
                    <ArrowLeftRight size={12} />
                    Cambiar
                  </button>
                  {openSwap === colIdx && (
                    <SwapDropdown
                      currentId={p.id}
                      excludedIds={excludedIds}
                      onSelect={(np) => { swapProduct(p.id, np); setOpenSwap(null); }}
                      onClose={() => setOpenSwap(null)}
                    />
                  )}
                </div>
              </div>

              {/* Specs */}
              <div className="divide-y divide-gray-100">
                {ROW_GROUPS.flatMap((g) => g.rows).filter((l) => l !== "Precio").map((label) => (
                  <div key={label} className="py-2 flex items-center justify-between gap-3">
                    <span className="text-xs text-gray-400 shrink-0">{label}</span>
                    <div className="text-right">
                      <CellContent product={p} label={label} isWinner={!!winnersMap.get(label)?.has(p.id)} />
                    </div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => handleAddToCart(p)}
                  disabled={!hasStock || isAdded}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    isAdded
                      ? "bg-green-600 text-white"
                      : hasStock
                      ? "bg-color-principal text-white hover:bg-color-principal-oscuro"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isAdded ? <><Check size={15} /> Agregado</> : <><ShoppingCart size={15} /> Agregar al carrito</>}
                </button>
                <Link
                  href={`/products/${p.id}`}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium text-color-principal hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <ExternalLink size={13} />
                  Ver producto
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      {/* ── DESKTOP: tabla con header sticky ────────────────────────────── */}
      <section className="hidden md:block">
        <div className="overflow-x-auto rounded-2xl shadow-sm ring-1 ring-black/5">
          <table className="w-full bg-white" style={{ minWidth: `${240 + compareList.length * 220}px` }}>

            {/* THEAD sticky (S3) */}
            <thead className="sticky top-0 z-30">
              <tr className="border-b border-gray-100 bg-white shadow-sm">
                {/* Celda vacía esquina */}
                <th className="sticky left-0 z-40 bg-white w-44" />

                {compareList.map((p, colIdx) => {
                  const hasStock = p.variantes?.some((v) => v.stock > 0);
                  const isAdded  = addedIds.has(p.id);
                  return (
                    <th
                      key={p.id}
                      scope="col"
                      className="px-6 py-5 text-center align-top bg-white"
                    >
                      {/* Imagen */}
                      <div className="relative mx-auto w-28 h-28 mb-3">
                        <Image
                          src={p.imagenes?.[0] || "/placeholder.png"}
                          alt={p.nombre}
                          fill
                          unoptimized
                          className="object-contain"
                        />
                      </div>

                      {/* Nombre */}
                      <p className="font-bold text-gray-900 text-sm leading-snug mb-1 truncate">
                        {p.nombre}
                      </p>

                      {/* Cambiar modelo */}
                      <div className="relative inline-block mb-3">
                        <button
                          onClick={() => setOpenSwap(openSwap === colIdx ? null : colIdx)}
                          className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-color-principal transition-colors px-2 py-1 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200"
                        >
                          <ArrowLeftRight size={11} />
                          Cambiar modelo
                        </button>
                        {openSwap === colIdx && (
                          <SwapDropdown
                            currentId={p.id}
                            excludedIds={excludedIds}
                            onSelect={(np) => { swapProduct(p.id, np); setOpenSwap(null); }}
                            onClose={() => setOpenSwap(null)}
                          />
                        )}
                      </div>

                      {/* CTAs (S3) */}
                      <div className="flex flex-col gap-1.5">
                        <button
                          onClick={() => handleAddToCart(p)}
                          disabled={!hasStock || isAdded}
                          className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-semibold transition-all ${
                            isAdded
                              ? "bg-green-600 text-white"
                              : hasStock
                              ? "bg-color-principal text-white hover:bg-color-principal-oscuro"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {isAdded
                            ? <><Check size={13} /> Agregado</>
                            : <><ShoppingCart size={13} /> {hasStock ? "Agregar al carrito" : "Sin stock"}</>
                          }
                        </button>
                        <Link
                          href={`/products/${p.id}`}
                          className="w-full flex items-center justify-center gap-1 py-1.5 rounded-full text-xs font-medium text-gray-500 hover:text-color-principal hover:bg-gray-50 transition-colors"
                        >
                          <ExternalLink size={11} />
                          Ver producto
                        </Link>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* TBODY: filas agrupadas (S4) */}
            <tbody>
              {ROW_GROUPS.map((group) => (
                <>
                  {/* Header de grupo */}
                  <tr key={`group-${group.category}`} className="bg-gray-50">
                    <td
                      colSpan={compareList.length + 1}
                      className="sticky left-0 bg-gray-50 px-5 py-2"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {group.category}
                      </span>
                    </td>
                  </tr>

                  {/* Filas del grupo */}
                  {group.rows.map((label) => {
                    const isDiff = rowsDiffMap.get(label);
                    return (
                      <tr
                        key={label}
                        className={`border-t border-gray-50 transition-colors ${isDiff ? "bg-blue-50/40" : "bg-white"}`}
                      >
                        {/* Label de fila (sticky left) */}
                        <th
                          scope="row"
                          className={`sticky left-0 z-10 border-r border-gray-100 font-medium text-right pr-5 py-4 w-44 align-middle text-sm text-gray-500 ${isDiff ? "bg-blue-50/40" : "bg-white"}`}
                        >
                          {label}
                        </th>

                        {/* Celdas de valor */}
                        {compareList.map((p) => {
                          const isWinner = !!winnersMap.get(label)?.has(p.id);
                          return (
                            <td
                              key={`${p.id}-${label}`}
                              className={`text-center py-4 px-4 align-middle border-l border-gray-50 ${
                                isWinner ? "bg-green-50/60" : ""
                              }`}
                            >
                              <CellContent product={p} label={label} isWinner={isWinner} />
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Toast message={toastMsg} show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
}
