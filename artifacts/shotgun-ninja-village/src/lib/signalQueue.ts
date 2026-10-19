import { createSignup } from "@workspace/api-client-react";

const STORAGE_KEY = "sn_signal_queue_v1";

export interface QueuedSignal {
  email: string;
  ts: number;
}

function readQueue(): QueuedSignal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(
      (item): item is QueuedSignal =>
        item !== null && typeof item === "object" &&
        typeof item.email === "string" && typeof item.ts === "number" &&
        Number.isFinite(item.ts),
    ) : [];
  } catch {
    return [];
  }
}

function writeQueue(list: QueuedSignal[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(-50)));
    return true;
  } catch {
    return false;
  }
}

export function queueSignal(email: string): boolean {
  try {
    const list = readQueue();
    if (list.some((s) => s.email === email)) return true;
    list.push({ email, ts: Date.now() });
    return writeQueue(list);
  } catch {
    return false;
  }
}

export function getQueuedSignals(): QueuedSignal[] {
  return readQueue();
}

export function clearQueuedSignals() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}

type FlushResult = {
  flushed: number;
  remaining: number;
};

let flushInFlight: Promise<FlushResult> | null = null;

async function flushSnapshot(source: string): Promise<FlushResult> {
  const list = readQueue();
  if (list.length === 0) return { flushed: 0, remaining: 0 };

  const delivered = new Set<QueuedSignal>();
  let flushed = 0;

  for (const item of list) {
    try {
      await createSignup({ email: item.email, source });
      flushed += 1;
      delivered.add(item);
    } catch {
      // Keep failed entries available for the next retry.
    }
  }

  // A signup can be queued while the requests above are pending. Reconcile
  // against current storage, removing only the snapshot entries delivered.
  const remaining = readQueue().filter(
    (current) => ![...delivered].some(
      (item) => item.email === current.email && item.ts === current.ts,
    ),
  );
  writeQueue(remaining);
  return { flushed, remaining: readQueue().length };
}

export function flushQueuedSignals(source = "queue-flush"): Promise<FlushResult> {
  if (flushInFlight) return flushInFlight;
  const operation = flushSnapshot(source);
  flushInFlight = operation;
  const clear = () => {
    if (flushInFlight === operation) flushInFlight = null;
  };
  void operation.then(clear, clear);
  return operation;
}

export function exportQueuedSignalsAsCsv(): string {
  const list = readQueue();
  const header = "email,queued_at_iso\n";
  const rows = list
    .map((s) => `${s.email.replace(/"/g, '""')},${new Date(s.ts).toISOString()}`)
    .join("\n");
  return header + rows + (rows ? "\n" : "");
}
