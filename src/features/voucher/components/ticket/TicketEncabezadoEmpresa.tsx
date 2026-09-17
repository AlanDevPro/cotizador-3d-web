// src/features/voucher/components/ticket/TicketEncabezadoEmpresa.tsx

import { Building2, MapPin, Phone, ShieldCheck } from "lucide-react";
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
  // Conversión explícita para evitar que 'src' reciba valores 'null'
  const logoSrc = (empresa?.logo_url || voucherData?.logoUri) ?? undefined;

  return (
    <>
      <div className="px-6 pb-2 pt-5">
        {/* Nivel 1: Fila Superior [NIT / Registro] <---> [Nombre + Logo] */}
        <div className="flex items-center justify-between gap-3">
          {/* Bloque Izquierdo: NIT / Registro Comercial */}
          <div className="flex items-center gap-1.5 text-left">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Reg. Comercial
              </span>
              <span className="font-mono text-[11px] font-bold text-slate-700">
                {empresa?.nit ? `NIT: ${empresa.nit}` : "S/N"}
              </span>
            </div>
          </div>

          {/* Bloque Derecho: Nombre de la Empresa + Logo */}
          <div className="flex items-center gap-2.5 text-right">
            <p className="text-xs font-black uppercase tracking-tight text-slate-900 sm:text-sm">
              {empresaNombre}
            </p>
            {logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoSrc}
                alt={empresaNombre}
                className="h-10 w-10 shrink-0 rounded-lg object-contain bg-slate-50 p-1 ring-1 ring-slate-200/60"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--dark-bg)] text-white shadow-2xs">
                <Building2 className="h-5 w-5" />
              </div>
            )}
          </div>
        </div>

        {/* Nivel 2: Fila Inferior Centrara [Ubicación] · [Teléfono] */}
        {(empresa?.direccion || empresa?.telefono) && (
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-x-16 gap-y-1 rounded-lg bg-slate-50 px-3 py-1.5 text-center text-[11px] font-medium text-slate-600 border border-slate-100">
            {empresa?.direccion && (
              <span className="flex items-center gap-1 truncate max-w-[200px]">
                <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                <span className="truncate">{empresa.direccion}</span>
              </span>
            )}

            {empresa?.direccion && empresa?.telefono && (
              <span className="text-slate-300 font-normal">·</span>
            )}

            {empresa?.telefono && (
              <span className="flex items-center gap-1 font-mono">
                <Phone className="h-3 w-3 shrink-0 text-slate-400" />
                <span>{empresa.telefono}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Línea Divisoria Estilo Ticket */}
      <div className="relative border-b-2 border-dashed border-slate-200 mx-6 my-2" />
    </>
  );
}