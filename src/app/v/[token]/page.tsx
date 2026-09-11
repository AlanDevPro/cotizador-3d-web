// src/app/v/[token]/page.tsx
import { notFound } from "next/navigation";
import type { Viewport } from "next";
import { getCotizacionPorToken } from "@/features/voucher/services/getCotizacionPorToken";
import { VoucherPublico } from "@/features/voucher/components/VoucherPublico";

// Desactiva el almacenamiento en caché estático para forzar la carga dinámica
export const revalidate = 0;

// 🔑 FORZAR VISTA DE ESCRITORIO
// Invalida la escala responsiva móvil e indica al navegador un ancho de escritorio fijo de 1280px.
export const viewport: Viewport = {
  width: 1280,
  initialScale: 0.35, // Escala inicial ajustada para que encaje toda la pantalla en el celular
};

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function VoucherPage({ params }: PageProps) {
  const { token } = await params;

  if (!token) {
    notFound();
  }

  // Carga la cotización pública desde la base de datos
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