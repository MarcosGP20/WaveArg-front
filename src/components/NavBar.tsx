import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="flex gap-4 p-4 border-b">
      <Link href="/" className="font-semibold">
        Home
      </Link>
      <Link href="/products">Products</Link>
      <Link href="/cart">Cart</Link>
    </nav>
  );
}
