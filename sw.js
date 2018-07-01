let CACHENAME = 'currency-converter-v2';
let urlToCache = ['index.js'];
let allCaches = [CACHENAME, urlToCache]

self.addEventListener('install', function(event){
    event.waitUntil(
        caches.open(CACHENAME).then(function(cache){
        return cache.addAll(urlToCache);
        })
    );
});

self.addEventListener('activate', function(event){
    let cacheWhitelist = Object.values(allCaches);
    event.waitUntil(
    caches.keys().then(function(CACHENAME) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event){
   event.respondWith(
    caches.open(CACHENAME).then(function(cache) {
        return cache.match(event.request).then(function(response) {
                if (response) {
                    console.log('a reponse has been found');
                    return response;
                }
                return fetch(event.request).then(function(new_response) {
                    cache.put(event.request, new_response.clone());
                    return new_response;
                });
            }).catch(function(error) {
            console.error('Error in fetch handler:', error);
            throw error;
        });
    })
    );
});