// src/features/voucher/components/VoucherAccionesIniciales.tsx

interface VoucherAccionesInicialesProps {
  onCancelar?: () => void;
  onAceptar: () => void;
}

export function VoucherAccionesIniciales({ onCancelar, onAceptar }: VoucherAccionesInicialesProps) {
  return (
    <div className="mt-6 flex gap-3">
      <button
        type="button"
        onClick={onCancelar}
        className="flex-1 rounded-xl border border-slate-300 bg-white py-3 text-xs font-bold uppercase tracking-wider text-slate-700 transition hover:bg-slate-50"
      >
        Cancelar pedido
      </button>
      <button
        type="button"
        onClick={onAceptar}
        className="flex-1 rounded-xl bg-[var(--brand)] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[var(--brand-dark)]"
      >
        Aceptar pedido
      </button>
    </div>
  );
}