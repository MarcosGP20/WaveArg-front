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
      keyframes: {
        fadeDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeDown: "fadeDown 0.18s ease-out forwards",
      },
    },
  },
  plugins: [],
};
