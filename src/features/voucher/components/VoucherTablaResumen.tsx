// src/features/voucher/components/VoucherTablaResumen.tsx
import React from "react";
import { Banknote, Hash, Package, Palette, Receipt, Wrench } from "lucide-react";
import type { VoucherTablaResumenProps } from "../types/voucher.types";
import { formatBs, formatCantidadUnidad } from "../utils/voucherFormatters";
import { EncabezadoTabla } from "./shared/EncabezadoTabla";

export function VoucherTablaResumen({
  filas,
  subtotal,
}: VoucherTablaResumenProps) {
  // 1. Sanitización del subtotal de piezas (SOLO impresión, sin diseño ni accesorios)
  const numSubtotalPiezas = Number(subtotal) || 0;

  // 🎨 Diseño y modelado: proporcional exacto según las filas visibles en la pestaña actual
  const numDiseno = filas.reduce(
    (acc, f) => acc + (Number(f.pieza.precio_personalizacion_pieza) || 0),
    0
  );
  const tieneDiseno = numDiseno > 0;

  // 🔩 Cálculo del costo total de accesorios de todas las filas visibles
  const numAccesorios = filas.reduce(
    (accSum, f) =>
      accSum +
      (f.accesorios ?? []).reduce(
        (subAcc, a) => subAcc + (Number(a.costoTotal) || 0),
        0
      ),
    0
  );
  const tieneAccesorios = numAccesorios > 0;

  // 📦 Subtotal de trabajo de impresión = piezas + accesorios (sin diseño)
  const numSubtotalTrabajo = numSubtotalPiezas + numAccesorios;

  // 2. Total final a pagar de esta vista
  const totalCalculado = numSubtotalTrabajo + numDiseno;

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 shadow-xs bg-white">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="bg-[var(--dark-bg)] font-bold uppercase tracking-wider text-white">
            <th className="px-4 py-3">
              <EncabezadoTabla icon={Package} label="Concepto" />
            </th>
            <th className="px-4 py-3 text-center">
              <EncabezadoTabla icon={Hash} label="Cantidad" align="center" />
            </th>
            <th className="px-4 py-3 text-right">
              <EncabezadoTabla icon={Banknote} label="P. Unitario" align="right" />
            </th>
            <th className="px-4 py-3 text-right">
              <EncabezadoTabla icon={Receipt} label="Importe" align="right" />
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 text-slate-700">
          {filas.map((fila, idx) => {
            const tieneAccesoriosFila = fila.accesorios && fila.accesorios.length > 0;

            return (
              <React.Fragment key={idx}>
                {/* Fila Principal: Pieza de Impresión 3D */}
                <tr className="transition hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Package className="h-4 w-4 text-slate-500 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900">{fila.descripcion}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-mono">{fila.cantidad}</td>
                  <td className="px-4 py-3 text-right font-mono">
                    {formatBs(fila.precioUnitario)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900 font-mono">
                    {formatBs(fila.total)}
                  </td>
                </tr>

                {/* Filas de Accesorios Asociados (Directamente debajo de su pieza) */}
                {tieneAccesoriosFila &&
                  fila.accesorios.map((acc, accIdx) => {
                    const precioUnitAcc = Number(acc.costoUnitario) || 0;
                    const totalAcc = Number(acc.costoTotal) || 0;

                    return (
                      <tr
                        key={`acc-${idx}-${accIdx}`}
                        className="bg-sky-50/30 transition hover:bg-sky-50/60"
                      >
                        <td className="py-2.5 pl-8 pr-4">
                          <div className="flex items-start gap-2.5 text-sky-900">
                            <Wrench className="h-3.5 w-3.5 text-sky-500 shrink-0 mt-0.5" />
                            <div className="flex flex-col">
                              <span className="text-[11px] font-semibold text-sky-950">
                                {acc.nombre}
                              </span>
                              <span className="text-[10px] text-slate-400 font-normal">
                                Para la pieza: <span className="font-medium text-slate-500">{fila.descripcion}</span>
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono text-sky-900">
                          {acc.cantidad}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-sky-900">
                          {formatBs(precioUnitAcc)}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono font-semibold text-sky-950">
                          {formatBs(totalAcc)}
                        </td>
                      </tr>
                    );
                  })}
              </React.Fragment>
            );
          })}
        </tbody>

        {/* ============================================================ */}
        {/* FOOTER DE LA TABLA: RESUMEN DE COSTOS INTEGRADO              */}
        {/* ============================================================ */}
        <tfoot className="divide-y divide-slate-200 border-t-2 border-slate-200">
          {/* Subtotal de piezas + accesorios */}
          <tr className="bg-slate-100/90">
            <td colSpan={3} className="px-4 py-3 text-left font-semibold text-slate-800 text-xs">
              <div className="flex items-center justify-start gap-2">
                <Package className="h-4 w-4 text-slate-600" /> Subtotal Piezas y Accesorios:
              </div>
            </td>
            <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 text-sm">
              {formatBs(numSubtotalTrabajo)}
            </td>
          </tr>

          {/* Servicio adicional: Diseño y Modelado 3D */}
          {tieneDiseno && (
            <tr className="bg-amber-100/70 border-t border-amber-200/80">
              <td colSpan={3} className="px-4 py-3 text-left font-medium text-amber-900 text-xs">
                <div className="flex items-center justify-start gap-2">
                  <Palette className="h-4 w-4 text-amber-600" /> Diseño y Modelado 3D:
                </div>
              </td>
              <td className="px-4 py-3 text-right font-mono font-bold text-amber-950 text-sm">
                {formatBs(numDiseno)}
              </td>
            </tr>
          )}

          {/* Total Final a Pagar */}
          <tr className="bg-[var(--brand-light)] border-t-2 border-[var(--brand)]/40 font-bold text-slate-900">
            <td colSpan={3} className="px-4 py-3.5 text-left uppercase tracking-wider text-xs text-[var(--brand-dark)]">
              <div className="flex items-center justify-start gap-2">
                <Receipt className="h-4 w-4 text-[var(--brand)]" /> Total a pagar:
              </div>
            </td>
            <td className="px-4 py-3.5 text-right font-mono text-base font-black text-[var(--brand)]">
              {formatBs(totalCalculado)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}