import { useState } from "react";
import { AlertCircle, Banknote, LocateFixed, MapPin, QrCode, Store, Truck } from "lucide-react";
import type { MetodoPago, TipoEntrega } from "../types/voucher.types";
import { COSTO_ENVIO_DOMICILIO } from "../constants/voucherConstants";
import { formatBs } from "../utils/voucherFormatters";

interface VoucherSeleccionOpcionesProps {
  visible: boolean;
  tipoEntrega: TipoEntrega | null;
  metodoPago: MetodoPago | null;
  onSeleccionarEntrega: (t: TipoEntrega) => void;
  onSeleccionarPago: (m: MetodoPago) => void;
  direccionDomicilio: string;
  onGuardarDireccion: (direccion: string) => void;
  ubicacionUrl: string | null;
  obteniendoUbicacion: boolean;
  errorUbicacion: string | null;
  onUsarUbicacionActual: () => void;
}

export function VoucherSeleccionOpciones({
  visible,
  tipoEntrega,
  metodoPago,
  onSeleccionarEntrega,
  onSeleccionarPago,
  direccionDomicilio,
  onGuardarDireccion,
  ubicacionUrl,
  obteniendoUbicacion,
  errorUbicacion,
  onUsarUbicacionActual,
}: VoucherSeleccionOpcionesProps) {
  const [direccionLocal, setDireccionLocal] = useState(direccionDomicilio);

  if (!visible) return null;

  const faltaDireccion = tipoEntrega === "domicilio" && !direccionLocal.trim();
  const faltaUbicacion = tipoEntrega === "domicilio" && !ubicacionUrl;

  return (
    <div className="rounded-xl border border-slate-200 p-5 space-y-5 bg-white shadow-xs">
      {/* Paso 1: Entrega */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <Truck className="h-4 w-4 text-[var(--brand)]" />
          1. Elige el tipo de entrega
        </p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onSeleccionarEntrega("recoger")}
            className={`rounded-xl border p-4 text-left transition flex items-start gap-3 ${
              tipoEntrega === "recoger"
                ? "border-[var(--brand)] bg-[var(--brand-light)] ring-1 ring-[var(--brand)]"
                : "border-slate-200 hover:border-[var(--brand)]/40 hover:bg-slate-50"
            }`}
          >
            <Store className={`h-5 w-5 mt-0.5 ${tipoEntrega === "recoger" ? "text-[var(--brand)]" : "text-slate-400"}`} />
            <div>
              <p className="text-sm font-bold text-slate-900">Recoger en el local</p>
              <p className="mt-0.5 text-xs text-slate-500">Sin costo adicional</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onSeleccionarEntrega("domicilio")}
            className={`rounded-xl border p-4 text-left transition flex items-start gap-3 ${
              tipoEntrega === "domicilio"
                ? "border-[var(--brand)] bg-[var(--brand-light)] ring-1 ring-[var(--brand)]"
                : "border-slate-200 hover:border-[var(--brand)]/40 hover:bg-slate-50"
            }`}
          >
            <Truck className={`h-5 w-5 mt-0.5 ${tipoEntrega === "domicilio" ? "text-[var(--brand)]" : "text-slate-400"}`} />
            <div>
              <p className="text-sm font-bold text-slate-900">Envío a domicilio</p>
              <p className="mt-0.5 text-xs text-slate-500">+ {formatBs(COSTO_ENVIO_DOMICILIO)} al pedido</p>
            </div>
          </button>
        </div>

        {/* Campos de dirección — solo si eligió domicilio */}
        {tipoEntrega === "domicilio" && (
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-600" />
                Escribe tu dirección
              </label>
              <textarea
                value={direccionLocal}
                onChange={(e) => {
                  const val = e.target.value;
                  setDireccionLocal(val);
                  onGuardarDireccion(val.trim());
                }}
                onBlur={() => {
                  if (direccionLocal.trim()) {
                    onGuardarDireccion(direccionLocal.trim());
                  }
                }}
                rows={2}
                placeholder="Ej: Av. Siempre Viva #123, entre calles..., zona..., referencia..."
                className={`mt-1.5 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 ${
                  faltaDireccion
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:border-[var(--brand)] focus:ring-[var(--brand)]"
                }`}
              />

              {/* Advertencia si no escribió dirección */}
              {faltaDireccion && (
                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  Debes ingresar tu dirección escrita para continuar con el pedido.
                </p>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={onUsarUbicacionActual}
                disabled={obteniendoUbicacion}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-[var(--brand)] transition hover:bg-[var(--brand-light)] disabled:opacity-60"
              >
                <LocateFixed className={`h-4 w-4 ${obteniendoUbicacion ? "animate-pulse" : ""}`} />
                {obteniendoUbicacion ? "Obteniendo tu ubicación..." : "Registrar ubicación actual"}
              </button>

              {/* Advertencia si falta la ubicación GPS en tiempo real */}
              {faltaUbicacion && !errorUbicacion && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  Debes registrar tu ubicación en tiempo real para continuar con el pedido.
                </p>
              )}

              {errorUbicacion && (
                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errorUbicacion}
                </p>
              )}

              {ubicacionUrl && !errorUbicacion && (
                <a
                  href={ubicacionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 block text-xs font-medium text-emerald-600 hover:underline"
                >
                  ✓ Ubicación registrada — ver en Google Maps
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-100" />

      {/* Paso 2: Pago */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <Banknote className="h-4 w-4 text-[var(--brand)]" />
          2. Elige el método de pago
        </p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onSeleccionarPago("efectivo")}
            className={`rounded-xl border p-4 text-left transition flex items-start gap-3 ${
              metodoPago === "efectivo"
                ? "border-[var(--brand)] bg-[var(--brand-light)] ring-1 ring-[var(--brand)]"
                : "border-slate-200 hover:border-[var(--brand)]/40 hover:bg-slate-50"
            }`}
          >
            <Banknote className={`h-5 w-5 mt-0.5 ${metodoPago === "efectivo" ? "text-[var(--brand)]" : "text-slate-400"}`} />
            <div>
              <p className="text-sm font-bold text-slate-900">Efectivo</p>
              <p className="mt-0.5 text-xs text-slate-500">Pago del anticipo en el local</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onSeleccionarPago("qr")}
            className={`rounded-xl border p-4 text-left transition flex items-start gap-3 ${
              metodoPago === "qr"
                ? "border-[var(--brand)] bg-[var(--brand-light)] ring-1 ring-[var(--brand)]"
                : "border-slate-200 hover:border-[var(--brand)]/40 hover:bg-slate-50"
            }`}
          >
            <QrCode className={`h-5 w-5 mt-0.5 ${metodoPago === "qr" ? "text-[var(--brand)]" : "text-slate-400"}`} />
            <div>
              <p className="text-sm font-bold text-slate-900">QR</p>
              <p className="mt-0.5 text-xs text-slate-500">Transferencia bancaria inmediata</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}