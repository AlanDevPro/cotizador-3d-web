export interface SocialNetworkConfig {
  id: string;
  label: string;
  url: string;
}

export type TipoRedSocial = "whatsapp" | "tiktok" | "instagram" | "facebook" | "web";

/**
 * Convierte entradas heterogéneas (teléfonos, usernames, URLs relativas) 
 * en URLs absolutas válidas para cada plataforma.
 */
export function construirUrlRedSocial(
  tipo: TipoRedSocial,
  rawValue?: string | null
): string | null {
  if (!rawValue || typeof rawValue !== "string") return null;
  const val = rawValue.trim();
  if (!val) return null;

  // Si ya contiene protocolo, retornar directa
  if (val.startsWith("http://") || val.startsWith("https://")) {
    return val;
  }

  switch (tipo) {
    case "whatsapp": {
      const limpio = val.replace(/\D/g, "");
      return limpio ? `https://wa.me/${limpio}` : null;
    }
    case "tiktok": {
      const user = val.startsWith("@") ? val : `@${val}`;
      return `https://www.tiktok.com/${user}`;
    }
    case "instagram": {
      const user = val.replace(/^@/, "");
      return `https://www.instagram.com/${user}`;
    }
    case "facebook": {
      // Soporta nombres de usuario o IDs de páginas
      const page = val.replace(/^\//, "");
      return `https://www.facebook.com/${page}`;
    }
    case "web":
      return `https://${val}`;
    default:
      return null;
  }
}