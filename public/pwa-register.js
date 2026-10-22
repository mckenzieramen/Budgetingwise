// Registers the app shell only. Firebase data and authentication are never cached here.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(err => console.warn('PWA registration failed:', err));
  });
}

// Admin-only enhancements.
if(document.getElementById('adminApp')){
  const viewportStyle=document.createElement('link');
  viewportStyle.rel='stylesheet';
  viewportStyle.href='./admin-viewport-v1.css?v=admin-viewport-v1';
  document.head.appendChild(viewportStyle);

  import('./admin-premium-dialog-v1.js?v=admin-dialog-v2')
    .then(()=>import('./admin-premium-actions-v1.js?v=admin-actions-v1'))
    .catch(err=>console.warn('Premium admin dialogs unavailable:',err));
  import('./admin-drawer-resize-v1.js?v=admin-drawer-resize-v1').catch(err=>console.warn('Client details resize unavailable:',err));
  import('./admin-form-guard-v1.js?v=admin-form-guard-v1').catch(err=>console.warn('Admin customer form guard unavailable:',err));
  import('./admin-secure-client-create-v1.js?v=secure-create-v5').catch(err=>console.warn('Secure client creation unavailable:',err));

  // Chat Support button already exists in admin.html. Keep the support module
  // lazy-loaded so it cannot slow the Admin sign-in/bootstrap. The first click
  // loads the module; after it mounts, its own click handler opens the inbox.
  let supportPromise=null;
  const loadSupport=()=>{
    if(!supportPromise){
      supportPromise=import('./admin-support-v1.js?v=admin-support-v13').catch(err=>{
        supportPromise=null;
        console.warn('Admin support inbox unavailable:',err);
        throw err;
      });
    }
    return supportPromise;
  };

  document.addEventListener('click',async event=>{
    const target=event.target.closest('#adminSupportNav');
    if(!target || target.dataset.supportReady==='1')return;

    // Stop only this initial click. Never programmatically click the button:
    // doing so can recursively re-enter this capture listener and freeze Chrome.
    event.preventDefault();
    event.stopImmediatePropagation();
    target.disabled=true;

    try{
      await loadSupport();
      target.dataset.supportReady='1';
      target.disabled=false;
      // admin-support-v1 has mounted by now. Dispatch a non-recursive bubbling
      // event that skips this capture branch because supportReady is set.
      target.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));
    }catch{
      target.disabled=false;
    }
  },true);
}
