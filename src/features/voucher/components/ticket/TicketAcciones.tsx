import { CheckCircle2, RefreshCw, Upload } from "lucide-react";
import type { MetodoPago } from "../../types/voucher.types";
import type { TipoMontoPago } from "../VoucherSeleccionOpciones";

interface TicketAccionesProps {
  metodoPago: MetodoPago | null;
  /** Monto elegido con QR ("anticipo" o "total"); se reenvía al confirmar el comprobante */
  tipoMontoPago?: TipoMontoPago | null;
  comprobanteArchivo: File | null;
  pedidoConfirmadoEfectivo: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onComprobanteChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    tipoMontoPago: TipoMontoPago | null
  ) => void;
  onSeleccionarComprobante: () => void;
  onConfirmarEfectivo: () => void;
  onCambiarOpciones?: () => void;
}

export function TicketAcciones({
  metodoPago,
  tipoMontoPago = null,
  comprobanteArchivo,
  pedidoConfirmadoEfectivo,
  fileInputRef,
  onComprobanteChange,
  onSeleccionarComprobante,
  onConfirmarEfectivo,
  onCambiarOpciones,
}: TicketAccionesProps) {
  const accionRealizada =
    (metodoPago === "qr" && Boolean(comprobanteArchivo)) ||
    (metodoPago === "efectivo" && pedidoConfirmadoEfectivo);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onComprobanteChange(e, tipoMontoPago)}
      />

      <div className="flex items-center justify-between gap-3 pt-2">
        {!accionRealizada && onCambiarOpciones ? (
          <button
            type="button"
            onClick={onCambiarOpciones}
            className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 active:scale-98"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
            <span>Cambiar opciones</span>
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-3">
          {metodoPago === "qr" && (
            <button
              type="button"
              onClick={onSeleccionarComprobante}
              className="flex h-11 w-52 items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[var(--brand-dark)] active:scale-98"
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
              className="flex h-11 w-52 items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[var(--brand-dark)] active:scale-98"
            >
              <CheckCircle2 className="h-4 w-4" />
              Confirmar pedido
            </button>
          )}
        </div>
      </div>
    </>
  );
}