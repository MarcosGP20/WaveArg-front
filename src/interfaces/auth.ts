// interfaces/auth.interface.ts

export interface User {
  id: string;
  email: string;
  rol: string;
  nombre?: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginDTO {
  email: string;
  contraseña: string; // Importante: usar exactamente como pide el back
}

export interface RegisterDTO {
  email: string;
  contraseña: string;
  rolId: number; //  (0 por defecto)
}
