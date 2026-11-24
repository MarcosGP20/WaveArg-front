// Al apretar Atrás, el navegador puede restaurar la página entera desde su bfcache (con el DOM y
// el store de antes) sin pasar por el servidor. Después de cerrar sesión eso mostraría datos de la
// cuenta cerrada: si la página vino de la bfcache hay que recargarla.
export function debeRecargar(evento: { persisted: boolean }): boolean {
  return evento.persisted;
}
