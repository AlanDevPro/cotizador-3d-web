import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type {
  TipoEntrega,
  MetodoPago,
  TipoMontoPago,
  TipoPagoRegistro,
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
  anularUltimoPagoPedidoService,
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
  const router = useRouter();

  const [tema, setTema] = useState<string>("rosa");
  const [tabActivo, setTabActivo] = useState<string>("general");
  const [pedidoAceptado, setPedidoAceptado] = useState<boolean>(false);
  const [isCreatingPedido, setIsCreatingPedido] = useState<boolean>(false);
  const [isUpdatingPedido, setIsUpdatingPedido] = useState<boolean>(false);
  const [pedidoId, setPedidoId] = useState<string | null>(null);

  const [tipoEntrega, setTipoEntrega] = useState<TipoEntrega | null>(null);
  const [metodoPago, setMetodoPago] = useState<MetodoPago | null>(null);

  const [direccionDomicilio, setDireccionDomicilio] = useState<string>("");
  const [ubicacionUrl, setUbicacionUrl] = useState<string | null>(null);
  const [obteniendoUbicacion, setObteniendoUbicacion] = useState<boolean>(false);
  const [errorUbicacion, setErrorUbicacion] = useState<string | null>(null);

  const [comprobanteArchivo, setComprobanteArchivo] = useState<File | null>(null);
  const [pedidoConfirmadoEfectivo, setPedidoConfirmadoEfectivo] = useState<boolean>(false);

  const [pagoId, setPagoId] = useState<string | null>(null);
  const [comprobanteVerificado, setComprobanteVerificado] = useState<boolean>(false);

  const [isRegistrandoPago, setIsRegistrandoPago] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fechaEmision = new Date();

  // 1. Cargar estado inicial del pedido y su último pago
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

      if (pedidoExistente.envio_direccion) {
        setDireccionDomicilio(pedidoExistente.envio_direccion);
      }

      if (pedidoExistente.envio_ubicacion_url) {
        setUbicacionUrl(pedidoExistente.envio_ubicacion_url);
      }

      const ultimoPago = await getUltimoPagoPedidoService(pedidoExistente.id);
      if (ultimoPago && activo) {
        setMetodoPago(ultimoPago.metodo as MetodoPago);
        setPagoId(ultimoPago.id);
        setComprobanteVerificado(Boolean(ultimoPago.verificado));
        if (ultimoPago.metodo === "efectivo") setPedidoConfirmadoEfectivo(true);
      }
    })();

    return () => {
      activo = false;
    };
  }, [cotizacion.id]);

  // 2. Suscripción Realtime: Cambios en la verificación del PAGO
  useEffect(() => {
    if (!pagoId) return;

    const channel = supabase
      .channel(`realtime-pago-${pagoId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "pedido_pagos",
          filter: `id=eq.${pagoId}`,
        },
        (payload) => {
          if (payload.new && typeof payload.new.verificado !== "undefined") {
            setComprobanteVerificado(Boolean(payload.new.verificado));
          }
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pagoId, router]);

  // 3. Suscripción Realtime: Cambios directos en la tabla PEDIDOS
  useEffect(() => {
    if (!pedidoId) return;

    const channel = supabase
      .channel(`realtime-pedido-${pedidoId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "pedidos",
          filter: `id=eq.${pedidoId}`,
        },
        (payload) => {
          if (payload.new?.envio_tipo) {
            setTipoEntrega(payload.new.envio_tipo as TipoEntrega);
          }
          if (payload.new?.envio_direccion) {
            setDireccionDomicilio(payload.new.envio_direccion);
          }
          if (payload.new?.envio_ubicacion_url) {
            setUbicacionUrl(payload.new.envio_ubicacion_url);
          }
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pedidoId, router]);

  const alternarTema = () => setTema((prev) => (prev === "rosa" ? "morado" : "rosa"));

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

  const handleSeleccionarPago = (metodo: MetodoPago) => {
    setMetodoPago(metodo);
  };

  const handleGuardarDireccion = async (direccion: string) => {
    setDireccionDomicilio(direccion);
    if (!pedidoId) return;

    try {
      setIsUpdatingPedido(true);
      await actualizarOpcionesPedidoService(pedidoId, { envioDireccion: direccion });
    } catch (error) {
      console.error("Error al guardar la dirección:", error);
    } finally {
      setIsUpdatingPedido(false);
    }
  };

  const handleUsarUbicacionActual = () => {
    if (!("geolocation" in navigator)) {
      setErrorUbicacion("Tu navegador no soporta geolocalización.");
      return;
    }

    setObteniendoUbicacion(true);
    setErrorUbicacion(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setUbicacionUrl(mapsUrl);

        if (pedidoId) {
          try {
            setIsUpdatingPedido(true);
            await actualizarOpcionesPedidoService(pedidoId, { envioUbicacionUrl: mapsUrl });
          } catch (error) {
            console.error("Error al guardar la ubicación:", error);
            setErrorUbicacion("No se pudo guardar la ubicación. Intenta nuevamente.");
          } finally {
            setIsUpdatingPedido(false);
          }
        }
        setObteniendoUbicacion(false);
      },
      (geoError) => {
        setObteniendoUbicacion(false);
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setErrorUbicacion("Debes permitir el acceso a tu ubicación para usar esta opción.");
        } else {
          setErrorUbicacion("No se pudo obtener tu ubicación. Intenta nuevamente.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSeleccionarComprobante = () => {
    if (isRegistrandoPago) return;
    fileInputRef.current?.click();
  };

  const handleComprobanteChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    tipoMontoPago: TipoMontoPago | null = null
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Solo se permiten archivos de imagen (JPG, PNG, WEBP, etc.).");
      if (e.target) e.target.value = "";
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

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

      const { montoAnticipo, totalConEnvio } = calcularTotalesPedido(
        cotizacion.precio_final ?? 0,
        tipoEntrega
      );

      const esTotal = tipoMontoPago === "total";
      const tipoPago: TipoPagoRegistro = esTotal ? "pago_final" : "anticipo";
      const montoEsperado = esTotal ? totalConEnvio : montoAnticipo;

      const comprobanteUrl = await subirComprobantePagoService(pedidoId, file);

      const pago = await registrarPagoPedidoService(pedidoId, {
        tipo: tipoPago,
        metodo: "qr",
        comprobanteUrl,
        montoEsperado,
      });

      setPagoId(pago.id);
      setComprobanteVerificado(Boolean(pago.verificado));
    } catch (error) {
      console.error("Error al registrar el pago QR:", error);
      alert("No se pudo registrar tu comprobante. Intenta nuevamente.");
    } finally {
      setIsUpdatingPedido(false);
      setIsRegistrandoPago(false);
    }
  };

  const handleConfirmarEfectivo = async (tipoMontoPago: TipoMontoPago | null = null) => {
    if (!pedidoId || !tipoEntrega || isRegistrandoPago) return;

    try {
      setIsRegistrandoPago(true);
      setIsUpdatingPedido(true);

      const { montoAnticipo, totalConEnvio } = calcularTotalesPedido(
        cotizacion.precio_final ?? 0,
        tipoEntrega
      );

      const esTotal = tipoMontoPago === "total";
      const tipoPago: TipoPagoRegistro = esTotal ? "pago_final" : "anticipo";
      const montoEsperado = esTotal ? totalConEnvio : montoAnticipo;

      const pago = await registrarPagoPedidoService(pedidoId, {
        tipo: tipoPago,
        metodo: "efectivo",
        montoEsperado,
      });

      setPagoId(pago.id);
      setComprobanteVerificado(Boolean(pago.verificado));
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

  const handleCambiarOpciones = async () => {
    if (pedidoId) {
      try {
        await anularUltimoPagoPedidoService(pedidoId);
      } catch (error) {
        console.warn("⚠️ No se pudo anular el pago previo:", error);
      }
    }

    setTipoEntrega(null);
    setMetodoPago(null);
    setPagoId(null);
    setPedidoConfirmadoEfectivo(false);
    setComprobanteArchivo(null);
    setComprobanteVerificado(false);
    setErrorUbicacion(null);
  };

  const seleccionCompleta = Boolean(tipoEntrega && metodoPago);

  return {
    tema,
    alternarTema,
    tabActivo,
    setTabActivo,
    pedidoAceptado,
    pedidoId,
    pagoId,
    isCreatingPedido,
    isUpdatingPedido,
    tipoEntrega,
    metodoPago,
    direccionDomicilio,
    ubicacionUrl,
    obteniendoUbicacion,
    errorUbicacion,
    comprobanteArchivo,
    pedidoConfirmadoEfectivo,
    comprobanteVerificado,
    seleccionCompleta,
    fechaEmision,
    fileInputRef,
    handleAceptarPedido,
    handleSeleccionarEntrega,
    handleSeleccionarPago,
    handleGuardarDireccion,
    handleUsarUbicacionActual,
    handleSeleccionarComprobante,
    handleComprobanteChange,
    handleConfirmarEfectivo,
    handleCambiarOpciones,
  };
}