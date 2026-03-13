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
