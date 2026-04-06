import { Suspense } from "react";
import FailureContent from "./FailureContent";

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
