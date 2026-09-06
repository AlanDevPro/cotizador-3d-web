// src/app/v/[token]/page.tsx
import { notFound } from "next/navigation";
import { getCotizacionPorToken } from "@/features/voucher/services/getCotizacionPorToken";
import { VoucherPublico } from "@/features/voucher/components/VoucherPublico";

// Desactiva el almacenamiento en caché estático para forzar la carga dinámica
export const revalidate = 0;

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function VoucherPage({ params }: PageProps) {
  const { token } = await params;

  if (!token) {
    notFound();
  }

  // La función ya retorna un tipo `CotizacionPublica | null`
  const cotizacion = await getCotizacionPorToken(token);

  if (!cotizacion) {
    notFound();
  }

  return (
    <VoucherPublico
      cotizacion={cotizacion}
      clienteNombre={cotizacion.cliente_nombre ?? undefined}
      clienteTelefono={cotizacion.cliente_contacto ?? undefined}
      whatsappUrl={cotizacion.empresa?.whatsapp_url ?? undefined}
      tiktokUrl={cotizacion.empresa?.tiktok_url ?? undefined}
      instagramUrl={cotizacion.empresa?.instagram_url ?? undefined}
      facebookUrl={cotizacion.empresa?.facebook_url ?? undefined}
    />
  );
}