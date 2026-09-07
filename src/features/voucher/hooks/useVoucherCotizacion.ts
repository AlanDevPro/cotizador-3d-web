// src/features/voucher/hooks/useVoucherCotizacion.ts
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
  DEFAULT_GARANTIA_DIAS,
  DEFAULT_UBICACION,
} from "../constants/voucherConstants";
import { detalleTecnicoPieza } from "../utils/voucherFormatters";
import { calcularTotalesPedido } from "../utils/calcularTotalesPedido";

interface UseVoucherCotizacionParams {
  cotizacion: CotizacionPublica;
  tabActivo: TabId;
  tipoEntrega: TipoEntrega | null;
  numeroPedido?: string;
  clienteNombre?: string;
  ubicacionLocal?: string;
  ubicacionMapsUrl?: string;
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
  ubicacionMapsUrl,
  qrPagoUri,
  fechaEmision,
}: UseVoucherCotizacionParams) {
  const empresa = cotizacion.empresa;
  const empresaNombre = empresa?.nombre ?? "Taller de Impresión 3D";
  const voucherData = cotizacion.voucher_data;

  // Tabs reactivos
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

  // Filas para la tabla/vista según la pestaña seleccionada
  const piezasVista = useMemo(
    () => (esGeneral ? cotizacion.piezas : [pieza!]),
    [esGeneral, cotizacion.piezas, pieza]
  );

  const filasVista = useMemo(
    () => piezasVista.map((p) => construirFila(p, voucherData)),
    [piezasVista, voucherData]
  );

  // Filas completas para el comprobante
  const filasComprobante = useMemo(
    () => cotizacion.piezas.map((p) => construirFila(p, voucherData)),
    [cotizacion.piezas, voucherData]
  );

  // Cálculos base del pedido
  const subtotalOrden = useMemo(
    () => filasComprobante.reduce((acc, f) => acc + f.total, 0),
    [filasComprobante]
  );
  
  const montoImpuestoOrden = cotizacion.monto_impuesto || 0;
  const totalOrden = subtotalOrden + montoImpuestoOrden;

  // Recalculo reactivo dinámico de totales con el tipoEntrega actual
  const { costoEnvio, totalConEnvio, montoAnticipo, montoSaldo } = useMemo(
    () => calcularTotalesPedido(totalOrden, tipoEntrega),
    [totalOrden, tipoEntrega]
  );

  // Totales ajustados a la vista actual (tab general incluye envío e impuesto, tab individual solo el monto de la pieza)
  const subtotalVista = useMemo(
    () => filasVista.reduce((acc, f) => acc + f.total, 0),
    [filasVista]
  );

  const montoImpuestoVista = esGeneral ? montoImpuestoOrden : 0;
  const totalVista = esGeneral ? totalConEnvio : subtotalVista;
  const precioMostrado = esGeneral ? totalConEnvio : pieza!.precio_total_pieza;

  // Políticas y datos adicionales
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
  const direccionLocal = ubicacionLocal?.trim() || empresa?.direccion || DEFAULT_UBICACION;
  const direccionMapsUrl = ubicacionMapsUrl || empresa?.ubicacion_url || null;

  const notasLegales = voucherData?.notasLegales?.length
    ? voucherData.notasLegales
    : [
        "Este documento es un comprobante de pedido y no reemplaza a la factura fiscal.",
        `Garantía válida por ${garantiaDias} días tras la recepción del trabajo.`,
      ];

  // El QR se regenera reactivamente cuando cambia el anticipo por el costo de envío
  const qrImagenSrc = useMemo(
    () =>
      qrPagoUri ||
      `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
        `Anticipo pedido ${codigoPedido} - ${empresaNombre} - Monto: ${montoAnticipo.toFixed(2)} Bs`
      )}`,
    [qrPagoUri, codigoPedido, empresaNombre, montoAnticipo]
  );

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
    direccionMapsUrl,
    notasLegales,
    qrImagenSrc,
  };
}

export type UseVoucherCotizacionReturn = ReturnType<typeof useVoucherCotizacion>;