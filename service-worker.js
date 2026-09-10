/* Service worker minimal : met en cache la coquille de l'appli pour qu'elle
   s'ouvre même sans connexion. Les données (Firestore) suivent leur propre
   mécanisme de cache hors-ligne et ne passent pas par ici. */
const CACHE_NAME = "bible-tracker-shell-v1";
const SHELL_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./firebase-config.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event=>{
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache=>cache.addAll(SHELL_FILES)).then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate", event=>{
  event.waitUntil(
    caches.keys().then(names=>Promise.all(
      names.filter(n=>n!==CACHE_NAME).map(n=>caches.delete(n))
    )).then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch", event=>{
  const url = new URL(event.request.url);
  // On ne met en cache que les fichiers de l'appli elle-même (même origine).
  // Tout ce qui va vers Google/Firebase part directement sur le réseau.
  if(url.origin !== self.location.origin){ return; }
  event.respondWith(
    caches.match(event.request).then(cached=> cached || fetch(event.request))
  );
});
