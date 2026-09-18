import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  LocateFixed,
  MapPin,
  Store,
  Truck,
  Wallet,
  Banknote,
  QrCode,
  Percent,
  BadgeCheck,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import type { MetodoPago, TipoEntrega } from "../types/voucher.types";
import { COSTO_ENVIO_DOMICILIO } from "../constants/voucherConstants";
import { formatBs } from "../utils/voucherFormatters";

export type TipoMontoPago = "anticipo" | "total";

interface VoucherSeleccionOpcionesProps {
  visible: boolean;
  tipoEntrega: TipoEntrega | null;
  metodoPago: MetodoPago | null;
  tipoMontoPago?: TipoMontoPago | null;
  onSeleccionarEntrega: (t: TipoEntrega) => void;
  onSeleccionarPago: (m: MetodoPago) => void;
  onSeleccionarTipoMontoPago?: (monto: TipoMontoPago) => void;
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
  tipoMontoPago = null,
  onSeleccionarEntrega,
  onSeleccionarPago,
  onSeleccionarTipoMontoPago,
  direccionDomicilio,
  onGuardarDireccion,
  ubicacionUrl,
  obteniendoUbicacion,
  errorUbicacion,
  onUsarUbicacionActual,
}: VoucherSeleccionOpcionesProps) {
  const [direccionLocal, setDireccionLocal] = useState(direccionDomicilio);
  const [prevDireccion, setPrevDireccion] = useState(direccionDomicilio);

  // Sincronización profesional durante el renderizado (sin useEffect ni renders en cascada)
  if (prevDireccion !== direccionDomicilio) {
    setPrevDireccion(direccionDomicilio);
    setDireccionLocal(direccionDomicilio);
  }

  if (!visible) return null;

  const faltaDireccion = tipoEntrega === "domicilio" && !direccionLocal.trim();
  const faltaUbicacion = tipoEntrega === "domicilio" && !ubicacionUrl;
  const faltaMontoQr = metodoPago === "qr" && !tipoMontoPago;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 space-y-6 shadow-xs font-sans">
      {/* Paso 1: Tipo de Entrega */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-900">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--brand-light)] text-[var(--brand)] shrink-0">
            <Truck className="h-4 w-4" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-800">
            1. Modalidad de entrega
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Opción Retiro en Tienda */}
          <button
            type="button"
            onClick={() => onSeleccionarEntrega("recoger")}
            className={`group relative rounded-xl border p-4 text-left transition-all duration-200 flex items-center gap-3.5 ${
              tipoEntrega === "recoger"
                ? "border-[var(--brand)] bg-[var(--brand-light)]/40 ring-2 ring-[var(--brand)] shadow-xs"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                tipoEntrega === "recoger"
                  ? "bg-[var(--brand)] text-white"
                  : "bg-slate-100 text-slate-500 group-hover:bg-slate-200/70"
              }`}
            >
              <Store className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <p className="text-sm font-bold text-slate-900 leading-tight">
                  Retiro en Sucursal
                </p>
                {tipoEntrega === "recoger" && (
                  <CheckCircle2 className="h-4 w-4 text-[var(--brand)] shrink-0" />
                )}
              </div>
              <p className="mt-0.5 text-xs font-medium text-emerald-600">
                Sin costo de envío
              </p>
            </div>
          </button>

          {/* Opción Envío a Domicilio */}
          <button
            type="button"
            onClick={() => onSeleccionarEntrega("domicilio")}
            className={`group relative rounded-xl border p-4 text-left transition-all duration-200 flex items-center gap-3.5 ${
              tipoEntrega === "domicilio"
                ? "border-[var(--brand)] bg-[var(--brand-light)]/40 ring-2 ring-[var(--brand)] shadow-xs"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                tipoEntrega === "domicilio"
                  ? "bg-[var(--brand)] text-white"
                  : "bg-slate-100 text-slate-500 group-hover:bg-slate-200/70"
              }`}
            >
              <Truck className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <p className="text-sm font-bold text-slate-900 leading-tight">
                  Envío a Domicilio
                </p>
                {tipoEntrega === "domicilio" && (
                  <CheckCircle2 className="h-4 w-4 text-[var(--brand)] shrink-0" />
                )}
              </div>
              <p className="mt-0.5 text-xs font-medium text-slate-500">
                + {formatBs(COSTO_ENVIO_DOMICILIO)} por recargo
              </p>
            </div>
          </button>
        </div>

        {/* Formulario Dirección/GPS */}
        {tipoEntrega === "domicilio" && (
          <div className="mt-4 rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-500" />
                Dirección exacta de entrega
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
                placeholder="Ej: Av. Las Américas #456, entre C. Bolívar y C. Sucre, portón negro."
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 bg-white placeholder:text-slate-400 transition focus:outline-none focus:ring-2 ${
                  faltaDireccion
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 focus:border-[var(--brand)] focus:ring-[var(--brand)]/20"
                }`}
              />

              {faltaDireccion && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  Ingresa tu dirección detallada para realizar la entrega.
                </p>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={onUsarUbicacionActual}
                disabled={obteniendoUbicacion}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-[var(--brand)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--brand)] transition hover:bg-[var(--brand-light)]/50 active:scale-[0.99] disabled:opacity-60"
              >
                <LocateFixed
                  className={`h-4 w-4 ${obteniendoUbicacion ? "animate-pulse" : ""}`}
                />
                {obteniendoUbicacion
                  ? "Obteniendo coordenadas GPS..."
                  : "Compartir ubicación GPS en tiempo real"}
              </button>

              {faltaUbicacion && !errorUbicacion && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  Se requiere tu punto GPS para la ruta de reparto.
                </p>
              )}

              {errorUbicacion && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errorUbicacion}
                </p>
              )}

              {ubicacionUrl && !errorUbicacion && (
                <a
                  href={ubicacionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  Ubicación GPS fijada correctamente
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-100" />

      {/* Paso 2: Método de Pago */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-900">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--brand-light)] text-[var(--brand)] shrink-0">
            <Wallet className="h-4 w-4" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-800">
            2. Método de abono
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Opción Efectivo */}
          <button
            type="button"
            onClick={() => onSeleccionarPago("efectivo")}
            className={`group relative rounded-xl border p-4 text-left transition-all duration-200 flex items-start gap-3.5 ${
              metodoPago === "efectivo"
                ? "border-[var(--brand)] bg-[var(--brand-light)]/40 ring-2 ring-[var(--brand)] shadow-xs"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                metodoPago === "efectivo"
                  ? "bg-[var(--brand)] text-white"
                  : "bg-amber-50 text-amber-600 group-hover:bg-amber-100/70"
              }`}
            >
              <Banknote className="h-5 w-5" />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between gap-1.5">
                <p className="text-sm font-bold text-slate-900 leading-tight">
                  Pago en Efectivo
                </p>
                <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200/60 shrink-0">
                  Anticipo 50%
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                Abona un <strong className="text-slate-700 font-semibold">50% inicial en tienda</strong> para iniciar producción. El saldo restante se liquida al entregar.
              </p>
            </div>
          </button>

          {/* Opción QR */}
          <button
            type="button"
            onClick={() => onSeleccionarPago("qr")}
            className={`group relative rounded-xl border p-4 text-left transition-all duration-200 flex items-start gap-3.5 ${
              metodoPago === "qr"
                ? "border-[var(--brand)] bg-[var(--brand-light)]/40 ring-2 ring-[var(--brand)] shadow-xs"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                metodoPago === "qr"
                  ? "bg-[var(--brand)] text-white"
                  : "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100/70"
              }`}
            >
              <QrCode className="h-5 w-5" />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between gap-1.5">
                <p className="text-sm font-bold text-slate-900 leading-tight">
                  Transferencia QR
                </p>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60 shrink-0">
                  50% o 100%
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                Confirmación inmediata. Elige saldar únicamente la <strong className="text-slate-700 font-semibold">reserva del 50%</strong> o la <strong className="text-slate-700 font-semibold">totalidad del pedido</strong>.
              </p>
            </div>
          </button>
        </div>

        {/* Sub-opciones de Monto QR */}
        {metodoPago === "qr" && (
          <div className="mt-4 rounded-xl border border-[var(--brand)]/30 bg-slate-50/90 p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <QrCode className="h-4 w-4 text-[var(--brand)]" />
                Selecciona el monto a transferir mediante QR:
              </p>
              {faltaMontoQr && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 animate-pulse">
                  <Sparkles className="h-3 w-3" /> Requerido
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {/* Opción 50% */}
              <button
                type="button"
                onClick={() => onSeleccionarTipoMontoPago?.("anticipo")}
                className={`group rounded-lg border p-3 text-left transition-all flex items-start gap-3 ${
                  tipoMontoPago === "anticipo"
                    ? "border-[var(--brand)] bg-white ring-2 ring-[var(--brand)]/30 shadow-xs"
                    : "border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300"
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors ${
                    tipoMontoPago === "anticipo"
                      ? "bg-[var(--brand-light)] text-[var(--brand)] font-bold"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Percent className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900">
                      Anticipo del 50%
                    </p>
                    {tipoMontoPago === "anticipo" && (
                      <CheckCircle2 className="h-4 w-4 text-[var(--brand)] shrink-0" />
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
                    Pagas el 50% ahora para iniciar tu pedido y la otra mitad al recibirlo.
                  </p>
                </div>
              </button>

              {/* Opción 100% */}
              <button
                type="button"
                onClick={() => onSeleccionarTipoMontoPago?.("total")}
                className={`group rounded-lg border p-3 text-left transition-all flex items-start gap-3 ${
                  tipoMontoPago === "total"
                    ? "border-[var(--brand)] bg-white ring-2 ring-[var(--brand)]/30 shadow-xs"
                    : "border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300"
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors ${
                    tipoMontoPago === "total"
                      ? "bg-[var(--brand-light)] text-[var(--brand)] font-bold"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <BadgeCheck className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900">
                      Pago Completo (100%)
                    </p>
                    {tipoMontoPago === "total" && (
                      <CheckCircle2 className="h-4 w-4 text-[var(--brand)] shrink-0" />
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
                    Liquida la totalidad de la orden. Sin cobros pendientes al entregar.
                  </p>
                </div>
              </button>
            </div>

            {faltaMontoQr && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 rounded-lg p-2 border border-amber-200/60">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                Selecciona una de las dos opciones para generar tu código QR y ver tu ticket.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}