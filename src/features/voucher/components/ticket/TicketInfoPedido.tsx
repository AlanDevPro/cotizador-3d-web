// src/features/voucher/components/ticket/TicketInfoPedido.tsx

import { Calendar, Hash, UserCog } from "lucide-react";
import { formatFechaHora } from "../../utils/voucherFormatters";

interface TicketInfoPedidoProps {
  codigoPedido: string;
  fechaEmision: Date;
  atendidoPor?: string;
}

export function TicketInfoPedido({ codigoPedido, fechaEmision, atendidoPor }: TicketInfoPedidoProps) {
  return (
    <div className="relative border-b-2 border-dashed border-slate-300 px-6 py-3">
      <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-slate-50" />
      <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-slate-50" />
      <div className="flex flex-wrap items-center justify-between gap-y-1 text-xs text-slate-600">
        <span className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
          <Hash className="h-3.5 w-3.5 text-slate-400" />
          {codigoPedido}
        </span>
        <span className="flex items-center gap-1.5 font-mono">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          {formatFechaHora(fechaEmision)}
        </span>
      </div>
      {atendidoPor && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
          <UserCog className="h-3.5 w-3.5 text-slate-400" />
          Atendido por: <span className="font-semibold text-slate-700">{atendidoPor}</span>
        </p>
      )}
    </div>
  );
}