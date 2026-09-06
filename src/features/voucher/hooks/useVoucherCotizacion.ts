"use client";

import { useMemo } from "react";
import type {
  CotizacionPublica,
  FilaVoucher,
  PiezaDetalle,
  TabId,
  TipoEntrega,
} from "../types/voucher.types";
import {
  COSTO_ENVIO_DOMICILIO,
  DEFAULT_GARANTIA_DIAS,
  DEFAULT_UBICACION,
} from "../constants/voucherConstants";
import { detalleTecnicoPieza } from "../utils/voucherFormatters";

interface UseVoucherCotizacionParams {
  cotizacion: CotizacionPublica;
  tabActivo: TabId;
  tipoEntrega: TipoEntrega | null;
  numeroPedido?: string;
  clienteNombre?: string;
  ubicacionLocal?: string;
  qrPagoUri?: string;
  fechaEmision: Date;
}

function construirFila(
  p: PiezaDetalle,
  voucherData?: CotizacionPublica["voucher_data"]
): FilaVoucher {
  const material = p.filamento?.material ?? voucherData?.documentTitle ?? "PLA";
  const color = p.filamento?.color ?? "A definir";
  const colorHex = p.filamento?.color_hex ?? null;
  const materialColor = [material, color].filter(Boolean).join(" ");

  return {
    pieza: p,
    descripcion: p.nombre_pieza,
    cantidad: p.cantidad,
    precioUnitario: p.cantidad > 0 ? p.precio_total_pieza / p.cantidad : p.precio_total_pieza,
    total: p.precio_total_pieza,
    material,
    color,
    colorHex,
    materialColor,
    detalleTecnico: detalleTecnicoPieza(p),
  };
}

export function useVoucherCotizacion({
  cotizacion,
  tabActivo,
  tipoEntrega,
  numeroPedido,
  clienteNombre,
  ubicacionLocal,
  qrPagoUri,
  fechaEmision,
}: UseVoucherCotizacionParams) {
  const empresa = cotizacion.empresa;
  const empresaNombre = empresa?.nombre ?? "Taller de Impresión 3D";
  const voucherData = cotizacion.voucher_data;

  const tabs = useMemo(
    () => [
      {
        id: "general" as TabId,
        label: `General (${cotizacion.piezas.length} ${
          cotizacion.piezas.length === 1 ? "pieza" : "piezas"
        })`,
      },
      ...cotizacion.piezas.map((p) => ({ id: p.id, label: p.nombre_pieza })),
    ],
    [cotizacion.piezas]
  );

  const pieza = cotizacion.piezas.find((p) => p.id === tabActivo);
  const esGeneral = tabActivo === "general" || !pieza;

  const precioMostrado = esGeneral ? cotizacion.precio_final : pieza!.precio_total_pieza;

  const piezasVista = esGeneral ? cotizacion.piezas : [pieza!];
  const filasVista = useMemo(
    () => piezasVista.map((p) => construirFila(p, voucherData)),
    [piezasVista, voucherData]
  );

  const subtotalVista = filasVista.reduce((acc, f) => acc + f.total, 0);
  const montoImpuestoVista = esGeneral ? cotizacion.monto_impuesto || 0 : 0;
  const totalVista = subtotalVista + montoImpuestoVista;

  const filasComprobante = useMemo(
    () => cotizacion.piezas.map((p) => construirFila(p, voucherData)),
    [cotizacion.piezas, voucherData]
  );

  const subtotalOrden = filasComprobante.reduce((acc, f) => acc + f.total, 0);
  const montoImpuestoOrden = cotizacion.monto_impuesto || 0;
  const totalOrden = subtotalOrden + montoImpuestoOrden;

  const costoEnvio = tipoEntrega === "domicilio" ? COSTO_ENVIO_DOMICILIO : 0;
  const totalConEnvio = totalOrden + costoEnvio;
  const montoAnticipo = totalConEnvio * 0.5;
  const montoSaldo = totalConEnvio - montoAnticipo;

  const politicas = voucherData?.policies?.length
    ? voucherData.policies
    : empresa?.garantia
    ? [{ label: "Garantía", text: empresa.garantia }]
    : [];

  const garantiaDias = voucherData?.garantiaDias ?? DEFAULT_GARANTIA_DIAS;

  const materialNombre = cotizacion.piezas[0]?.filamento?.material || "PLA - Genérico";
  const colorNombre = cotizacion.piezas[0]?.filamento?.color || "A definir / Según catálogo";
  const imagenProducto = voucherData?.productImageUri;

  const codigoPedido =
    numeroPedido ||
    `ORD-${fechaEmision.getFullYear()}-${cotizacion.id?.slice(0, 4)?.toUpperCase() ?? "0000"}`;
  const nombreClienteMostrado = clienteNombre?.trim() || "Cliente";
  const direccionLocal = ubicacionLocal?.trim() || DEFAULT_UBICACION;

  const notasLegales = voucherData?.notasLegales?.length
    ? voucherData.notasLegales
    : [
        "Este documento es un comprobante de pedido y no reemplaza a la factura fiscal.",
        `Garantía válida por ${garantiaDias} días tras la recepción del trabajo.`,
      ];

  const qrImagenSrc =
    qrPagoUri ||
    `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
      `Anticipo pedido ${codigoPedido} - ${empresaNombre} - Monto: ${montoAnticipo.toFixed(2)} Bs`
    )}`;

  return {
    empresa,
    empresaNombre,
    voucherData,
    tabs,
    pieza,
    esGeneral,
    precioMostrado,
    filasVista,
    subtotalVista,
    montoImpuestoVista,
    totalVista,
    filasComprobante,
    subtotalOrden,
    montoImpuestoOrden,
    costoEnvio,
    totalConEnvio,
    montoAnticipo,
    montoSaldo,
    politicas,
    garantiaDias,
    materialNombre,
    colorNombre,
    imagenProducto,
    codigoPedido,
    nombreClienteMostrado,
    direccionLocal,
    notasLegales,
    qrImagenSrc,
  };
}

export type UseVoucherCotizacionReturn = ReturnType<typeof useVoucherCotizacion>;