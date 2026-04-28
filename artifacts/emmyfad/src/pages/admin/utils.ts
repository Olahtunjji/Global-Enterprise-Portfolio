export function formatUSD(cents: number | null | undefined): string {
  const c = cents ?? 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(c / 100);
}

export function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

export const STATUS_COLOR: Record<string, string> = {
  new: "bg-blue-500/15 text-blue-700 border-blue-300",
  reviewing: "bg-amber-500/15 text-amber-800 border-amber-300",
  contracted: "bg-emerald-500/15 text-emerald-800 border-emerald-300",
  completed: "bg-slate-500/15 text-slate-800 border-slate-300",
  cancelled: "bg-red-500/15 text-red-700 border-red-300",
};

export const PAYMENT_STATUS_COLOR: Record<string, string> = {
  draft: "bg-slate-500/15 text-slate-800 border-slate-300",
  sent: "bg-blue-500/15 text-blue-700 border-blue-300",
  paid: "bg-emerald-500/15 text-emerald-800 border-emerald-300",
  refunded: "bg-amber-500/15 text-amber-800 border-amber-300",
  cancelled: "bg-red-500/15 text-red-700 border-red-300",
  error: "bg-red-500/15 text-red-700 border-red-300",
};
