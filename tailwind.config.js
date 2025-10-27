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
        colorPrincipal: "#05467D",
        colorPrincipalOscuro: "#0F3C64",
        colorSecundario: "#CCCCCC",
      },
    },
  },
  plugins: [],
};
