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
// Creación
// ==========================================

export async function crearPedidoPendienteService(dto: CrearPedidoDesdeCotizacionDTO) {
  const { data: pedido, error: errorPedido } = await supabase
    .from("pedidos")
    .insert({
      cotizacion_id: dto.cotizacionId,
      empresa_id: dto.empresaId,
      cliente_id: dto.clienteId ?? null,
      creado_por: dto.creadoPor ?? null,
      pieza_descripcion: dto.piezaDescripcion,
      estado: "pendiente",
      pago_total: dto.pagoTotal,
      pago_anticipo_pct: dto.pagoAnticipoPct ?? 50,
      pago_monto_cobrado: 0,
      pago_estado: "sin_pagar",
    })
    .select()
    .single();

  if (errorPedido) {
    throw new Error(`No se pudo registrar el pedido: ${errorPedido.message}`);
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

  const { error: errorCotizacion } = await supabase
    .from("cotizaciones")
    .update({ estado: "aceptada" })
    .eq("id", dto.cotizacionId);
  if (errorCotizacion) console.warn("⚠️ No se pudo actualizar estado de cotización:", errorCotizacion);

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
// Registrar pago (anticipo) — Se registra con monto esperado y verificado = false
// ==========================================

export async function registrarPagoPedidoService(pedidoId: string, dto: RegistrarPagoPedidoDTO) {
  const montoARegistrar = dto.montoEsperado ?? 0;

  const { data: pago, error } = await supabase
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

  if (error) {
    throw new Error(`No se pudo registrar el pago: ${error.message}`);
  }

  const detalleEsperado = montoARegistrar > 0
    ? ` Monto declarado: ${montoARegistrar.toFixed(2)} Bs (pendiente de verificación por el administrador).`
    : "";

  await supabase.from("pedido_eventos").insert({
    pedido_id: pedidoId,
    texto: `Anticipo registrado vía ${dto.metodo}.${detalleEsperado}`,
  });

  await actualizarEstadoPagoPedidoService(pedidoId);

  return pago;
}

// ==========================================
// Anular último pago
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

  // Sumar unicamente montos que hayan sido verificados
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
  const path = `comprobantes-pago/${pedidoId}/comprobante-${Date.now()}.${extension}`;

  const { error: errorUpload } = await supabase.storage
    .from("empresa-assets")
    .upload(path, file, { upsert: true });

  if (errorUpload) throw new Error(`No se pudo subir el comprobante: ${errorUpload.message}`);

  const { data } = supabase.storage.from("empresa-assets").getPublicUrl(path);
  return data.publicUrl;
}