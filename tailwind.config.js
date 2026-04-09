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
    },
  },
  plugins: [],
};
