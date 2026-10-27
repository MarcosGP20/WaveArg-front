"use client";

import { LazyMotion, MotionConfig } from "framer-motion";

const cargarFeatures = () => import("./motion-features").then((mod) => mod.default);

// Usar siempre `m.div` (no `motion.div`): con `strict`, un `motion.*` tira error, porque traería
// todas las features al bundle. reducedMotion="user" respeta prefers-reduced-motion.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={cargarFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
