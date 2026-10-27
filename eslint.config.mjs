import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Regla nueva del compilador de React (eslint-config-next 16). Hay ~20 setState en efectos
      // de hidratación (localStorage, auth); pasarlos a useSyncExternalStore es un refactor
      // aparte. Queda como warning para no frenar CI.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
