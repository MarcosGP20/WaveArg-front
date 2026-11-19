// Esqueleto del catálogo, con la forma de la página real: lo usan el Suspense de la página y la
// carga de productos.
const bloque = "animate-pulse rounded-lg bg-borde motion-reduce:animate-none";

export default function CatalogoEsqueleto() {
  return (
    <div aria-hidden="true" className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className={`h-10 w-48 ${bloque}`} />
      <div className={`mt-3 h-6 w-64 ${bloque}`} />
      <div className="mt-8 flex gap-8">
        <div className={`hidden h-96 w-64 flex-shrink-0 rounded-panel lg:block ${bloque}`} />
        <div className="grid flex-1 grid-cols-2 gap-3 md:gap-6 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-panel bg-superficie p-3 md:p-6">
              <div className={`aspect-square md:aspect-[4/3] ${bloque}`} />
              <div className={`mt-4 h-6 w-3/4 ${bloque}`} />
              <div className={`mt-2 h-5 w-1/2 ${bloque}`} />
              <div className={`mt-8 h-8 w-2/3 ${bloque}`} />
              <div className={`mt-4 h-12 ${bloque}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
