const CACHE_NAME = 'virtual-try-on-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/index.tsx',
  '/App.tsx',
  '/metadata.json',
  '/constants.ts',
  '/types.ts',
  '/components/WelcomeScreen.tsx',
  '/components/ImageSourceScreen.tsx',
  '/components/FittingRoomScreen.tsx',
  '/components/CameraFeed.tsx',
  '/components/StyleAdvisorModal.tsx',
  '/services/geminiService.ts',
  // PWA Icons
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Clothing images
  'https://i.ibb.co/6w2z2fM/tshirt-blue.png',
  'https://i.ibb.co/S68tL2G/jeans-blue.png',
  'https://i.ibb.co/hK4B6m8/sneakers-black.png',
  'https://i.ibb.co/bFcfxZq/hair-brown.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Add all URLs to cache, but don't fail if one of them fails
        const cachePromises = URLS_TO_CACHE.map(urlToCache => {
            return cache.add(urlToCache).catch(err => {
                console.warn(`Failed to cache ${urlToCache}:`, err);
            });
        });
        return Promise.all(cachePromises);
      })
  );
});

self.addEventListener('fetch', event => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it's a stream and can only be consumed once.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200) {
              return response;
            }
            
            // Check if the response is from a third-party domain and is opaque
            if (response.type === 'opaque') {
              return response;
            }

            // Clone the response because it's also a stream.
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
