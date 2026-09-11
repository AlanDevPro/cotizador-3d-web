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

  const piezasVista = useMemo(
    () => (esGeneral ? cotizacion.piezas : [pieza!]),
    [esGeneral, cotizacion.piezas, pieza]
  );

  const filasVista = useMemo(
    () => piezasVista.map((p) => construirFila(p, voucherData)),
    [piezasVista, voucherData]
  );

  const filasComprobante = useMemo(
    () => cotizacion.piezas.map((p) => construirFila(p, voucherData)),
    [cotizacion.piezas, voucherData]
  );

  const subtotalOrden = useMemo(
    () => filasComprobante.reduce((acc, f) => acc + f.total, 0),
    [filasComprobante]
  );

  const montoImpuestoOrden = cotizacion.monto_impuesto || 0;
  const totalOrden = subtotalOrden + montoImpuestoOrden;

  const { costoEnvio, totalConEnvio, montoAnticipo, montoSaldo } = useMemo(
    () => calcularTotalesPedido(totalOrden, tipoEntrega),
    [totalOrden, tipoEntrega]
  );

  const subtotalVista = useMemo(
    () => filasVista.reduce((acc, f) => acc + f.total, 0),
    [filasVista]
  );

  const montoImpuestoVista = esGeneral ? montoImpuestoOrden : 0;
  const totalVista = esGeneral ? totalConEnvio : subtotalVista;
  const precioMostrado = esGeneral ? totalConEnvio : pieza!.precio_total_pieza;

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

  // Orden de prioridad del QR mostrado al cliente:
  // 1. qrPagoUri explícito recibido por props (override manual/pruebas)
  // 2. empresa.qr_pago_url: el QR bancario/billetera real cargado en
  //    configuracion_empresa (el que realmente se debe usar para cobrar)
  // 3. Generador de respaldo (solo texto informativo) si la empresa aún
  //    no configuró su QR de pago
  const qrImagenSrc = useMemo(
    () =>
      qrPagoUri ||
      empresa?.qr_pago_url ||
      `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
        `Anticipo pedido ${codigoPedido} - ${empresaNombre} - Monto: ${montoAnticipo.toFixed(2)} Bs`
      )}`,
    [qrPagoUri, empresa?.qr_pago_url, codigoPedido, empresaNombre, montoAnticipo]
  );

  const qrPagoTitular = empresa?.qr_pago_titular ?? null;

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
    qrPagoTitular,
  };
}

export type UseVoucherCotizacionReturn = ReturnType<typeof useVoucherCotizacion>;




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


import { supabase } from "@/lib/supabase";
import type {
  ActualizarOpcionesPedidoDTO,
  CrearPedidoDesdeCotizacionDTO,
  PedidoExistente,
  RegistrarPagoPedidoDTO,
  UltimoPago,
} from "../types/voucher.types";

export type {
  ActualizarOpcionesPedidoDTO,
  CrearPedidoDesdeCotizacionDTO,
  PedidoExistente,
  RegistrarPagoPedidoDTO,
  UltimoPago,
} from "../types/voucher.types";

const CHECKLIST_DEFAULT_LABELS = [
  "Confirmar diseño y archivo final",
  "Imprimir pieza(s)",
  "Control de calidad y postprocesado",
  "Empacar pedido",
  "Entregar / despachar pedido",
];

// ==========================================
// Creación (Corregida de Forma Profesional)
// ==========================================

