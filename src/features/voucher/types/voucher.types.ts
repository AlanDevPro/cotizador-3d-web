// src/features/voucher/types/voucher.types.ts
import type { RefObject, ChangeEvent } from "react";

export type TipoEntrega = "recoger" | "domicilio";
export type MetodoPago = "efectivo" | "qr";
export type TipoMontoPago = "anticipo" | "total";
export type EstadoPagoPedido = "sin_pagar" | "anticipo" | "pagado";
export type TipoPagoRegistro = "anticipo" | "pago_final";
export type Tema = "rosa" | "morado";
export type TabId = "general" | string;

// ==========================================
// DTOs & Interfaces de Pago / Pedido
// ==========================================

export interface CrearPedidoDesdeCotizacionDTO {
  cotizacionId: string;
  empresaId: string;
  clienteId?: string | null;
  envioTipo?: TipoEntrega | string | null;
  creadoPor?: string | null;
  piezaDescripcion: string;
  pagoTotal: number;
  pagoAnticipoPct?: number;
}

export interface ActualizarOpcionesPedidoDTO {
  envioTipo?: TipoEntrega | string | null;
  envioCosto?: number | null;
  pagoTotal?: number | null;
  pagoAnticipoPct?: number;
  envioDireccion?: string | null;
  envioUbicacionUrl?: string | null;
}

export interface RegistrarPagoPedidoDTO {
  tipo: TipoPagoRegistro;
  metodo: MetodoPago;
  comprobanteUrl?: string | null;
  montoEsperado?: number;
}

export interface PedidoExistente {
  id: string;
  estado: string;
  envio_tipo: string | null;
  envio_costo: number | null;
  envio_direccion: string | null;
  envio_ubicacion_url: string | null;
  pago_total: number | null;
  pago_monto_cobrado: number | null;
  pago_estado: EstadoPagoPedido | string | null;
}

export interface UltimoPago {
  id: string;
  metodo: MetodoPago;
  tipo: TipoPagoRegistro | string;
  monto: number;
  comprobante_url: string | null;
  verificado: boolean;
}

// ==========================================
// Dominios Principales (Filamento, Accesorios, Pieza, Empresa)
// ==========================================

export interface FilamentoInfo {
  id: string;
  material: string;
  color: string;
  color_hex?: string | null;
  marca?: string | null;
}

/**
 * 🔩 Accesorio aplicado a una pieza (proviene de cotizacion_item_accesorios
 * + su catálogo accesorios). costoTotal ya viene calculado por la columna
 * generada `costo_total_accesorio` (cantidad * costo_unitario_aplicado).
 */
export interface AccesorioAplicado {
  id: string;
  accesorioId: string;
  nombre: string;
  descripcion?: string | null;
  cantidad: number;
  unidadMedida: string;
  costoUnitario: number;
  costoTotal: number;
}

export interface PiezaDetalle {
  id: string;
  nombre_pieza: string;
  cantidad: number;
  precio_total_pieza: number;       // base + ganancia + su diseño + sus accesorios (vista individual / hero)
  precio_base_pieza: number;        // 🆕 base + ganancia SOLAMENTE (para tablas/filas y evitar doble conteo)
  precio_personalizacion_pieza: number; // 🆕 parte proporcional de diseño asignada a esta pieza
  imagen_url?: string | null;

  filamento_id?: string | null;
  filamento?: FilamentoInfo | null;

  // 🔩 Accesorios aplicados a esta pieza
  accesorios: AccesorioAplicado[];
  costo_accesorios_total: number;

  peso_gramos?: number | null;
  tiempo_impresion_horas?: number | null;
  tiempo_preparacion_minutos?: number | null;
  tiempo_postprocesado_minutos?: number | null;

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
  ubicacion_url?: string | null;
  qr_pago_url?: string | null;
  qr_pago_titular?: string | null;
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
  total: number; // 🔧 ahora representa SOLO base+ganancia (sin diseño ni accesorios) para sumar limpio en la tabla
  material: string;
  color: string;
  colorHex?: string | null;
  materialColor: string;
  detalleTecnico?: string | null;

  // 🔩 Desglose de accesorios de esta fila/pieza (informativo/separado)
  accesorios: AccesorioAplicado[];
  costoAccesorios: number; // se suma aparte en el resumen total, ya no está "metido" a la fuerza
}

// ==========================================
// Props de Componentes
// ==========================================

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
  fechaEmision?: Date | string;
  atendidoPor?: string;
  nombreCliente?: string | null;
  clienteDocumento?: string;
  clienteTelefono?: string;
  tipoEntrega: TipoEntrega | null;
  filasComprobante: FilaVoucher[];
  subtotalOrden: number;
  montoImpuestoOrden: number;
  costoEnvio: number;
  costoDiseno?: number | string;
  totalConEnvio: number;
  montoAnticipo: number;
  montoSaldo: number;
  metodoPago: MetodoPago | null;
  tipoMontoPago?: TipoMontoPago | null;
  qrImagenSrc?: string | null;
  comprobanteArchivo: File | null;
  pedidoConfirmadoEfectivo: boolean;
  verificado?: boolean;
  direccionLocal?: string | null;
  notasLegales?: string[] | null;
  fileInputRef: RefObject<HTMLInputElement>;
  onSeleccionarComprobante: () => void;
  onComprobanteChange: (
    e: ChangeEvent<HTMLInputElement>,
    tipoMontoPago?: TipoMontoPago | null
  ) => void;
  onConfirmarEfectivo: () => void;
  onCambiarOpciones: () => void;
}