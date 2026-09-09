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



//src/features/voucher/services/getCotizacionPorToken.ts
import { createClient } from "@supabase/supabase-js";
import type {
  CotizacionPublica,
  PiezaDetalle,
  EmpresaInfo,
  VoucherData,
  FilamentoInfo,
} from "../types/voucher.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface DBFilamento {
  id: string;
  material: string;
  color: string;
  color_hex?: string | null;
  marca?: string | null;
}

interface DBCotizacionItem {
  id: string;
  nombre_pieza: string | null;
  cantidad: number | null;
  peso_gramos: number | null;
  tiempo_impresion_horas: number | null;
  tiempo_preparacion_minutos: number | null;
  tiempo_postprocesado_minutos: number | null;
  costo_material: number | null;
  costo_energia: number | null;
  costo_amortizacion: number | null;
  costo_mantenimiento: number | null;
  costo_mano_obra: number | null;
  costo_subtotal_item: number | null;
  filamento_id?: string | null;
  filamentos: DBFilamento | DBFilamento[] | null;
}

interface DBEmpresa {
  id: string;
  nombre_comercial?: string | null;
  razon_social?: string | null;
  logo_url?: string | null;
  garantia?: string | null;
  sitio_web?: string | null;
  nit?: string | null;
  whatsapp?: string | null;
  direccion_fiscal?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  ciudad?: string | null;
  ubicacion_url?: string | null;
}

function mapearPiezaItem(
  item: DBCotizacionItem,
  costoDirectoTotal: number,
  costoFallosTotal: number,
  montoGananciaTotal: number,
  montoImpuestoTotal: number,
  imagenRespaldo: string | null
): PiezaDetalle {
  const cantidad = Number(item.cantidad) || 1;
  const subtotalDirecto = Number(item.costo_subtotal_item) || 0;

  const proporcionPct = costoDirectoTotal > 0 ? subtotalDirecto / costoDirectoTotal : 0;
  const costoFallosPieza = costoFallosTotal * proporcionPct;
  const montoGananciaPieza = montoGananciaTotal * proporcionPct;
  const costoBasePieza = subtotalDirecto + costoFallosPieza;
  const impuestoPieza = montoImpuestoTotal * proporcionPct;

  const precioTotalPieza =
    subtotalDirecto > 0
      ? costoBasePieza + montoGananciaPieza + impuestoPieza
      : subtotalDirecto;

  const rawFilamento = Array.isArray(item.filamentos)
    ? item.filamentos[0]
    : item.filamentos;

  const filamento: FilamentoInfo | null =
    rawFilamento && rawFilamento.material
      ? {
          id: rawFilamento.id,
          material: rawFilamento.material,
          color: rawFilamento.color,
          color_hex: rawFilamento.color_hex || null,
          marca: rawFilamento.marca || null,
        }
      : null;

  return {
    id: item.id,
    nombre_pieza: item.nombre_pieza || "Pieza sin nombre",
    cantidad,
    precio_total_pieza: precioTotalPieza,
    imagen_url: imagenRespaldo,
    peso_gramos: item.peso_gramos ? Number(item.peso_gramos) : null,
    tiempo_impresion_horas: item.tiempo_impresion_horas ? Number(item.tiempo_impresion_horas) : null,
    tiempo_preparacion_minutos: item.tiempo_preparacion_minutos ? Number(item.tiempo_preparacion_minutos) : null,
    tiempo_postprocesado_minutos: item.tiempo_postprocesado_minutos ? Number(item.tiempo_postprocesado_minutos) : null,
    filamento_id: item.filamento_id || filamento?.id || null,
    filamento,
    costo_material: Number(item.costo_material) || 0,
    costo_mano_obra: Number(item.costo_mano_obra) || 0,
    costo_depreciacion: Number(item.costo_amortizacion) || 0,
    costo_energia: Number(item.costo_energia) || 0,
    costo_mantenimiento: Number(item.costo_mantenimiento) || 0,
    subtotal_directo: subtotalDirecto,
    proporcion_pct: proporcionPct * 100,
    costo_fallos_pieza: costoFallosPieza,
    costo_base_pieza: costoBasePieza,
    monto_ganancia_pieza: montoGananciaPieza,
  };
}

