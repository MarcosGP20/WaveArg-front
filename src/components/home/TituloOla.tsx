import { Fragment } from "react";

// Titular con la "ola tipográfica" (DESIGN.md): al cargar, una ola recorre las letras ensanchando
// el eje wdth de Archivo y vuelve. Una sola vez; con reduced-motion, quieto. Las letras van en
// spans ocultos para lectores de pantalla, que leen el texto entero del sr-only.
export default function TituloOla({ lineas, className }: { lineas: string[]; className?: string }) {
  let indice = 0;
  return (
    <h1 className={className}>
      <span className="sr-only">{lineas.join(" ")}</span>
      <span aria-hidden="true">
        {lineas.map((linea, l) => (
          <Fragment key={l}>
            {l > 0 && <br />}
            {linea.split(" ").map((palabra, p, palabras) => (
              <Fragment key={p}>
                <span className="inline-block whitespace-nowrap">
                  {[...palabra].map((letra) => {
                    const i = indice++;
                    return (
                      <span key={i} className="titulo-ola-letra" style={{ "--i": i } as React.CSSProperties}>
                        {letra}
                      </span>
                    );
                  })}
                </span>
                {p < palabras.length - 1 && " "}
              </Fragment>
            ))}
          </Fragment>
        ))}
      </span>
    </h1>
  );
}
