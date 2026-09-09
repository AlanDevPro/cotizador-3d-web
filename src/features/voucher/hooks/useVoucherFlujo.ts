import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type {
  TipoEntrega,
  MetodoPago,
  CotizacionPublica,
  PiezaDetalle,
  CrearPedidoDesdeCotizacionDTO,
} from "../types/voucher.types";
import { calcularTotalesPedido } from "../utils/calcularTotalesPedido";
import {
  crearPedidoPendienteService,
  actualizarOpcionesPedidoService,
  registrarPagoPedidoService,
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

  const [pagoId, setPagoId] = useState<string | null>(null);
  const [comprobanteVerificado, setComprobanteVerificado] = useState<boolean>(false);

  // Guarda contra doble-click / doble-submit mientras se registra el anticipo
  const [isRegistrandoPago, setIsRegistrandoPago] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fechaEmision = new Date();

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
    if (isRegistrandoPago) return;
    fileInputRef.current?.click();
  };

  // 4. Comprobante QR subido → registrarPagoPedidoService hace upsert
  // (crea el anticipo la primera vez, lo actualiza si ya existía)
  const handleComprobanteChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Solo se permiten archivos de imagen (JPG, PNG, WEBP, etc.).");
      if (e.target) e.target.value = "";
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Evita que un doble-click dispare dos registros mientras el primero
    // todavía no terminó de guardarse.
    if (isRegistrandoPago) {
      e.target.value = "";
      return;
    }

    setComprobanteArchivo(file);
    onSubirComprobante?.(file);
    e.target.value = "";

    if (!pedidoId || !tipoEntrega) return;

    try {
      setIsRegistrandoPago(true);
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
      setIsRegistrandoPago(false);
    }
  };

  // 5. Confirmación de pago en efectivo (upsert, mismo criterio)
  const handleConfirmarEfectivo = async () => {
    if (!pedidoId || !tipoEntrega || isRegistrandoPago) return;

    try {
      setIsRegistrandoPago(true);
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
      setIsRegistrandoPago(false);
    }
  };

  // 6. Cambiar opciones: YA NO borra el pago. Solo resetea la UI para que el
  // cliente vuelva a elegir envio_tipo/metodo_pago; al volver a confirmar
  // (efectivo) o subir comprobante (QR), registrarPagoPedidoService
  // encuentra el anticipo existente y lo ACTUALIZA en la misma fila.
  const handleCambiarOpciones = () => {
    setTipoEntrega(null);
    setMetodoPago(null);
    setPedidoConfirmadoEfectivo(false);
    setComprobanteArchivo(null);
    setComprobanteVerificado(false);
    // pagoId se mantiene: sigue siendo el mismo registro que se actualizará
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