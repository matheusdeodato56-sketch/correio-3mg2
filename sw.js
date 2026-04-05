var CACHE = 'correio-3mg2-v1';
var ARQUIVOS = [
  '/correio-3mg2/',
  '/correio-3mg2/index.html',
  '/correio-3mg2/manifest.json',
  '/correio-3mg2/icon-192.png',
  '/correio-3mg2/icon-512.png'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(ARQUIVOS); })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k!==CACHE; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e){
  /* Requisições ao JSONBin sempre vão para a rede */
  if(e.request.url.includes('jsonbin.io')){
    e.respondWith(fetch(e.request));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function(r){ return r || fetch(e.request); })
  );
});
