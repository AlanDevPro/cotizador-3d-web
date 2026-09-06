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
      // Verde oficial de WhatsApp (#25D366)
      styleClass:
        "text-[#25D366] bg-[#25D366]/10 border-[#25D366]/20 hover:bg-[#25D366] hover:text-white hover:border-[#25D366]",
    },
    {
      id: "instagram",
      label: "Instagram",
      url: construirUrlRedSocial("instagram", instagramUrl),
      Icon: InstagramIcon,
      // Rosa/Magenta oficial de Instagram (#E4405F)
      styleClass:
        "text-[#E4405F] bg-[#E4405F]/10 border-[#E4405F]/20 hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F]",
    },
    {
      id: "facebook",
      label: "Facebook",
      url: construirUrlRedSocial("facebook", facebookUrl),
      Icon: FacebookIcon,
      // Azul oficial de Facebook (#1877F2)
      styleClass:
        "text-[#1877F2] bg-[#1877F2]/10 border-[#1877F2]/20 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]",
    },
    {
      id: "tiktok",
      label: "TikTok",
      url: construirUrlRedSocial("tiktok", tiktokUrl),
      Icon: TikTokIcon,
      // Negro/Oscuro oficial de TikTok (#000000)
      styleClass:
        "text-slate-900 bg-slate-100 border-slate-200 hover:bg-black hover:text-white hover:border-black",
    },
  ].flatMap((item) =>
    item.url
      ? [
          item as {
            id: string;
            label: string;
            url: string;
            Icon: React.ComponentType<{ className?: string }>;
            styleClass: string;
          },
        ]
      : []
  );

  if (redes.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-2 sm:justify-end">
      {redes.map(({ id, url, label, Icon, styleClass }) => (
        <a
          key={id}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className={`flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition-all duration-200 hover:scale-105 ${styleClass}`}
        >
          <Icon className="h-4.5 w-4.5" />
        </a>
      ))}
    </div>
  );
}