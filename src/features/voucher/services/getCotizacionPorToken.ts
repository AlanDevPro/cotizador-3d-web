import { createClient } from "@supabase/supabase-js";
import type {
  CotizacionPublica,
  PiezaDetalle,
  EmpresaInfo,
  VoucherData,
  FilamentoInfo,
} from "../types/voucher.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface DBFilamento {
  id: string;
  material: string;
  color: string;
  color_hex?: string | null;
  marca?: string | null;
}

interface DBCotizacionItem {
  id: string;
  nombre_pieza: string | null;
  cantidad: number | null;
  peso_gramos: number | null;
  tiempo_impresion_horas: number | null;
  tiempo_preparacion_minutos: number | null;
  tiempo_postprocesado_minutos: number | null;
  costo_material: number | null;
  costo_energia: number | null;
  costo_amortizacion: number | null;
  costo_mantenimiento: number | null;
  costo_mano_obra: number | null;
  costo_subtotal_item: number | null;
  filamento_id?: string | null;
  filamentos: DBFilamento | DBFilamento[] | null;
}

interface DBEmpresa {
  id: string;
  nombre_comercial?: string | null;
  razon_social?: string | null;
  logo_url?: string | null;
  garantia?: string | null;
  sitio_web?: string | null;
  nit?: string | null;
  whatsapp?: string | null;
  direccion_fiscal?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  ciudad?: string | null;
}

function mapearPiezaItem(
  item: DBCotizacionItem,
  costoDirectoTotal: number,
  costoFallosTotal: number,
  montoGananciaTotal: number,
  montoImpuestoTotal: number,
  imagenRespaldo: string | null
): PiezaDetalle {
  const cantidad = Number(item.cantidad) || 1;
  const subtotalDirecto = Number(item.costo_subtotal_item) || 0;

  const proporcionPct = costoDirectoTotal > 0 ? subtotalDirecto / costoDirectoTotal : 0;
  const costoFallosPieza = costoFallosTotal * proporcionPct;
  const montoGananciaPieza = montoGananciaTotal * proporcionPct;
  const costoBasePieza = subtotalDirecto + costoFallosPieza;
  const impuestoPieza = montoImpuestoTotal * proporcionPct;

  const precioTotalPieza =
    subtotalDirecto > 0
      ? costoBasePieza + montoGananciaPieza + impuestoPieza
      : subtotalDirecto;

  const rawFilamento = Array.isArray(item.filamentos)
    ? item.filamentos[0]
    : item.filamentos;

  const filamento: FilamentoInfo | null =
    rawFilamento && rawFilamento.material
      ? {
          id: rawFilamento.id,
          material: rawFilamento.material,
          color: rawFilamento.color,
          color_hex: rawFilamento.color_hex || null,
          marca: rawFilamento.marca || null,
        }
      : null;

  return {
    id: item.id,
    nombre_pieza: item.nombre_pieza || "Pieza sin nombre",
    cantidad,
    precio_total_pieza: precioTotalPieza,
    imagen_url: imagenRespaldo,
    peso_gramos: item.peso_gramos ? Number(item.peso_gramos) : null,
    tiempo_impresion_horas: item.tiempo_impresion_horas ? Number(item.tiempo_impresion_horas) : null,
    tiempo_preparacion_minutos: item.tiempo_preparacion_minutos ? Number(item.tiempo_preparacion_minutos) : null,
    tiempo_postprocesado_minutos: item.tiempo_postprocesado_minutos ? Number(item.tiempo_postprocesado_minutos) : null,
    filamento_id: item.filamento_id || filamento?.id || null,
    filamento,
    costo_material: Number(item.costo_material) || 0,
    costo_mano_obra: Number(item.costo_mano_obra) || 0,
    costo_depreciacion: Number(item.costo_amortizacion) || 0,
    costo_energia: Number(item.costo_energia) || 0,
    costo_mantenimiento: Number(item.costo_mantenimiento) || 0,
    subtotal_directo: subtotalDirecto,
    proporcion_pct: proporcionPct * 100,
    costo_fallos_pieza: costoFallosPieza,
    costo_base_pieza: costoBasePieza,
    monto_ganancia_pieza: montoGananciaPieza,
  };
}

