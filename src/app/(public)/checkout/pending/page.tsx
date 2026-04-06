import { Suspense } from "react";
import type { Metadata } from "next";
import PendingContent from "./PendingContent";

export const metadata: Metadata = {
  title: "Pago pendiente | Wave ARG",
};

export default function PendingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PendingContent />
    </Suspense>
  );
}
