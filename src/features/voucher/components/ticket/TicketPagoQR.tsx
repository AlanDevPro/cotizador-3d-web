import { CheckCircle2, Clock, QrCode } from "lucide-react";

interface TicketPagoQRProps {
  visible: boolean;
  qrImagenSrc: string;
  comprobanteArchivo: File | null;
  verificado: boolean;
}

export function TicketPagoQR({
  visible,
  qrImagenSrc,
  comprobanteArchivo,
  verificado,
}: TicketPagoQRProps) {
  if (!visible) return null;

  return (
    <div className="border-t border-dashed border-slate-200 px-5 py-4">
      <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
        <QrCode className="h-4 w-4 text-[var(--brand)]" />
        Pago con QR
      </p>

      {verificado ? (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-700">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="text-sm font-semibold">
            Pago ya confirmado con éxito. No necesitas hacer nada más.
          </p>
        </div>
      ) : !comprobanteArchivo ? (
        <div className="flex flex-col items-center gap-2">
          <img
            src={qrImagenSrc}
            alt="Código QR de pago"
            className="h-44 w-44 rounded-lg border border-slate-200"
          />
          <p className="text-center text-xs text-slate-500">
            Escanea el código, realiza el pago y sube tu comprobante.
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-amber-700">
          <Clock className="h-5 w-5 shrink-0 animate-pulse" />
          <p className="text-sm font-semibold">
            Comprobante subido correctamente. Espera mientras verificamos tu pago.
          </p>
        </div>
      )}
    </div>
  );
}