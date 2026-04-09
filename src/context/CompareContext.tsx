"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Producto } from "@/interfaces/producto";

export type Product = Producto;

type CompareContextType = {
  compareList: Product[];
  toggleCompare: (product: Product) => void;
  removeProduct: (id: number) => void;
  swapProduct: (oldId: number, newProduct: Product) => void;
  clearCompare: () => void;
  modoComparacion: boolean;
  setModoComparacion: (estado: boolean) => void;
};

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [modoComparacion, setModoComparacion] = useState(false);

  const toggleCompare = (product: Product) => {
    const exists = compareList.find((p) => p.id === product.id);
    let updatedList;
    if (exists) {
      updatedList = compareList.filter((p) => p.id !== product.id);
    } else {
      updatedList = [...compareList, product];
    }
    setCompareList(updatedList);
    setModoComparacion(updatedList.length > 0);
  };

  const removeProduct = (id: number) => {
    const updated = compareList.filter((p) => p.id !== id);
    setCompareList(updated);
    setModoComparacion(updated.length > 0);
  };

  const swapProduct = (oldId: number, newProduct: Product) => {
    // Evitar duplicados: si el nuevo ya está en la lista, no lo agrega
    if (compareList.some((p) => p.id === newProduct.id)) return;
    const updated = compareList.map((p) => (p.id === oldId ? newProduct : p));
    setCompareList(updated);
  };

  const clearCompare = () => setCompareList([]);

  return (
    <CompareContext.Provider
      value={{
        compareList,
        toggleCompare,
        removeProduct,
        swapProduct,
        clearCompare,
        modoComparacion,
        setModoComparacion,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context)
    throw new Error("useCompare must be used within CompareProvider");
  return context;
};
