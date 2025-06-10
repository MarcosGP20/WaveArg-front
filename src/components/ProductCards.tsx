import Link from "next/link";

type ProductCardProps = {
  nombre: string;
  color: string;
  memoria: string;
  precio: number;
  image: string;
  slug: string;
};

export default function ProductCard({
  nombre,
  color,
  memoria,
  precio,
  image,
  slug,
}: ProductCardProps) {
  return (
    <Link href={`/products/${slug}`} className="block">
      <div className="border rounded-xl p-4 hover:shadow-md transition">
        <div className="relative w-full h-60 mb-4">
          <img
            src={image}
            alt={nombre}
            className="object-contain w-full h-full"
          />
        </div>
        <h2 className="text-lg font-semibold">{nombre}</h2>
        <p className="text-sm text-gray-500">
          {color} · {memoria}
        </p>
        <p className="text-xl font-bold mt-2">${precio.toLocaleString()}</p>
        <span className="mt-3 inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          Ver más
        </span>
      </div>
    </Link>
  );
}
