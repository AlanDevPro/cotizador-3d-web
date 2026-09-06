// src/features/voucher/components/VoucherPoliticas.tsx

import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import type { VoucherPolicy } from "../types/voucher.types";

/**
 * Convierte encabezados de políticas en etiquetas <strong>.
 * Soporta:
 *  - *• Anticipo:* o *• Anticipo:
 *  - • Anticipo: (sin asteriscos)
 */
function parseBoldText(text: string): ReactNode[] {
  // Regex que busca:
  // 1. Texto entre asteriscos: \*([^*]+)\*
  // 2. Texto que inicia con asterisco hasta dos puntos: \*([^*:]+:)
  // 3. Patrón de viñeta sin asteriscos hasta dos puntos: (•[^:]+:)
  const regex = /(\*[^*]+\*|\*[^*:]+:|•[^:]+:)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    const isMatch =
      (part.startsWith("*") && part.endsWith("*")) ||
      (part.startsWith("*") && part.includes(":")) ||
      (part.startsWith("•") && part.includes(":"));

    if (isMatch) {
      // Limpia asteriscos residuales para obtener el texto limpio
      const cleanContent = part.replace(/\*/g, "");
      return (
        <strong key={index} className="font-semibold text-white">
          {cleanContent}
        </strong>
      );
    }

    return part;
  });
}

/**
 * Divide textos que contengan múltiples políticas en la misma cadena
 * usando la secuencia de separación ". • " o ".• "
 */
function splitMultiplePolicies(text: string): string[] {
  if (!text) return [];
  // Divide cuando hay un punto final seguido de viñeta
  const rawSegments = text.split(/(?<=\.)\s*(?=•)/g);
  return rawSegments.map((s) => s.trim()).filter(Boolean);
}

export function VoucherPoliticas({ politicas }: { politicas: VoucherPolicy[] }) {
  if (!politicas || politicas.length === 0) return null;

  // Aplanar y separar todas las políticas en ítems individuales
  const listaPoliticas = politicas.flatMap((pol) => {
    const subTextos = splitMultiplePolicies(pol.text);
    return subTextos.map((subText) => ({
      label: pol.label,
      text: subText,
    }));
  });

  return (
    <div className="mt-6 rounded-xl bg-[var(--dark-bg)] p-4 text-white">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--brand)]">
        <ShieldCheck className="h-4 w-4" />
        Políticas de contratación y servicio
      </p>

      <div className="mt-2 space-y-2 text-xs leading-relaxed text-slate-300">
        {listaPoliticas.map((pol, idx) => (
          <p key={idx} className="flex flex-wrap gap-x-1">
            <span>{parseBoldText(pol.text)}</span>
          </p>
        ))}
      </div>
    </div>
  );
}