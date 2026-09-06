import type { RefObject, ChangeEvent } from "react";

export type TipoEntrega = "recoger" | "domicilio";
export type MetodoPago = "efectivo" | "qr";
export type Tema = "rosa" | "morado";
export type TabId = "general" | string;

export interface FilamentoInfo {
  id: string;
  material: string;
  color: string;
  color_hex?: string | null;
  marca?: string | null;
}

export interface PiezaDetalle {
  id: string;
  nombre_pieza: string;
  cantidad: number;
  precio_total_pieza: number;
  imagen_url?: string | null;

  // Información de Filamento Normalizada
  filamento_id?: string | null;
  filamento?: FilamentoInfo | null;

  // Especificaciones Técnicas
  peso_gramos?: number | null;
  tiempo_impresion_horas?: number | null;
  tiempo_preparacion_minutos?: number | null;
  tiempo_postprocesado_minutos?: number | null;

  // Desglose Financiero Directo
  costo_material: number;
  costo_mano_obra: number;
  costo_depreciacion: number;
  costo_energia: number;
  costo_mantenimiento: number;
  subtotal_directo: number;
  proporcion_pct: number;
  costo_fallos_pieza: number;
  costo_base_pieza: number;
  monto_ganancia_pieza: number;
}

export interface EmpresaInfo {
  id: string;
  nombre: string;
  nombre_comercial?: string | null;
  razon_social?: string | null;
  logo_url?: string | null;
  garantia?: string | null;
  sitio_web?: string | null;
  nit?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  ciudad?: string | null;
  whatsapp_url?: string | null;
  tiktok_url?: string | null;
  instagram_url?: string | null;
  facebook_url?: string | null;
}

export interface VoucherPolicy {
  label: string;
  text: string;
}

export interface VoucherData {
  documentTitle?: string | null;
  companyTagline?: string | null;
  validityLabel?: string | null;
  footerNote?: string | null;
  logoUri?: string | null;
  productImageUri?: string | null;
  policies?: VoucherPolicy[] | null;
  garantiaDias?: number | null;
  notasLegales?: string[] | null;
}

export interface CotizacionPublica {
  id: string;
  creado_en: string;
  codigo_cotizacion?: string | null;
  precio_final: number;
  monto_impuesto?: number | null;
  porcentaje_impuesto?: number | null;
  costo_diseno_total: number;
  costo_directo_total: number;
  costo_indirecto_total: number;
  costo_fallos_total: number;
  subtotal_costo_base: number;
  monto_ganancia: number;
  margen_ganancia_aplicado_pct: number;
  cliente_nombre?: string | null;
  cliente_contacto?: string | null;
  estado?: string | null;
  notas?: string | null;
  imagen_referencia_url?: string | null;
  piezas: PiezaDetalle[];
  empresa?: EmpresaInfo | null;
  voucher_data?: VoucherData | null;
}

export interface FilaVoucher {
  pieza: PiezaDetalle;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  material: string;
  color: string;
  colorHex?: string | null;
  materialColor: string;
  detalleTecnico?: string | null;
}

export interface VoucherPublicoProps {
  cotizacion: CotizacionPublica;
  onAceptarPedido?: () => void;
  onCancelarPedido?: () => void;
  clienteNombre?: string;
  clienteDocumento?: string;
  clienteTelefono?: string;
  atendidoPor?: string;
  numeroPedido?: string;
  qrPagoUri?: string;
  ubicacionLocal?: string;
  ubicacionMapsUrl?: string;
  onSubirComprobante?: (archivo: File) => void;
  onConfirmarPedidoEfectivo?: () => void;
  instagramUrl?: string;
  whatsappUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
}

export interface VoucherTablaResumenProps {
  filas: FilaVoucher[];
  costoDisenoTotal?: number | null;
  subtotal: number;
  montoImpuesto: number;
  total: number;
}

export interface VoucherHeaderProps {
  empresaNombre?: string | null;
  empresa?: EmpresaInfo | null;
  voucherData?: VoucherData | null;
  creadoEn?: string;
  tema: Tema;
  onAlternarTema: () => void;
}

export interface TicketComprobanteProps {
  empresa?: EmpresaInfo | null;
  empresaNombre?: string | null;
  voucherData?: VoucherData | null;
  codigoPedido?: string | null;
  fechaEmision?: Date | string; // Permite tanto Date como string
  atendidoPor?: string;
  nombreCliente?: string | null;
  clienteDocumento?: string;
  clienteTelefono?: string;
  tipoEntrega: TipoEntrega | null; // Permite null si aún no se seleccionó
  filasComprobante: FilaVoucher[];
  subtotalOrden: number;
  montoImpuestoOrden: number;
  costoEnvio: number;
  totalConEnvio: number;
  montoAnticipo: number;
  montoSaldo: number;
  metodoPago: MetodoPago | null; // Permite null si aún no se seleccionó
  qrImagenSrc?: string | null;
  comprobanteArchivo: File | null;
  pedidoConfirmadoEfectivo: boolean;
  direccionLocal?: string | null;
  notasLegales?: string[] | null;
  fileInputRef: RefObject<HTMLInputElement>;
  onSeleccionarComprobante: () => void;
  onComprobanteChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onConfirmarEfectivo: () => void;
  onCambiarOpciones: () => void;
}