export type Archetype = "builder" | "protector" | "tracer" | "breaker";

export type Scores = Record<Archetype, number>;

export const EMPTY_SCORES: Scores = {
  builder: 0,
  protector: 0,
  tracer: 0,
  breaker: 0,
};

/**
 * Add an option's partial scores onto the running totals.
 * Returns a new object; does not mutate the input.
 */
export function applyOptionScores(
  scores: Scores,
  optionScores: Partial<Record<Archetype, number>>,
): Scores {
  const next = { ...scores };
  (Object.entries(optionScores) as [Archetype, number | undefined][]).forEach(
    ([key, val]) => {
      if (val) {
        next[key] += val;
      }
    },
  );
  return next;
}

/**
 * Pick the winning archetype. On a tie, the archetype that appears later
 * in the scores object's key order wins (builder → protector → tracer →
 * breaker), matching the original quiz behavior.
 */
export function computeTopArchetype(scores: Scores): Archetype {
  return Object.entries(scores).reduce((a, b) =>
    a[1] > b[1] ? a : b,
  )[0] as Archetype;
}
