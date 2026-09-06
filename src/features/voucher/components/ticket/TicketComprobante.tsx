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
}