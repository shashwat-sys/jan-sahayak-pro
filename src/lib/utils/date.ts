import { format, formatDistanceToNowStrict } from "date-fns";

export function formatDisplayDate(date: string | null | undefined) {
  if (!date) {
    return "—";
  }

  return format(new Date(date), "dd MMM yyyy");
}

export function daysSince(date: string | null | undefined) {
  if (!date) {
    return 0;
  }

  const diffMs = Date.now() - new Date(date).getTime();
  return Math.floor(diffMs / 86_400_000);
}

export function daysUntil(date: string | null | undefined) {
  if (!date) {
    return Number.POSITIVE_INFINITY;
  }

  const diffMs = new Date(date).getTime() - Date.now();
  return Math.floor(diffMs / 86_400_000);
}

export function humanizeRelativeDate(date: string | null | undefined) {
  if (!date) {
    return "—";
  }

  return formatDistanceToNowStrict(new Date(date), { addSuffix: true });
}

export function monthKey(date: string) {
  return date.slice(0, 7);
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}
