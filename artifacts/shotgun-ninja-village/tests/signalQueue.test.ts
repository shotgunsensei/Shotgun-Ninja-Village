import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createSignup } from "@workspace/api-client-react";
import { queueSignal, getQueuedSignals, clearQueuedSignals, flushQueuedSignals } from "@/lib/signalQueue";

vi.mock("@workspace/api-client-react", () => ({ createSignup: vi.fn() }));

describe("signalQueue", () => {
  beforeEach(() => {
    clearQueuedSignals();
    vi.mocked(createSignup).mockReset();
  });

  afterEach(() => vi.restoreAllMocks());

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

  it("rejects a queue write that storage did not persist", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage full", "QuotaExceededError");
    });
    expect(queueSignal("lost@x.test")).toBe(false);
    expect(getQueuedSignals()).toEqual([]);
  });

  it("ignores valid JSON with an invalid queue shape", () => {
    localStorage.setItem("sn_signal_queue_v1", '{"email":"wrong@x.test"}');
    expect(getQueuedSignals()).toEqual([]);
    localStorage.setItem("sn_signal_queue_v1", '[null,{"email":1,"ts":1},{"email":"ok@x.test","ts":2}]');
    expect(getQueuedSignals()).toEqual([{ email: "ok@x.test", ts: 2 }]);
  });

  it("keeps signups queued while a flush is awaiting the server", async () => {
    let release!: () => void;
    vi.mocked(createSignup).mockImplementationOnce(() => new Promise((resolve) => {
      release = () => resolve({ ok: true, alreadySubscribed: false });
    }));
    queueSignal("first@x.test");
    const flush = flushQueuedSignals();
    queueSignal("second@x.test");
    release();
    expect(await flush).toEqual({ flushed: 1, remaining: 1 });
    expect(getQueuedSignals().map((item) => item.email)).toEqual(["second@x.test"]);
  });

  it("shares concurrent flushes and keeps failed requests queued", async () => {
    let reject!: (error: Error) => void;
    vi.mocked(createSignup).mockImplementationOnce(() => new Promise((_resolve, fail) => {
      reject = fail;
    }));
    queueSignal("retry@x.test");
    const first = flushQueuedSignals();
    const second = flushQueuedSignals();
    expect(first).toBe(second);
    reject(new Error("Offline"));
    expect(await first).toEqual({ flushed: 0, remaining: 1 });
    expect(createSignup).toHaveBeenCalledTimes(1);
  });

  it("reports the persisted queue when cleanup cannot be stored", async () => {
    queueSignal("retry@x.test");
    vi.mocked(createSignup).mockResolvedValue({ ok: true, alreadySubscribed: false });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage full", "QuotaExceededError");
    });
    expect(await flushQueuedSignals()).toEqual({ flushed: 1, remaining: 1 });
    expect(getQueuedSignals()).toHaveLength(1);
  });
});
