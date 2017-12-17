console.log('ServiceWorker downloaded');

importScripts('reconstructive.js');

reconstructive.updateConfig({mementoPath: '/archived/<datetime>/<urir>'});

self.addEventListener("install", function(event) {
  console.log('ServiceWorker installed');
});

self.addEventListener("activate", function(event) {
  console.log('ServiceWorker Activated');
});

self.addEventListener("fetch", function(event) {
  console.log('A fetch event triggered:', event);
  reconstructive.reroute(event);
});
