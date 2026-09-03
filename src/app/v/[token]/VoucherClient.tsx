"use client";

import { useState, useEffect } from "react";
import { VoucherData, VoucherState } from "@/types/voucher";
import { buildVoucherHtml } from "@/lib/templates/voucherTemplate";

interface VoucherClientProps {
  initialData: VoucherData;
}

export default function VoucherClient({ initialData }: VoucherClientProps) {
  const [viewState, setViewState] = useState<VoucherState>("cotizacion");

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== "object") return;

      switch (event.data.type) {
        case "CONFIRM_QUOTE":
          setViewState("pago");
          break;
        case "CANCEL_QUOTE":
          setViewState("cancelado");
          break;
        case "BACK_TO_QUOTE":
        case "RESET_QUOTE":
          setViewState("cotizacion");
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const htmlContent = buildVoucherHtml(initialData, viewState);

  return (
    <div className="w-full min-h-screen bg-slate-100 flex flex-col items-center justify-center p-2 sm:p-6">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
        <iframe
          title="Voucher interactivo de Cotización"
          srcDoc={htmlContent}
          className="w-full h-[85vh] border-0"
        />
      </div>
    </div>
  );
}