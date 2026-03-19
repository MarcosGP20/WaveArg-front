// lib/api.ts
import { Producto, Variante } from "@/interfaces/producto";
import { LoginDTO, RegisterDTO, AuthResponse } from "@/interfaces/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { MOCK_PRODUCTS } from "./mockProducts";

// Re-export for convenience
export type { Producto, Variante };

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5075/api";

/**
 * Lee el token desde la cookie auth-token (misma que usa el middleware y Zustand).
 * Una sola fuente de verdad para autenticación.
 */
function getAuthToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/auth-token=([^;]+)/);
  return match ? decodeURIComponent(match[1].trim()) : null;
}

export async function fetchFromApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();

  // Mezclamos los headers default con los que vengan en options
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);

    // Si el backend responde 401, el token probablemente expiró → limpiar auth (Zustand + cookie)
    if (res.status === 401) {
      if (typeof window !== "undefined") {
        useAuthStore.getState().logout();
      }
      throw new Error("Es necesario que tengas una sesión iniciada. Por favor, iniciá sesión para continuar.");
    }

    if (!res.ok) {
      // Intentamos leer el body como texto primero para no perder info
      const rawText = await res.text().catch(() => "");
      console.error(`[API ${res.status}] ${endpoint} →`, rawText);

      // Luego intentamos parsearlo como JSON
      let errorData: Record<string, unknown> = {};
      try {
        if (rawText) errorData = JSON.parse(rawText);
      } catch {
        // No era JSON — usamos el texto crudo como mensaje
      }

      // Mensaje personalizado para error 500 de duplicado
      if (res.status === 500 && (errorData.message as string)?.includes("UNIQUE KEY")) {
        throw new Error("Este email ya está registrado. Usa otro email.");
      }

      // .NET ProblemDetails: { title, errors: { campo: ["msg"] } }
      // .NET custom: { message: "..." }
      let errorMessage =
        (errorData.message as string) ||
        (errorData.title as string) ||
        rawText ||
        `Error ${res.status}: ${res.statusText}`;

      // Si hay errores de validación de campo, los concatenamos
      if (errorData.errors && typeof errorData.errors === "object") {
        const detalles = Object.entries(errorData.errors)
          .map(([campo, msgs]) => `${campo}: ${(msgs as string[]).join(", ")}`)
          .join(" | ");
        errorMessage = `${errorMessage} → ${detalles}`;
      }

      throw new Error(errorMessage);
    }

    // Para endpoints que devuelven 204 No Content (como un DELETE exitoso)
    if (res.status === 204) return {} as T;

    // El backend podría devolver texto plano en lugar de JSON
    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return (await res.json()) as T;
    } else {
      // Si es texto plano, lo convertimos a objeto con message
      const text = await res.text();
      return { message: text } as T;
    }
  } catch (error) {
    console.error(`[API Error - ${endpoint}]:`, error);
    throw error;
  }
}

// --- Endpoints ---

export const ProductService = {
  getAll: async (soloDisponibles = false) => {
    return MOCK_PRODUCTS;
  },

  getById: async (id: number | string) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === Number(id));
    if (!product) throw new Error("Producto no encontrado");
    return product;
  },

  create: (
    data: any, // Usamos any o CreateProductoDTO
  ) =>
    fetchFromApi<Producto>("/Productos", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Partial<Producto>) =>
    fetchFromApi<Producto>(`/Productos`, {
      method: "PUT",
      body: JSON.stringify({ id, ...data }),
    }),

  delete: (id: number) =>
    fetchFromApi<void>(`/Productos/${id}`, {
      method: "DELETE",
    }),
};

export const VariantesService = {
  create: (data: any) =>
    fetchFromApi<Variante[]>("/Variantes", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Partial<Variante>) =>
    fetchFromApi<Variante>(`/Variantes`, {
      method: "PUT",
      body: JSON.stringify({ id, ...data }),
    }),

  delete: (id: number) =>
    fetchFromApi<void>(`/Variantes/${id}`, {
      method: "DELETE",
    }),
};
export async function loginUser(data: LoginDTO) {
  return fetchFromApi<AuthResponse>("/Auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginWithGoogle(idToken: string) {
  return fetchFromApi<AuthResponse>("/Auth/google", {
    method: "POST",
    body: JSON.stringify({ idToken }),
  });
}

export async function registerUser(data: RegisterDTO) {
  // Ahora usamos fetchFromApi para ser consistentes
  return fetchFromApi<{ message: string }>("/Auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Ejemplo de lo que necesitas para el catálogo
// lib/api.ts
export async function getProductos() {
  return MOCK_PRODUCTS;
}

export async function getProductoById(id: number | string) {
  const product = MOCK_PRODUCTS.find((p) => p.id === Number(id));
  if (!product) throw new Error("Producto no encontrado");
  return product;
}

// --- MercadoPago ---

export interface MPPreferenciaItem {
  productoId: number;
  nombre: string;
  cantidad: number;
  precio: number;
}

export interface MPPreferenciaResponse {
  url_real?: string;    // URL de pago producción
  url_prueba?: string;  // URL de pago sandbox
  [key: string]: unknown;
}

export const MercadoPagoService = {
  /**
   * Crea una preferencia de pago en MercadoPago a través del backend.
   * Devuelve la URL de pago (initPoint o sandboxInitPoint).
   */
  crearPreferencia: (items: MPPreferenciaItem[]) =>
    fetchFromApi<MPPreferenciaResponse>("/MercadoPago/crear-preferencia", {
      method: "POST",
      body: JSON.stringify(items),
    }),

  /**
   * Reenvía una notificación de webhook de MercadoPago al backend.
   */
  procesarWebhook: (type: string, dataId: string) =>
    fetchFromApi<unknown>(
      `/MercadoPago/webhook?type=${encodeURIComponent(type)}&data.id=${encodeURIComponent(dataId)}`,
      { method: "POST" },
    ),
};
