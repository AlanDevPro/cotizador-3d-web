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
,
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
},
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
  // Conversión segura de fecha si viene como string
  const fechaObj =
    typeof props.fechaEmision === "string"
      ? new Date(props.fechaEmision)
      : props.fechaEmision ?? new Date();

  // Nombre seguro de la empresa con fallback
  const nombreEmpresaSeguro = props.empresaNombre ?? props.empresa?.nombre ?? "EMPRESA";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
          <Ticket className="h-4 w-4 text-[var(--brand)]" />
          3. Tu comprobante de pedido
        </p>
        <button
          type="button"
          onClick={props.onCambiarOpciones}
          className="flex items-center gap-1 text-xs font-semibold text-[var(--brand)] hover:underline"
        >
          <RefreshCw className="h-3 w-3" />
          Cambiar opciones
        </button>
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
            subtotalOrden={props.subtotalOrden}
            montoImpuestoOrden={props.montoImpuestoOrden}
            costoEnvio={props.costoEnvio}
            totalConEnvio={props.totalConEnvio}
            montoAnticipo={props.montoAnticipo}
            montoSaldo={props.montoSaldo}
          />

          <TicketPagoQR
            visible={props.metodoPago === "qr"}
            qrImagenSrc={props.qrImagenSrc ?? ""}
            comprobanteArchivo={props.comprobanteArchivo}
          />

          <TicketPagoEfectivo
            visible={props.metodoPago === "efectivo"}
            pedidoConfirmadoEfectivo={props.pedidoConfirmadoEfectivo}
            montoAnticipo={props.montoAnticipo}
            empresaNombre={nombreEmpresaSeguro}
            direccionLocal={props.direccionLocal ?? ""}
          />

          <TicketNotasLegales notas={props.notasLegales ?? []} />
          <TicketCodigoBarras codigoPedido={props.codigoPedido ?? "S/N"} />
        </div>

        <TicketAcciones
          metodoPago={props.metodoPago}
          comprobanteArchivo={props.comprobanteArchivo}
          pedidoConfirmadoEfectivo={props.pedidoConfirmadoEfectivo}
          fileInputRef={props.fileInputRef}
          onComprobanteChange={props.onComprobanteChange}
          onSeleccionarComprobante={props.onSeleccionarComprobante}
          onConfirmarEfectivo={props.onConfirmarEfectivo}
        />
      </div>
    </div>
  );
},
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
}

export function TicketAcciones({
  metodoPago,
  comprobanteArchivo,
  pedidoConfirmadoEfectivo,
  fileInputRef,
  onComprobanteChange,
  onSeleccionarComprobante,
  onConfirmarEfectivo,
}: TicketAccionesProps) {
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={onComprobanteChange}
      />

      <div className="flex justify-end gap-3 pt-2">
        {metodoPago === "qr" && (
          <button
            type="button"
            onClick={onSeleccionarComprobante}
            className="flex h-11 w-52 items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[var(--brand-dark)]"
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
            className="flex h-11 w-52 items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[var(--brand-dark)]"
          >
            <CheckCircle2 className="h-4 w-4" />
            Confirmar pedido
          </button>
        )}
      </div>
    </>
  );
}
si tengo ese codigos quiero que fuera de mi comprobanteticket me agregues otro componente  para mostrarme la ubicacion del local usando google map  si es que mi cliente seleciona mi metodo de pago de efectivo pero que este cuadro solo me aparezca cuando presiono el boton de Confirmar pedido  luego quiero que que siempre este oculto dame mi codigo de mi nuevo componente para mostrar mi ubicacion de google map de mi local 
