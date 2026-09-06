// src/features/voucher/components/ticket/TicketPagoEfectivo.tsx

import { Banknote, MapPin } from "lucide-react";
import { formatBs } from "../../utils/voucherFormatters";

interface TicketPagoEfectivoProps {
  visible: boolean;
  pedidoConfirmadoEfectivo: boolean;
  montoAnticipo: number;
  empresaNombre: string;
  direccionLocal: string;
}

export function TicketPagoEfectivo({
  visible,
  pedidoConfirmadoEfectivo,
  montoAnticipo,
  empresaNombre,
  direccionLocal,
}: TicketPagoEfectivoProps) {
  if (!visible) return null;

  return (
    <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
        <Banknote className="h-4 w-4 text-[var(--brand)]" />
        Pago en efectivo
      </p>
      {!pedidoConfirmadoEfectivo ? (
        <p className="mt-1 text-xs text-slate-600">
          El anticipo de <span className="font-mono font-bold text-[var(--brand)]">{formatBs(montoAnticipo)}</span> se debe abonar directamente en el taller.
        </p>
      ) : (
        <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-bold mb-1">
            <MapPin className="h-4 w-4 text-emerald-600" />
            Paga tu anticipo en esta ubicación
          </div>
          <p className="font-bold text-slate-900">{empresaNombre}</p>
          <p className="mt-0.5 text-slate-700">{direccionLocal}</p>
        </div>
      )}
    </div>
  );
}