// Service Worker
console.log(123);

// Listen for Notification
self.addEventListener('push', (event) => {
  console.log('Push Received', event.data.text());
  self.registration.showNotification(event.data.text());
});
