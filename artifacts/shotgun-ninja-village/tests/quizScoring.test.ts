import { describe, it, expect } from "vitest";
import {
  EMPTY_SCORES,
  applyOptionScores,
  computeTopArchetype,
  type Scores,
} from "@/lib/quizScoring";

describe("applyOptionScores", () => {
  it("adds partial option scores onto the running totals", () => {
    const next = applyOptionScores(EMPTY_SCORES, { builder: 2, tracer: 1 });
    expect(next).toEqual({ builder: 2, protector: 0, tracer: 1, breaker: 0 });
  });

  it("accumulates across multiple answers", () => {
    let scores: Scores = EMPTY_SCORES;
    scores = applyOptionScores(scores, { builder: 2, tracer: 1 });
    scores = applyOptionScores(scores, { builder: 1, protector: 2 });
    expect(scores).toEqual({ builder: 3, protector: 2, tracer: 1, breaker: 0 });
  });

  it("ignores zero and undefined values", () => {
    const next = applyOptionScores(EMPTY_SCORES, { protector: 2, breaker: 0 });
    expect(next).toEqual({ builder: 0, protector: 2, tracer: 0, breaker: 0 });
  });

  it("does not mutate the input scores", () => {
    const original: Scores = { builder: 1, protector: 1, tracer: 1, breaker: 1 };
    applyOptionScores(original, { builder: 5 });
    expect(original.builder).toBe(1);
    expect(EMPTY_SCORES).toEqual({ builder: 0, protector: 0, tracer: 0, breaker: 0 });
  });
});

describe("computeTopArchetype", () => {
  it("picks the archetype with the highest score", () => {
    expect(
      computeTopArchetype({ builder: 3, protector: 7, tracer: 2, breaker: 5 }),
    ).toBe("protector");
    expect(
      computeTopArchetype({ builder: 9, protector: 1, tracer: 0, breaker: 2 }),
    ).toBe("builder");
  });

  it("breaks ties in favor of the later archetype in key order", () => {
    // builder vs breaker tie → breaker (later in key order) wins
    expect(
      computeTopArchetype({ builder: 4, protector: 0, tracer: 0, breaker: 4 }),
    ).toBe("breaker");
    // protector vs tracer tie → tracer wins
    expect(
      computeTopArchetype({ builder: 1, protector: 5, tracer: 5, breaker: 0 }),
    ).toBe("tracer");
  });

  it("handles an all-zero (untouched) score object", () => {
    // Four-way tie → last key wins, and it must not throw
    expect(computeTopArchetype(EMPTY_SCORES)).toBe("breaker");
  });
});
