const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5000";

export async function fetchFromApi<T>(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${endpoint}`, options);
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}
