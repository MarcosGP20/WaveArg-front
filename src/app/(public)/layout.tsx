import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { CompareProvider } from "@/context/CompareContext";
import CompareBar from "@/components/CompareBar";
import CartAbandonmentReminder from "@/components/CartAbandonmentReminder";
import CartDrawer from "@/components/CartDrawer";
import AdminFloatingButton from "@/components/AdminFloatingButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import { GoogleProvider } from "@/components/GoogleProvider";
import MotionProvider from "@/components/MotionProvider";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GoogleProvider>
    <MotionProvider>
    <CartProvider>
      <CompareProvider>
        <div className="flex min-h-screen flex-col">
          {/* Skip link (front#14): invisible hasta que recibe foco con Tab. */}
          <a
            href="#contenido"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-[#05467D] focus:shadow-lg"
          >
            Ir al contenido
          </a>
          <NavBar />
          {/* El único <main> del sitio público: las páginas no abren otro. */}
          <main id="contenido" tabIndex={-1} className="flex-1 focus:outline-none">{children}</main>
          <CompareBar />
          <CartAbandonmentReminder />
          <CartDrawer />
          <AdminFloatingButton />
          <WhatsAppButton />
          <Footer />
        </div>
      </CompareProvider>
    </CartProvider>
    </MotionProvider>
    </GoogleProvider>
  );
}
