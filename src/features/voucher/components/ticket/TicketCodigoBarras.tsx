// src/features/voucher/components/ticket/TicketCodigoBarras.tsx

export function TicketCodigoBarras({ codigoPedido }: { codigoPedido: string }) {
  return (
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
  );
}