export async function getCotizacionPorToken(token: string): Promise<CotizacionPublica | null> {
  try {
    const { data, error } = await supabase
      .from("cotizaciones")
      .select(`
        id,
        created_at,
        codigo_cotizacion,
        cliente_nombre,
        cliente_contacto,
        costo_directo_total,
        costo_indirecto_total,
        costo_fallos_total,
        costo_diseno_total,
        subtotal_costo_base,
        monto_ganancia,
        monto_impuesto,
        precio_final,
        margen_ganancia_aplicado_pct,
        estado,
        notas,
        imagen_referencia_url,
        voucher_data,
        empresa:empresas (
          id,
          nombre_comercial,
          razon_social,
          logo_url,
          garantia,
          sitio_web,
          nit,
          whatsapp,
          direccion_fiscal,
          instagram,
          facebook,
          ciudad,
          ubicacion_url
        ),
        cotizacion_items (
          id,
          nombre_pieza,
          cantidad,
          peso_gramos,
          tiempo_impresion_horas,
          tiempo_preparacion_minutos,
          tiempo_postprocesado_minutos,
          costo_material,
          costo_energia,
          costo_amortizacion,
          costo_mantenimiento,
          costo_mano_obra,
          costo_subtotal_item,
          filamento_id,
          filamentos (
            id,
            material,
            color,
            color_hex,
            marca
          )
        )
      `)
      .eq("token_publico", token)
      .single();

    if (error || !data) {
      console.error("[Voucher Service] Error al consultar la cotización:", error);
      return null;
    }

    const voucherDataObj = (data.voucher_data as VoucherData) || null;
    const imagenCotizacion = data.imagen_referencia_url || voucherDataObj?.productImageUri || null;

    const costoDirectoTotal = Number(data.costo_directo_total) || 0;
    const costoFallosTotal = Number(data.costo_fallos_total) || 0;
    const montoGananciaTotal = Number(data.monto_ganancia) || 0;
    const montoImpuestoTotal = Number(data.monto_impuesto) || 0;

    const rawItems = (data.cotizacion_items as unknown as DBCotizacionItem[]) || [];
    const piezasMapeadas = rawItems.map((item) =>
      mapearPiezaItem(
        item,
        costoDirectoTotal,
        costoFallosTotal,
        montoGananciaTotal,
        montoImpuestoTotal,
        imagenCotizacion
      )
    );

    const rawEmpresa = (Array.isArray(data.empresa) ? data.empresa[0] : data.empresa) as DBEmpresa | null;
    const empresaMapeada: EmpresaInfo | null = rawEmpresa
      ? {
          id: rawEmpresa.id,
          nombre: rawEmpresa.nombre_comercial || rawEmpresa.razon_social || "Empresa",
          nombre_comercial: rawEmpresa.nombre_comercial,
          razon_social: rawEmpresa.razon_social,
          logo_url: rawEmpresa.logo_url,
          garantia: rawEmpresa.garantia,
          sitio_web: rawEmpresa.sitio_web,
          nit: rawEmpresa.nit,
          telefono: rawEmpresa.whatsapp || null,
          whatsapp_url: rawEmpresa.whatsapp ? `https://wa.me/${rawEmpresa.whatsapp}` : null,
          direccion: rawEmpresa.direccion_fiscal || null,
          ciudad: rawEmpresa.ciudad || null,
          instagram_url: rawEmpresa.instagram || null,
          facebook_url: rawEmpresa.facebook || null,
          ubicacion_url: rawEmpresa.ubicacion_url || null,
        }
      : null;

    return {
      id: data.id,
      creado_en: data.created_at,
      codigo_cotizacion: data.codigo_cotizacion ? String(data.codigo_cotizacion) : null,
      precio_final: Number(data.precio_final) || 0,
      monto_impuesto: data.monto_impuesto ? Number(data.monto_impuesto) : null,
      costo_diseno_total: Number(data.costo_diseno_total) || 0,
      costo_directo_total: costoDirectoTotal,
      costo_indirecto_total: Number(data.costo_indirecto_total) || 0,
      costo_fallos_total: costoFallosTotal,
      subtotal_costo_base: Number(data.subtotal_costo_base) || 0,
      monto_ganancia: montoGananciaTotal,
      margen_ganancia_aplicado_pct: Number(data.margen_ganancia_aplicado_pct) || 0,
      cliente_nombre: data.cliente_nombre || null,
      cliente_contacto: data.cliente_contacto || null,
      estado: data.estado || null,
      notas: data.notas || null,
      imagen_referencia_url: imagenCotizacion,
      piezas: piezasMapeadas,
      empresa: empresaMapeada,
      voucher_data: voucherDataObj,
    };
  } catch (err) {
    console.error("[Voucher Service] Excepción no controlada:", err);
    return null;
  }
}

