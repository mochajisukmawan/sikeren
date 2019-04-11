// use service worker
const filesToCache = [
  '/',
  'assets/img/logo_android_magang.png',
  'assets/img/logo.png',
  'assets/img/loader.gif',
  'assets/css/font-awesome.min.css',
  'assets/css/framework7.ios.min.css',
  'assets/css/style.css',
  'assets/js/framework7.min.js',
  'assets/js/jquery-3.3.1.min.js',
  'assets/js/Chart.bundle.js', 
  'index.php'
];

const staticCacheName = 'pages-cache-v1';
self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});
self.addEventListener('fetch', event => {
  console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      if (response) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      console.log('Network request for ', event.request.url);
      return fetch(event.request)

      // TODO 4 - Add fetched files to the cache

    }).catch(error => {

      // TODO 6 - Respond with custom offline page

    })
  );
});