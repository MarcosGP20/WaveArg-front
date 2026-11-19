"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { GRUPOS, PREGUNTAS } from "@/components/faq-datos";
import { linkWhatsApp } from "@/lib/whatsapp";

const WA_URL = linkWhatsApp("Hola, tengo una consulta sobre los productos de Wave.");
const PANEL_ID = "chat-ayuda-panel";
const RETRASO_MS = 400;
// Cada cuánto se agita el lanzador para llamar la atención (pedido del cliente). Solo mientras el
// chat no se abrió nunca en esta carga, con la pestaña visible y sin prefers-reduced-motion.
const INTERVALO_SACUDIDA_MS = 90_000;

type Mensaje = {
  id: number;
  rol: "bot" | "usuario";
  contenido: React.ReactNode;
};

const BIENVENIDA: Mensaje = {
  id: 0,
  rol: "bot",
  contenido: "Hola, soy el asistente de Wave. Elegí una pregunta y te respondo al toque.",
};

function reduceMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function ChatAyuda() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([BIENVENIDA]);
  const [escribiendo, setEscribiendo] = useState(false);
  // El lanzador aparece entero al cargar y se esconde a los 2,5 s (de una, con reduced-motion).
  const [asomado, setAsomado] = useState(true);
  const [yaAbrio, setYaAbrio] = useState(false);
  const [sacudiendo, setSacudiendo] = useState(false);

  const lanzadorRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const contadorRef = useRef(1);
  const pendienteRef = useRef<{ timer: ReturnType<typeof setTimeout>; respuesta: Mensaje } | null>(null);

  // Cierra el chat; si el bot estaba "escribiendo", la respuesta se publica ya para no perderla.
  const cerrar = useCallback((devolverFoco: boolean) => {
    const pendiente = pendienteRef.current;
    if (pendiente) {
      clearTimeout(pendiente.timer);
      pendienteRef.current = null;
      setMensajes((m) => [...m, pendiente.respuesta]);
      setEscribiendo(false);
    }
    setAbierto(false);
    if (devolverFoco) lanzadorRef.current?.focus();
  }, []);

  // Al desmontar, no deja un timeout vivo.
  useEffect(() => {
    return () => {
      if (pendienteRef.current) clearTimeout(pendienteRef.current.timer);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setAsomado(false), reduceMotion() ? 0 : 2500);
    return () => clearTimeout(timer);
  }, []);

  // Sacudida periódica del lanzador hasta que el usuario abre el chat por primera vez.
  useEffect(() => {
    if (abierto || yaAbrio || reduceMotion()) return;
    const intervalo = setInterval(() => {
      if (!document.hidden) setSacudiendo(true);
    }, INTERVALO_SACUDIDA_MS);
    return () => clearInterval(intervalo);
  }, [abierto, yaAbrio]);

  // Al abrir, el foco va al panel.
  useEffect(() => {
    if (abierto) panelRef.current?.focus();
  }, [abierto]);

  // Escape cierra y devuelve el foco al lanzador.
  useEffect(() => {
    if (!abierto) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar(true);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [abierto, cerrar]);

  // Con cada mensaje nuevo, deja visible el comienzo de la respuesta: la última pregunta del usuario.
  // Scroll explícito del log (no scrollIntoView) para que nunca mueva la página.
  useEffect(() => {
    const log = logRef.current;
    const burbujas = log?.querySelectorAll<HTMLElement>('[data-rol="usuario"]');
    const ultima = burbujas?.[burbujas.length - 1];
    if (!log || !ultima) return;
    log.scrollTo({ top: ultima.offsetTop - log.offsetTop - 16, behavior: reduceMotion() ? "auto" : "smooth" });
  }, [mensajes, escribiendo]);

  function abrir() {
    setYaAbrio(true);
    setSacudiendo(false);
    setAbierto(true);
  }

  function elegir(pregunta: string, respuesta: React.ReactNode) {
    if (escribiendo) return;
    const idPregunta = contadorRef.current++;
    const idRespuesta = contadorRef.current++;
    const msgRespuesta: Mensaje = { id: idRespuesta, rol: "bot", contenido: respuesta };
    setMensajes((m) => [...m, { id: idPregunta, rol: "usuario", contenido: pregunta }]);

    if (reduceMotion()) {
      setMensajes((m) => [...m, msgRespuesta]);
      return;
    }
    setEscribiendo(true);
    const timer = setTimeout(() => {
      pendienteRef.current = null;
      setMensajes((m) => [...m, msgRespuesta]);
      setEscribiendo(false);
    }, RETRASO_MS);
    pendienteRef.current = { timer, respuesta: msgRespuesta };
  }

  const anillo =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-principal";

  return (
    <>
      {abierto && (
        <div
          ref={panelRef}
          id={PANEL_ID}
          role="dialog"
          aria-label="Preguntas frecuentes"
          tabIndex={-1}
          className="fixed bottom-[calc(9.5rem+var(--barra-inferior,0px))] sm:bottom-[calc(14.25rem+var(--barra-inferior,0px))] right-6 z-[60] flex w-[min(380px,calc(100vw-2rem))] max-h-[min(560px,calc(100dvh-11.5rem))] sm:max-h-[min(560px,calc(100dvh-16.25rem))] flex-col overflow-hidden rounded-panel border border-borde bg-white shadow-xl transition-[bottom] duration-300 animate-[fadeUp_0.2s_ease-out_both] focus:outline-none motion-reduce:animate-none motion-reduce:transition-none"
        >
          {/* Encabezado */}
          <div className="flex items-start justify-between gap-2 border-b border-borde py-3 pl-4 pr-1">
            <div className="pt-1">
              <p className="font-semibold leading-tight text-tinta">Preguntas frecuentes</p>
              <p className="text-[13px] text-tinta-suave">Respuestas al instante</p>
            </div>
            <button
              type="button"
              onClick={() => cerrar(true)}
              aria-label="Cerrar chat"
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-control text-tinta-suave transition-colors hover:text-tinta ${anillo}`}
            >
              <X size={20} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>

          {/* Conversación */}
          <div ref={logRef} role="log" aria-live="polite" className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
            {mensajes.map((m) => (
              <div
                key={m.id}
                data-rol={m.rol}
                className={
                  m.rol === "bot"
                    ? "max-w-[88%] self-start rounded-2xl rounded-bl-md bg-superficie px-3.5 py-2.5 text-[15px] leading-relaxed text-tinta"
                    : "max-w-[88%] self-end rounded-2xl rounded-br-md bg-color-principal px-3.5 py-2.5 text-[15px] leading-relaxed text-white"
                }
              >
                {typeof m.contenido === "string" ? (
                  m.contenido
                ) : (
                  <div className="flex flex-col gap-2 [&_strong]:font-semibold">{m.contenido}</div>
                )}
              </div>
            ))}

            {escribiendo && (
              <div
                role="status"
                aria-label="Escribiendo"
                className="flex items-center gap-1 self-start rounded-2xl rounded-bl-md bg-superficie px-4 py-3.5"
              >
                {[0, 150, 300].map((retraso) => (
                  <span
                    key={retraso}
                    aria-hidden="true"
                    style={{ animationDelay: `${retraso}ms` }}
                    className="h-2 w-2 animate-pulse rounded-full bg-tinta-suave motion-reduce:animate-none"
                  />
                ))}
              </div>
            )}

            {/* Opciones: siempre al final; las ya consultadas se pueden repetir. */}
            <div className="mt-2 flex flex-col gap-4">
              {GRUPOS.map((grupo) => (
                <div key={grupo} role="group" aria-label={grupo} className="flex flex-col gap-2">
                  <p className="text-[13px] text-tinta-suave">{grupo}</p>
                  {PREGUNTAS.filter((p) => p.grupo === grupo).map(({ pregunta, respuesta }) => (
                    <button
                      key={pregunta}
                      type="button"
                      disabled={escribiendo}
                      onClick={() => elegir(pregunta, respuesta)}
                      className={`min-h-11 rounded-control border border-borde-fuerte bg-white px-3.5 py-2 text-left text-sm text-tinta transition-colors hover:border-color-principal disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-borde-fuerte ${anillo}`}
                    >
                      {pregunta}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Pie */}
          <div className="border-t border-borde px-4 py-3">
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-11 items-center text-sm text-color-principal underline underline-offset-[3px] ${anillo}`}
            >
              ¿No está tu duda? Escribinos por WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Lanzador: pestaña pegada al borde derecho. Escondida deja ver 40px con el ícono entero; entera
          (hover, foco, chat abierto, primeros 2,5 s) muestra ícono + etiqueta. En mobile 4px transparentes
          (pl-1) llegan a 44px tocables; desde sm se sacan para no tapar el aviso de WhatsApp. Hasta la
          primera apertura se agita cada INTERVALO_SACUDIDA_MS (animación en el span, no en el botón). */}
      <button
        ref={lanzadorRef}
        type="button"
        onClick={() => (abierto ? cerrar(false) : abrir())}
        aria-expanded={abierto}
        aria-controls={PANEL_ID}
        aria-label={abierto ? "Cerrar chat de preguntas frecuentes" : "¿Dudas? Abrir chat de preguntas frecuentes"}
        className={`group fixed bottom-[calc(5.75rem+var(--barra-inferior,0px))] sm:bottom-[calc(10.5rem+var(--barra-inferior,0px))] right-0 z-50 h-12 pl-1 sm:pl-0 transition-[bottom,transform] duration-250 ease-out focus:outline-none motion-reduce:transition-none ${
          abierto || asomado
            ? "translate-x-0"
            : "translate-x-[calc(100%-44px)] sm:translate-x-[calc(100%-40px)] hover:translate-x-0 focus-visible:translate-x-0"
        }`}
      >
        <span
          onAnimationEnd={() => setSacudiendo(false)}
          className={`flex h-12 items-center gap-2 rounded-l-full bg-color-principal pl-3 pr-4 text-white shadow-lg transition-colors group-hover:bg-color-principal-oscuro group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-color-principal motion-reduce:animate-none ${
            sacudiendo && !abierto ? "animate-[chatSacudida_0.7s_ease-in-out_both]" : ""
          }`}
          style={{ transformOrigin: "right center" }}
        >
          {abierto ? (
            <X size={20} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
          ) : (
            <MessageCircle size={20} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
          )}
          <span className="whitespace-nowrap text-sm font-medium">{abierto ? "Cerrar" : "¿Dudas?"}</span>
        </span>
      </button>
    </>
  );
}
