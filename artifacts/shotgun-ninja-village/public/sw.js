// Minimal service worker — required only for PWA installability prompts.
// Intentionally does NOT cache or intercept fetches to avoid stale assets
// during rapid release cycles. Update this file to add real offline strategy
// if/when the catalog stabilizes.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