export async function crearPedidoPendienteService(dto: CrearPedidoDesdeCotizacionDTO) {
  let finalClienteId = dto.clienteId ?? null;

  if (!finalClienteId) {
    const { data: cotizacion, error: errorCotizacion } = await supabase
      .from("cotizaciones")
      .select("id, empresa_id, cliente_id, cliente_nombre, cliente_contacto")
      .eq("id", dto.cotizacionId)
      .single();

    if (errorCotizacion) {
      throw new Error(`Error al verificar la cotización: ${errorCotizacion.message}`);
    }

    finalClienteId = cotizacion.cliente_id;

    if (!finalClienteId) {
      const { data: nuevoCliente, error: errorNuevoCliente } = await supabase
        .from("clientes")
        .insert({
          empresa_id: dto.empresaId || cotizacion.empresa_id,
          nombre: cotizacion.cliente_nombre || "Cliente Web",
          telefono: cotizacion.cliente_contacto || null,
        })
        .select("id")
        .single();

      if (errorNuevoCliente || !nuevoCliente) {
        throw new Error(
          `No se pudo autogenerar el cliente para el pedido: ${errorNuevoCliente?.message}`
        );
      }

      finalClienteId = nuevoCliente.id;

      await supabase
        .from("cotizaciones")
        .update({ cliente_id: finalClienteId })
        .eq("id", dto.cotizacionId);
    }
  }

  const { data: pedido, error: errorPedido } = await supabase
    .from("pedidos")
    .insert({
      cotizacion_id: dto.cotizacionId,
      empresa_id: dto.empresaId,
      cliente_id: finalClienteId,
      creado_por: dto.creadoPor ?? null,
      pieza_descripcion: dto.piezaDescripcion,
      estado: "pendiente",
      envio_tipo: dto.envioTipo ?? "recoger",
      pago_total: dto.pagoTotal,
      pago_anticipo_pct: dto.pagoAnticipoPct ?? 50,
      pago_monto_cobrado: 0,
      pago_estado: "sin_pagar",
    })
    .select()
    .single();

  if (errorPedido) {
    throw new Error(`No se pudo crear el pedido: ${errorPedido.message}`);
  }

  const { error: errorEvento } = await supabase.from("pedido_eventos").insert({
    pedido_id: pedido.id,
    texto: "Pedido aceptado por el cliente desde el comprobante/voucher web.",
  });
  if (errorEvento) console.warn("⚠️ No se pudo registrar el evento de creación:", errorEvento);

  const { error: errorChecklist } = await supabase.from("pedido_checklist_items").insert(
    CHECKLIST_DEFAULT_LABELS.map((label, index) => ({
      pedido_id: pedido.id,
      label,
      hecho: false,
      orden: index + 1,
    }))
  );
  if (errorChecklist) console.warn("⚠️ No se pudo crear el checklist del pedido:", errorChecklist);

  const { error: errorCotizState } = await supabase
    .from("cotizaciones")
    .update({ estado: "aceptada" })
    .eq("id", dto.cotizacionId);
  if (errorCotizState) console.warn("⚠️ No se pudo actualizar estado de cotización:", errorCotizState);

  return pedido;
}

// ==========================================
// Recuperar pedido / pago existentes
// ==========================================

export async function getPedidoPorCotizacionIdService(
  cotizacionId: string
): Promise<PedidoExistente | null> {
  const { data, error } = await supabase
    .from("pedidos")
    .select("id, estado, envio_tipo, envio_costo, pago_total, pago_monto_cobrado, pago_estado")
    .eq("cotizacion_id", cotizacionId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("🚨 Error al buscar pedido existente:", error);
    return null;
  }
  return data;
}

export async function getUltimoPagoPedidoService(pedidoId: string): Promise<UltimoPago | null> {
  const { data, error } = await supabase
    .from("pedido_pagos")
    .select("id, metodo, tipo, monto, comprobante_url, verificado")
    .eq("pedido_id", pedidoId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("🚨 Error al obtener el último pago:", error);
    return null;
  }
  return data as UltimoPago | null;
}

// ==========================================
// Actualizar opciones de entrega
// ==========================================

