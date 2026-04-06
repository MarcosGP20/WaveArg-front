import { Suspense } from "react";
import type { Metadata } from "next";
import FailureContent from "./FailureContent";

export const metadata: Metadata = {
  title: "Pago no aprobado | Wave ARG",
};

export default function FailurePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <FailureContent />
    </Suspense>
  );
}
