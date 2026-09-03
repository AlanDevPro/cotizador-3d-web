import { notFound } from "next/navigation";
import { getCotizacionPorToken } from "@/lib/cotizacion/getCotizacionPorToken";
import { VoucherPublico } from "@/components/voucher/VoucherPublico";

// Desactiva el almacenamiento en caché estático para forzar la carga dinámica en tiempo de solicitud
export const revalidate = 0;

export default async function VoucherPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const cotizacion = await getCotizacionPorToken(token);

  if (!cotizacion) {
    notFound();
  }

  return <VoucherPublico cotizacion={cotizacion} />;
}