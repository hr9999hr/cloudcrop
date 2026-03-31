/**
 * Format a duration in milliseconds to a human-friendly string.
 * e.g. "3 days", "12 hours", "45 min"
 */
export function formatDuration(ms: number): string {
  const minutes = ms / 60000;
  const hours = ms / 3600000;
  const days = ms / 86400000;

  if (days >= 1) {
    const d = Math.round(days);
    return `${d} day${d !== 1 ? 's' : ''}`;
  }
  if (hours >= 1) {
    const h = Math.round(hours);
    return `${h} hour${h !== 1 ? 's' : ''}`;
  }
  const m = Math.round(minutes);
  return `${m} min`;
}
