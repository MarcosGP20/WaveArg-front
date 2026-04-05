// Enum de categorías tal como lo define el backend
export enum CategoriaAccesorio {
  Cases = 0,
  Chargers = 1,
  Laptops = 2,
  Cables = 3,
  ScreenProtectors = 4,
  Others = 5,
}

export const CATEGORIA_LABELS: Record<CategoriaAccesorio, string> = {
  [CategoriaAccesorio.Cases]: "Fundas",
  [CategoriaAccesorio.Chargers]: "Cargadores",
  [CategoriaAccesorio.Laptops]: "Laptops",
  [CategoriaAccesorio.Cables]: "Cables",
  [CategoriaAccesorio.ScreenProtectors]: "Protectores de pantalla",
  [CategoriaAccesorio.Others]: "Otros",
};

export interface AccesorioVariante {
  id: number;
  color: string;
  especificacion: string; // ej: "Compatible iPhone 14", "Tipo-C"
  precio: number;
  stock: number;
  esUsado: boolean;
  detalleEstado: string | null;
  fotoEstadoUrl: string | null;
  imagenes?: string[];
}

export interface Accesorio {
  id: number;
  nombre: string;
  modelo: string;
  descripcion: string;
  categoria: number; // Valor numérico del enum: 0=Cases, 1=Chargers, 2=Laptops...
  stockTotal: number;
  imagenes: string[];
  variantes: AccesorioVariante[];
}

export type CreateAccesorioDTO = {
  nombre: string;
  modelo: string;
  descripcion: string;
  categoria: CategoriaAccesorio;
  imagenesUrls: string[];
};
