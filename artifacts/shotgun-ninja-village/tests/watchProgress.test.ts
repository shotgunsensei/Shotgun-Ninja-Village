import { describe, it, expect, beforeEach } from "vitest";
import {
  WATCH_KEY,
  markWatched,
  getWatched,
  getNextUnwatched,
} from "@/lib/watchProgress";

beforeEach(() => {
  localStorage.clear();
});

describe("getWatched", () => {
  it("returns an empty array when nothing is stored", () => {
    expect(getWatched()).toEqual([]);
  });

  it("returns stored episode numbers", () => {
    localStorage.setItem(WATCH_KEY, JSON.stringify(["01", "02"]));
    expect(getWatched()).toEqual(["01", "02"]);
  });

  it("returns [] for malformed JSON instead of throwing", () => {
    localStorage.setItem(WATCH_KEY, "{not valid json!!");
    expect(getWatched()).toEqual([]);
  });

  it("returns [] when stored value is not an array", () => {
    localStorage.setItem(WATCH_KEY, JSON.stringify({ "01": true }));
    expect(getWatched()).toEqual([]);
    localStorage.setItem(WATCH_KEY, JSON.stringify("01"));
    expect(getWatched()).toEqual([]);
    localStorage.setItem(WATCH_KEY, JSON.stringify(42));
    expect(getWatched()).toEqual([]);
  });

  it("filters out non-string entries from a corrupted array", () => {
    localStorage.setItem(WATCH_KEY, JSON.stringify(["01", 2, null, "03", {}]));
    expect(getWatched()).toEqual(["01", "03"]);
  });
});

describe("markWatched", () => {
  it("adds an episode and persists it", () => {
    markWatched("01");
    expect(getWatched()).toEqual(["01"]);
    markWatched("02");
    expect(getWatched()).toEqual(["01", "02"]);
  });

  it("does not duplicate an already-watched episode", () => {
    markWatched("01");
    markWatched("01");
    expect(getWatched()).toEqual(["01"]);
  });

  it("recovers from malformed stored state by starting fresh", () => {
    localStorage.setItem(WATCH_KEY, "corrupt###");
    markWatched("02");
    expect(getWatched()).toEqual(["02"]);
  });
});

describe("getNextUnwatched", () => {
  const ALL = ["01", "02", "03"];

  it("returns the first episode when nothing is watched", () => {
    expect(getNextUnwatched(ALL)).toBe("01");
  });

  it("returns the first unwatched episode in order", () => {
    markWatched("01");
    expect(getNextUnwatched(ALL)).toBe("02");
    markWatched("02");
    expect(getNextUnwatched(ALL)).toBe("03");
  });

  it("skips gaps correctly", () => {
    markWatched("02");
    expect(getNextUnwatched(ALL)).toBe("01");
  });

  it("returns null when everything is watched", () => {
    ALL.forEach(markWatched);
    expect(getNextUnwatched(ALL)).toBeNull();
  });

  it("treats malformed storage as nothing watched", () => {
    localStorage.setItem(WATCH_KEY, "!!!");
    expect(getNextUnwatched(ALL)).toBe("01");
  });
});
