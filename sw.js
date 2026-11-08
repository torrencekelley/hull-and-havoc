// Hull & Havoc service worker — bump HH_CACHE on every release so phones pick up the new build.
var HH_CACHE = 'hull-and-havoc-v4';
var HH_FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(HH_CACHE).then(function(c){ return c.addAll(HH_FILES); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.map(function(k){ return k === HH_CACHE ? null : caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(function(resp){
      var copy = resp.clone();
      caches.open(HH_CACHE).then(function(c){ c.put(e.request, copy); });
      return resp;
    }).catch(function(){ return caches.match(e.request, { ignoreSearch: true }); })
  );
});
