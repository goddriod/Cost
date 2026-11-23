// Saves every page of this site on the phone so it opens without internet.
const CACHE='p6cm-v1';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
 const r=e.request;
 if(r.method!=='GET'||new URL(r.url).origin!==self.location.origin)return;
 e.respondWith((async()=>{
  const c=await caches.open(CACHE),hit=await c.match(r);
  const net=fetch(r).then(res=>{if(res&&res.ok)c.put(r,res.clone());return res}).catch(()=>null);
  if(hit){e.waitUntil(net);return hit}
  return (await net)||new Response('You are offline and this page was not saved yet.',{status:503});
 })());
});
