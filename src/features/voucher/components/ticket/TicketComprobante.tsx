import { Ticket } from "lucide-react";
import type { TicketComprobanteProps } from "../../types/voucher.types";
import type { TipoMontoPago } from "../VoucherSeleccionOpciones";
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

interface TicketComprobanteExtraProps {
  /** Monto elegido por el cliente cuando el método es QR ("anticipo" 50% o "total" 100%) */
  tipoMontoPago?: TipoMontoPago | null;
}

export function TicketComprobante(props: TicketComprobanteProps & TicketComprobanteExtraProps) {
  const fechaObj =
    typeof props.fechaEmision === "string"
      ? new Date(props.fechaEmision)
      : props.fechaEmision ?? new Date();

  const nombreEmpresaSeguro = props.empresaNombre ?? props.empresa?.nombre ?? "EMPRESA";
  const pagoVerificado = Boolean(props.verificado);

  const numPiezas = Number(props.subtotalOrden) || 0;
  const numEnvio = Number(props.costoEnvio) || 0;
  const numDiseno = Number(props.costoDiseno) || 0;
  const totalCalculado = numPiezas + numEnvio + numDiseno;

  // El pago en efectivo siempre es anticipo 50%. Con QR el cliente eligió 50% o 100%.
  const esPagoTotalQR = props.metodoPago === "qr" && props.tipoMontoPago === "total";
  const porcentajeAnticipo = esPagoTotalQR ? 100 : 50;
  const anticipoCalculado = (totalCalculado * porcentajeAnticipo) / 100;
  const saldoCalculado = totalCalculado - anticipoCalculado;
  const mostrarDesglose = !esPagoTotalQR;

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
            mostrarDesglose={mostrarDesglose}
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
            montoAnticipo={totalCalculado * 0.5}
            empresaNombre={nombreEmpresaSeguro}
            direccionLocal={props.direccionLocal ?? ""}
          />

          <TicketNotasLegales notas={props.notasLegales ?? []} />
          <TicketCodigoBarras codigoPedido={props.codigoPedido ?? "S/N"} />
        </div>

        {!pagoVerificado && (
          <TicketAcciones
            metodoPago={props.metodoPago}
            tipoMontoPago={props.tipoMontoPago}
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