export async function getCotizacionPorToken(token: string): Promise<CotizacionPublica | null> {
  try {
    const { data, error } = await supabase
      .from("cotizaciones")
      .select(`
        id,
        created_at,
        codigo_cotizacion,
        cliente_nombre,
        cliente_contacto,
        costo_directo_total,
        costo_indirecto_total,
        costo_fallos_total,
        costo_diseno_total,
        subtotal_costo_base,
        monto_ganancia,
        monto_impuesto,
        precio_final,
        margen_ganancia_aplicado_pct,
        estado,
        notas,
        imagen_referencia_url,
        voucher_data,
        empresa:empresas (
          id,
          nombre_comercial,
          razon_social,
          logo_url,
          garantia,
          sitio_web,
          nit,
          whatsapp,
          direccion_fiscal,
          instagram,
          facebook,
          ciudad
        ),
        cotizacion_items (
          id,
          nombre_pieza,
          cantidad,
          peso_gramos,
          tiempo_impresion_horas,
          tiempo_preparacion_minutos,
          tiempo_postprocesado_minutos,
          costo_material,
          costo_energia,
          costo_amortizacion,
          costo_mantenimiento,
          costo_mano_obra,
          costo_subtotal_item,
          filamento_id,
          filamentos (
            id,
            material,
            color,
            color_hex,
            marca
          )
        )
      `)
      .eq("token_publico", token)
      .single();

    if (error || !data) {
      console.error("[Voucher Service] Error al consultar la cotización:", error);
      return null;
    }

    const voucherDataObj = (data.voucher_data as VoucherData) || null;
    const imagenCotizacion = data.imagen_referencia_url || voucherDataObj?.productImageUri || null;

    const costoDirectoTotal = Number(data.costo_directo_total) || 0;
    const costoFallosTotal = Number(data.costo_fallos_total) || 0;
    const montoGananciaTotal = Number(data.monto_ganancia) || 0;
    const montoImpuestoTotal = Number(data.monto_impuesto) || 0;

    const rawItems = (data.cotizacion_items as unknown as DBCotizacionItem[]) || [];
    const piezasMapeadas = rawItems.map((item) =>
      mapearPiezaItem(
        item,
        costoDirectoTotal,
        costoFallosTotal,
        montoGananciaTotal,
        montoImpuestoTotal,
        imagenCotizacion
      )
    );

    const rawEmpresa = (Array.isArray(data.empresa) ? data.empresa[0] : data.empresa) as DBEmpresa | null;
    const empresaMapeada: EmpresaInfo | null = rawEmpresa
      ? {
          id: rawEmpresa.id,
          nombre: rawEmpresa.nombre_comercial || rawEmpresa.razon_social || "Empresa",
          nombre_comercial: rawEmpresa.nombre_comercial,
          razon_social: rawEmpresa.razon_social,
          logo_url: rawEmpresa.logo_url,
          garantia: rawEmpresa.garantia,
          sitio_web: rawEmpresa.sitio_web,
          nit: rawEmpresa.nit,
          telefono: rawEmpresa.whatsapp || null,
          whatsapp_url: rawEmpresa.whatsapp ? `https://wa.me/${rawEmpresa.whatsapp}` : null,
          direccion: rawEmpresa.direccion_fiscal || null,
          ciudad: rawEmpresa.ciudad || null,
          instagram_url: rawEmpresa.instagram || null,
          facebook_url: rawEmpresa.facebook || null,
        }
      : null;

    return {
      id: data.id,
      creado_en: data.created_at,
      codigo_cotizacion: data.codigo_cotizacion ? String(data.codigo_cotizacion) : null,
      precio_final: Number(data.precio_final) || 0,
      monto_impuesto: data.monto_impuesto ? Number(data.monto_impuesto) : null,
      costo_diseno_total: Number(data.costo_diseno_total) || 0,
      costo_directo_total: costoDirectoTotal,
      costo_indirecto_total: Number(data.costo_indirecto_total) || 0,
      costo_fallos_total: costoFallosTotal,
      subtotal_costo_base: Number(data.subtotal_costo_base) || 0,
      monto_ganancia: montoGananciaTotal,
      margen_ganancia_aplicado_pct: Number(data.margen_ganancia_aplicado_pct) || 0,
      cliente_nombre: data.cliente_nombre || null,
      cliente_contacto: data.cliente_contacto || null,
      estado: data.estado || null,
      notas: data.notas || null,
      imagen_referencia_url: imagenCotizacion,
      piezas: piezasMapeadas,
      empresa: empresaMapeada,
      voucher_data: voucherDataObj,
    };
  } catch (err) {
    console.error("[Voucher Service] Excepción no controlada:", err);
    return null;
  }
}