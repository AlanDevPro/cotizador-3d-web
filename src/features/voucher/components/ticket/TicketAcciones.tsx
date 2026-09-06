// src/features/voucher/components/ticket/TicketAcciones.tsx

import { CheckCircle2, RefreshCw, Upload } from "lucide-react";
import type { MetodoPago } from "../../types/voucher.types";

interface TicketAccionesProps {
  metodoPago: MetodoPago | null;
  comprobanteArchivo: File | null;
  pedidoConfirmadoEfectivo: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onComprobanteChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSeleccionarComprobante: () => void;
  onConfirmarEfectivo: () => void;
}

export function TicketAcciones({
  metodoPago,
  comprobanteArchivo,
  pedidoConfirmadoEfectivo,
  fileInputRef,
  onComprobanteChange,
  onSeleccionarComprobante,
  onConfirmarEfectivo,
}: TicketAccionesProps) {
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={onComprobanteChange}
      />

      <div className="flex justify-end gap-3 pt-2">
        {metodoPago === "qr" && (
          <button
            type="button"
            onClick={onSeleccionarComprobante}
            className="flex h-11 w-52 items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[var(--brand-dark)]"
          >
            {comprobanteArchivo ? (
              <>
                <RefreshCw className="h-4 w-4" />
                Reemplazar
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Subir comprobante
              </>
            )}
          </button>
        )}

        {metodoPago === "efectivo" && !pedidoConfirmadoEfectivo && (
          <button
            type="button"
            onClick={onConfirmarEfectivo}
            className="flex h-11 w-52 items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[var(--brand-dark)]"
          >
            <CheckCircle2 className="h-4 w-4" />
            Confirmar pedido
          </button>
        )}
      </div>
    </>
  );
}