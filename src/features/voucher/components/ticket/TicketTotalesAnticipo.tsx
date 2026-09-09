// src/features/voucher/components/ticket/TicketTotalesAnticipo.tsx

import { Receipt, Truck, Paintbrush, Layers } from "lucide-react";
import { formatBs } from "../../utils/voucherFormatters";

interface TicketTotalesAnticipoProps {
  metodoEnvio?: string | null;
  costoEnvio?: number | string;
  costoDiseno?: number | string;
  subtotalOrden: number | string; // Suma base de piezas
  montoAnticipo?: number | string;
  porcentajeAnticipo?: number | string;
  montoSaldo?: number | string;
}

export function TicketTotalesAnticipo({
  metodoEnvio,
  costoEnvio = 0,
  costoDiseno = 0,
  subtotalOrden,
  montoAnticipo,
  porcentajeAnticipo = 50,
  montoSaldo,
}: TicketTotalesAnticipoProps) {
  // 1. Sanitización de valores numéricos
  const numPiezas = Number(subtotalOrden) || 0;
  const numEnvio = Number(costoEnvio) || 0;
  const numDiseno = Number(costoDiseno) || 0;
  const numPorcentaje = Number(porcentajeAnticipo) || 50;

  // 2. Cálculo Consolidado
  const totalCalculado = numPiezas + numEnvio + numDiseno;

  // 3. Cálculo dinámico y preciso del Anticipo y Saldo si no vienen recalculados
  const numAnticipo =
    montoAnticipo !== undefined && montoAnticipo !== null
      ? Number(montoAnticipo)
      : (totalCalculado * numPorcentaje) / 100;

  const numSaldo =
    montoSaldo !== undefined && montoSaldo !== null
      ? Number(montoSaldo)
      : totalCalculado - numAnticipo;

  // 4. Banderas condicionales
  const tieneEnvio = numEnvio > 0 || Boolean(metodoEnvio);
  const tieneDiseno = numDiseno > 0;

  return (
    <div className="px-6 py-3 space-y-1.5 text-xs">
      {/* Detalle de Productos / Piezas base */}
      <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-slate-600">
        <span className="flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-slate-400" />
          <span>Trabajo / Piezas</span>
        </span>
        <span className="font-mono font-medium text-slate-900">
          {formatBs(numPiezas)}
        </span>
      </div>

      {/* Servicio de Diseño */}
      {tieneDiseno && (
        <div className="flex items-center justify-between rounded-lg bg-amber-50/60 border border-amber-200/50 px-3 py-2 text-amber-900">
          <span className="flex items-center gap-1.5 font-medium">
            <Paintbrush className="h-3.5 w-3.5 text-amber-600" />
            <span>Servicio de Diseño</span>
          </span>
          <span className="font-mono font-semibold text-amber-950">
            {formatBs(numDiseno)}
          </span>
        </div>
      )}

      {/* Costo de Envío */}
      {tieneEnvio && (
        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-slate-600">
          <span className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-slate-400" />
            <span>
              Envío{metodoEnvio ? ` (${metodoEnvio})` : " a domicilio"}
            </span>
          </span>
          <span className="font-mono font-medium text-slate-900">
            {formatBs(numEnvio)}
          </span>
        </div>
      )}

      {/* Total Final de la Orden */}
      <div className="flex items-center justify-between rounded-lg border border-[var(--brand)]/30 bg-[var(--brand-light)] px-3 py-2.5 font-bold text-slate-900 mt-2">
        <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[var(--brand-dark)]">
          <Receipt className="h-4 w-4" /> Total a pagar
        </span>
        <span className="font-mono text-base font-black text-[var(--brand)]">
          {formatBs(totalCalculado)}
        </span>
      </div>

      {/* Desglose de Pago (Anticipo y Saldo) */}
      <div className="mt-2 rounded-lg bg-[var(--dark-bg)] px-3 py-2.5 text-white shadow-sm">
        <div className="flex justify-between font-bold">
          <span>Anticipo requerido ({numPorcentaje}%)</span>
          <span className="font-mono">{formatBs(numAnticipo)}</span>
        </div>
        <div className="mt-1 flex justify-between text-slate-300">
          <span>Saldo pendiente a la entrega</span>
          <span className="font-mono font-medium">{formatBs(numSaldo)}</span>
        </div>
      </div>
    </div>
  );
}