// Klavye Ustası: önce internetten alır, bağlantı yoksa son kaydedilen sürümü açar
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(function (r) {
    if (r.ok) {
      var k = r.clone(), k2 = e.request.mode === "navigate" ? r.clone() : null;
      caches.open("ku1").then(function (c) { c.put(e.request, k); if (k2) c.put("./", k2); });
    }
    return r;
  }).catch(function () {
    return caches.match(e.request).then(function (r) { return r || caches.match("./"); });
  }));
});
