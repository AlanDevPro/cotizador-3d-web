import { createClient } from "@supabase/supabase-js";
import type {
  CotizacionPublica,
  PiezaDetalle,
  EmpresaInfo,
  VoucherData,
} from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getCotizacionPorToken(
  token: string,
): Promise<CotizacionPublica | null> {
  // 1. Diagnóstico de parámetros e instanciación de cliente
  console.log("\n================ [DIAGNOSTICO VOUCHER] ================");
  console.log("🔑 1. Token recibido en URL:", token);
  console.log("🌐 2. Supabase URL en uso:", supabaseUrl);
  console.log("🔑 3. Anon Key presente:", !!supabaseAnonKey);

  // 2. Consulta de la Cotización (se añade costo_diseno_total)
  const { data: cotizacion, error: errCotizacion } = await supabase
    .from("cotizaciones")
    .select(
      `id, cliente_nombre, created_at, empresa_id,
       costo_directo_total, costo_indirecto_total, costo_fallos_total,
       subtotal_costo_base, monto_ganancia, monto_impuesto,
       costo_diseno_total,
       precio_final, margen_ganancia_aplicado_pct, voucher_data`,
    )
    .eq("token_publico", token)
    .single();

  if (errCotizacion) {
    console.error("❌ 4. ERROR Supabase en 'cotizaciones':", {
      message: String(errCotizacion?.message || errCotizacion),
      code: errCotizacion?.code,
      details: errCotizacion?.details,
      hint: errCotizacion?.hint,
    });
    console.log("=======================================================\n");
    return null;
  }

  if (!cotizacion) {
    console.warn(
      "⚠️ 4. La consulta finalizó sin error pero no devolvió ninguna fila para el token:",
      token,
    );
    console.log("=======================================================\n");
    return null;
  }

  console.log("✅ 4. Cotización encontrada con ID:", cotizacion.id);

  // 3. Consulta de ítems asociados
  const { data: items, error: errItems } = await supabase
    .from("cotizacion_items")
    .select(
      `id, nombre_pieza, cantidad, peso_gramos, tiempo_impresion_horas,
       costo_material, costo_energia, costo_amortizacion, costo_mano_obra,
       costo_subtotal_item`,
    )
    .eq("cotizacion_id", cotizacion.id);

  if (errItems) {
    console.error("⚠️ 5. ERROR Supabase en 'cotizacion_items':", {
      message: String(errItems?.message || errItems),
      code: errItems?.code,
      details: errItems?.details,
      hint: errItems?.hint,
    });
  } else {
    console.log(`📦 5. Ítems recuperados: ${items?.length || 0} registro(s)`);
  }

  // 4. Consulta de datos de la empresa adaptados al esquema
  let empresa: EmpresaInfo | null = null;
  if (cotizacion.empresa_id) {
    const { data: empresaRow, error: errEmpresa } = await supabase
      .from("empresas")
      .select(
        "id, nombre_comercial, razon_social, logo_url, nit, direccion_fiscal, ciudad, whatsapp, instagram, facebook, sitio_web, garantia",
      )
      .eq("id", cotizacion.empresa_id)
      .single();

    if (errEmpresa) {
      console.error("⚠️ 6. ERROR Supabase en 'empresas':", {
        message: String(errEmpresa?.message || errEmpresa),
        code: errEmpresa?.code,
        details: errEmpresa?.details,
        hint: errEmpresa?.hint,
      });
    } else if (empresaRow) {
      empresa = {
        ...empresaRow,
        nombre: empresaRow.nombre_comercial || empresaRow.razon_social || "Empresa",
      } as EmpresaInfo;
    }
  }

  console.log("🚀 7. Proceso completado exitosamente.");
  console.log("=======================================================\n");

  const costoDirectoTotal = cotizacion.costo_directo_total || 0;

  const piezas: PiezaDetalle[] = (items || []).map((item) => {
    const cantidad = item.cantidad || 1;
    const subtotalDirecto = item.costo_subtotal_item || 0;
    const proporcionPct =
      costoDirectoTotal > 0 ? subtotalDirecto / costoDirectoTotal : 0;

    const costoFallosPieza =
      (cotizacion.costo_fallos_total || 0) * proporcionPct;
    const montoGananciaPieza =
      (cotizacion.monto_ganancia || 0) * proporcionPct;
    const costoBasePieza = subtotalDirecto + costoFallosPieza;
    const impuestoPieza = (cotizacion.monto_impuesto || 0) * proporcionPct;
    const precioTotalPieza =
      costoBasePieza + montoGananciaPieza + impuestoPieza;

    return {
      id: item.id,
      nombre_pieza: item.nombre_pieza,
      cantidad,
      peso_gramos: item.peso_gramos,
      tiempo_impresion_horas: item.tiempo_impresion_horas,
      costo_material: (item.costo_material || 0) * cantidad,
      costo_mano_obra: (item.costo_mano_obra || 0) * cantidad,
      costo_depreciacion: (item.costo_amortizacion || 0) * cantidad,
      costo_energia: (item.costo_energia || 0) * cantidad,
      subtotal_directo: subtotalDirecto,
      proporcion_pct: proporcionPct * 100,
      costo_fallos_pieza: costoFallosPieza,
      costo_base_pieza: costoBasePieza,
      monto_ganancia_pieza: montoGananciaPieza,
      precio_total_pieza: precioTotalPieza,
    };
  });

  // Retorno final incluyendo el costo de diseño/personalización
  return {
    id: cotizacion.id,
    cliente_nombre: cotizacion.cliente_nombre,
    creado_en: cotizacion.created_at,
    costo_directo_total: cotizacion.costo_directo_total,
    costo_indirecto_total: cotizacion.costo_indirecto_total,
    costo_fallos_total: cotizacion.costo_fallos_total,
    subtotal_costo_base: cotizacion.subtotal_costo_base,
    monto_ganancia: cotizacion.monto_ganancia,
    monto_impuesto: cotizacion.monto_impuesto,
    costo_diseno_total: cotizacion.costo_diseno_total || 0,
    precio_final: cotizacion.precio_final,
    margen_ganancia_aplicado_pct: cotizacion.margen_ganancia_aplicado_pct,
    voucher_data: (cotizacion.voucher_data as VoucherData) || null,
    empresa,
    piezas,
  };
}