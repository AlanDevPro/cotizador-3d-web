// src/features/voucher/components/ticket/TicketClienteEntrega.tsx

import { Phone, Store, Truck, User } from "lucide-react";
import type { TipoEntrega } from "../../types/voucher.types";

interface TicketClienteEntregaProps {
  nombreCliente: string;
  clienteDocumento?: string;
  clienteTelefono?: string;
  tipoEntrega: TipoEntrega | null;
}

export function TicketClienteEntrega({
  nombreCliente,
  clienteDocumento,
  clienteTelefono,
  tipoEntrega,
}: TicketClienteEntregaProps) {
  return (
    <div className="border-b-2 border-dashed border-slate-300 px-6 py-3 space-y-1.5 text-xs">
      <p className="flex items-center gap-1.5 font-bold text-slate-900">
        <User className="h-3.5 w-3.5 text-[var(--brand)]" />
        {nombreCliente}
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500">
        {clienteDocumento && <span>NIT/CI: <span className="font-medium text-slate-700">{clienteDocumento}</span></span>}
        {clienteTelefono && (
          <span className="flex items-center gap-1">
            <Phone className="h-3 w-3" /> {clienteTelefono}
          </span>
        )}
      </div>
      <p className="flex items-center gap-1.5 text-slate-500">
        {tipoEntrega === "recoger" ? <Store className="h-3.5 w-3.5" /> : <Truck className="h-3.5 w-3.5" />}
        Entrega: <span className="font-medium text-slate-700">
          {tipoEntrega === "recoger" ? "Recoger en el taller" : "Envío a domicilio"}
        </span>
      </p>
    </div>
  );
}