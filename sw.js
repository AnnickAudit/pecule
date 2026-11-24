// Pécule — service worker généré au build
const CACHE = 'pecule-3c734a5d63ab'
const ASSETS = ["./","./assets/bricolage-grotesque-latin-ext-wght-normal-CcLUaPy7.woff2","./assets/bricolage-grotesque-latin-wght-normal-DLoelf7F.woff2","./assets/bricolage-grotesque-vietnamese-wght-normal-BUzh504Q.woff2","./assets/geist-cyrillic-ext-wght-normal-DjL33-gN.woff2","./assets/geist-cyrillic-wght-normal-BEAKL7Jp.woff2","./assets/geist-latin-ext-wght-normal-DC-KSUi6.woff2","./assets/geist-latin-wght-normal-BgDaEnEv.woff2","./assets/geist-vietnamese-wght-normal-6IgcOCM7.woff2","./assets/index-D1hxZfVq.js","./assets/index-D_perDvJ.css","./favicon.svg","./icons/apple-touch-icon.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png","./manifest.webmanifest"]

self.addEventListener('install', (event) => {
  event.waitUntil(
    // cache: 'reload' : on contourne le cache HTTP pour ne jamais figer une ancienne page d'accueil.
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(ASSETS.map((url) => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('pecule-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match('./', { cacheName: CACHE, ignoreVary: true }).then((hit) => hit || fetch(req)),
    )
    return
  }
  // ignoreVary : certains hébergeurs ajoutent « Vary: Origin », ce qui empêcherait de retrouver les fichiers hors-ligne.
  event.respondWith(
    caches.match(req, { cacheName: CACHE, ignoreSearch: true, ignoreVary: true }).then((hit) => hit || fetch(req)),
  )
})