//src/features/voucher/components/VoucherPublico.tsx
"use client";

import { useMemo } from "react";
import type { VoucherPublicoProps, Tema } from "../types/voucher.types";
import { TEMAS } from "../constants/voucherConstants";
import { useVoucherFlujo } from "../hooks/useVoucherFlujo";
import { useVoucherCotizacion } from "../hooks/useVoucherCotizacion";
import { mapearPiezasAFilasVoucher } from "../utils/voucherFormatters";

import { VoucherHeader } from "./VoucherHeader";
import { VoucherTabsPiezas } from "./VoucherTabsPiezas";
import { VoucherHeroCard } from "./VoucherHeroCard";
import { VoucherTablaResumen } from "./VoucherTablaResumen";
import { VoucherPoliticas } from "./VoucherPoliticas";
import { VoucherAccionesIniciales } from "./VoucherAccionesIniciales";
import { VoucherSeleccionOpciones } from "./VoucherSeleccionOpciones";
import { TicketComprobante } from "./ticket/TicketComprobante";
import { VoucherUbicacionLocal } from "./VoucherUbicacionLocal";
import { VoucherFooter } from "./VoucherFooter";

export function VoucherPublico({
  cotizacion,
  onAceptarPedido,
  onCancelarPedido,
  clienteNombre,
  clienteDocumento,
  clienteTelefono,
  atendidoPor,
  numeroPedido,
  qrPagoUri,
  ubicacionLocal,
  ubicacionMapsUrl,
  onSubirComprobante,
  onConfirmarPedidoEfectivo,
  whatsappUrl,
  tiktokUrl,
  instagramUrl,
  facebookUrl,
}: VoucherPublicoProps) {
  const flujo = useVoucherFlujo({
    cotizacion,
    onAceptarPedidoSuccess: onAceptarPedido,
    onSubirComprobante,
    onConfirmarPedidoEfectivo,
  });

  const datos = useVoucherCotizacion({
    cotizacion,
    tabActivo: flujo.tabActivo,
    tipoEntrega: flujo.tipoEntrega,
    numeroPedido,
    clienteNombre,
    ubicacionLocal,
    ubicacionMapsUrl,
    qrPagoUri,
    fechaEmision: flujo.fechaEmision,
  });

  const filasMapeadas = useMemo(() => {
    return mapearPiezasAFilasVoucher(cotizacion.piezas ?? []);
  }, [cotizacion.piezas]);

  const temaClave = (flujo.tema as Tema) || "rosa";
  const estiloTema = (TEMAS[temaClave] ?? TEMAS.rosa) as React.CSSProperties;
  const piezaSeleccionadaId =
    flujo.tabActivo !== "general" ? flujo.tabActivo : null;

  // Una vez que el pago fue verificado por el admin, el pedido queda "cerrado"
  // para el cliente: ya no necesita ver dónde pagar/recoger, porque ya pagó.
  const mostrarUbicacionLocal =
    flujo.metodoPago === "efectivo" &&
    flujo.pedidoConfirmadoEfectivo &&
    !flujo.comprobanteVerificado;

  return (
    <div
      className="min-h-screen bg-slate-50 px-4 py-8 text-slate-800 antialiased"
      style={estiloTema}
    >
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {/* Cabecera del Voucher */}
        <VoucherHeader
          empresaNombre={datos.empresaNombre}
          empresa={datos.empresa ?? undefined}
          voucherData={datos.voucherData ?? undefined}
          creadoEn={cotizacion.creado_en}
          tema={temaClave}
          onAlternarTema={flujo.alternarTema}
        />

        <div className="mt-4 h-1 w-full rounded-full bg-[var(--brand)]" />

        {/* Pestañas de Piezas */}
        <VoucherTabsPiezas
          tabs={datos.tabs}
          tabActivo={flujo.tabActivo}
          onCambiarTab={flujo.setTabActivo}
          visible={(cotizacion.piezas?.length ?? 0) > 1}
        />

        {/* Tarjeta Destacada */}
        <VoucherHeroCard
          cotizacion={cotizacion}
          piezaSeleccionadaId={piezaSeleccionadaId}
        />

        {/* Tabla Desglose */}
        <VoucherTablaResumen
          filas={datos.filasVista ?? filasMapeadas}
          costoDisenoTotal={cotizacion.costo_diseno_total}
          subtotal={datos.subtotalVista}
          montoImpuesto={datos.montoImpuestoVista}
          total={datos.totalVista}
        />

        {/* Políticas y Garantía */}
        <VoucherPoliticas politicas={datos.politicas} />

        {/* Botones de Acción Inicial */}
        {!flujo.pedidoAceptado && (
          <VoucherAccionesIniciales
            onCancelar={onCancelarPedido}
            onAceptar={flujo.handleAceptarPedido}
            loading={flujo.isCreatingPedido}
          />
        )}

        {/* Flujo de Confirmación y Ticket */}
        {flujo.pedidoAceptado && (
          <div className="mt-6 space-y-4">
            <VoucherSeleccionOpciones
              visible={!flujo.seleccionCompleta}
              tipoEntrega={flujo.tipoEntrega}
              metodoPago={flujo.metodoPago}
              onSeleccionarEntrega={flujo.handleSeleccionarEntrega}
              onSeleccionarPago={flujo.handleSeleccionarPago}
            />

            {flujo.seleccionCompleta && (
              <>
                <TicketComprobante
                  empresa={datos.empresa ?? undefined}
                  empresaNombre={datos.empresaNombre}
                  voucherData={datos.voucherData ?? undefined}
                  codigoPedido={datos.codigoPedido}
                  fechaEmision={flujo.fechaEmision}
                  atendidoPor={atendidoPor}
                  nombreCliente={datos.nombreClienteMostrado}
                  clienteDocumento={clienteDocumento}
                  clienteTelefono={clienteTelefono}
                  tipoEntrega={flujo.tipoEntrega}
                  filasComprobante={datos.filasComprobante ?? filasMapeadas}
                  subtotalOrden={datos.subtotalOrden}
                  montoImpuestoOrden={datos.montoImpuestoOrden}
                  costoEnvio={datos.costoEnvio}
                  costoDiseno={cotizacion.costo_diseno_total}
                  totalConEnvio={datos.totalConEnvio}
                  montoAnticipo={datos.montoAnticipo}
                  montoSaldo={datos.montoSaldo}
                  metodoPago={flujo.metodoPago}
                  verificado={flujo.comprobanteVerificado}
                  qrImagenSrc={datos.qrImagenSrc}
                  comprobanteArchivo={flujo.comprobanteArchivo}
                  pedidoConfirmadoEfectivo={flujo.pedidoConfirmadoEfectivo}
                  direccionLocal={datos.direccionLocal}
                  notasLegales={datos.notasLegales}
                  fileInputRef={
                    flujo.fileInputRef as React.RefObject<HTMLInputElement>
                  }
                  onSeleccionarComprobante={flujo.handleSeleccionarComprobante}
                  onComprobanteChange={flujo.handleComprobanteChange}
                  onConfirmarEfectivo={flujo.handleConfirmarEfectivo}
                  onCambiarOpciones={flujo.handleCambiarOpciones}
                />

                {/* Punto de Pago y Recojo: solo mientras el pago en efectivo
                    sigue pendiente de verificación. Una vez verificado, se oculta. */}
                {mostrarUbicacionLocal && (
                  <VoucherUbicacionLocal
                    direccion={datos.direccionLocal}
                    ubicacionUrl={datos.direccionMapsUrl ?? undefined}
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* Pie de Página */}
        <VoucherFooter
          footerNote={datos.voucherData?.footerNote}
          sitioWeb={datos.empresa?.sitio_web}
          whatsappUrl={
            whatsappUrl ?? datos.empresa?.whatsapp_url ?? datos.empresa?.telefono
          }
          tiktokUrl={tiktokUrl ?? datos.empresa?.tiktok_url}
          facebookUrl={facebookUrl ?? datos.empresa?.facebook_url}
          instagramUrl={instagramUrl ?? datos.empresa?.instagram_url}
        />
      </div>
    </div>
  );
}





// src/features/voucher/components/ticket/TicketComprobante.tsx

import { RefreshCw, Ticket } from "lucide-react";
import type { TicketComprobanteProps } from "../../types/voucher.types";
import { TicketEncabezadoEmpresa } from "./TicketEncabezadoEmpresa";
import { TicketInfoPedido } from "./TicketInfoPedido";
import { TicketClienteEntrega } from "./TicketClienteEntrega";
import { TicketDetalleTrabajo } from "./TicketDetalleTrabajo";
import { TicketTotalesAnticipo } from "./TicketTotalesAnticipo";
import { TicketPagoQR } from "./TicketPagoQR";
import { TicketPagoEfectivo } from "./TicketPagoEfectivo";
import { TicketNotasLegales } from "./TicketNotasLegales";
import { TicketCodigoBarras } from "./TicketCodigoBarras";
import { TicketAcciones } from "./TicketAcciones";

export function TicketComprobante(props: TicketComprobanteProps) {
  const fechaObj =
    typeof props.fechaEmision === "string"
      ? new Date(props.fechaEmision)
      : props.fechaEmision ?? new Date();

  const nombreEmpresaSeguro = props.empresaNombre ?? props.empresa?.nombre ?? "EMPRESA";

  const pagoVerificado = Boolean(props.verificado);

  // Recálculo preventivo a nivel de comprobante para consistencia global
  const numPiezas = Number(props.subtotalOrden) || 0;
  const numEnvio = Number(props.costoEnvio) || 0;
  const numDiseno = Number(props.costoDiseno) || 0;
  const totalCalculado = numPiezas + numEnvio + numDiseno;
  
  const porcentajeAnticipo = Number(50);
  const anticipoCalculado = (totalCalculado * porcentajeAnticipo) / 100;
  const saldoCalculado = totalCalculado - anticipoCalculado;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
          <Ticket className="h-4 w-4 text-[var(--brand)]" />
          3. Tu comprobante de pedido
        </p>

        {!pagoVerificado && (
          <button
            type="button"
            onClick={props.onCambiarOpciones}
            className="flex items-center gap-1 text-xs font-semibold text-[var(--brand)] hover:underline"
          >
            <RefreshCw className="h-3 w-3" />
            Cambiar opciones
          </button>
        )}
      </div>

      <div className="relative mx-auto max-w-md space-y-4">
        <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200">
          <TicketEncabezadoEmpresa
            empresaNombre={nombreEmpresaSeguro}
            empresa={props.empresa ?? undefined}
            voucherData={props.voucherData ?? undefined}
          />

          <TicketInfoPedido
            codigoPedido={props.codigoPedido ?? "S/N"}
            fechaEmision={fechaObj}
            atendidoPor={props.atendidoPor}
          />

          <TicketClienteEntrega
            nombreCliente={props.nombreCliente ?? ""}
            clienteDocumento={props.clienteDocumento}
            clienteTelefono={props.clienteTelefono}
            tipoEntrega={props.tipoEntrega}
          />

          <TicketDetalleTrabajo filas={props.filasComprobante} />

          <TicketTotalesAnticipo
            metodoEnvio={props.tipoEntrega ?? undefined}
            costoEnvio={props.costoEnvio}
            costoDiseno={props.costoDiseno}
            subtotalOrden={props.subtotalOrden}
            montoAnticipo={anticipoCalculado}
            montoSaldo={saldoCalculado}
            porcentajeAnticipo={porcentajeAnticipo}
          />

          <TicketPagoQR
            visible={props.metodoPago === "qr"}
            qrImagenSrc={props.qrImagenSrc ?? ""}
            comprobanteArchivo={props.comprobanteArchivo}
            verificado={pagoVerificado}
          />

          <TicketPagoEfectivo
            visible={props.metodoPago === "efectivo"}
            pedidoConfirmadoEfectivo={props.pedidoConfirmadoEfectivo}
            verificado={pagoVerificado}
            montoAnticipo={anticipoCalculado}
            empresaNombre={nombreEmpresaSeguro}
            direccionLocal={props.direccionLocal ?? ""}
          />

          <TicketNotasLegales notas={props.notasLegales ?? []} />
          <TicketCodigoBarras codigoPedido={props.codigoPedido ?? "S/N"} />
        </div>

        {!pagoVerificado && (
          <TicketAcciones
            metodoPago={props.metodoPago}
            comprobanteArchivo={props.comprobanteArchivo}
            pedidoConfirmadoEfectivo={props.pedidoConfirmadoEfectivo}
            fileInputRef={props.fileInputRef}
            onComprobanteChange={props.onComprobanteChange}
            onSeleccionarComprobante={props.onSeleccionarComprobante}
            onConfirmarEfectivo={props.onConfirmarEfectivo}
          />
        )}
      </div>
    </div>
  );
}


import { CheckCircle2, Clock, QrCode } from "lucide-react";

interface TicketPagoQRProps {
  visible: boolean;
  qrImagenSrc: string;
  comprobanteArchivo: File | null;
  verificado: boolean;
}

export function TicketPagoQR({
  visible,
  qrImagenSrc,
  comprobanteArchivo,
  verificado,
}: TicketPagoQRProps) {
  if (!visible) return null;

  return (
    <div className="border-t border-dashed border-slate-200 px-5 py-4">
      <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
        <QrCode className="h-4 w-4 text-[var(--brand)]" />
        Pago con QR
      </p>

      {verificado ? (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-700">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="text-sm font-semibold">
            Pago ya confirmado con éxito. No necesitas hacer nada más.
          </p>
        </div>
      ) : !comprobanteArchivo ? (
        <div className="flex flex-col items-center gap-2">
          <img
            src={qrImagenSrc}
            alt="Código QR de pago"
            className="h-44 w-44 rounded-lg border border-slate-200"
          />
          <p className="text-center text-xs text-slate-500">
            Escanea el código, realiza el pago y sube tu comprobante.
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-amber-700">
          <Clock className="h-5 w-5 shrink-0 animate-pulse" />
          <p className="text-sm font-semibold">
            Comprobante subido correctamente. Espera mientras verificamos tu pago.
          </p>
        </div>
      )}
    </div>
  );
}


si tengo todos estos codigos explicame detalladamente por que no esta recupearando correctamente mi imgen_QR de mi configuracion empresa para que pueda usar esa imagen QR para que me realicen los pagos asi que dime que archivo stengo que modifiacar si tengo estos datos de mi base de datos: 
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
  },
  {
    "tabla": "configuracion_empresa",
    "columna": "empresa_id",
    "tipo_dato": "uuid",
    "es_pk": "SI",
    "referencia_tabla_fk": "empresas",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "configuracion_empresa",
    "columna": "costo_kwh",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "configuracion_empresa",
    "columna": "costo_mano_obra_hora",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "configuracion_empresa",
    "columna": "costo_operativo_fijo_mensual",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "configuracion_empresa",
    "columna": "horas_laborables_mes",
    "tipo_dato": "integer",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "configuracion_empresa",
    "columna": "tasa_fallo_defecto_pct",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "configuracion_empresa",
    "columna": "impuesto_pct",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "configuracion_empresa",
    "columna": "margen_ganancia_defecto_pct",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "configuracion_empresa",
    "columna": "moneda",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "configuracion_empresa",
    "columna": "qr_pago_url",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "configuracion_empresa",
    "columna": "qr_pago_titular",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "configuracion_empresa",
    "columna": "updated_at",
    "tipo_dato": "timestamp with time zone",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "id",
    "tipo_dato": "uuid",
    "es_pk": "SI",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "cotizacion_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "cotizaciones",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "impresora_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "impresoras",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "filamento_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "filamentos",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "nombre_pieza",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "cantidad",
    "tipo_dato": "integer",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "peso_gramos",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "tiempo_impresion_horas",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "tiempo_preparacion_minutos",
    "tipo_dato": "integer",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "tiempo_postprocesado_minutos",
    "tipo_dato": "integer",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "costo_material",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "costo_energia",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "costo_amortizacion",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "costo_mantenimiento",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "costo_mano_obra",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "costo_subtotal_item",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "created_at",
    "tipo_dato": "timestamp with time zone",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "id",
    "tipo_dato": "uuid",
    "es_pk": "SI",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "creado_por",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "profiles",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "cotizaciones",
    "columna": "creado_por",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "profiles",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "cotizaciones",
    "columna": "codigo_cotizacion",
    "tipo_dato": "integer",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "cliente_nombre",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "cliente_contacto",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "costo_directo_total",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "costo_indirecto_total",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "costo_fallos_total",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "subtotal_costo_base",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "monto_ganancia",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "monto_impuesto",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "precio_final",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "margen_ganancia_aplicado_pct",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "estado",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "notas",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "created_at",
    "tipo_dato": "timestamp with time zone",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "cliente_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "clientes",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "cotizaciones",
    "columna": "empresa_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "empresas",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "cotizaciones",
    "columna": "token_publico",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "voucher_data",
    "tipo_dato": "jsonb",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "imagen_referencia_url",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "costo_diseno_total",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresa_miembros",
    "columna": "id",
    "tipo_dato": "uuid",
    "es_pk": "SI",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresa_miembros",
    "columna": "empresa_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "empresas",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "empresa_miembros",
    "columna": "user_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "profiles",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "empresa_miembros",
    "columna": "rol",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresa_miembros",
    "columna": "estado",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresa_miembros",
    "columna": "created_at",
    "tipo_dato": "timestamp with time zone",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "id",
    "tipo_dato": "uuid",
    "es_pk": "SI",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "creado_por",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "logo_url",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "nombre_comercial",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "nit",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "razon_social",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "direccion_fiscal",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "ciudad",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "whatsapp",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "instagram",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "facebook",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "sitio_web",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "garantia",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "created_at",
    "tipo_dato": "timestamp with time zone",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "updated_at",
    "tipo_dato": "timestamp with time zone",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "es_singleton",
    "tipo_dato": "boolean",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "ubicacion_url",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  }
]


dame mis codigos en los que tengo que hacer las modificaciones para poder cargar correctamente mi imagen_QR de mi configuracion_empresa para los cobros QR 
