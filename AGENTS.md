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
    .select(
      "id, estado, envio_tipo, envio_costo, envio_direccion, envio_ubicacion_url, pago_total, pago_monto_cobrado, pago_estado"
    )
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
// Actualizar opciones de entrega y ubicación
// ==========================================

export async function actualizarOpcionesPedidoService(
  pedidoId: string,
  dto: ActualizarOpcionesPedidoDTO
) {
  const updatePayload: Record<string, unknown> = {};
  if (dto.envioTipo !== undefined) updatePayload.envio_tipo = dto.envioTipo;
  if (dto.envioCosto !== undefined) updatePayload.envio_costo = dto.envioCosto;
  if (dto.pagoTotal !== undefined) updatePayload.pago_total = dto.pagoTotal;
  if (dto.envioDireccion !== undefined) updatePayload.envio_direccion = dto.envioDireccion;
  if (dto.envioUbicacionUrl !== undefined) updatePayload.envio_ubicacion_url = dto.envioUbicacionUrl;

  if (Object.keys(updatePayload).length === 0) return null;

  const { data: dataArray, error } = await supabase
    .from("pedidos")
    .update(updatePayload)
    .eq("id", pedidoId)
    .select(
      "id, estado, envio_tipo, envio_costo, envio_direccion, envio_ubicacion_url, pago_total"
    );

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

  // 2. Si ya fue verificado por el administrador, el pedido queda cerrado
  if (pagoExistente?.verificado) {
    throw new Error(
      "Este pedido ya tiene un pago verificado y no puede modificarse desde aquí."
    );
  }

  let pago;
  const esActualizacion = Boolean(pagoExistente);

  if (pagoExistente) {
    // 3a. Ya existe -> actualizar la misma fila
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



// src/features/voucher/components/ticket/TicketComprobante.tsx

import { Ticket } from "lucide-react";
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
            onCambiarOpciones={props.onCambiarOpciones}
          />
        )}
      </div>
    </div>
  );
}



// src/features/voucher/components/ticket/TicketAcciones.tsx

import { CheckCircle2, RefreshCw, Upload } from "lucide-react";
import type { MetodoPago } from "../../types/voucher.types";

interface TicketAccionesProps {
  metodoPago: MetodoPago | null;
  comprobanteArchivo: File | null;
  pedidoConfirmadoEfectivo: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onComprobanteChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSeleccionarComprobante: () => void;
  onConfirmarEfectivo: () => void;
  onCambiarOpciones?: () => void;
}

export function TicketAcciones({
  metodoPago,
  comprobanteArchivo,
  pedidoConfirmadoEfectivo,
  fileInputRef,
  onComprobanteChange,
  onSeleccionarComprobante,
  onConfirmarEfectivo,
  onCambiarOpciones,
}: TicketAccionesProps) {
  // El usuario ya ejecutó la acción si subió el comprobante (QR) o confirmó el pedido (Efectivo)
  const accionRealizada =
    (metodoPago === "qr" && Boolean(comprobanteArchivo)) ||
    (metodoPago === "efectivo" && pedidoConfirmadoEfectivo);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onComprobanteChange}
      />

      <div className="flex items-center justify-between gap-3 pt-2">
        {/* LADO IZQUIERDO: Botón para cambiar opciones si aún NO se ha confirmado ni subido comprobante */}
        {!accionRealizada && onCambiarOpciones ? (
          <button
            type="button"
            onClick={onCambiarOpciones}
            className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 active:scale-98"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
            <span>Cambiar opciones</span>
          </button>
        ) : (
          <div />
        )}

        {/* LADO DERECHO: Botón de acción principal (Subir / Reemplazar Comprobante o Confirmar Efectivo) */}
        <div className="flex items-center gap-3">
          {metodoPago === "qr" && (
            <button
              type="button"
              onClick={onSeleccionarComprobante}
              className="flex h-11 w-52 items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[var(--brand-dark)] active:scale-98"
            >
              {comprobanteArchivo ? (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Reemplazar
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Subir comprobante
                </>
              )}
            </button>
          )}

          {metodoPago === "efectivo" && !pedidoConfirmadoEfectivo && (
            <button
              type="button"
              onClick={onConfirmarEfectivo}
              className="flex h-11 w-52 items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[var(--brand-dark)] active:scale-98"
            >
              <CheckCircle2 className="h-4 w-4" />
              Confirmar pedido
            </button>
          )}
        </div>
      </div>
    </>
  );
}


si tengo estos codigos quiero que me des mi codigso completos con las modificaicones para que cunado presiono mi boton de confirmar pedido o mi subir comprobante o reemplazar quiero que tambien se me actualice mi pedido que mi: pago_estado cambie de "sin_pagar" pase a "anticipo" y que tambien se me marque mi "pago_monto_cobrado" que seria el monto del anticipo que se esta cobrando dame mi codigo con esta mejoras profesinales 