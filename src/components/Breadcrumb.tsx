import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1 text-sm text-tinta-suave">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={13} strokeWidth={1.75} aria-hidden="true" className="flex-shrink-0 text-borde-fuerte" />}
          {item.href ? (
            <Link href={item.href} className="py-2 transition-colors hover:text-tinta hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="max-w-[220px] truncate font-medium text-tinta" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
