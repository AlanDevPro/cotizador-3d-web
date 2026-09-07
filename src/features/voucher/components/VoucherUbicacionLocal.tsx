"use client";

import { MapPin, Navigation, ExternalLink } from "lucide-react";

interface VoucherUbicacionLocalProps {
  direccion?: string;
  ubicacionUrl?: string; // URL de Google Maps para abrir en app/navegador
  mapaEmbedUrl?: string; // URL de iframe embed de Google Maps (opcional)
}

export function VoucherUbicacionLocal({
  direccion,
  ubicacionUrl,
  mapaEmbedUrl,
}: VoucherUbicacionLocalProps) {
  // Construye una URL de búsqueda en Google Maps si no se pasa una personalizada
  const urlDireccionGoogle =
    ubicacionUrl ||
    (direccion
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`
      : null);

  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-xs transition-all animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Punto de Pago y Recojo
            </h4>
            <p className="text-xs text-slate-600">
              Te esperamos en nuestro local para completar tu pedido
            </p>
          </div>
        </div>

        {urlDireccionGoogle && (
          <a
            href={urlDireccionGoogle}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
          >
            <Navigation className="h-3.5 w-3.5" />
            <span>Cómo llegar</span>
            <ExternalLink className="h-3 w-3 opacity-75" />
          </a>
        )}
      </div>

      {direccion && (
        <p className="mt-3 text-xs font-medium text-slate-700 bg-white/80 p-2.5 rounded-lg border border-emerald-100">
          <span className="font-bold text-slate-900">Dirección: </span>
          {direccion}
        </p>
      )}

      {/* Visualización del mapa embed interactivo */}
      <div className="mt-3 overflow-hidden rounded-xl border border-emerald-200/80 bg-slate-100">
        {mapaEmbedUrl ? (
          <iframe
            title="Ubicación del Local"
            src={mapaEmbedUrl}
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full grayscale-25 hover:grayscale-0 transition-all"
          />
        ) : urlDireccionGoogle ? (
          <iframe
            title="Ubicación del Local"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(
              direccion || ""
            )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            className="w-full"
          />
        ) : null}
      </div>
    </div>
  );
}