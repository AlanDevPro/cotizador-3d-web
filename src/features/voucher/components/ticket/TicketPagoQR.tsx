// src/features/voucher/components/ticket/TicketPagoQR.tsx

import { CheckCircle2, QrCode } from "lucide-react";

interface TicketPagoQRProps {
  visible: boolean;
  qrImagenSrc: string;
  comprobanteArchivo: File | null;
}

export function TicketPagoQR({ visible, qrImagenSrc, comprobanteArchivo }: TicketPagoQRProps) {
  if (!visible) return null;

  return (
    <div className="border-t border-slate-100 px-6 py-4 text-center bg-slate-50/50">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={qrImagenSrc}
        alt="Código QR para pago del anticipo"
        className="mx-auto h-40 w-40 rounded-lg border border-slate-200 object-contain p-2 bg-white shadow-xs"
      />
      <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center justify-center gap-1.5">
        <QrCode className="h-4 w-4 text-[var(--brand)]" />
        Escanea el QR y paga el anticipo
      </p>

      {comprobanteArchivo && (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-center">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
          <p className="font-bold text-emerald-800">Comprobante recibido</p>
          <p className="mt-0.5 truncate text-emerald-600">{comprobanteArchivo.name}</p>
        </div>
      )}
    </div>
  );
}