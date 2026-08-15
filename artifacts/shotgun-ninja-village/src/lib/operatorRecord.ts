import { getWatched } from "./watchProgress";

export const QUIZ_RESULT_KEY = "sn_quiz_result";
export const ENLISTED_KEY = "sn_enlisted";

export type ArchetypeId = "builder" | "protector" | "tracer" | "breaker";

export interface SavedQuizResult {
  archetype: ArchetypeId;
  name: string;
  savedAt: string;
}

const ARCHETYPE_IDS: ArchetypeId[] = [
  "builder",
  "protector",
  "tracer",
  "breaker",
];

export function saveQuizResult(archetype: ArchetypeId, name: string) {
  if (typeof window === "undefined") return;
  try {
    const record: SavedQuizResult = {
      archetype,
      name,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(QUIZ_RESULT_KEY, JSON.stringify(record));
    window.dispatchEvent(new Event("sn:progress"));
  } catch {
    // ignore
  }
}

export function getQuizResult(): SavedQuizResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(QUIZ_RESULT_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      "archetype" in parsed &&
      typeof (parsed as { archetype: unknown }).archetype === "string" &&
      ARCHETYPE_IDS.includes(
        (parsed as { archetype: string }).archetype as ArchetypeId,
      ) &&
      "name" in parsed &&
      typeof (parsed as { name: unknown }).name === "string"
    ) {
      const p = parsed as {
        archetype: ArchetypeId;
        name: string;
        savedAt?: unknown;
      };
      return {
        archetype: p.archetype,
        name: p.name,
        savedAt: typeof p.savedAt === "string" ? p.savedAt : "",
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function markEnlisted() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ENLISTED_KEY, "1");
  } catch {
    // ignore
  }
}

export function isEnlisted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(ENLISTED_KEY) === "1";
  } catch {
    return false;
  }
}

export interface OperatorBadges {
  trilogyComplete: boolean;
  quizComplete: boolean;
  enlisted: boolean;
  earnedCount: number;
}

export function getOperatorBadges(
  allTransmissionNums: string[],
): OperatorBadges {
  const watched = getWatched();
  const trilogyComplete =
    allTransmissionNums.length > 0 &&
    allTransmissionNums.every((num) => watched.includes(num));
  const quizComplete = getQuizResult() !== null;
  const enlisted = isEnlisted();
  const earnedCount = [trilogyComplete, quizComplete, enlisted].filter(
    Boolean,
  ).length;
  return { trilogyComplete, quizComplete, enlisted, earnedCount };
}
