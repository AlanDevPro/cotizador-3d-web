"use client";

import { useRef, useState, useMemo } from "react";
import {
  Building2,
  Package,
  MapPin,
  Truck,
  Store,
  QrCode,
  Banknote,
  CheckCircle2,
  Upload,
  RefreshCw,
  Calendar,
  User,
  FileText,
  Receipt,
  ExternalLink,
  ShieldCheck,
  Phone,
  Hash,
  UserCog,
  Layers,
  Palette,
  Scale,
  //Instagram,
  //Facebook,
  Scissors,
  Ticket,
} from "lucide-react";

// ==========================================
// INTERFACES & TIPOS DEFINIDOS
// ==========================================

export interface PiezaDetalle {
  id: string;
  nombre_pieza: string;
  cantidad: number;
  precio_total_pieza: number;
  material?: string;
  color?: string;
  infill_porcentaje?: number;
  altura_capa_mm?: number;
  peso_gramos?: number;
  [key: string]: unknown;
}

export interface EmpresaInfo {
  nombre?: string;
  logo_url?: string;
  garantia?: string;
  sitio_web?: string;
  nit?: string;
  telefono?: string;
  direccion?: string;
  [key: string]: unknown;
}

export interface VoucherPolicy {
  label: string;
  text: string;
}

export interface VoucherData {
  documentTitle?: string;
  companyTagline?: string;
  validityLabel?: string;
  footerNote?: string;
  logoUri?: string;
  productImageUri?: string;
  material?: string;
  color?: string;
  policies?: VoucherPolicy[];
  garantiaDias?: number;
  notasLegales?: string[];
  [key: string]: unknown;
}

