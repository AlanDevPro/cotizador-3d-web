import { Banknote, CheckCircle2, Clock, MapPin } from "lucide-react";

interface TicketPagoEfectivoProps {
  visible: boolean;
  pedidoConfirmadoEfectivo: boolean;
  verificado: boolean;
  montoAnticipo: number;
  empresaNombre: string;
  direccionLocal: string;
}

export function TicketPagoEfectivo({
  visible,
  pedidoConfirmadoEfectivo,
  verificado,
  montoAnticipo,
  empresaNombre,
  direccionLocal,
}: TicketPagoEfectivoProps) {
  if (!visible) return null;

  return (
    <div className="border-t border-dashed border-slate-200 px-5 py-4">
      <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
        <Banknote className="h-4 w-4 text-[var(--brand)]" />
        Pago en efectivo
      </p>

      {verificado ? (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-700">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="text-sm font-semibold">
            Pago ya confirmado con éxito. No necesitas hacer nada más.
          </p>
        </div>
      ) : !pedidoConfirmadoEfectivo ? (
        <p className="text-xs text-slate-500">
          Confirma tu pedido y acércate a <strong>{empresaNombre}</strong> para pagar el
          anticipo de {montoAnticipo.toFixed(2)} Bs en efectivo.
        </p>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-amber-700">
            <Clock className="h-5 w-5 shrink-0 animate-pulse" />
            <p className="text-sm font-semibold">
              Pedido confirmado. Aún no verificamos tu pago; acércate al local a cancelar
              el anticipo.
            </p>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            {direccionLocal}
          </p>
        </div>
      )}
    </div>
  );
}