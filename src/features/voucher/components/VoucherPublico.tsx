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

  // Validación estricta para envío a domicilio
  const domicilioValido =
    flujo.tipoEntrega === "domicilio"
      ? Boolean(flujo.direccionDomicilio?.trim()) && Boolean(flujo.ubicacionUrl)
      : true;

  // La selección de opciones solo está lista si eligió entrega, método de pago y completó los datos requeridos
  const seleccionCompleta =
    flujo.seleccionCompleta && domicilioValido;

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
              visible={flujo.pedidoAceptado && !seleccionCompleta}
              tipoEntrega={flujo.tipoEntrega}
              metodoPago={flujo.metodoPago}
              onSeleccionarEntrega={flujo.handleSeleccionarEntrega}
              onSeleccionarPago={flujo.handleSeleccionarPago}
              direccionDomicilio={flujo.direccionDomicilio}
              onGuardarDireccion={flujo.handleGuardarDireccion}
              ubicacionUrl={flujo.ubicacionUrl}
              obteniendoUbicacion={flujo.obteniendoUbicacion}
              errorUbicacion={flujo.errorUbicacion}
              onUsarUbicacionActual={flujo.handleUsarUbicacionActual}
            />

            {seleccionCompleta && (
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