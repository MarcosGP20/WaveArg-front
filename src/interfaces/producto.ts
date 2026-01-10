export interface Variante {
  id: number;
  color: string;
  memoria: string;
  precio: number;
  stock: number;
  esUsado: boolean;
  fotoEstadoUrl: string | null;
}

export interface Producto {
  id: number;
  nombre: string;
  modelo: string;
  descripcion: string;
  stockTotal: number;
  imagenes: string[];
  variantes: Variante[];
}
