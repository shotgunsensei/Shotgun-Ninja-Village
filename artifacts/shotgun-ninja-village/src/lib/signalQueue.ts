const STORAGE_KEY = "sn_signal_queue_v1";

interface QueuedSignal {
  email: string;
  ts: number;
}

export function queueSignal(email: string): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: QueuedSignal[] = raw ? JSON.parse(raw) : [];
    if (list.some((s) => s.email === email)) return true;
    list.push({ email, ts: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(-50)));
    return true;
  } catch {
    return false;
  }
}

export function getQueuedSignals(): QueuedSignal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearQueuedSignals() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}
