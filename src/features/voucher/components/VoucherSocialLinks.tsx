import React from "react";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";
import { TikTokIcon } from "./icons/TikTokIcon";
import { InstagramIcon } from "./icons/InstagramIcon";
import { FacebookIcon } from "./icons/FacebookIcon";
import { construirUrlRedSocial } from "../utils/socialUtils";

interface VoucherSocialLinksProps {
  whatsappUrl?: string | null;
  tiktokUrl?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
}

export function VoucherSocialLinks({
  whatsappUrl,
  tiktokUrl,
  instagramUrl,
  facebookUrl,
}: VoucherSocialLinksProps) {
  const redes = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      url: construirUrlRedSocial("whatsapp", whatsappUrl),
      Icon: WhatsAppIcon,
      filledBg: "bg-[#128c7e]",
      tooltipBg: "bg-[#128c7e]",
    },
    {
      id: "instagram",
      label: "Instagram",
      url: construirUrlRedSocial("instagram", instagramUrl),
      Icon: InstagramIcon,
      filledBg: "bg-gradient-to-tr from-[#405de6] via-[#b33ab4] to-[#fd1f1f]",
      tooltipBg: "bg-[#c135b4]",
    },
    {
      id: "facebook",
      label: "Facebook",
      url: construirUrlRedSocial("facebook", facebookUrl),
      Icon: FacebookIcon,
      filledBg: "bg-[#1877F2]",
      tooltipBg: "bg-[#1877F2]",
    },
    {
      id: "tiktok",
      label: "TikTok",
      url: construirUrlRedSocial("tiktok", tiktokUrl),
      Icon: TikTokIcon,
      filledBg: "bg-black",
      tooltipBg: "bg-black",
    },
  ].flatMap((item) =>
    item.url
      ? [
          item as {
            id: string;
            label: string;
            url: string;
            Icon: React.ComponentType<{ className?: string }>;
            filledBg: string;
            tooltipBg: string;
          },
        ]
      : []
  );

  if (redes.length === 0) return null;

  return (
    <ul className="flex items-center justify-center gap-3 sm:justify-end">
      {redes.map(({ id, url, label, Icon, filledBg, tooltipBg }) => (
        <li key={id} className="group relative list-none">
          {/* Tooltip animado */}
          <div
            className={`pointer-events-none absolute left-1/2 top-[-30px] z-20 -translate-x-1/2 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold text-white shadow-md opacity-0 transition-all duration-300 ease-in-out group-hover:top-[-45px] group-hover:opacity-100 ${tooltipBg}`}
          >
            {label}
          </div>

          {/* Botón con efecto filled */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 ease-in-out hover:border-transparent hover:text-white hover:shadow-lg"
          >
            {/* Div de fondo animado */}
            <div
              className={`absolute bottom-0 left-0 h-0 w-full transition-all duration-300 ease-in-out group-hover:h-full ${filledBg}`}
            />

            {/* Ícono dinámico */}
            <Icon className="relative z-10 h-5 w-5 transition-colors duration-300" />
          </a>
        </li>
      ))}
    </ul>
  );
}