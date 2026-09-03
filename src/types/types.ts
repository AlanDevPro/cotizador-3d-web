// PATCH para src/features/cotizacion/types.ts (app móvil)
// Reemplaza el bloque "VOUCHER / PDF" existente por este, para que coincida
// 1:1 con src/types/voucher.ts del proyecto web (cotizador-3d-web).

export interface VoucherPricingTier {
  label: string;
  conditionLabel?: string;
  price: number;
  discountLabel?: string;
}

export interface VoucherItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface VoucherPolicy {
  label: string;
  text: string;
}

export interface VoucherEspecificaciones {
  materialNombre?: string;
  materialColor?: string;
}

/** Espeja DesglosePiezaResultado / ResultadoCotizacion; reutilizable para general y por pieza */
export interface VoucherDesglose {
  costoMaterial: number;
  costoManoObra: number;
  costoDepreciacion: number;
  costoEnergia: number;
  costoFallos: number;
  costoBase: number;
  montoGanancia: number;
  margenAplicadoPct: number;
  precioTotal: number;
  pesoGramos?: number;
  tiempoImpresionHoras?: number;
  tiempoImpresionMinutos?: number;
}

export interface VoucherPiezaDetalle extends VoucherDesglose {
  id: string;
  nombrePieza: string;
  cantidad: number;
}

export interface VoucherData {
  codigoPedido?: string;
  companyName: string;
  companyTagline: string;
  documentTitle: string;
  issueDateLabel: string;
  validityLabel?: string;
  logoUri?: string;
  productImageUri?: string;
  unitPriceLabel: string;
  unitPrice: number;
  especificaciones?: VoucherEspecificaciones;
  pricingTiers?: VoucherPricingTier[];
  items: VoucherItem[];
  policies: VoucherPolicy[];
  footerNote: string;
  websiteUrl?: string;
  currencySymbol: string;

  clienteNombre?: string;
  montoTotal?: number;
  montoAnticipo?: number;
  saldoPendiente?: number;
  qrUrl?: string;

  // NUEVO: cotización por pieza + general
  generalDesglose?: VoucherDesglose;
  piezas?: VoucherPiezaDetalle[];
}