/* Service worker TeGe TKA Sejarah - versi 1.1.0 */
var VERSION = '1.1.0';
var CACHE = 'tg-tka-' + VERSION;
var PRECACHE = [
 "./",
 "assets/bg-landscape.webp",
 "assets/bg-potret.webp",
 "assets/cover-1.webp",
 "assets/cover-2.webp",
 "assets/cover-3.webp",
 "assets/cover-4.webp",
 "assets/cover-5.webp",
 "css/app.css",
 "fonts/PlayfairDisplay-Bold.ttf",
 "fonts/PlayfairDisplay-SemiBold.ttf",
 "fonts/PlayfairDisplay-SemiBoldItalic.ttf",
 "fonts/PlusJakartaSans-Bold.ttf",
 "fonts/PlusJakartaSans-Medium.ttf",
 "fonts/PlusJakartaSans-Regular.ttf",
 "fonts/PlusJakartaSans-SemiBold.ttf",
 "icons/apple-touch-icon.png",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "index.html",
 "js/alat.js",
 "js/app.js",
 "js/materi.js",
 "js/sertifikat.js",
 "js/soal.js",
 "js/version.js",
 "manifest.webmanifest"
];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(PRECACHE.map(function (u) { return c.add(new Request(u, { cache: 'reload' })); }));
  }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf('tg-tka-') === 0 && k !== CACHE && k !== 'tg-tka-fonts'; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('message', function (e) { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', function (e) {
  var req = e.request; if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open('tg-tka-fonts').then(function (c) {
      return c.match(req).then(function (hit) {
        var net = fetch(req).then(function (r) { if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r; }).catch(function () { return hit; });
        return hit || net;
      });
    }));
    return;
  }
  if (url.origin !== location.origin) return;
  if (url.pathname.indexOf('/pdf/') >= 0) return;
  if (req.mode === 'navigate') {
    e.respondWith(caches.match('./index.html').then(function (hit) { return hit || fetch(req); }));
    return;
  }
  e.respondWith(caches.match(req).then(function (hit) { return hit || fetch(req); }));
});
