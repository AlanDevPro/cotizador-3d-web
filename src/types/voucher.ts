// src/types/voucher.ts
export interface VoucherItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface VoucherPricingTier {
  label: string;
  conditionLabel?: string;
  price: number;
  discountLabel?: string;
}

export interface VoucherPolicy {
  label: string;
  text: string;
}

export interface VoucherData {
  companyName: string;
  companyTagline: string;
  documentTitle: string;
  issueDateLabel: string;
  validityLabel?: string;
  logoUri?: string;
  productImageUri?: string;
  unitPriceLabel: string;
  unitPrice: number;
  especificaciones?: { materialNombre?: string; materialColor?: string };
  pricingTiers?: VoucherPricingTier[];
  items: VoucherItem[];
  policies: VoucherPolicy[];
  footerNote: string;
  websiteUrl?: string;
  currencySymbol: string;
}