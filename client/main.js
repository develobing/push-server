// Service Worker Registration
let swReg;

// Push Server URL
const serverUrl = 'http://localhost:3333';

// Register Service Worker
navigator.serviceWorker
  .register('/sw.js')
  .then((reg) => {
    console.log('Service Worker Registered!', reg);

    // Reference the registration globally
    swReg = reg;

    // Check if a subscription exists, and if so, update the UI
    swReg.pushManager.getSubscription().then(setSubscribedStatus);
  })
  .catch(console.error);

// Update UI for subscribed status
const setSubscribedStatus = (subscribed) => {
  const subscribeBtn = document.getElementById('subscribe');
  const unsubscribeBtn = document.getElementById('unsubscribe');

  if (subscribed) {
    subscribeBtn.classList.add('hidden');
    unsubscribeBtn.classList.remove('hidden');
  } else {
    subscribeBtn.classList.remove('hidden');
    unsubscribeBtn.classList.add('hidden');
  }
};

// Get public key from server
const getApplicationServerKey = () => {
  return (
    // Fetch from server
    fetch(`${serverUrl}/key`)
      // Parse response body as arrayBuffer
      .then((res) => res.arrayBuffer())
      // Return the arrayBuffer as a new Uint8Array
      .then((key) => new Uint8Array(key))
  );
};

// Unsubscribe from push notification
const unsubscribe = () => {
  // Unsubscribe & update UI
  swReg.pushManager.getSubscription().then((subscription) => {
    subscription.unsubscribe().then(() => {
      setSubscribedStatus(false);
    });
  });
};

// Subscribe for push notification
const subscribe = () => {
  // Check if the service worker is registered
  if (!swReg) return console.error('Service Worker not registered');

  // Get application server key from the push server
  getApplicationServerKey().then((applicationServerKey) => {
    // Subscribe
    swReg.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      })
      .then((res) => res.toJSON())
      .then((subscription) => {
        console.log('subscribe() - subscription', subscription);

        // Pass subscription to server
        fetch(`${serverUrl}/subscribe`, {
          method: 'POST',
          body: JSON.stringify(subscription),
        })
          .then(setSubscribedStatus)
          .catch(unsubscribe);
      });
  });
};
