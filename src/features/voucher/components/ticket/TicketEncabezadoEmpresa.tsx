// src/features/voucher/components/ticket/TicketEncabezadoEmpresa.tsx

import { Building2 } from "lucide-react";
import type { EmpresaInfo, VoucherData } from "../../types/voucher.types";

interface TicketEncabezadoEmpresaProps {
  empresaNombre: string;
  empresa?: EmpresaInfo;
  voucherData?: VoucherData;
}

export function TicketEncabezadoEmpresa({
  empresaNombre,
  empresa,
  voucherData,
}: TicketEncabezadoEmpresaProps) {
  // Convertimos explícitamente el valor a string o undefined para que 'img' no reciba null
  const logoSrc = (empresa?.logo_url || voucherData?.logoUri) ?? undefined;

  return (
    <>
      <div className="flex flex-col items-center gap-2 px-6 pb-4 pt-5 text-center">
        {logoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoSrc}
            alt={empresaNombre}
            className="h-12 w-12 rounded-lg p-1"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--dark-bg)]">
            <Building2 className="h-6 w-6 text-white" />
          </div>
        )}
        <p className="text-sm font-black uppercase tracking-wide text-slate-900">
          {empresaNombre}
        </p>
        {empresa?.nit && (
          <p className="text-[11px] font-medium text-slate-500">
            NIT / Reg. Comercial: {empresa.nit}
          </p>
        )}
        {(empresa?.direccion || empresa?.telefono) && (
          <p className="text-[11px] text-slate-500">
            {[empresa?.direccion, empresa?.telefono]
              .filter(Boolean)
              .join("  ·  ")}
          </p>
        )}
      </div>

      <div className="bg-[var(--brand)] py-1.5 text-center">
        <p className="flex items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-white">
          Comprobante de Pedido
        </p>
      </div>
    </>
  );
}