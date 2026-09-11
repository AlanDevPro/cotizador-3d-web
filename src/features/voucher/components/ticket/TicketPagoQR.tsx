import { useState, useCallback } from "react";
import { CheckCircle2, Clock, QrCode, Download, Maximize2, X } from "lucide-react";

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
  const [modalAbierto, setModalAbierto] = useState(false);

  // Función para descargar la imagen directamente
  const handleDescargarQR = useCallback(async () => {
    try {
      const response = await fetch(qrImagenSrc);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "codigo-qr-pago.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el código QR:", error);
    }
  }, [qrImagenSrc]);

  if (!visible) return null;

  return (
    <>
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
            {/* Contenedor interactivo del QR */}
            <div
              onClick={() => setModalAbierto(true)}
              className="group relative cursor-pointer overflow-hidden rounded-lg border border-slate-200 transition-all duration-200 hover:border-slate-300 hover:shadow-md"
            >
              <img
                src={qrImagenSrc}
                alt="Código QR de pago"
                className="h-44 w-44 object-contain transition-transform duration-300 group-hover:scale-105"
              />

              {/* Overlay sutil al pasar el cursor (no interfiere con la lectura normal) */}
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-900 backdrop-blur-sm shadow-sm">
                  <Maximize2 className="h-3.5 w-3.5" />
                  Ampliar QR
                </span>
              </div>
            </div>

            <p className="text-center text-xs text-slate-500">
              Haz clic en el QR para ampliarlo o escanéalo directamente.
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

      {/* Modal de QR Ampliado */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative flex w-full max-w-sm flex-col items-center rounded-2xl bg-white p-6 shadow-2xl">
            {/* Botón Cerrar Modal */}
            <button
              onClick={() => setModalAbierto(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-label="Cerrar vista ampliada"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="mb-4 text-base font-bold text-slate-900">
              Código QR de Pago
            </h3>

            {/* QR Ampliado */}
            <div className="mb-6 rounded-xl border border-slate-100 bg-white p-3 shadow-inner">
              <img
                src={qrImagenSrc}
                alt="Código QR de pago ampliado"
                className="h-64 w-64 object-contain"
              />
            </div>

            {/* Botón de Descarga visible únicamente en el estado ampliado */}
            <button
              onClick={handleDescargarQR}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.98]"
            >
              <Download className="h-4 w-4" />
              Guardar o Descargar QR
            </button>
          </div>
        </div>
      )}
    </>
  );
}