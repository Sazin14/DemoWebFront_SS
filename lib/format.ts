const formatterCache = new Map<string, Intl.NumberFormat>();

/** Single place for price formatting so currency can change centrally. */
export function formatPrice(amount: number, currency = "USD"): string {
  let formatter = formatterCache.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", { style: "currency", currency });
    formatterCache.set(currency, formatter);
  }
  return formatter.format(amount);
}

export function roundMoney(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}
