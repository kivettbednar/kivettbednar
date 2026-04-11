export function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2)
}

export function formatCurrency(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100)
}
