// app/v/[token]/page.tsx
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { buildVoucherHtml } from "@/lib/voucherTemplate";
import type { VoucherData } from "@/types/voucher";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 0;

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function VoucherPublicoPage({ params }: PageProps) {
  // 1. Resolver params como Promesa
  const { token } = await params;

  if (!token) {
    notFound();
  }

  // 2. Variable mutable solo para data
  let data: VoucherData | null = null;

  // 3. Consulta mediante RPC con asignación directa
  const { data: rpcData, error: rpcError } = await supabase.rpc(
    "get_voucher_publico",
    { p_token: token }
  );

  data = rpcData as VoucherData | null;

  // 4. Fallback: Consulta directa a la tabla si la RPC falla o no devuelve datos
  if (rpcError || !data) {
    console.warn(
      "⚠️ RPC get_voucher_publico falló o no existe. Intentando consulta directa...",
      rpcError?.message
    );

    const { data: cotizacion, error: directError } = await supabase
      .from("cotizaciones")
      .select("voucher_data")
      .eq("token_publico", token)
      .maybeSingle();

    if (directError || !cotizacion?.voucher_data) {
      console.error(
        "❌ Error recuperando voucher por token:",
        directError?.message || "Token no encontrado."
      );
      notFound();
    }

    data = cotizacion.voucher_data as VoucherData;
  }

  // 5. Renderizar el HTML del Voucher
  const html = buildVoucherHtml(data);

  return (
    <iframe
      srcDoc={html}
      title="Cotización 3D"
      style={{
        border: "none",
        width: "100vw",
        height: "100vh",
        display: "block",
        margin: 0,
        padding: 0,
      }}
    />
  );
}