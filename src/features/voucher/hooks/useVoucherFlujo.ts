import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type {
  TipoEntrega,
  MetodoPago,
  CotizacionPublica,
  PiezaDetalle,
  CrearPedidoDesdeCotizacionDTO, // <- Importado directamente desde el archivo de tipos
} from "../types/voucher.types";
import { calcularTotalesPedido } from "../utils/calcularTotalesPedido";
import {
  crearPedidoPendienteService,
  actualizarOpcionesPedidoService,
  registrarPagoPedidoService,
  anularUltimoPagoPedidoService,
  subirComprobantePagoService,
  getPedidoPorCotizacionIdService,
  getUltimoPagoPedidoService,
} from "../services/pedidos.service";

interface UseVoucherFlujoProps {
  cotizacion: CotizacionPublica;
  onAceptarPedidoSuccess?: (pedidoId: string) => void;
  onSubirComprobante?: (file: File) => void;
  onConfirmarPedidoEfectivo?: () => void;
}

export function useVoucherFlujo({
  cotizacion,
  onAceptarPedidoSuccess,
  onSubirComprobante,
  onConfirmarPedidoEfectivo,
}: UseVoucherFlujoProps) {
  const [tema, setTema] = useState<string>("rosa");
  const [tabActivo, setTabActivo] = useState<string>("general");
  const [pedidoAceptado, setPedidoAceptado] = useState<boolean>(false);
  const [isCreatingPedido, setIsCreatingPedido] = useState<boolean>(false);
  const [isUpdatingPedido, setIsUpdatingPedido] = useState<boolean>(false);
  const [pedidoId, setPedidoId] = useState<string | null>(null);

  const [tipoEntrega, setTipoEntrega] = useState<TipoEntrega | null>(null);
  const [metodoPago, setMetodoPago] = useState<MetodoPago | null>(null);

  const [comprobanteArchivo, setComprobanteArchivo] = useState<File | null>(null);
  const [pedidoConfirmadoEfectivo, setPedidoConfirmadoEfectivo] = useState<boolean>(false);

  // Estado del último pago registrado (anticipo) — para mostrar mensaje de verificación
  const [pagoId, setPagoId] = useState<string | null>(null);
  const [comprobanteVerificado, setComprobanteVerificado] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fechaEmision = new Date();

  // Recuperar pedido y último pago existentes al montar
  useEffect(() => {
    let activo = true;

    (async () => {
      const pedidoExistente = await getPedidoPorCotizacionIdService(cotizacion.id);
      if (!activo || !pedidoExistente) return;

      setPedidoId(pedidoExistente.id);
      setPedidoAceptado(true);

      if (pedidoExistente.envio_tipo) {
        setTipoEntrega(pedidoExistente.envio_tipo as TipoEntrega);
      }

      const ultimoPago = await getUltimoPagoPedidoService(pedidoExistente.id);
      if (ultimoPago && activo) {
        setMetodoPago(ultimoPago.metodo as MetodoPago);
        setPagoId(ultimoPago.id);
        setComprobanteVerificado(ultimoPago.verificado);
        if (ultimoPago.metodo === "efectivo") setPedidoConfirmadoEfectivo(true);
      }
    })();

    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cotizacion.id]);

  // Escucha en tiempo real cuando el admin verifica el pago desde la app móvil
  useEffect(() => {
    if (!pagoId) return;

    const channel = supabase
      .channel(`pedido_pago_${pagoId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "pedido_pagos",
          filter: `id=eq.${pagoId}`,
        },
        (payload) => {
          if (payload.new?.verificado) {
            setComprobanteVerificado(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pagoId]);

  const alternarTema = () => setTema((prev) => (prev === "rosa" ? "morado" : "rosa"));

  // 1. Creación básica del pedido
  const handleAceptarPedido = async () => {
    if (isCreatingPedido || pedidoId) return;

    try {
      setIsCreatingPedido(true);

      const descripcionPiezas = cotizacion.piezas?.length
        ? cotizacion.piezas.map((p: PiezaDetalle) => p.nombre_pieza).join(", ")
        : "Pieza 3D personalizada";

      const dto: CrearPedidoDesdeCotizacionDTO = {
        cotizacionId: cotizacion.id,
        empresaId: cotizacion.empresa?.id ?? "",
        clienteId: null,
        creadoPor: null,
        piezaDescripcion: descripcionPiezas,
        pagoTotal: cotizacion.precio_final ?? 0,
        pagoAnticipoPct: 50,
      };

      const pedidoCreado = await crearPedidoPendienteService(dto);

      setPedidoId(pedidoCreado.id);
      setPedidoAceptado(true);
      onAceptarPedidoSuccess?.(pedidoCreado.id);
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      alert("Ocurrió un error al crear tu pedido. Por favor intenta nuevamente.");
    } finally {
      setIsCreatingPedido(false);
    }
  };

  // 2. Selección de entrega
  const handleSeleccionarEntrega = async (tipo: TipoEntrega) => {
    setTipoEntrega(tipo);
    if (!pedidoId) return;

    try {
      setIsUpdatingPedido(true);
      const { costoEnvio, totalConEnvio } = calcularTotalesPedido(
        cotizacion.precio_final ?? 0,
        tipo
      );

      await actualizarOpcionesPedidoService(pedidoId, {
        envioTipo: tipo,
        envioCosto: costoEnvio,
        pagoTotal: totalConEnvio,
      });
    } catch (error) {
      console.error("Error al guardar tipo de entrega:", error);
    } finally {
      setIsUpdatingPedido(false);
    }
  };

  // 3. Selección de método de pago
  const handleSeleccionarPago = (metodo: MetodoPago) => {
    setMetodoPago(metodo);
  };

  const handleSeleccionarComprobante = () => {
    fileInputRef.current?.click();
  };

  // 4. Comprobante QR subido → bucket empresa-assets + registro de anticipo (monto 0)
  const handleComprobanteChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setComprobanteArchivo(file);
    onSubirComprobante?.(file);

    if (!pedidoId || !tipoEntrega) return;

    try {
      setIsUpdatingPedido(true);
      const { montoAnticipo } = calcularTotalesPedido(cotizacion.precio_final ?? 0, tipoEntrega);
      const comprobanteUrl = await subirComprobantePagoService(pedidoId, file);

      const pago = await registrarPagoPedidoService(pedidoId, {
        tipo: "anticipo",
        metodo: "qr",
        comprobanteUrl,
        montoEsperado: montoAnticipo,
      });

      setPagoId(pago.id);
      setComprobanteVerificado(false);
    } catch (error) {
      console.error("Error al registrar el pago QR:", error);
      alert("No se pudo registrar tu comprobante. Intenta nuevamente.");
    } finally {
      setIsUpdatingPedido(false);
    }
  };

  // 5. Confirmación de pago en efectivo (monto 0 hasta que pague en el local)
  const handleConfirmarEfectivo = async () => {
    if (!pedidoId || !tipoEntrega) return;

    try {
      setIsUpdatingPedido(true);
      const { montoAnticipo } = calcularTotalesPedido(cotizacion.precio_final ?? 0, tipoEntrega);

      const pago = await registrarPagoPedidoService(pedidoId, {
        tipo: "anticipo",
        metodo: "efectivo",
        montoEsperado: montoAnticipo,
      });

      setPagoId(pago.id);
      setComprobanteVerificado(false);
      setPedidoConfirmadoEfectivo(true);
      onConfirmarPedidoEfectivo?.();
    } catch (error) {
      console.error("Error al confirmar el pago en efectivo:", error);
      alert("No se pudo confirmar tu pedido. Intenta nuevamente.");
    } finally {
      setIsUpdatingPedido(false);
    }
  };

  // 6. "Cambiar opciones": anula el pago previo y reabre la selección
  const handleCambiarOpciones = async () => {
    if (pedidoId && (pedidoConfirmadoEfectivo || comprobanteArchivo)) {
      try {
        setIsUpdatingPedido(true);
        await anularUltimoPagoPedidoService(pedidoId);
      } catch (error) {
        console.error("Error al anular el pago anterior:", error);
      } finally {
        setIsUpdatingPedido(false);
      }
    }

    setTipoEntrega(null);
    setMetodoPago(null);
    setPedidoConfirmadoEfectivo(false);
    setComprobanteArchivo(null);
    setPagoId(null);
    setComprobanteVerificado(false);
  };

  const seleccionCompleta = Boolean(tipoEntrega && metodoPago);

  return {
    tema,
    alternarTema,
    tabActivo,
    setTabActivo,
    pedidoAceptado,
    pedidoId,
    isCreatingPedido,
    isUpdatingPedido,
    tipoEntrega,
    metodoPago,
    handleSeleccionarEntrega,
    handleSeleccionarPago,
    comprobanteArchivo,
    pedidoConfirmadoEfectivo,
    comprobanteVerificado,
    seleccionCompleta,
    fechaEmision,
    fileInputRef,
    handleAceptarPedido,
    handleSeleccionarComprobante,
    handleComprobanteChange,
    handleConfirmarEfectivo,
    handleCambiarOpciones,
  };
}