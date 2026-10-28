/* Offline cache for the selectors and their repository-hosted cover artwork. */
const CACHE='games-planet-local-covers-20261028-v1';
const ASSETS=["./","index.html","PS2GAMESELECTOR.html","ps3_selector.html","PS4_GAME_SELECTOR.html","PCGAMESELECTOR.html","cover-preview.js","images/cover-catalog.js","images/pc-covers-01.jpg","images/pc-covers-02.jpg","images/pc-covers-03.jpg","images/pc-covers-04.jpg","images/pc-covers-05.jpg","images/pc-covers-06.jpg","images/ps2-covers-01.jpg","images/ps2-covers-02.jpg","images/ps2-covers-03.jpg","images/ps2-covers-04.jpg","images/ps2-covers-05.jpg","images/ps2-covers-06.jpg","images/ps2-covers-07.jpg","images/ps2-covers-08.jpg","images/ps2-covers-09.jpg","images/ps2-covers-10.jpg","images/ps2-covers-11.jpg","images/ps2-covers-12.jpg","images/ps2-covers-13.jpg","images/ps3-covers-01.jpg","images/ps3-covers-02.jpg","images/ps3-covers-03.jpg","images/ps3-covers-04.jpg","images/ps3-covers-05.jpg","images/ps3-covers-06.jpg","images/ps4-covers-01.jpg","images/ps4-covers-02.jpg","images/ps4-covers-03.jpg","images/ps4-covers-04.jpg","images/ps4-covers-05.jpg","images/ps4-covers-06.jpg","images/ps4-covers-07.jpg"];
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(ASSETS);await self.skipWaiting();})());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('games-planet-local-covers-')&&key!==CACHE)await caches.delete(key);await self.clients.claim();})());
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  if(event.request.mode==='navigate'){
   try{const response=await fetch(event.request);if(response.ok)await cache.put(event.request,response.clone());return response;}
   catch(error){const saved=await cache.match(event.request,{ignoreSearch:true});if(saved)return saved;throw error;}
  }
  const saved=await cache.match(event.request,{ignoreSearch:true});
  if(saved)return saved;
  const response=await fetch(event.request);
  if(response.ok&&/\/(?:images\/|cover-preview\.js)/.test(new URL(event.request.url).pathname))await cache.put(event.request,response.clone());
  return response;
 })());
});
