const namaCache = "todo-app-v1";
const daftarShell = [
  "./offline.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icons/icon-uk-192.png",
  "./icons/icon-uk-512.png"
];

self.addEventListener("install", function (event){
  event.waitUntil(
    caches.open(namaCache).then(function (cache){
      return cache.addAll(daftarShell);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event){
  event.waitUntil(
    caches.keys().then(function (daftar){
      return Promise.all(
        daftar
          .filter(function (nama){
            return nama.startsWith("todo-app-") && nama !== namaCache;
          })
          .map(function (nama){
            return caches.delete(nama);
          })
      );
    }).then(function (){
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event){
  const request = event.request;
  if (request.method === "POST" && request.mode === "navigate"){
    event.respondWith(
      fetch(request).catch(function (){
        return caches.match("./offline.html");
      })
    );
    return;
  }
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate"){
    event.respondWith(networkFirst(request));
    return;
  }

  if (url.pathname.endsWith("/style.css") || url.pathname.endsWith("/script.js")){
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  if (url.pathname.includes("/uploads/") || url.pathname.includes("/icons/") || url.pathname.endsWith("/manifest.json")){
    event.respondWith(cacheFirst(request));
  }
});

async function networkFirst(request){
  try {
    return await fetch(request);
  } catch (error) {
    return caches.match("./offline.html");
  }
}

async function staleWhileRevalidate(request){
  const cache = await caches.open(namaCache);
  const tersimpan = await cache.match(request);

  const dariNetwork = fetch(request).then(function (response){
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(function (){
    return tersimpan || Response.error();
  });

  return tersimpan || dariNetwork;
}

async function cacheFirst(request){
  const tersimpan = await caches.match(request);
  if (tersimpan) return tersimpan;

  try {
    const response = await fetch(request);
    if (response.ok){
      const cache = await caches.open(namaCache);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return Response.error();
  }
}

self.addEventListener("message", function (event){
  const data = event.data;
  event.waitUntil(
    self.registration.showNotification(data.judul, { body: data.isi })
  );
});

self.addEventListener("notificationclick", function (event){
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then(function (daftar){
      if (daftar.length > 0){
        return daftar[0].focus();
      }
      return self.clients.openWindow("./");
    })
  );
});