export async function actualizarOpcionesPedidoService(
  pedidoId: string,
  dto: ActualizarOpcionesPedidoDTO
) {
  const updatePayload: Record<string, unknown> = {};
  if (dto.envioTipo !== undefined) updatePayload.envio_tipo = dto.envioTipo;
  if (dto.envioCosto !== undefined) updatePayload.envio_costo = dto.envioCosto;
  if (dto.pagoTotal !== undefined) updatePayload.pago_total = dto.pagoTotal;
  if (Object.keys(updatePayload).length === 0) return null;

  const { data: dataArray, error } = await supabase
    .from("pedidos")
    .update(updatePayload)
    .eq("id", pedidoId)
    .select("id, estado, envio_tipo, envio_costo, pago_total");

  if (error) throw new Error(`Error en base de datos: ${error.message}`);
  if (!dataArray || dataArray.length === 0) {
    throw new Error("No se pudieron guardar las opciones. RLS o el pedido no existe.");
  }

  await supabase.from("pedido_eventos").insert({
    pedido_id: pedidoId,
    texto: `Tipo de entrega actualizado: ${JSON.stringify(updatePayload)}`,
  });

  return dataArray[0];
}

// ==========================================
// Registrar / actualizar pago (anticipo) — UPSERT
//
// Regla de negocio: solo puede existir UN registro de tipo "anticipo" por
// pedido. Si el cliente presiona "Subir comprobante", "Reemplazar" o
// "Confirmar pedido" más de una vez (doble click, refresco de página, o
// cambia de método de pago/entrega y vuelve a confirmar), se actualiza la
// misma fila en vez de insertar una nueva.
// ==========================================

