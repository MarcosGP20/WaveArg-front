import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
