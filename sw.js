// Speichert die App-Dateien auf dem Gerät, damit sie ohne Internet startet.
// Deine Aufgaben werden hier NICHT verarbeitet – die liegen im lokalen Speicher der App.
const CACHE = "aufgaben-v11";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./apple-touch-icon.png", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      if (e.request.mode === "navigate") return caches.match("./index.html").then((r) => r || fetch(e.request));
      return fetch(e.request);
    })
  );
});
