importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAhPPFA8-2lrzx8PEAKYdOPgyQdVhyEL9I",
  authDomain: "fire-database-e3fa6.firebaseapp.com",
  projectId: "fire-database-e3fa6",
  storageBucket: "fire-database-e3fa6.firebasestorage.app",
  messagingSenderId: "86123398212",
  appId: "1:86123398212:web:32fada019688e783ae6811"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body, icon } = payload.notification || {};
  const data = payload.data || {};

  self.registration.showNotification(title || 'Nueva notificación', {
    body: body || '',
    icon: icon || '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/icon-72x72.png',
    data,
    tag: data.tag || 'default',
    renotify: true,
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'close') return;

  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// ─── PWA Installability Hack ───
// Los navegadores requieren que el Service Worker tenga un handler de "fetch"
// para habilitar el prompt nativo de "Agregar a la pantalla de inicio".
self.addEventListener('fetch', (event) => {
  // No interceptamos la red (passthrough pasivo) pero satisfacemos el requisito
});
