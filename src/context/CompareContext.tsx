"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Producto } from "@/lib/api";

export type Product = Producto;

type CompareContextType = {
  compareList: Product[];
  toggleCompare: (product: Product) => void;
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

  const clearCompare = () => setCompareList([]);

  return (
    <CompareContext.Provider
      value={{
        compareList,
        toggleCompare,
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
