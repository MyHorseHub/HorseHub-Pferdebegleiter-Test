const CACHE='horsehub-1.55.0';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./horse-companion.css?v=1.55.0','./companion-db.js?v=1.55.0','./horse-companion.js?v=1.55.0','./andalusier-head-neck-clean.png?v=1.55.0'];

self.addEventListener('install',event=>event.waitUntil(
  caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())
));

self.addEventListener('activate',event=>event.waitUntil(
  caches.keys().then(keys=>Promise.all(
    keys.filter(key=>key.startsWith('horsehub-') && key!==CACHE).map(key=>caches.delete(key))
  )).then(()=>self.clients.claim())
));

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  const isNavigation=event.request.mode==='navigate' || event.request.destination==='document' || url.pathname.endsWith('/index.html');
  if(isNavigation){
    event.respondWith(
      fetch(event.request, {cache:'no-store'})
        .then(response=>{
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put('./index.html',copy)).catch(()=>{});
          return response;
        })
        .catch(()=>caches.match('./index.html'))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached=>cached || fetch(event.request).then(response=>{
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});
      return response;
    }).catch(()=>caches.match('./index.html')))
  );
});
