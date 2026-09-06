// src/features/voucher/components/VoucherSeleccionOpciones.tsx

import { Banknote, QrCode, Store, Truck } from "lucide-react";
import type { MetodoPago, TipoEntrega } from "../types/voucher.types";
import { COSTO_ENVIO_DOMICILIO } from "../constants/voucherConstants";
import { formatBs } from "../utils/voucherFormatters";

interface VoucherSeleccionOpcionesProps {
  visible: boolean;
  tipoEntrega: TipoEntrega | null;
  metodoPago: MetodoPago | null;
  onSeleccionarEntrega: (t: TipoEntrega) => void;
  onSeleccionarPago: (m: MetodoPago) => void;
}

export function VoucherSeleccionOpciones({
  visible,
  tipoEntrega,
  metodoPago,
  onSeleccionarEntrega,
  onSeleccionarPago,
}: VoucherSeleccionOpcionesProps) {
  if (!visible) return null;

  return (
    <div className="rounded-xl border border-slate-200 p-5 space-y-5 bg-white">
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