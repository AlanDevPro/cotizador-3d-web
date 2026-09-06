// src/features/voucher/components/VoucherTabsPiezas.tsx

import type { TabId } from "../types/voucher.types";

interface VoucherTabsPiezasProps {
  tabs: { id: TabId; label: string }[];
  tabActivo: TabId;
  onCambiarTab: (id: TabId) => void;
  visible: boolean;
}

export function VoucherTabsPiezas({ tabs, tabActivo, onCambiarTab, visible }: VoucherTabsPiezasProps) {
  if (!visible) return null;

  return (
    <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => {
        const activo = tab.id === tabActivo;
        return (
          <button
            key={tab.id}
            onClick={() => onCambiarTab(tab.id)}
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
  );
}