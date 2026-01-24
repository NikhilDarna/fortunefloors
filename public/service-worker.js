self.addEventListener('push', (event) => {
  const data = event.data?.json() || { 
    title: 'New Property Alert!', 
    body: 'Someone posted a new property' 
  };
  
  const options = {
    body: data.body,
    icon: '/favicon.ico',
    badge: '/badge.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/properties' },
    actions: [{ action: 'view', title: 'View Property' }]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
