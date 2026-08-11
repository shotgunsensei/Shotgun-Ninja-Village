export const WATCH_KEY = "sn_watch_progress";

export function markWatched(num: string) {
  if (typeof window === "undefined") return;
  try {
    const current = getWatched();
    if (!current.includes(num)) {
      current.push(num);
      localStorage.setItem(WATCH_KEY, JSON.stringify(current));
    }
  } catch (e) {
    // ignore
  }
}

export function getWatched(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(WATCH_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === "string");
  } catch (e) {
    return [];
  }
}

export function getNextUnwatched(allNums: string[]): string | null {
  const watched = getWatched();
  for (const num of allNums) {
    if (!watched.includes(num)) {
      return num;
    }
  }
  return null;
}
