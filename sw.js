self.addEventListener("install", function (){
  self.skipWaiting();
});

self.addEventListener("activate", function (event){
  event.waitUntil(self.clients.claim());
});

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