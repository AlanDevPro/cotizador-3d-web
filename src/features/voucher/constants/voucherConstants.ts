// src/features/voucher/constants/voucherConstants.ts

import type { Tema } from "../types/voucher.types";

export const DEFAULT_TAGLINE = "Servicios de manufactura, prototipado e impresión 3D";
export const DEFAULT_VALIDEZ = "Cotización válida por 24 horas desde la fecha de emisión.";
export const DEFAULT_TITULO = "COTIZACIÓN";
export const DEFAULT_FOOTER = "Gracias por confiar en nuestros servicios. Calidad y precisión en cada proyecto.";
export const DEFAULT_UBICACION = "Dirección del taller no configurada. Contáctanos para más detalles.";
export const DEFAULT_GARANTIA_DIAS = 15;

export const COSTO_ENVIO_DOMICILIO = 10;
export const PORCENTAJE_ANTICIPO = 0.5;

// Tokens de tema: cada tema define las variables CSS que pintan todo el voucher
export const TEMAS: Record<Tema, Record<string, string>> = {
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