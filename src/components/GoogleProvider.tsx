"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export function GoogleProvider({ children }: { children: React.ReactNode }) {
  if (!clientId || clientId === "TU_CLIENT_ID_ACA") {
    // Sin Client ID configurado, renderizamos sin proveedor (el botón mostrará un warning)
    return <>{children}</>;
  }
  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
