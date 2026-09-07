// src/features/voucher/components/VoucherTablaResumen.tsx

import { Banknote, Hash, Package, Palette, Receipt } from "lucide-react";
import type { VoucherTablaResumenProps } from "../types/voucher.types";
import { formatBs } from "../utils/voucherFormatters";
import { EncabezadoTabla } from "./shared/EncabezadoTabla";

export function VoucherTablaResumen({
  filas,
  costoDisenoTotal = 0,
  subtotal,
}: VoucherTablaResumenProps) {
  // 1. Sanitización de valores numéricos de entrada
  const numDiseno = Number(costoDisenoTotal) || 0;
  const numSubtotalPiezas = Number(subtotal) || 0;

  const tieneDiseno = numDiseno > 0;

  // 2. Cálculo directo del Total a Pagar (Piezas + Diseño, sin IVA ni recargos)
  const totalCalculado = numSubtotalPiezas + numDiseno;

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 shadow-xs">
      {/* Tabla de Detalle de Piezas */}
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="bg-[var(--dark-bg)] font-bold uppercase tracking-wider text-white">
            <th className="px-4 py-3">
              <EncabezadoTabla icon={Package} label="Pieza" />
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
          {filas.map((fila, idx) => (
            <tr key={idx} className="transition hover:bg-slate-50/50">
              <td className="px-4 py-3 font-semibold text-slate-900">
                {fila.descripcion}
              </td>
              <td className="px-4 py-3 text-center">{fila.cantidad}</td>
              <td className="px-4 py-3 text-right">
                {formatBs(fila.precioUnitario)}
              </td>
              <td className="px-4 py-3 text-right font-bold text-slate-900">
                {formatBs(fila.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Resumen Final de Costos (Sin Impuestos / IVA) */}
      <div className="space-y-2 border-t border-slate-200 bg-slate-50/80 px-4 py-3">
        {/* Servicio Adicional: Diseño y Modelado 3D */}
        {tieneDiseno && (
          <div className="flex items-center justify-between rounded-lg border border-amber-200/60 bg-amber-50/60 px-3 py-2 text-xs text-amber-900 shadow-2xs">
            <span className="flex items-center gap-1.5 font-medium">
              <Palette className="h-3.5 w-3.5 text-amber-600" /> Diseño y Modelado 3D
            </span>
            <span className="font-semibold text-amber-950 font-mono">
              {formatBs(numDiseno)}
            </span>
          </div>
        )}

        {/* Total Final a Pagar */}
        <div className="flex items-center justify-between rounded-lg border border-[var(--brand)]/30 bg-[var(--brand-light)] px-3 py-2.5 text-sm font-bold text-slate-900">
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[var(--brand-dark)]">
            <Receipt className="h-4 w-4" /> Total a pagar
          </span>
          <span className="text-base font-black text-[var(--brand)] font-mono">
            {formatBs(totalCalculado)}
          </span>
        </div>
      </div>
    </div>
  );
}