export interface CotizacionPublica {
  id: string;
  creado_en: string;
  precio_final: number;
  monto_impuesto?: number;
  costo_diseno_total?: number;
  piezas: PiezaDetalle[];
  empresa?: EmpresaInfo;
  voucher_data?: VoucherData;
  [key: string]: unknown;
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

export type TipoEntrega = "recoger" | "domicilio";
export type MetodoPago = "efectivo" | "qr";
export type Tema = "rosa" | "morado";
type TabId = "general" | string;

// ==========================================
// CONSTANTES & HELPERS
// ==========================================

const DEFAULT_TAGLINE = "Servicios de manufactura, prototipado e impresión 3D";
const DEFAULT_VALIDEZ = "Cotización válida por 7 días";
const DEFAULT_TITULO = "COTIZACIÓN COMERCIAL";
const DEFAULT_FOOTER = "Gracias por confiar en nuestros servicios. Calidad y precisión en cada proyecto.";
const DEFAULT_UBICACION = "Dirección del taller no configurada. Contáctanos para más detalles.";
const DEFAULT_GARANTIA_DIAS = 15;

const COSTO_ENVIO_DOMICILIO = 10;
const PORCENTAJE_ANTICIPO = 0.5;

// Tokens de tema: cada tema define las variables CSS que pintan todo el voucher
const TEMAS: Record<Tema, Record<string, string>> = {
  rosa: {
    "--brand": "#e11d48",
    "--brand-dark": "#9f1239",
    "--brand-light": "#fff1f2",
    "--brand-soft": "#ffe4e6",
    "--dark-bg": "#0f172a",
    "--dark-bg-2": "#1e293b",
  },
  morado: {
    "--brand": "#7c3aed",
    "--brand-dark": "#4c1d95",
    "--brand-light": "#f5f3ff",
    "--brand-soft": "#ede9fe",
    "--dark-bg": "#150a2b",
    "--dark-bg-2": "#241143",
  },
};

function formatBs(monto: number): string {
  const numero = new Intl.NumberFormat("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(monto);
  return `${numero} Bs`;
}

function formatFecha(iso?: string): string {
  if (!iso) return formatFecha(new Date().toISOString());
  try {
    return new Date(iso).toLocaleDateString("es-BO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatFechaHora(fecha: Date): string {
  const fechaTexto = fecha.toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const horaTexto = fecha.toLocaleTimeString("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${fechaTexto} · ${horaTexto}`;
}

function detalleTecnicoPieza(p: PiezaDetalle): string | null {
  const partes: string[] = [];
  if (typeof p.infill_porcentaje === "number") partes.push(`Infill: ${p.infill_porcentaje}%`);
  if (typeof p.altura_capa_mm === "number") partes.push(`Capa: ${p.altura_capa_mm}mm`);
  if (typeof p.peso_gramos === "number") partes.push(`Peso: ~${p.peso_gramos}g`);
  return partes.length > 0 ? partes.join(" · ") : null;
}

// ==========================================
// ICONOS DE REDES SOCIALES (trazo simple, estilo lucide)
// ==========================================

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 21l1.4-4.2A8.5 8.5 0 1 1 8.3 20L3 21z" />
      <path d="M8.5 9.7c0 3.7 3 6.7 6.7 6.7.6 0 1-.5.9-1l-.3-1.3a.9.9 0 0 0-.9-.7l-1.5.2a5 5 0 0 1-2.9-2.9l.2-1.5a.9.9 0 0 0-.7-.9L8.6 8a.9.9 0 0 0-1 .9" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 3v10.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M15 3c.4 2.4 2.1 4.1 4.5 4.4" />
    </svg>
  );
}

// ==========================================
// SUBCOMPONENTES DE UI
// ==========================================

function EncabezadoTabla({ icon: Icon, label, align = "left" }: { icon: React.ElementType; label: string; align?: "left" | "center" | "right" }) {
  const alignClass = align === "right" ? "justify-end" : align === "center" ? "justify-center" : "justify-start";
  return (
    <span className={`flex items-center gap-1.5 ${alignClass}`}>
      <Icon className="h-3.5 w-3.5 opacity-70" />
      {label}
    </span>
  );
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

export function VoucherPublico({
  cotizacion,
  onAceptarPedido,
  onCancelarPedido,
  clienteNombre,
  clienteDocumento,
  clienteTelefono,
  atendidoPor,
  numeroPedido,
  qrPagoUri,
  ubicacionLocal,
  ubicacionMapsUrl,
  onSubirComprobante,
  onConfirmarPedidoEfectivo,
  instagramUrl,
  whatsappUrl,
  facebookUrl,
  tiktokUrl,
}: VoucherPublicoProps) {
  const [tabActivo, setTabActivo] = useState<TabId>("general");
  const [tema, setTema] = useState<Tema>("rosa");

  // Estados del flujo de compra
  const [pedidoAceptado, setPedidoAceptado] = useState(false);
  const [tipoEntrega, setTipoEntrega] = useState<TipoEntrega | null>(null);
  const [metodoPago, setMetodoPago] = useState<MetodoPago | null>(null);
  const [comprobanteArchivo, setComprobanteArchivo] = useState<File | null>(null);
  const [pedidoConfirmadoEfectivo, setPedidoConfirmadoEfectivo] = useState(false);
  const [fechaEmision] = useState(() => new Date());

  const fileInputRef = useRef<HTMLInputElement>(null);

  function alternarTema() {
    setTema((actual) => (actual === "rosa" ? "morado" : "rosa"));
  }

  // Tabs de piezas
  const tabs = useMemo(() => [
    {
      id: "general" as TabId,
      label: `General (${cotizacion.piezas.length} ${cotizacion.piezas.length === 1 ? "pieza" : "piezas"})`,
    },
    ...cotizacion.piezas.map((p) => ({ id: p.id, label: p.nombre_pieza })),
  ], [cotizacion.piezas]);

  const pieza = cotizacion.piezas.find((p) => p.id === tabActivo);
  const esGeneral = tabActivo === "general" || !pieza;

  const empresa = cotizacion.empresa;
  const empresaNombre = empresa?.nombre ?? "Taller de Impresión 3D";
  const voucherData = cotizacion.voucher_data;

  const precioMostrado = esGeneral ? cotizacion.precio_final : pieza!.precio_total_pieza;

  // Filas para la vista superior (hero + tabla resumen), respeta el tab seleccionado
  const piezasVista = esGeneral ? cotizacion.piezas : [pieza!];
  const filasVista = useMemo(() => {
    return piezasVista.map((p) => ({
      pieza: p,
      descripcion: p.nombre_pieza,
      cantidad: p.cantidad,
      precioUnitario: p.cantidad > 0 ? p.precio_total_pieza / p.cantidad : p.precio_total_pieza,
      total: p.precio_total_pieza,
      materialColor: [p.material, p.color].filter(Boolean).join(" ") || null,
      detalleTecnico: detalleTecnicoPieza(p),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [esGeneral, cotizacion.piezas, pieza]);

  const subtotalVista = filasVista.reduce((acc, f) => acc + f.total, 0);
  const montoImpuestoVista = esGeneral ? cotizacion.monto_impuesto || 0 : 0;
  const costoDisenoVista = esGeneral ? cotizacion.costo_diseno_total || 0 : 0;
  const totalVista = subtotalVista + montoImpuestoVista + costoDisenoVista;

  // El comprobante SIEMPRE muestra el pedido completo (todas las piezas),
  // sin importar qué pestaña (General / Pieza 1 / Pieza 2...) esté activa.
  // Las pestañas solo cambian el precio mostrado arriba, en el hero.
  const filasComprobante = useMemo(() => {
    return cotizacion.piezas.map((p) => ({
      pieza: p,
      descripcion: p.nombre_pieza,
      cantidad: p.cantidad,
      precioUnitario: p.cantidad > 0 ? p.precio_total_pieza / p.cantidad : p.precio_total_pieza,
      total: p.precio_total_pieza,
      materialColor: [p.material, p.color].filter(Boolean).join(" ") || null,
      detalleTecnico: detalleTecnicoPieza(p),
    }));
  }, [cotizacion.piezas]);

  const subtotalOrden = filasComprobante.reduce((acc, f) => acc + f.total, 0);
  const montoImpuestoOrden = cotizacion.monto_impuesto || 0;
  const totalOrden = subtotalOrden + montoImpuestoOrden;

  const costoEnvio = tipoEntrega === "domicilio" ? COSTO_ENVIO_DOMICILIO : 0;
  const totalConEnvio = totalOrden + costoEnvio;
  const montoAnticipo = totalConEnvio * PORCENTAJE_ANTICIPO;
  const montoSaldo = totalConEnvio - montoAnticipo;

  const politicas = voucherData?.policies?.length
    ? voucherData.policies
    : empresa?.garantia
      ? [{ label: "Garantía", text: empresa.garantia }]
      : [];

  const garantiaDias = voucherData?.garantiaDias ?? DEFAULT_GARANTIA_DIAS;

  const materialNombre = voucherData?.material || "PLA - Genérico";
  const colorNombre = voucherData?.color || "A definir / Según catálogo";
  const imagenProducto = voucherData?.productImageUri;

  const codigoPedido =
    numeroPedido || `ORD-${fechaEmision.getFullYear()}-${cotizacion.id?.slice(0, 4)?.toUpperCase() ?? "0000"}`;
  const nombreClienteMostrado = clienteNombre?.trim() || "Cliente";
  const direccionLocal = ubicacionLocal?.trim() || DEFAULT_UBICACION;

  const notasLegales = voucherData?.notasLegales?.length
    ? voucherData.notasLegales
    : [
        "Este documento es un comprobante de pedido y no reemplaza a la factura fiscal.",
        `Garantía válida por ${garantiaDias} días tras la recepción del trabajo.`,
      ];

  const qrImagenSrc =
    qrPagoUri ||
    `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
      `Anticipo pedido ${codigoPedido} - ${empresaNombre} - Monto: ${formatBs(montoAnticipo)}`
    )}`;

  // Handlers
  function handleAceptarPedido() {
    setPedidoAceptado(true);
    onAceptarPedido?.();
  }

  function handleCambiarOpciones() {
    setTipoEntrega(null);
    setMetodoPago(null);
    setComprobanteArchivo(null);
    setPedidoConfirmadoEfectivo(false);
  }

  function handleSeleccionarComprobante() {
    fileInputRef.current?.click();
  }

  function handleComprobanteChange(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (archivo) {
      setComprobanteArchivo(archivo);
      onSubirComprobante?.(archivo);
    }
  }

  function handleConfirmarEfectivo() {
    setPedidoConfirmadoEfectivo(true);
    onConfirmarPedidoEfectivo?.();
  }

  const seleccionCompleta = Boolean(tipoEntrega && metodoPago);

  const redesSociales = [
    //{ url: instagramUrl, Icon: Instagram, label: "Instagram" },
    { url: whatsappUrl, Icon: WhatsAppIcon, label: "WhatsApp" },
    //{ url: facebookUrl, Icon: Facebook, label: "Facebook" },
    { url: tiktokUrl, Icon: TikTokIcon, label: "TikTok" },
  ].filter((r) => r.url);

  return (
    <div
      className="min-h-screen bg-slate-50 px-4 py-8 antialiased text-slate-800"
      style={TEMAS[tema] as React.CSSProperties}
    >
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

        {/* Encabezado */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--brand)]">
              <Building2 className="h-3.5 w-3.5" />
              {empresaNombre} · Impresión 3D
            </p>
            <h1 className="mt-1 text-2xl font-black uppercase tracking-tight text-slate-900 sm:text-3xl">
              {voucherData?.documentTitle || DEFAULT_TITULO}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {voucherData?.companyTagline || DEFAULT_TAGLINE}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
              Fecha de emisión: {formatFecha(cotizacion.creado_en)}
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-[var(--brand)]">
              <span>★</span>
              {voucherData?.validityLabel || DEFAULT_VALIDEZ}
            </p>
          </div>

          <div className="flex flex-shrink-0 flex-col items-center gap-2">
            {(empresa?.logo_url || voucherData?.logoUri) && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={empresa?.logo_url || voucherData?.logoUri}
                alt={empresaNombre}
                className="h-14 w-14 rounded-xl border border-slate-100 object-contain p-1 shadow-xs"
              />
            )}
            <button
              type="button"
              onClick={alternarTema}
              title="Cambiar tema de color"
              aria-label="Cambiar tema de color"
              className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600 shadow-xs transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
            >
              <Palette className="h-3.5 w-3.5" />
              {tema === "rosa" ? "Morado" : "Rosa"}
            </button>
          </div>
        </div>

        <div className="mt-4 h-1 w-full rounded-full bg-[var(--brand)]" />

        {/* Tabs de Piezas */}
        {cotizacion.piezas.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => {
              const activo = tab.id === tabActivo;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTabActivo(tab.id)}
                  className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    activo
                      ? "border-[var(--brand)] bg-[var(--brand)] text-white shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Hero Card */}
        <div className="mt-6 flex flex-col gap-4 rounded-xl  bg-white sm:flex-row sm:items-center">
          {imagenProducto ? (
            <div className="h-28 w-full flex-shrink-0 rounded-lg border border-slate-200 bg-white sm:w-28 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagenProducto}
                alt="Vista de la pieza"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-28 w-full flex-shrink-0 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs font-medium text-slate-400 sm:w-28">
              <Package className="h-6 w-6 mb-1 text-slate-300" />
              Modelo 3D
            </div>
          )}

          <div className="flex flex-1 flex-col justify-center gap-2">
            <div className="rounded-lg bg-[var(--brand)] px-4 py-3 shadow-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                {esGeneral ? "PRECIO TOTAL (VENTA)" : "PRECIO DE ESTA PIEZA"}
              </p>
              <p className="text-3xl font-black tracking-tight text-white">
                {formatBs(precioMostrado)}
              </p>
            </div>

            
          </div>
        </div>

        {/* Tabla de cotización inicial (respeta la pestaña seleccionada) */}
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[var(--dark-bg)] font-bold uppercase tracking-wider text-white">
                <th className="px-4 py-3"><EncabezadoTabla icon={Package} label="Pieza" /></th>
                <th className="px-4 py-3 text-center"><EncabezadoTabla icon={Hash} label="Cantidad" align="center" /></th>
                <th className="px-4 py-3 text-right"><EncabezadoTabla icon={Banknote} label="P. Unitario" align="right" /></th>
                <th className="px-4 py-3 text-right"><EncabezadoTabla icon={Receipt} label="Importe" align="right" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filasVista.map((fila, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3 font-semibold text-slate-900">{fila.descripcion}</td>
                  <td className="px-4 py-3 text-center">{fila.cantidad}</td>
                  <td className="px-4 py-3 text-right">{formatBs(fila.precioUnitario)}</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">
                    {formatBs(fila.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-200 space-y-2">
            <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs text-slate-600 shadow-xs">
              <span className="flex items-center gap-1.5"><Scale className="h-3.5 w-3.5 text-slate-400" /> Subtotal</span>
              <span className="font-medium text-slate-900">{formatBs(subtotalVista)}</span>
            </div>

            {montoImpuestoVista > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs text-slate-600 shadow-xs">
                <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-slate-400" /> Impuestos / IVA</span>
                <span className="font-medium text-slate-900">{formatBs(montoImpuestoVista)}</span>
              </div>
            )}

            {costoDisenoVista > 0 && (
  <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs text-slate-600 shadow-xs">
    <span className="flex items-center gap-1.5"><Scissors className="h-3.5 w-3.5 text-slate-400" /> Personalización / Diseño</span>
    <span className="font-medium text-slate-900">{formatBs(costoDisenoVista)}</span>
  </div>
)}

            <div className="flex items-center justify-between rounded-lg border border-[var(--brand)]/30 bg-[var(--brand-light)] px-3 py-2.5 text-sm font-bold text-slate-900">
              <span className="flex items-center gap-1.5 uppercase text-xs tracking-wider text-[var(--brand-dark)]">
                <Receipt className="h-4 w-4" /> Total a pagar
              </span>
              <span className="text-base font-black text-[var(--brand)]">{formatBs(totalVista)}</span>
            </div>
          </div>
        </div>

        {/* Políticas */}
        {politicas.length > 0 && (
          <div className="mt-6 rounded-xl bg-[var(--dark-bg)] p-4 text-white">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--brand)]">
              <ShieldCheck className="h-4 w-4" />
              Políticas de contratación y servicio
            </p>
            <div className="mt-2 space-y-2 text-xs leading-relaxed text-slate-300">
              {politicas.map((pol, idx) => (
                <p key={idx}>
                  <span className="font-semibold text-white">{pol.label}: </span>
                  {pol.text}
                </p>
              ))}
            </div>
          </div>
        )}

        

        {/* Flujo de Confirmación */}
        {pedidoAceptado && (
          <div className="mt-6 space-y-4">

            {/* SELECCIÓN SIMULTÁNEA: Entrega y Pago (Se ocultan al completar ambos) */}
            {!seleccionCompleta && (
              <div className="rounded-xl border border-slate-200 p-5 space-y-5 bg-white">
                {/* Paso 1: Entrega */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Truck className="h-4 w-4 text-[var(--brand)]" />
                    1. Elige el tipo de entrega
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setTipoEntrega("recoger")}
                      className={`rounded-xl border p-4 text-left transition flex items-start gap-3 ${
                        tipoEntrega === "recoger"
                          ? "border-[var(--brand)] bg-[var(--brand-light)] ring-1 ring-[var(--brand)]"
                          : "border-slate-200 hover:border-[var(--brand)]/40 hover:bg-slate-50"
                      }`}
                    >
                      <Store className={`h-5 w-5 mt-0.5 ${tipoEntrega === "recoger" ? "text-[var(--brand)]" : "text-slate-400"}`} />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Recoger en el local</p>
                        <p className="mt-0.5 text-xs text-slate-500">Sin costo adicional</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTipoEntrega("domicilio")}
                      className={`rounded-xl border p-4 text-left transition flex items-start gap-3 ${
                        tipoEntrega === "domicilio"
                          ? "border-[var(--brand)] bg-[var(--brand-light)] ring-1 ring-[var(--brand)]"
                          : "border-slate-200 hover:border-[var(--brand)]/40 hover:bg-slate-50"
                      }`}
                    >
                      <Truck className={`h-5 w-5 mt-0.5 ${tipoEntrega === "domicilio" ? "text-[var(--brand)]" : "text-slate-400"}`} />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Envío a domicilio</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          + {formatBs(COSTO_ENVIO_DOMICILIO)} al pedido
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-100" />

                {/* Paso 2: Pago */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Banknote className="h-4 w-4 text-[var(--brand)]" />
                    2. Elige el método de pago
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setMetodoPago("efectivo")}
                      className={`rounded-xl border p-4 text-left transition flex items-start gap-3 ${
                        metodoPago === "efectivo"
                          ? "border-[var(--brand)] bg-[var(--brand-light)] ring-1 ring-[var(--brand)]"
                          : "border-slate-200 hover:border-[var(--brand)]/40 hover:bg-slate-50"
                      }`}
                    >
                      <Banknote className={`h-5 w-5 mt-0.5 ${metodoPago === "efectivo" ? "text-[var(--brand)]" : "text-slate-400"}`} />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Efectivo</p>
                        <p className="mt-0.5 text-xs text-slate-500">Pago del anticipo en el local</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMetodoPago("qr")}
                      className={`rounded-xl border p-4 text-left transition flex items-start gap-3 ${
                        metodoPago === "qr"
                          ? "border-[var(--brand)] bg-[var(--brand-light)] ring-1 ring-[var(--brand)]"
                          : "border-slate-200 hover:border-[var(--brand)]/40 hover:bg-slate-50"
                      }`}
                    >
                      <QrCode className={`h-5 w-5 mt-0.5 ${metodoPago === "qr" ? "text-[var(--brand)]" : "text-slate-400"}`} />
                      <div>
                        <p className="text-sm font-bold text-slate-900">QR</p>
                        <p className="mt-0.5 text-xs text-slate-500">Transferencia bancaria inmediata</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* COMPROBANTE DE PEDIDO — estilo ticket de boleto, siempre con TODAS las piezas */}
            {seleccionCompleta && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Ticket className="h-4 w-4 text-[var(--brand)]" />
                    3. Tu comprobante de pedido
                  </p>
                  <button
                    type="button"
                    onClick={handleCambiarOpciones}
                    className="flex items-center gap-1 text-xs font-semibold text-[var(--brand)] hover:underline"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Cambiar opciones
                  </button>
                </div>

                {/* ===== TICKET / BOLETO ===== */}
<div className="relative mx-auto max-w-md space-y-4">
  {/* Tarjeta del Ticket */}
  <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200">
    
    {/* Sección: identidad de la empresa */}
    <div className="flex flex-col items-center gap-2 px-6 pt-5 pb-4 text-center">
      {(empresa?.logo_url || voucherData?.logoUri) ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={empresa?.logo_url || voucherData?.logoUri}
          alt={empresaNombre}
          className="h-12 w-12 rounded-lg border border-slate-200 object-contain p-1"
        />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--dark-bg)]">
          <Building2 className="h-6 w-6 text-white" />
        </div>
      )}
      <p className="text-sm font-black uppercase tracking-wide text-slate-900">
        {empresaNombre}
      </p>
      {empresa?.nit && (
        <p className="text-[11px] font-medium text-slate-500">NIT / Reg. Comercial: {empresa.nit}</p>
      )}
      {(empresa?.direccion || empresa?.telefono) && (
        <p className="text-[11px] text-slate-500">
          {[empresa?.direccion, empresa?.telefono].filter(Boolean).join("  ·  ")}
        </p>
      )}
    </div>

    {/* Título del ticket */}
    <div className="bg-[var(--brand)] py-1.5 text-center">
      <p className="flex items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-white">
        Comprobante de Pedido
      </p>
    </div>

    {/* Perforación del ticket */}
    <div className="relative border-b-2 border-dashed border-slate-300 px-6 py-3">
      <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-slate-50" />
      <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-slate-50" />
      <div className="flex flex-wrap items-center justify-between gap-y-1 text-xs text-slate-600">
        <span className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
          <Hash className="h-3.5 w-3.5 text-slate-400" />
          {codigoPedido}
        </span>
        <span className="flex items-center gap-1.5 font-mono">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          {formatFechaHora(fechaEmision)}
        </span>
      </div>
      {atendidoPor && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
          <UserCog className="h-3.5 w-3.5 text-slate-400" />
          Atendido por: <span className="font-semibold text-slate-700">{atendidoPor}</span>
        </p>
      )}
    </div>

    {/* Sección: cliente */}
    <div className="border-b-2 border-dashed border-slate-300 px-6 py-3 space-y-1.5 text-xs">
      <p className="flex items-center gap-1.5 font-bold text-slate-900">
        <User className="h-3.5 w-3.5 text-[var(--brand)]" />
        {nombreClienteMostrado}
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500">
        {clienteDocumento && <span>NIT/CI: <span className="font-medium text-slate-700">{clienteDocumento}</span></span>}
        {clienteTelefono && (
          <span className="flex items-center gap-1">
            <Phone className="h-3 w-3" /> {clienteTelefono}
          </span>
        )}
      </div>
      <p className="flex items-center gap-1.5 text-slate-500">
        {tipoEntrega === "recoger" ? <Store className="h-3.5 w-3.5" /> : <Truck className="h-3.5 w-3.5" />}
        Entrega: <span className="font-medium text-slate-700">
          {tipoEntrega === "recoger" ? "Recoger en el taller" : "Envío a domicilio"}
        </span>
      </p>
    </div>

    {/* Sección: detalle del trabajo */}
    <div className="relative border-b-2 border-dashed border-slate-300 px-6 py-3">
      <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-slate-50" />
      <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-slate-50" />
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-900">
        <FileText className="h-3.5 w-3.5 text-[var(--brand)]" />
        Detalle del trabajo (Impresión 3D)
      </p>
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="text-[10px] uppercase tracking-wider text-slate-400">
            <th className="pb-1.5 font-semibold"><EncabezadoTabla icon={Hash} label="Cant." /></th>
            <th className="pb-1.5 font-semibold"><EncabezadoTabla icon={Package} label="Descripción" /></th>
            <th className="pb-1.5 text-right font-semibold"><EncabezadoTabla icon={Banknote} label="Unit." align="right" /></th>
            <th className="pb-1.5 text-right font-semibold"><EncabezadoTabla icon={Receipt} label="Total" align="right" /></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {filasComprobante.map((fila, idx) => (
            <tr key={idx} className="align-top">
              <td className="py-1.5 pr-1 font-mono text-slate-500">{fila.cantidad}x</td>
              <td className="py-1.5 pr-2">
                <p className="font-semibold text-slate-900">{fila.descripcion}</p>
                {(fila.materialColor || fila.detalleTecnico) && (
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-400">
                    {fila.materialColor && (
                      <span className="flex items-center gap-1">
                        <Palette className="h-2.5 w-2.5" /> {fila.materialColor}
                      </span>
                    )}
                  </p>
                )}
              </td>
              <td className="py-1.5 text-right font-mono text-slate-600">{formatBs(fila.precioUnitario)}</td>
              <td className="py-1.5 text-right font-mono font-bold text-slate-900">{formatBs(fila.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Sección: totales y anticipo */}
    <div className="px-6 py-3 space-y-1.5 text-xs">
      <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-slate-600">
        <span className="flex items-center gap-1.5"><Scale className="h-3.5 w-3.5 text-slate-400" /> Subtotal</span>
        <span className="font-mono font-medium text-slate-900">{formatBs(subtotalOrden)}</span>
      </div>
      {montoImpuestoOrden > 0 && (
        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-slate-600">
          <span>Impuestos / IVA</span>
          <span className="font-mono font-medium text-slate-900">{formatBs(montoImpuestoOrden)}</span>
        </div>
      )}
      {costoEnvio > 0 && (
        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-slate-600">
          <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-slate-400" /> Envío a domicilio</span>
          <span className="font-mono font-medium text-slate-900">{formatBs(costoEnvio)}</span>
        </div>
      )}

      <div className="flex items-center justify-between rounded-lg border border-[var(--brand)]/30 bg-[var(--brand-light)] px-3 py-2.5 font-bold text-slate-900">
        <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[var(--brand-dark)]">
          <Receipt className="h-4 w-4" /> Total orden
        </span>
        <span className="font-mono text-base font-black text-[var(--brand)]">{formatBs(totalConEnvio)}</span>
      </div>

      <div className="mt-2 rounded-lg bg-[var(--dark-bg)] px-3 py-2.5 text-white">
        <div className="flex justify-between font-bold">
          <span>Anticipo requerido (50%)</span>
          <span className="font-mono">{formatBs(montoAnticipo)}</span>
        </div>
        <div className="mt-1 flex justify-between text-slate-300">
          <span>Saldo pendiente a la entrega</span>
          <span className="font-mono font-medium">{formatBs(montoSaldo)}</span>
        </div>
      </div>
    </div>

    {/* Vista previa / Datos de Pago (Interior del ticket) */}
    {metodoPago === "qr" && (
      <div className="border-t border-slate-100 px-6 py-4 text-center bg-slate-50/50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrImagenSrc}
          alt="Código QR para pago del anticipo"
          className="mx-auto h-40 w-40 rounded-lg border border-slate-200 object-contain p-2 bg-white shadow-xs"
        />
        <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center justify-center gap-1.5">
          <QrCode className="h-4 w-4 text-[var(--brand)]" />
          Escanea el QR y paga el anticipo
        </p>

        {comprobanteArchivo && (
          <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-center">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
            <p className="font-bold text-emerald-800">Comprobante recibido</p>
            <p className="mt-0.5 truncate text-emerald-600">{comprobanteArchivo.name}</p>
          </div>
        )}
      </div>
    )}

    {metodoPago === "efectivo" && (
      <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <Banknote className="h-4 w-4 text-[var(--brand)]" />
          Pago en efectivo
        </p>
        {!pedidoConfirmadoEfectivo ? (
          <p className="mt-1 text-xs text-slate-600">
            El anticipo de <span className="font-mono font-bold text-[var(--brand)]">{formatBs(montoAnticipo)}</span> se debe abonar directamente en el taller.
          </p>
        ) : (
          <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold mb-1">
              <MapPin className="h-4 w-4 text-emerald-600" />
              Paga tu anticipo en esta ubicación
            </div>
            <p className="font-bold text-slate-900">{empresaNombre}</p>
            <p className="mt-0.5 text-slate-700">{direccionLocal}</p>
          </div>
        )}
      </div>
    )}

    {/* Sección: notas legales */}
    <div className="border-t-2 border-dashed border-slate-300 bg-slate-50/70 px-6 py-3">
      <ul className="space-y-1 text-[10.5px] leading-relaxed text-slate-500">
        {notasLegales.map((nota, idx) => (
          <li key={idx} className="flex gap-1.5">
            <span className="text-slate-300">•</span>
            <span>{nota}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* Código de barras decorativo */}
    <div className="flex flex-col items-center gap-1 px-6 pb-5 pt-1">
      <div
        className="h-8 w-full max-w-xs"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #0f172a 0px, #0f172a 2px, transparent 2px, transparent 4px, #0f172a 4px, #0f172a 5px, transparent 5px, transparent 9px)",
        }}
      />
      <p className="font-mono text-[10px] tracking-[0.3em] text-slate-400">{codigoPedido}</p>
    </div>
  </div>

  {/* ===== ACCIONES DE PAGO (FUERA DEL TICKET, ALINEADAS A LA DERECHA) ===== */}
  <input
    ref={fileInputRef}
    type="file"
    accept="image/*,application/pdf"
    className="hidden"
    onChange={handleComprobanteChange}
  />

  <div className="flex justify-end gap-3 pt-2">
    {metodoPago === "qr" && (
      <button
        type="button"
        onClick={handleSeleccionarComprobante}
        className="flex h-11 w-52 items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[var(--brand-dark)]"
      >
        {comprobanteArchivo ? (
          <>
            <RefreshCw className="h-4 w-4" />
            Reemplazar
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Subir comprobante
          </>
        )}
      </button>
    )}

    {metodoPago === "efectivo" && !pedidoConfirmadoEfectivo && (
      <button
        type="button"
        onClick={handleConfirmarEfectivo}
        className="flex h-11 w-52 items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[var(--brand-dark)]"
      >
        <CheckCircle2 className="h-4 w-4" />
        Confirmar pedido
      </button>
    )}
  </div>
</div>
{/* ===== FIN TICKET ===== */}

                
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-center text-xs text-slate-400 space-y-1 sm:text-left">
            <p>{voucherData?.footerNote || DEFAULT_FOOTER}</p>
            {empresa?.sitio_web && (
              <p className="font-semibold text-[var(--brand)]">{empresa.sitio_web}</p>
            )}
          </div>

          {redesSociales.length > 0 && (
            <div className="flex items-center justify-center gap-2 sm:justify-end">
              {redesSociales.map(({ url, Icon, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}