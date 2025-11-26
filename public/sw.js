// Service Worker para PWA - HairyWallet
const CACHE_NAME = 'hairywallet-v2';
const RUNTIME_CACHE = 'hairywallet-runtime-v2';

const urlsToCache = [
  '/',
  '/hairy-wallet',
  '/hairy-wallet/crear',
  '/hairy-wallet/importar',
  '/hairy-wallet/enviar',
  '/hairy-wallet/recibir',
  '/hairy-wallet/historial',
  '/wallet-login',
  '/wallet-register',
  '/download-wallet',
  'https://fonts.googleapis.com/css2?family=Pacifico&display=swap',
  'https://cdn.jsdelivr.net/npm/remixicon@4.0.0/fonts/remixicon.css',
  'https://static.readdy.ai/image/f9a9038def0140c9123e9ba49c8c1ced/0c2f33e0a05f2c11011f4287446eae74.png'
];

// Instalar SW y cachear recursos
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cacheando recursos...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[SW] Recursos cacheados correctamente');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Error al cachear recursos:', error);
      })
  );
});

// Activar SW y limpiar caches antiguos
self.addEventListener('activate', (event) => {
  console.log('[SW] Activando Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[SW] Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Service Worker activado');
      return self.clients.claim();
    })
  );
});

// Estrategia de cache: Network First con fallback a Cache
self.addEventListener('fetch', (event) => {
  // Ignorar requests que no sean GET
  if (event.request.method !== 'GET') return;

  // Ignorar requests a APIs externas (excepto fuentes y recursos estáticos)
  const url = new URL(event.request.url);
  if (url.origin !== location.origin && 
      !url.hostname.includes('fonts.googleapis.com') &&
      !url.hostname.includes('cdn.jsdelivr.net') &&
      !url.hostname.includes('static.readdy.ai')) {
    return;
  }

  event.respondWith(
    caches.open(RUNTIME_CACHE).then((cache) => {
      return fetch(event.request)
        .then((response) => {
          // Si la respuesta es válida, clonarla y guardarla en cache
          if (response && response.status === 200) {
            cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(() => {
          // Si falla la red, intentar con el cache principal
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Si no está en cache, devolver página offline personalizada
            if (event.request.mode === 'navigate') {
              return caches.match('/hairy-wallet');
            }
          });
        });
    })
  );
});

// Notificaciones push
self.addEventListener('push', (event) => {
  console.log('[SW] Push recibido:', event);
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'Nueva transacción en tu wallet',
    icon: 'https://static.readdy.ai/image/f9a9038def0140c9123e9ba49c8c1ced/0c2f33e0a05f2c11011f4287446eae74.png',
    badge: 'https://static.readdy.ai/image/f9a9038def0140c9123e9ba49c8c1ced/0c2f33e0a05f2c11011f4287446eae74.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'hairywallet-notification',
    requireInteraction: false,
    data: data,
    actions: [
      {
        action: 'view',
        title: 'Ver detalles'
      },
      {
        action: 'close',
        title: 'Cerrar'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'HairyWallet', options)
  );
});

// Manejo de clics en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notificación clickeada:', event);
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/hairy-wallet/historial')
    );
  }
});

// Sincronización en segundo plano
self.addEventListener('sync', (event) => {
  console.log('[SW] Sincronización en segundo plano:', event.tag);
  if (event.tag === 'sync-transactions') {
    event.waitUntil(syncTransactions());
  }
});

async function syncTransactions() {
  try {
    console.log('[SW] Sincronizando transacciones...');
    // Aquí iría la lógica de sincronización
    return Promise.resolve();
  } catch (error) {
    console.error('[SW] Error al sincronizar:', error);
    return Promise.reject(error);
  }
}

// Manejo de mensajes desde la app
self.addEventListener('message', (event) => {
  console.log('[SW] Mensaje recibido:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

console.log('[SW] Service Worker cargado correctamente');
