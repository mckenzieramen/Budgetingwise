// Registers the app shell only. Firebase data and authentication are never cached here.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(err => console.warn('PWA registration failed:', err));
  });
}
// Admin-only enhancements.
if(document.getElementById('adminApp')){
  const viewportStyle=document.createElement('link');viewportStyle.rel='stylesheet';viewportStyle.href='./admin-viewport-v1.css?v=admin-viewport-v1';document.head.appendChild(viewportStyle);
  import('./admin-premium-dialog-v1.js?v=admin-dialog-v2').then(()=>import('./admin-premium-actions-v1.js?v=admin-actions-v1')).catch(err=>console.warn('Premium admin dialogs unavailable:',err));
  import('./admin-drawer-resize-v1.js?v=admin-drawer-resize-v1').catch(err=>console.warn('Client details resize unavailable:',err));
  import('./admin-form-guard-v1.js?v=admin-form-guard-v1').catch(err=>console.warn('Admin customer form guard unavailable:',err));
  import('./admin-secure-client-create-v1.js?v=secure-create-v5').catch(err=>console.warn('Secure client creation unavailable:',err));

  // Do not start the supportThreads listener on every Admin page load.
  // It is loaded only when the administrator actually opens Chat Support,
  // preventing an unrelated Firestore permission warning from appearing
  // immediately after creating a customer account.
  let supportLoaded=false;
  const loadSupport=()=>{
    if(supportLoaded)return;
    supportLoaded=true;
    import('./admin-support-v1.js?v=admin-support-v8').catch(err=>{
      supportLoaded=false;
      console.warn('Admin support inbox unavailable:',err);
    });
  };
  document.addEventListener('click',event=>{
    const target=event.target.closest('button,a');
    if(!target)return;
    const text=(target.textContent||'').trim().toLowerCase();
    if(target.id==='adminSupportNav'||text.includes('chat support'))loadSupport();
  },true);
}
