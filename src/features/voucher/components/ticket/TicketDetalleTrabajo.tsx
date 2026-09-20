import { Banknote, FileText, Hash, Package, Receipt, Box, Palette, Wrench } from "lucide-react";
import type { FilaVoucher } from "../../types/voucher.types";
import { formatBs, formatCantidadUnidad } from "../../utils/voucherFormatters";
import { EncabezadoTabla } from "../shared/EncabezadoTabla";

interface TicketDetalleTrabajoProps {
  filas: FilaVoucher[];
}

export function TicketDetalleTrabajo({ filas }: TicketDetalleTrabajoProps) {
  return (
    <div className="relative border-b-2 border-dashed border-slate-300 px-6 py-3">
      <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-slate-50" />
      <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-slate-50" />

      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-900">
        <FileText className="h-3.5 w-3.5 text-[var(--brand)]" />
        Detalle de Impresión
      </p>

      <table className="w-full text-left text-xs">
        <thead>
          <tr className="text-[10px] uppercase tracking-wider text-slate-400">
            <th className="pb-1.5 font-semibold">
              <EncabezadoTabla icon={Hash} label="Cant." />
            </th>
            <th className="pb-1.5 font-semibold">
              <EncabezadoTabla icon={Package} label="Descripción" />
            </th>
            <th className="pb-1.5 text-right font-semibold">
              <EncabezadoTabla icon={Banknote} label="Unit." align="right" />
            </th>
            <th className="pb-1.5 text-right font-semibold">
              <EncabezadoTabla icon={Receipt} label="Total" align="right" />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {filas.map((fila, idx) => {
            const materialTexto = fila.material || "Sin material";
            const colorTexto = fila.color || "Sin color";

            return (
              <tr key={idx} className="align-top">
                <td className="py-2 pr-1 font-mono text-slate-500">{fila.cantidad}x</td>
                <td className="py-2 pr-2">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    {/* Nombre de la pieza */}
                    <span className="font-semibold text-slate-900">
                      {fila.descripcion}
                    </span>

                    {/* Material */}
                    <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                      <Box className="h-3 w-3 text-amber-600" />
                      {materialTexto}
                    </span>

                    {/* Color y su viñeta Hexadecimal */}
                    <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                      <Palette className="h-3 w-3 text-[var(--brand)]" />
                      {colorTexto}
                      {fila.colorHex && (
                        <span className="inline-flex items-center gap-1 font-mono text-[9px] text-slate-400">
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full border border-slate-300 shadow-xs"
                            style={{ backgroundColor: fila.colorHex }}
                            title={fila.colorHex}
                          />
                        </span>
                      )}
                    </span>

                    {/* 🔩 Accesorios aplicados a esta pieza, con cantidad y unidad de medida */}
                    {fila.accesorios?.map((acc) => (
                      <span
                        key={acc.id}
                        className="inline-flex items-center gap-1 rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-medium text-sky-700"
                        title={acc.descripcion ?? undefined}
                      >
                        <Wrench className="h-3 w-3 text-sky-600" />
                        {formatCantidadUnidad(acc.cantidad, acc.unidadMedida)} {acc.nombre}
                        <span className="font-mono text-[9px] text-sky-500">
                          ({formatBs(acc.costoTotal)})
                        </span>
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-2 text-right font-mono text-slate-600">
                  {formatBs(fila.precioUnitario)}
                </td>
                <td className="py-2 text-right font-mono font-bold text-slate-900">
                  {formatBs(fila.total)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}