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