// src/features/voucher/components/ticket/TicketNotasLegales.tsx

export function TicketNotasLegales({ notas }: { notas: string[] }) {
  return (
    <div className="border-t-2 border-dashed border-slate-300 bg-slate-50/70 px-6 py-3">
      <ul className="space-y-1 text-[10.5px] leading-relaxed text-slate-500">
        {notas.map((nota, idx) => (
          <li key={idx} className="flex gap-1.5">
            <span className="text-slate-300">•</span>
            <span>{nota}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}