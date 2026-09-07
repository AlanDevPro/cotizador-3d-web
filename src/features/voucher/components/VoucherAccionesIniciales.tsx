interface VoucherAccionesInicialesProps {
  onCancelar?: () => void;
  onAceptar: () => void;
  loading?: boolean;
}

export function VoucherAccionesIniciales({
  onCancelar,
  onAceptar,
  loading = false,
}: VoucherAccionesInicialesProps) {
  return (
    <div className="mt-6 flex gap-3">
      <button
        type="button"
        onClick={onCancelar}
        disabled={loading}
        className="flex-1 rounded-xl border border-slate-300 bg-white py-3 text-xs font-bold uppercase tracking-wider text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
      >
        Cancelar pedido
      </button>
      <button
        type="button"
        onClick={onAceptar}
        disabled={loading}
        className="flex-1 rounded-xl bg-[var(--brand)] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[var(--brand-dark)] disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Creando pedido...</span>
          </>
        ) : (
          "Aceptar pedido"
        )}
      </button>
    </div>
  );
}