export async function registrarPagoPedidoService(pedidoId: string, dto: RegistrarPagoPedidoDTO) {
  const montoARegistrar = dto.montoEsperado ?? 0;

  // 1. Buscar si ya existe un anticipo para este pedido
  const { data: pagoExistente, error: errorBuscar } = await supabase
    .from("pedido_pagos")
    .select("id, verificado")
    .eq("pedido_id", pedidoId)
    .eq("tipo", dto.tipo)
    .maybeSingle();

  if (errorBuscar) {
    throw new Error(`No se pudo verificar el pago existente: ${errorBuscar.message}`);
  }

  // 2. Si ya fue verificado por el administrador, el pedido queda cerrado:
  // el cliente ya no puede modificarlo desde el voucher web.
  if (pagoExistente?.verificado) {
    throw new Error(
      "Este pedido ya tiene un pago verificado y no puede modificarse desde aquí."
    );
  }

  let pago;
  const esActualizacion = Boolean(pagoExistente);

  if (pagoExistente) {
    // 3a. Ya existe -> actualizar la misma fila (nuevo método, nuevo comprobante, etc.)
    const { data, error } = await supabase
      .from("pedido_pagos")
      .update({
        metodo: dto.metodo,
        monto: montoARegistrar,
        comprobante_url: dto.comprobanteUrl ?? null,
        verificado: false,
        fecha: new Date().toISOString(),
      })
      .eq("id", pagoExistente.id)
      .select()
      .single();

    if (error) throw new Error(`No se pudo actualizar el pago: ${error.message}`);
    pago = data;
  } else {
    // 3b. No existe -> crear el primer registro de anticipo
    const { data, error } = await supabase
      .from("pedido_pagos")
      .insert({
        pedido_id: pedidoId,
        tipo: dto.tipo,
        monto: montoARegistrar,
        metodo: dto.metodo,
        comprobante_url: dto.comprobanteUrl ?? null,
        verificado: false,
        fecha: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(`No se pudo registrar el pago: ${error.message}`);
    pago = data;
  }

  const detalleEsperado = montoARegistrar > 0
    ? ` Monto declarado: ${montoARegistrar.toFixed(2)} Bs (pendiente de verificación por el administrador).`
    : "";

  await supabase.from("pedido_eventos").insert({
    pedido_id: pedidoId,
    texto: esActualizacion
      ? `Anticipo actualizado vía ${dto.metodo}.${detalleEsperado}`
      : `Anticipo registrado vía ${dto.metodo}.${detalleEsperado}`,
  });

  await actualizarEstadoPagoPedidoService(pedidoId);

  return pago;
}

// ==========================================
// Anular último pago
// (se conserva por si se necesita en otro flujo administrativo, pero el
// voucher web YA NO la llama al presionar "Cambiar opciones": ahora
// simplemente se actualiza el mismo registro cuando el cliente vuelve a
// confirmar)
// ==========================================

export async function anularUltimoPagoPedidoService(pedidoId: string) {
  const { data: ultimoPago, error: errorBuscar } = await supabase
    .from("pedido_pagos")
    .select("id")
    .eq("pedido_id", pedidoId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (errorBuscar) throw new Error(`No se pudo verificar pagos previos: ${errorBuscar.message}`);
  if (!ultimoPago) return;

  const { error: errorEliminar } = await supabase
    .from("pedido_pagos")
    .delete()
    .eq("id", ultimoPago.id);

  if (errorEliminar) throw new Error(`No se pudo anular el pago anterior: ${errorEliminar.message}`);

  await supabase.from("pedido_eventos").insert({
    pedido_id: pedidoId,
    texto: "Anticipo anulado por cambio de opciones del cliente.",
  });

  await actualizarEstadoPagoPedidoService(pedidoId);
}

// ==========================================
// Recalcular pago_estado desde pedido_pagos.monto
// ==========================================

export async function actualizarEstadoPagoPedidoService(pedidoId: string) {
  const { data: pagos, error: errorPagos } = await supabase
    .from("pedido_pagos")
    .select("monto, verificado")
    .eq("pedido_id", pedidoId);

  if (errorPagos) throw new Error(`No se pudo calcular el pago acumulado: ${errorPagos.message}`);

  const { data: pedido, error: errorPedido } = await supabase
    .from("pedidos")
    .select("pago_total")
    .eq("id", pedidoId)
    .single();

  if (errorPedido) throw new Error(`No se pudo leer el pedido: ${errorPedido.message}`);

  const montoCobrado = (pagos ?? [])
    .filter((p) => p.verificado)
    .reduce((acc, p) => acc + (Number(p.monto) || 0), 0);

  const pagoTotal = Number(pedido.pago_total) || 0;

  let pagoEstado: "sin_pagar" | "anticipo" | "pagado" = "sin_pagar";
  if (montoCobrado > 0 && pagoTotal > 0) {
    pagoEstado = montoCobrado >= pagoTotal ? "pagado" : "anticipo";
  }

  const { error: errorUpdate } = await supabase
    .from("pedidos")
    .update({ pago_monto_cobrado: montoCobrado, pago_estado: pagoEstado })
    .eq("id", pedidoId);

  if (errorUpdate) throw new Error(`No se pudo actualizar el estado de pago: ${errorUpdate.message}`);
}

// ==========================================
// Subir comprobante de pago QR → bucket empresa-assets
// ==========================================

export async function subirComprobantePagoService(pedidoId: string, file: File): Promise<string> {
  const extension = file.name.split(".").pop() || "jpg";
  const path = `comprobantes-pago/${pedidoId}/comprobante-anticipo.${extension}`;

  const { error: errorUpload } = await supabase.storage
    .from("empresa-assets")
    .upload(path, file, { upsert: true });

  if (errorUpload) throw new Error(`No se pudo subir el comprobante: ${errorUpload.message}`);

  const { data } = supabase.storage.from("empresa-assets").getPublicUrl(path);

  return `${data.publicUrl}?t=${Date.now()}`;
}





import type { RefObject, ChangeEvent } from "react";

export type TipoEntrega = "recoger" | "domicilio";
export type MetodoPago = "efectivo" | "qr";
export type Tema = "rosa" | "morado";
export type TabId = "general" | string;

// ==========================================
// DTOs & Interfaces de Pago / Pedido
// ==========================================

export interface CrearPedidoDesdeCotizacionDTO {
  cotizacionId: string;
  empresaId: string;
  clienteId?: string | null;
  envioTipo?: TipoEntrega | string | null;
  creadoPor?: string | null;
  piezaDescripcion: string;
  pagoTotal: number;
  pagoAnticipoPct?: number;
}

export interface ActualizarOpcionesPedidoDTO {
  envioTipo?: TipoEntrega | string | null;
  envioCosto?: number | null;
  pagoTotal?: number | null;
}

export interface RegistrarPagoPedidoDTO {
  tipo: "anticipo" | "saldo" | "total";
  metodo: "efectivo" | "qr";
  comprobanteUrl?: string | null;
  montoEsperado?: number; // solo informativo (evento), nunca se persiste en pedido_pagos.monto
}

export interface PedidoExistente {
  id: string;
  estado: string;
  envio_tipo: string | null;
  envio_costo: number | null;
  pago_total: number | null;
  pago_monto_cobrado: number | null;
  pago_estado: string | null;
}

export interface UltimoPago {
  id: string;
  metodo: "efectivo" | "qr";
  tipo: string;
  monto: number;
  comprobante_url: string | null;
  verificado: boolean;
}

// ==========================================
// Dominios Principales (Filamento, Pieza, Empresa)
// ==========================================

export interface FilamentoInfo {
  id: string;
  material: string;
  color: string;
  color_hex?: string | null;
  marca?: string | null;
}

export interface PiezaDetalle {
  id: string;
  nombre_pieza: string;
  cantidad: number;
  precio_total_pieza: number;
  imagen_url?: string | null;

  // Información de Filamento Normalizada
  filamento_id?: string | null;
  filamento?: FilamentoInfo | null;

  // Especificaciones Técnicas
  peso_gramos?: number | null;
  tiempo_impresion_horas?: number | null;
  tiempo_preparacion_minutos?: number | null;
  tiempo_postprocesado_minutos?: number | null;

  // Desglose Financiero Directo
  costo_material: number;
  costo_mano_obra: number;
  costo_depreciacion: number;
  costo_energia: number;
  costo_mantenimiento: number;
  subtotal_directo: number;
  proporcion_pct: number;
  costo_fallos_pieza: number;
  costo_base_pieza: number;
  monto_ganancia_pieza: number;
}

export interface EmpresaInfo {
  id: string;
  nombre: string;
  nombre_comercial?: string | null;
  razon_social?: string | null;
  logo_url?: string | null;
  garantia?: string | null;
  sitio_web?: string | null;
  nit?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  ciudad?: string | null;
  whatsapp_url?: string | null;
  tiktok_url?: string | null;
  instagram_url?: string | null;
  facebook_url?: string | null;
  ubicacion_url?: string | null;
  qr_pago_url?: string | null;
  qr_pago_titular?: string | null;
}

export interface VoucherPolicy {
  label: string;
  text: string;
}

export interface VoucherData {
  documentTitle?: string | null;
  companyTagline?: string | null;
  validityLabel?: string | null;
  footerNote?: string | null;
  logoUri?: string | null;
  productImageUri?: string | null;
  policies?: VoucherPolicy[] | null;
  garantiaDias?: number | null;
  notasLegales?: string[] | null;
}

export interface CotizacionPublica {
  id: string;
  creado_en: string;
  codigo_cotizacion?: string | null;
  precio_final: number;
  monto_impuesto?: number | null;
  porcentaje_impuesto?: number | null;
  costo_diseno_total: number;
  costo_directo_total: number;
  costo_indirecto_total: number;
  costo_fallos_total: number;
  subtotal_costo_base: number;
  monto_ganancia: number;
  margen_ganancia_aplicado_pct: number;
  cliente_nombre?: string | null;
  cliente_contacto?: string | null;
  estado?: string | null;
  notas?: string | null;
  imagen_referencia_url?: string | null;
  piezas: PiezaDetalle[];
  empresa?: EmpresaInfo | null;
  voucher_data?: VoucherData | null;
}

export interface FilaVoucher {
  pieza: PiezaDetalle;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  material: string;
  color: string;
  colorHex?: string | null;
  materialColor: string;
  detalleTecnico?: string | null;
}

// ==========================================
// Props de Componentes
// ==========================================

export interface VoucherPublicoProps {
  cotizacion: CotizacionPublica;
  onAceptarPedido?: () => void;
  onCancelarPedido?: () => void;
  clienteNombre?: string;
  clienteDocumento?: string;
  clienteTelefono?: string;
  atendidoPor?: string;
  numeroPedido?: string;
  qrPagoUri?: string;
  ubicacionLocal?: string;
  ubicacionMapsUrl?: string;
  onSubirComprobante?: (archivo: File) => void;
  onConfirmarPedidoEfectivo?: () => void;
  instagramUrl?: string;
  whatsappUrl?: string;
  facebookUrl?: string;  tiktokUrl?: string;
}

export interface VoucherTablaResumenProps {
  filas: FilaVoucher[];
  costoDisenoTotal?: number | null;
  subtotal: number;
  montoImpuesto: number;
  total: number;
}

export interface VoucherHeaderProps {
  empresaNombre?: string | null;
  empresa?: EmpresaInfo | null;
  voucherData?: VoucherData | null;
  creadoEn?: string;
  tema: Tema;
  onAlternarTema: () => void;
}

export interface TicketComprobanteProps {
  empresa?: EmpresaInfo | null;
  empresaNombre?: string | null;
  voucherData?: VoucherData | null;
  codigoPedido?: string | null;
  fechaEmision?: Date | string;
  atendidoPor?: string;
  nombreCliente?: string | null;
  clienteDocumento?: string;
  clienteTelefono?: string;
  tipoEntrega: TipoEntrega | null;
  filasComprobante: FilaVoucher[];
  subtotalOrden: number;
  montoImpuestoOrden: number;
  costoEnvio: number;
  costoDiseno?: number | string;
  totalConEnvio: number;
  montoAnticipo: number;
  montoSaldo: number;
  metodoPago: MetodoPago | null;
  qrImagenSrc?: string | null;
  comprobanteArchivo: File | null;
  pedidoConfirmadoEfectivo: boolean;
  verificado?: boolean; // Trazabilidad para la auditoría de pago
  direccionLocal?: string | null;
  notasLegales?: string[] | null;
  fileInputRef: RefObject<HTMLInputElement>;
  onSeleccionarComprobante: () => void;
  onComprobanteChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onConfirmarEfectivo: () => void;
  onCambiarOpciones: () => void;
}


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



[
  {
    "tabla": "clientes",
    "columna": "id",
    "tipo_dato": "uuid",
    "es_pk": "SI",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "clientes",
    "columna": "telefono",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "clientes",
    "columna": "direccion",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "clientes",
    "columna": "notas",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "clientes",
    "columna": "created_at",
    "tipo_dato": "timestamp with time zone",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "clientes",
    "columna": "updated_at",
    "tipo_dato": "timestamp with time zone",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "clientes",
    "columna": "nombre",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "clientes",
    "columna": "empresa_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "empresas",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "clientes",
    "columna": "user_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "profiles",
    "referencia_columna_fk": "id"
  }
]

si tengo estos codigos y estos datos completos quiero que me des las modificacioens necesarias que tengo que ahcer para que cuando me selecione envio_domicilio quiero que debajo me aparezacan debajo de mi boton de secionar envio_tipo los campos para llenar la direccion que me escriba su direccion y tambien me salga la un boton que diga: registrar ubicacion actual o algo asi y quiero que si presiona esa boton me tome la ubicacion real del cliente para tomar las coordenadas y con esas coordenadas guardar su ubicacion exacta con url en im base de datos en mi direccion_url o algo asi para que pueda usar esa url de coordenadas en google maps para envio a domicilio mas preciso y profesional dame mi codigo con esas mejoras profesionales