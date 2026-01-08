// lib/api.ts

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5075/api";

/**
 * Helper para obtener el token de forma segura en Next.js
 */
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export async function fetchFromApi<T>(
  endpoint: string,
  options: RequestInit = {}
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

    // Si el backend responde 401, el token probablemente expiró
    if (res.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // Opcional: window.location.href = '/login';
      }
      throw new Error("Sesión expirada. Por favor, inicia sesión de nuevo.");
    }

    if (!res.ok) {
      // Intentamos parsear el JSON de error del backend .NET
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${res.status}: ${res.statusText}`
      );
    }

    // Para endpoints que devuelven 204 No Content (como un DELETE exitoso)
    if (res.status === 204) return {} as T;

    return (await res.json()) as T;
  } catch (error) {
    console.error(`[API Error - ${endpoint}]:`, error);
    throw error;
  }
}

// --- Endpoints ---

// Definimos interfaces para tener autocompletado total
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    nombre: string;
  };
}

export async function registerUser(data: Record<string, any>) {
  return fetchFromApi<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(data: object) {
  return fetchFromApi<AuthResponse>("/auth/login", {
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
