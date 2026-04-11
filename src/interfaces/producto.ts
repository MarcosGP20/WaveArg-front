export interface Variante {
  id: number;
  color: string;
  memoria: string;
  precio: number;
  stock: number;
  esUsado: boolean;
  detalleEstado: string;
  fotoEstadoUrl: string | null;
  imagenes?: string[];
}

export interface ImagenDetalle {
  id: number;
  url: string;
}

export interface Producto {
  id: number;
  nombre: string;
  modelo: string;
  descripcion: string;
  stockTotal: number;
  imagenes: string[];
  imagenesDetalle?: ImagenDetalle[];
  variantes: Variante[];
}

export interface CreateProductoDTO {
  nombre: string;
  modelo: string;
  descripcion: string;
  imagenesUrls: string[];
  variantes: Omit<Variante, "id">[];
}
