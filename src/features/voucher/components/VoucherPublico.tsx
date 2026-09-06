"use client";

import { useMemo } from "react";
import type { VoucherPublicoProps } from "../types/voucher.types";
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
  onSubirComprobante,
  onConfirmarPedidoEfectivo,
  whatsappUrl,
  tiktokUrl,
}: VoucherPublicoProps) {
  const flujo = useVoucherFlujo({
    onAceptarPedido,
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
    qrPagoUri,
    fechaEmision: flujo.fechaEmision,
  });

  // Mapeo unificado garantizando la extracción de filamento (material, color, colorHex)
  const filasMapeadas = useMemo(() => {
    return mapearPiezasAFilasVoucher(cotizacion.piezas ?? []);
  }, [cotizacion.piezas]);

  const estiloTema = (TEMAS[flujo.tema] ?? TEMAS.rosa) as React.CSSProperties;

  // Determinar la pieza seleccionada para la Hero Card según el tab activo
  const piezaSeleccionadaId =
    flujo.tabActivo !== "todas" ? flujo.tabActivo : null;

  return (
    <div
      className="min-h-screen bg-slate-50 px-4 py-8 antialiased text-slate-800"
      style={estiloTema}
    >
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <VoucherHeader
          empresaNombre={datos.empresaNombre}
          empresa={datos.empresa ?? undefined}
          voucherData={datos.voucherData ?? undefined}
          creadoEn={cotizacion.creado_en}
          tema={flujo.tema}
          onAlternarTema={flujo.alternarTema}
        />

        <div className="mt-4 h-1 w-full rounded-full bg-[var(--brand)]" />

        <VoucherTabsPiezas
          tabs={datos.tabs}
          tabActivo={flujo.tabActivo}
          onCambiarTab={flujo.setTabActivo}
          visible={(cotizacion.piezas?.length ?? 0) > 1}
        />

        {/* Invocación adaptada al nuevo contrato de props de VoucherHeroCard */}
        <VoucherHeroCard
          cotizacion={cotizacion}
          piezaSeleccionadaId={piezaSeleccionadaId}
        />

        <VoucherTablaResumen
          filas={datos.filasVista ?? filasMapeadas}
          costoDisenoTotal={cotizacion.costo_diseno_total}
          subtotal={datos.subtotalVista}
          montoImpuesto={datos.montoImpuestoVista}
          total={datos.totalVista}
        />

        <VoucherPoliticas politicas={datos.politicas} />

        {!flujo.pedidoAceptado && (
          <VoucherAccionesIniciales
            onCancelar={onCancelarPedido}
            onAceptar={flujo.handleAceptarPedido}
          />
        )}

        {flujo.pedidoAceptado && (
          <div className="mt-6 space-y-4">
            <VoucherSeleccionOpciones
              visible={!flujo.seleccionCompleta}
              tipoEntrega={flujo.tipoEntrega}
              metodoPago={flujo.metodoPago}
              onSeleccionarEntrega={flujo.setTipoEntrega}
              onSeleccionarPago={flujo.setMetodoPago}
            />

            {flujo.seleccionCompleta && (
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
                totalConEnvio={datos.totalConEnvio}
                montoAnticipo={datos.montoAnticipo}
                montoSaldo={datos.montoSaldo}
                metodoPago={flujo.metodoPago}
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
            )}
          </div>
        )}

        <VoucherFooter
          footerNote={datos.voucherData?.footerNote}
          sitioWeb={datos.empresa?.sitio_web}
          whatsappUrl={whatsappUrl ?? datos.empresa?.telefono}
          tiktokUrl={tiktokUrl ?? datos.empresa?.tiktok_url}
          facebookUrl={datos.empresa?.razon_social}
          instagramUrl={datos.empresa?.instagram_url}
        />
      </div>
    </div>
  );
}