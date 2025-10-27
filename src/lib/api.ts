const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5075/api";

export async function fetchFromApi<T>(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${endpoint}`, options);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API request failed: ${res.status} - ${errorText}`);
  }
  return (await res.json()) as T;
}

// Registro de usuario
export async function registerUser(data: {
  email: string;
  password: string;
  [key: string]: any;
}) {
  return fetchFromApi("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// Login de usuario
export async function loginUser(data: { email: string; password: string }) {
  return fetchFromApi("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
