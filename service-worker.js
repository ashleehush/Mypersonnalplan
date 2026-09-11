/* Service worker "réseau d'abord" : tant que tu as du réseau, l'appli va
   toujours chercher la dernière version des fichiers (donc plus jamais
   coincée sur une ancienne version). Le cache ne sert que de secours si
   jamais tu es hors-ligne. */
const CACHE_NAME = "bible-tracker-shell-v15";
const SHELL_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./firebase-config.js",
  "./video-config.js",
  "./music-config.js",
  "./livres-config.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
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
  // On ne gère que les fichiers de l'appli elle-même (même origine).
  // Tout ce qui va vers Google/Firebase part directement sur le réseau.
  if(url.origin !== self.location.origin){ return; }

  event.respondWith(
    fetch(event.request).then(res=>{
      const copy = res.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put(event.request, copy));
      return res;
    }).catch(()=> caches.match(event.request))
  );
});
