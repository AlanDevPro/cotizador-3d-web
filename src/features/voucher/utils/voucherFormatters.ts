//src/features/voucher/utils/voucherFormatters.ts
import type { PiezaDetalle, FilaVoucher } from "../types/voucher.types";

export function formatBs(monto: number): string {
  const numero = new Intl.NumberFormat("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(monto);
  return `${numero} Bs`;
}

export function formatFecha(iso?: string): string {
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

export function formatFechaHora(fecha: Date): string {
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

export function detalleTecnicoPieza(p: PiezaDetalle): string | null {
  const partes: string[] = [];
  if (typeof p.peso_gramos === "number" && p.peso_gramos > 0) {
    partes.push(`Peso: ~${p.peso_gramos}g`);
  }
  if (typeof p.tiempo_impresion_horas === "number" && p.tiempo_impresion_horas > 0) {
    partes.push(`Tiempo: ${p.tiempo_impresion_horas}h`);
  }
  return partes.length > 0 ? partes.join(" · ") : null;
}

export function mapearPiezaAFilaVoucher(pieza: PiezaDetalle): FilaVoucher {
  const material = pieza.filamento?.material || "PLA";
  const color = pieza.filamento?.color || "Estándar";
  const colorHex = pieza.filamento?.color_hex || null;

  return {
    pieza,
    descripcion: pieza.nombre_pieza,
    cantidad: pieza.cantidad,
    precioUnitario: pieza.cantidad > 0 ? pieza.precio_total_pieza / pieza.cantidad : 0,
    total: pieza.precio_total_pieza,
    material,
    color,
    colorHex,
    materialColor: `${material} - ${color}`,
    detalleTecnico: detalleTecnicoPieza(pieza),
  };
}

export function mapearPiezasAFilasVoucher(piezas: PiezaDetalle[]): FilaVoucher[] {
  if (!Array.isArray(piezas)) return [];
  return piezas.map(mapearPiezaAFilaVoucher);
}