// Saves every page of this site on the phone so it opens without internet.
// Online: always fetches the newest copy. Offline: uses the saved copy.
const CACHE='p6cm-v2';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
 const r=e.request;
 if(r.method!=='GET'||new URL(r.url).origin!==self.location.origin)return;
 e.respondWith((async()=>{
  const c=await caches.open(CACHE);
  try{
   const res=await Promise.race([fetch(r),new Promise((_,no)=>setTimeout(no,4000))]);
   if(res&&res.ok)c.put(r,res.clone());
   return res;
  }catch(x){
   const hit=await c.match(r);
   return hit||new Response('You are offline and this page was not saved yet.',{status:503});
  }
 })());
});
