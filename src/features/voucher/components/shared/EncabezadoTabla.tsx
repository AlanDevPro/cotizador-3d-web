// src/features/voucher/components/shared/EncabezadoTabla.tsx

export function EncabezadoTabla({
  icon: Icon,
  label,
  align = "left",
}: {
  icon: React.ElementType;
  label: string;
  align?: "left" | "center" | "right";
}) {
  const alignClass = align === "right" ? "justify-end" : align === "center" ? "justify-center" : "justify-start";
  return (
    <span className={`flex items-center gap-1.5 ${alignClass}`}>
      <Icon className="h-3.5 w-3.5 opacity-70" />
      {label}
    </span>
  );
}