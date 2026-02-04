// lib/api.ts
import { Producto, Variante } from "@/interfaces/producto";
import { LoginDTO, RegisterDTO, AuthResponse } from "@/interfaces/auth";
import { useAuthStore } from "@/store/useAuthStore";

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
      throw new Error("Sesión expirada. Por favor, inicia sesión de nuevo.");
    }

    if (!res.ok) {
      // Intentamos parsear el JSON de error del backend .NET
      const errorData = await res.json().catch(() => ({}));

      // Mensaje personalizado para error 500 de duplicado
      if (res.status === 500 && errorData.message?.includes("UNIQUE KEY")) {
        throw new Error("Este email ya está registrado. Usa otro email.");
      }

      throw new Error(
        errorData.message || `Error ${res.status}: ${res.statusText}`,
      );
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
  getAll: (soloDisponibles = false) =>
    fetchFromApi<Producto[]>(
      `/Productos${soloDisponibles ? "?soloDisponibles=true" : ""}`,
    ),

  getById: (id: number | string) => fetchFromApi<Producto>(`/Productos/${id}`),

  create: (
    data: any, // Usamos any o CreateProductoDTO
  ) =>
    fetchFromApi<Producto>("/Productos", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Partial<Producto>) =>
    fetchFromApi<Producto>(`/Productos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
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
};
export async function loginUser(data: LoginDTO) {
  return fetchFromApi<AuthResponse>("/Auth/login", {
    method: "POST",
    body: JSON.stringify(data), // Enviará { email, contraseña }
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
  // Según tu Swagger es /api/Productos?soloDisponibles=true
  return fetchFromApi<Producto[]>("/Productos?soloDisponibles=true", {
    method: "GET",
  });
}

export async function getProductoById(id: number | string) {
  return fetchFromApi<Producto>(`/Productos/${id}`, {
    method: "GET",
  });
}
