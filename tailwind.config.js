// tailwind.config.ts

module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        colorPrincipal: "#05467D", // Azul primario
        colorPrincipalOscuro: "#0F3C64", // Azul oscuro
        colorSecundario: "#CCCCCC", // Gris claro
      },
    },
  },
  plugins: [],
};
