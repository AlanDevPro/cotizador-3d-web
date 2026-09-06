// src/features/voucher/components/ticket/TicketTotalesAnticipo.tsx

import { Receipt, Scale, Truck } from "lucide-react";
import { formatBs } from "../../utils/voucherFormatters";

interface TicketTotalesAnticipoProps {
  subtotalOrden: number;
  montoImpuestoOrden: number;
  costoEnvio: number;
  totalConEnvio: number;
  montoAnticipo: number;
  montoSaldo: number;
}

export function TicketTotalesAnticipo({
  subtotalOrden,
  montoImpuestoOrden,
  costoEnvio,
  totalConEnvio,
  montoAnticipo,
  montoSaldo,
}: TicketTotalesAnticipoProps) {
  return (
    <div className="px-6 py-3 space-y-1.5 text-xs">
      <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-slate-600">
        <span className="flex items-center gap-1.5"><Scale className="h-3.5 w-3.5 text-slate-400" /> Subtotal</span>
        <span className="font-mono font-medium text-slate-900">{formatBs(subtotalOrden)}</span>
      </div>
      {montoImpuestoOrden > 0 && (
        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-slate-600">
          <span>Impuestos / IVA</span>
          <span className="font-mono font-medium text-slate-900">{formatBs(montoImpuestoOrden)}</span>
        </div>
      )}
      {costoEnvio > 0 && (
        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-slate-600">
          <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-slate-400" /> Envío a domicilio</span>
          <span className="font-mono font-medium text-slate-900">{formatBs(costoEnvio)}</span>
        </div>
      )}

      <div className="flex items-center justify-between rounded-lg border border-[var(--brand)]/30 bg-[var(--brand-light)] px-3 py-2.5 font-bold text-slate-900">
        <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[var(--brand-dark)]">
          <Receipt className="h-4 w-4" /> Total orden
        </span>
        <span className="font-mono text-base font-black text-[var(--brand)]">{formatBs(totalConEnvio)}</span>
      </div>

      <div className="mt-2 rounded-lg bg-[var(--dark-bg)] px-3 py-2.5 text-white">
        <div className="flex justify-between font-bold">
          <span>Anticipo requerido (50%)</span>
          <span className="font-mono">{formatBs(montoAnticipo)}</span>
        </div>
        <div className="mt-1 flex justify-between text-slate-300">
          <span>Saldo pendiente a la entrega</span>
          <span className="font-mono font-medium">{formatBs(montoSaldo)}</span>
        </div>
      </div>
    </div>
  );
}