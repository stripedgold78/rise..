
// This optional code is used to register a service worker.
// register() is not called by default.

export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      navigator.serviceWorker.register(swUrl).then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }).catch(error => {
        console.error('ServiceWorker registration failed:', error);
      });
    });
  }
}
