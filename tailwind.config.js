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
        // MercadoPago brand colors
        "mp": "var(--color-mp)",
        "mp-dark": "var(--color-mp-dark)",
      },
      fontSize: {
        // Escala semántica — usar en lugar de text-2xl/3xl/etc. ad hoc
        // h1: título principal de página (ej: nombre de producto, encabezado hero)
        "h1": ["clamp(1.875rem, 4vw, 2.25rem)", { lineHeight: "1.15", fontWeight: "700" }],
        // h2: título de sección (ej: "Conocé nuestros productos", "Resumen del pedido")
        "h2": ["clamp(1.5rem, 3vw, 1.875rem)", { lineHeight: "1.2", fontWeight: "700" }],
        // h3: subtítulo / título de card (ej: nombre de producto en card)
        "h3": ["clamp(1.0625rem, 2vw, 1.25rem)", { lineHeight: "1.3", fontWeight: "600" }],
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
