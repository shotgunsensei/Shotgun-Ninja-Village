import { describe, it, expect, beforeEach } from "vitest";
import { queueSignal, getQueuedSignals, clearQueuedSignals } from "@/lib/signalQueue";

describe("signalQueue", () => {
  beforeEach(() => {
    clearQueuedSignals();
  });

  it("queues a single signal", () => {
    const ok = queueSignal("op@village.test");
    expect(ok).toBe(true);
    const list = getQueuedSignals();
    expect(list).toHaveLength(1);
    expect(list[0].email).toBe("op@village.test");
    expect(typeof list[0].ts).toBe("number");
  });

  it("deduplicates by email", () => {
    queueSignal("a@x.test");
    queueSignal("a@x.test");
    queueSignal("b@x.test");
    const list = getQueuedSignals();
    expect(list).toHaveLength(2);
    expect(list.map((s) => s.email).sort()).toEqual(["a@x.test", "b@x.test"]);
  });

  it("clears the queue", () => {
    queueSignal("c@x.test");
    expect(getQueuedSignals()).toHaveLength(1);
    clearQueuedSignals();
    expect(getQueuedSignals()).toHaveLength(0);
  });

  it("caps storage at 50 entries", () => {
    for (let i = 0; i < 60; i++) {
      queueSignal(`u${i}@x.test`);
    }
    const list = getQueuedSignals();
    expect(list.length).toBeLessThanOrEqual(50);
    expect(list[list.length - 1].email).toBe("u59@x.test");
  });

  it("returns an empty list when storage is unset", () => {
    clearQueuedSignals();
    expect(getQueuedSignals()).toEqual([]);
  });

  it("survives malformed storage gracefully", () => {
    localStorage.setItem("sn_signal_queue_v1", "{not json");
    expect(getQueuedSignals()).toEqual([]);
  });
});
