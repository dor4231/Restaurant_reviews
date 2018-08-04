var staticCacheName = 'restReview-v4';
var urlsToCache = ['/', 'restaurant.html', 'js/main.js', 'js/dbhelper.js', 'css/styles.css', 'data/restaurants.json'];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(staticCacheName)
        .then(function (cache) {
        return cache.addAll(urlsToCache);
    }));
});

self.addEventListener('activate', function (event) {
    event.waitUntil(caches.keys().then(function (cacheNames) {
        return Promise.all(cacheNames.filter(function (cacheName) {
            return cacheName.startsWith('restReview-') && cacheName !== staticCacheName;
        }).map(function (cacheName) {
            return caches['delete'](cacheName);
        }));
    }));
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.open(staticCacheName).then(function(cache) {
            return cache.match(event.request).then(function (response) {
                return response || fetch(event.request).then(function(response) {
                  cache.put(event.request, response.clone());
                  return response;
                });
        })
    }))
});