// tailwind.config.ts
module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-atkinson)", "sans-serif"],
      },
      colors: {
        "color-principal": "var(--color-principal)",
        "color-principal-oscuro": "var(--color-principal-oscuro)",
        colorSecundario: "#CCCCCC",
      },
      transitionDuration: {
        fast: "var(--duration-fast)",   // 150ms — micro-interactions, color swaps
        base: "var(--duration-base)",   // 250ms — default for most transitions
        slow: "var(--duration-slow)",   // 400ms — layout shifts, large motions
      },
    },
  },
  plugins: [],
};
