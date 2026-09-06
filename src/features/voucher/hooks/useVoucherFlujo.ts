// src/features/voucher/hooks/useVoucherFlujo.ts
"use client";

import { useRef, useState } from "react";
import type { TabId, Tema, TipoEntrega, MetodoPago } from "../types/voucher.types";

interface UseVoucherFlujoParams {
  onAceptarPedido?: () => void;
  onSubirComprobante?: (archivo: File) => void;
  onConfirmarPedidoEfectivo?: () => void;
}

/**
 * Maneja todo el estado interactivo del voucher: tab activo, tema,
 * flujo de aceptación de pedido, entrega, pago y comprobante.
 */
export function useVoucherFlujo({
  onAceptarPedido,
  onSubirComprobante,
  onConfirmarPedidoEfectivo,
}: UseVoucherFlujoParams) {
  const [tabActivo, setTabActivo] = useState<TabId>("general");
  const [tema, setTema] = useState<Tema>("rosa");

  const [pedidoAceptado, setPedidoAceptado] = useState(false);
  const [tipoEntrega, setTipoEntrega] = useState<TipoEntrega | null>(null);
  const [metodoPago, setMetodoPago] = useState<MetodoPago | null>(null);
  const [comprobanteArchivo, setComprobanteArchivo] = useState<File | null>(null);
  const [pedidoConfirmadoEfectivo, setPedidoConfirmadoEfectivo] = useState(false);
  const [fechaEmision] = useState(() => new Date());

  const fileInputRef = useRef<HTMLInputElement>(null);

  function alternarTema() {
    setTema((actual) => (actual === "rosa" ? "morado" : "rosa"));
  }

  function handleAceptarPedido() {
    setPedidoAceptado(true);
    onAceptarPedido?.();
  }

  function handleCambiarOpciones() {
    setTipoEntrega(null);
    setMetodoPago(null);
    setComprobanteArchivo(null);
    setPedidoConfirmadoEfectivo(false);
  }

  function handleSeleccionarComprobante() {
    fileInputRef.current?.click();
  }

  function handleComprobanteChange(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (archivo) {
      setComprobanteArchivo(archivo);
      onSubirComprobante?.(archivo);
    }
  }

  function handleConfirmarEfectivo() {
    setPedidoConfirmadoEfectivo(true);
    onConfirmarPedidoEfectivo?.();
  }

  const seleccionCompleta = Boolean(tipoEntrega && metodoPago);

  return {
    // estado
    tabActivo,
    setTabActivo,
    tema,
    alternarTema,
    pedidoAceptado,
    tipoEntrega,
    setTipoEntrega,
    metodoPago,
    setMetodoPago,
    comprobanteArchivo,
    pedidoConfirmadoEfectivo,
    fechaEmision,
    fileInputRef,
    seleccionCompleta,
    // handlers
    handleAceptarPedido,
    handleCambiarOpciones,
    handleSeleccionarComprobante,
    handleComprobanteChange,
    handleConfirmarEfectivo,
  };
}

export type UseVoucherFlujoReturn = ReturnType<typeof useVoucherFlujo>;