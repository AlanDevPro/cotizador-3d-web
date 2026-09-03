export function formatMoneda(value?: number, moneda = "Bs"): string {
  const safe = value === undefined || value === null || isNaN(value) ? 0 : value;
  return `${safe.toFixed(2).replace(".", ",")} ${moneda}`;
}

export function formatTiempo(horas?: number): string {
  const h = Math.floor(horas || 0);
  const m = Math.round(((horas || 0) - h) * 60);
  if (h <= 0 && m <= 0) return "0min";
  if (h <= 0) return `${m}min`;
  if (m <= 0) return `${h}hrs`;
  return `${h}hrs ${m}min`;
}