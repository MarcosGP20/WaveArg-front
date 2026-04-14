import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { CompareProvider } from "@/context/CompareContext";
import CompareBar from "@/components/CompareBar";
import CartAbandonmentReminder from "@/components/CartAbandonmentReminder";
import CartDrawer from "@/components/CartDrawer";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <CompareProvider>
        <div className="flex min-h-screen flex-col">
          <NavBar />
          <main className="flex-1">{children}</main>
          <CompareBar />
          <CartAbandonmentReminder />
          <CartDrawer />
          <Footer />
        </div>
      </CompareProvider>
    </CartProvider>
  );
}
