/**
 * Convert a string to a Date object.
 * @param dateStr - The date string (e.g. "2025-12-22", "2025-12-22T16:30:00Z")
 * @returns Date object or null if invalid
 */
export function stringToDate(dateStr: string): Date | null {
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Convert a Date object to a formatted string.
 * @param date - The Date object
 * @param format - Optional format ("YYYY-MM-DD", "YYYY-MM-DD HH:mm:ss")
 * @returns formatted string
 */
export function dateToString(date: Date, format: 'date' | 'datetime' = 'date'): string {
  const pad = (n: number) => n.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  if (format === 'datetime') {
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  return `${year}-${month}-${day}`;
}
