// src/features/voucher/utils/calcularTotalesPedido.ts
import { COSTO_ENVIO_DOMICILIO } from "../constants/voucherConstants";
import type { TipoEntrega } from "../types/voucher.types";

export interface TotalesPedido {
  costoEnvio: number;
  totalConEnvio: number;
  montoAnticipo: number;
  montoSaldo: number;
}

export function calcularTotalesPedido(
  totalOrden: number,
  tipoEntrega: TipoEntrega | null,
  porcentajeAnticipo = 0.5
): TotalesPedido {
  const costoEnvio = tipoEntrega === "domicilio" ? COSTO_ENVIO_DOMICILIO : 0;
  const totalConEnvio = totalOrden + costoEnvio;
  const montoAnticipo = totalConEnvio * porcentajeAnticipo;
  const montoSaldo = totalConEnvio - montoAnticipo;
  return { costoEnvio, totalConEnvio, montoAnticipo, montoSaldo };
}