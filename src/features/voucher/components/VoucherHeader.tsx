import { Building2, Calendar, Palette } from "lucide-react";
import type { EmpresaInfo, Tema, VoucherData } from "../types/voucher.types";
import { formatFecha } from "../utils/voucherFormatters";
import {
  DEFAULT_TAGLINE,
  DEFAULT_TITULO,
  DEFAULT_VALIDEZ,
} from "../constants/voucherConstants";

interface VoucherHeaderProps {
  empresaNombre: string;
  empresa?: EmpresaInfo;
  voucherData?: VoucherData;
  creadoEn: string;
  tema: Tema;
  onAlternarTema: () => void;
}

export function VoucherHeader({
  empresaNombre,
  empresa,
  voucherData,
  creadoEn,
  tema,
  onAlternarTema,
}: VoucherHeaderProps) {
  // Garantiza extraer la URL de la imagen si viene en alguna de las dos fuentes
  const logoUrl = empresa?.logo_url || voucherData?.logoUri;

  // Determinar título a mostrar
  const tituloMostrado = voucherData?.documentTitle?.trim() || DEFAULT_TITULO;

  return (
    <div className="flex items-start justify-between gap-4">
      {/* Información del documento */}
      <div className="flex-1">
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--brand)]">
          <Building2 className="h-3.5 w-3.5" />
          {empresaNombre} · Impresión 3D
        </p>

        <h1 className="mt-1 text-2xl font-black uppercase tracking-tight text-slate-900 sm:text-3xl">
          {tituloMostrado}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {voucherData?.companyTagline || DEFAULT_TAGLINE}
        </p>

        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
          <Calendar className="h-3.5 w-3.5" />
          Fecha de emisión: {formatFecha(creadoEn)}
        </p>

        <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-[var(--brand)]">
          <span>★</span>
          {voucherData?.validityLabel || DEFAULT_VALIDEZ}
        </p>
      </div>

      {/* Logo y selector de tema */}
      <div className="flex flex-shrink-0 flex-col items-center gap-2">
        {logoUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={logoUrl}
            alt={`Logo de ${empresaNombre}`}
            className="h-20 w-auto max-w-[120px] rounded-xl object-contain p-1 shadow-xs"
          />
        )}

        <button
          type="button"
          onClick={onAlternarTema}
          title="Cambiar tema de color"
          aria-label="Cambiar tema de color"
          className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600 shadow-xs transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
        >
          <Palette className="h-3.5 w-3.5" />
          <span>{tema === "rosa" ? "Morado" : "Rosa"}</span>
        </button>
      </div>
    </div>
  );
}