import { createSignup } from "@workspace/api-client-react";

const STORAGE_KEY = "sn_signal_queue_v1";

export interface QueuedSignal {
  email: string;
  ts: number;
}

function readQueue(): QueuedSignal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as QueuedSignal[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(list: QueuedSignal[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(-50)));
  } catch {
    /* noop */
  }
}

export function queueSignal(email: string): boolean {
  try {
    const list = readQueue();
    if (list.some((s) => s.email === email)) return true;
    list.push({ email, ts: Date.now() });
    writeQueue(list);
    return true;
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

export async function flushQueuedSignals(source = "queue-flush"): Promise<{
  flushed: number;
  remaining: number;
}> {
  const list = readQueue();
  if (list.length === 0) return { flushed: 0, remaining: 0 };

  const remaining: QueuedSignal[] = [];
  let flushed = 0;

  for (const item of list) {
    try {
      await createSignup({ email: item.email, source });
      flushed += 1;
    } catch {
      remaining.push(item);
    }
  }

  writeQueue(remaining);
  return { flushed, remaining: remaining.length };
}

export function exportQueuedSignalsAsCsv(): string {
  const list = readQueue();
  const header = "email,queued_at_iso\n";
  const rows = list
    .map((s) => `${s.email.replace(/"/g, '""')},${new Date(s.ts).toISOString()}`)
    .join("\n");
  return header + rows + (rows ? "\n" : "");
}
