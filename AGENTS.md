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
,



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


si tengo este codigo y dime como hago para que pueda refresscarse automaticamente mi pagina web cuando cuando mi cliente ya selcione mi metodo y de pago y tipo_envio y ya confirmo o subio su comprobantes dime como hago eso que modificacaciones tengo que hacer en que archivos o como hago para que mi web se refresque automaticamente de forma profesional desde pues de mi cliente confirmo el pedido o subio su comprobante  