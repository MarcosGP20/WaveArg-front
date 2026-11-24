// La ola del logo como separador: reemplaza las líneas rectas en los bordes de sección de la home.
const LARGO = 1200;
const PASO = 40;

const camino = (() => {
  let d = `M0 12 Q ${PASO / 2} 2 ${PASO} 12`;
  for (let x = PASO * 2; x <= LARGO; x += PASO) d += ` T ${x} 12`;
  return d;
})();

export default function LineaOla({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${LARGO} 24`} preserveAspectRatio="none" className={`block h-3 w-full ${className ?? ""}`}>
      <path d={camino} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
