const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatearFechaYHora(fecha: string): string {
  const date = new Date(fecha);
  return dateFormatter.format(date);
}

export function ellipsisText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) {
    return text || "";
  }
  return text.substring(0, maxLength) + "...";
}

export function capitalize(s: string | null | undefined): string {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('es-ES').format(num);
}
