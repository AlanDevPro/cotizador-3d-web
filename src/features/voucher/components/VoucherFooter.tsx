import React from "react";
import { DEFAULT_FOOTER } from "../constants/voucherConstants";
import { VoucherSocialLinks } from "./VoucherSocialLinks";
import { construirUrlRedSocial } from "../utils/socialUtils";

interface VoucherFooterProps {
  footerNote?: string | null;
  sitioWeb?: string | null;
  whatsappUrl?: string | null;
  tiktokUrl?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
}

export function VoucherFooter({
  footerNote,
  sitioWeb,
  whatsappUrl,
  tiktokUrl,
  instagramUrl,
  facebookUrl,
}: VoucherFooterProps) {
  const urlWebAbsoluta = construirUrlRedSocial("web", sitioWeb);

  return (
    <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Nota al pie y sitio web */}
      <div className="space-y-1 text-center text-xs text-slate-400 sm:text-left">
        <p>{footerNote || DEFAULT_FOOTER}</p>
        {urlWebAbsoluta && (
          <a
            href={urlWebAbsoluta}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--brand)] hover:underline"
          >
            {sitioWeb}
          </a>
        )}
      </div>

      {/* Redes sociales animadas */}
      <VoucherSocialLinks
        whatsappUrl={whatsappUrl}
        tiktokUrl={tiktokUrl}
        instagramUrl={instagramUrl}
        facebookUrl={facebookUrl}
      />
    </div>
  );
}