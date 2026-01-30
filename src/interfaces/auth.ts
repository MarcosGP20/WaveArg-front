// interfaces/auth.interface.ts

export interface User {
  id: string; // .NET suele usar strings para IDs si son GUIDs
  email: string;
  rol: string; // e.g., "Admin", "User"
  // Agrega aquí si el login devuelve nombre u otros campos
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
