export interface PiezaDetalle {
  id: string;
  nombre_pieza: string;
  cantidad: number;
  peso_gramos: number;
  tiempo_impresion_horas: number;

  costo_material: number;
  costo_mano_obra: number;
  costo_depreciacion: number;
  costo_energia: number;
  subtotal_directo: number;

  proporcion_pct: number;
  costo_fallos_pieza: number;
  costo_base_pieza: number;
  monto_ganancia_pieza: number;
  precio_total_pieza: number;
}

export interface EmpresaInfo {
  nombre: string;
  logo_url?: string | null;
  tagline?: string | null;
  garantia?: string | null;
  sitio_web?: string | null;
  nit?: string | null;
  direccion_fiscal?: string | null;
  ciudad?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  facebook?: string | null;
}

// Estructura opcional del JSON voucher_data
export interface VoucherData {
  companyName?: string;
  companyTagline?: string;
  documentTitle?: string;
  issueDateLabel?: string;
  validityLabel?: string;
  logoUri?: string;
  productImageUri?: string;
  unitPriceLabel?: string;
  unitPrice?: number;
  currencySymbol?: string;
  items?: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  policies?: Array<{
    label: string;
    text: string;
  }>;
  footerNote?: string;
  [key: string]: unknown; // Permite flexibilidad si el JSON guarda campos extra
}

export interface CotizacionPublica {
  id: string;
  cliente_nombre: string | null;
  creado_en: string;
  costo_directo_total: number;
  costo_indirecto_total: number;
  costo_fallos_total: number;
  subtotal_costo_base: number;
  monto_ganancia: number;
  monto_impuesto: number;
  precio_final: number;
  margen_ganancia_aplicado_pct: number;
  empresa: EmpresaInfo | null;
  piezas: PiezaDetalle[];
  voucher_data?: VoucherData | null;
}