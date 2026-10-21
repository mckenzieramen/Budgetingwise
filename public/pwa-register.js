// Registers the app shell only. Firebase data and authentication are never cached here.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(err => console.warn('PWA registration failed:', err));
  });
}
// Admin-only support inbox. Load the current tab implementation explicitly.
if(document.getElementById('adminApp')){
  import('./admin-support-v1.js?v=admin-support-v4').catch(err=>console.warn('Admin support inbox unavailable:',err));
}
