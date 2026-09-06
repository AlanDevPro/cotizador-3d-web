// src/features/voucher/components/VoucherHeroCard.tsx

import { useState, useEffect, useCallback } from "react";
import { Layers, Package, Palette, Maximize2, X } from "lucide-react";
import { formatBs } from "../utils/voucherFormatters";
import type { CotizacionPublica } from "../types/voucher.types";

interface VoucherHeroCardProps {
  cotizacion: CotizacionPublica;
  piezaSeleccionadaId?: string | null;
}

function obtenerUrlValida(val: unknown): string | null {
  if (typeof val === "string" && val.trim().length > 0) {
    return val;
  }
  return null;
}

export function VoucherHeroCard({
  cotizacion,
  piezaSeleccionadaId,
}: VoucherHeroCardProps) {
  const [modalAbierto, setModalAbierto] = useState(false);

  const piezaSeleccionada = piezaSeleccionadaId
    ? cotizacion.piezas.find((p) => p.id === piezaSeleccionadaId)
    : null;

  const esGeneral = !piezaSeleccionada;

  const precioMostrado = piezaSeleccionada
    ? piezaSeleccionada.precio_total_pieza
    : cotizacion.precio_final;

  const imgPieza = obtenerUrlValida(piezaSeleccionada?.imagen_url);
  const imgCotizacion = obtenerUrlValida(cotizacion.imagen_referencia_url);
  const imgFallbackPieza = obtenerUrlValida(
    cotizacion.piezas.find((p) => obtenerUrlValida(p.imagen_url))?.imagen_url
  );

  const imagenProducto: string | null = piezaSeleccionada
    ? (imgPieza || imgCotizacion)
    : (imgCotizacion || imgFallbackPieza);

  const manejarKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setModalAbierto(false);
    }
  }, []);

  useEffect(() => {
    if (modalAbierto) {
      window.addEventListener("keydown", manejarKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", manejarKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [modalAbierto, manejarKeyDown]);

  let materialTxt = "No especificado";
  let colorTxt = "No especificado";
  let colorHex: string | null = null;

  if (piezaSeleccionada) {
    materialTxt = piezaSeleccionada.filamento?.material || "No especificado";
    colorTxt = piezaSeleccionada.filamento?.color || "No especificado";
    colorHex = piezaSeleccionada.filamento?.color_hex || null;
  } else if (cotizacion.piezas && cotizacion.piezas.length > 0) {
    const materialesUnicos = Array.from(
      new Set(
        cotizacion.piezas
          .map((p) => p.filamento?.material)
          .filter((m): m is string => Boolean(m))
      )
    );

    const coloresUnicos = Array.from(
      new Set(
        cotizacion.piezas
          .map((p) => p.filamento?.color)
          .filter((c): c is string => Boolean(c))
      )
    );

    if (materialesUnicos.length === 1) {
      materialTxt = materialesUnicos[0];
    } else if (materialesUnicos.length > 1) {
      materialTxt = "Múltiples materiales";
    }

    if (coloresUnicos.length === 1) {
      colorTxt = coloresUnicos[0];
      const primerHex = cotizacion.piezas.find(
        (p) => p.filamento?.color_hex
      );
      colorHex = primerHex?.filamento?.color_hex || null;
    } else if (coloresUnicos.length > 1) {
      colorTxt = "Varios colores";
    }
  }

  return (
    <>
      <div className="mt-6 flex flex-col items-center gap-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm md:flex-row md:items-stretch md:p-6">
        {imagenProducto ? (
          <div
            onClick={() => setModalAbierto(true)}
            className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-xl border border-slate-200/70 bg-slate-50 shadow-inner transition-all hover:border-slate-300 md:w-1/2"
            title="Haz clic para ampliar la imagen"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagenProducto}
              alt="Vista previa del modelo 3D"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-black/65 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-transform group-hover:scale-105">
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Ampliar</span>
            </div>
          </div>
        ) : (
          <div className="flex aspect-square w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/80 text-xs font-semibold text-slate-400 md:w-1/2">
            <div className="mb-2 rounded-full bg-slate-100 p-3.5 text-slate-400">
              <Package className="h-8 w-8" />
            </div>
            <span>Sin vista previa disponible</span>
          </div>
        )}

        <div className="flex w-full flex-col justify-center gap-4 py-2 md:w-1/2 md:py-4">
          <div className="relative flex flex-col justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand)]/90 p-5 text-white shadow-md sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/80">
              {esGeneral ? "PRECIO TOTAL ESTIMADO" : "PRECIO DE ESTA PIEZA"}
            </p>
            <p className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
              {formatBs(precioMostrado)}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-xs shadow-2xs">
              <div className="rounded-lg bg-white p-2 text-slate-600 shadow-xs">
                <Layers className="h-4 w-4" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Material
                </span>
                <span className="truncate font-bold text-slate-800">
                  {materialTxt}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-xs shadow-2xs">
              <div className="rounded-lg bg-white p-2 text-slate-600 shadow-xs">
                <Palette className="h-4 w-4" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Color
                </span>
                <div className="flex items-center gap-1.5 truncate font-bold text-slate-800">
                  {colorHex && (
                    <span
                      className="inline-block h-3.5 w-3.5 flex-shrink-0 rounded-full border border-slate-300 shadow-xs"
                      style={{ backgroundColor: colorHex }}
                      title={`HEX: ${colorHex}`}
                    />
                  )}
                  <span className="truncate">{colorTxt}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalAbierto && imagenProducto && (
        <div
          onClick={() => setModalAbierto(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[90vh] max-w-4xl flex-col items-center overflow-hidden rounded-2xl bg-slate-900/40 p-2 shadow-2xl ring-1 ring-white/10"
          >
            <button
              type="button"
              onClick={() => setModalAbierto(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2.5 text-white backdrop-blur-sm transition-transform hover:scale-110 hover:bg-black/80"
              title="Cerrar (Esc)"
            >
              <X className="h-5 w-5" />
            </button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagenProducto}
              alt="Vista previa ampliada del modelo 3D"
              className="max-h-[85vh] w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}