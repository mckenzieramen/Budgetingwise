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

  // Keep the Chat Support navigation visible at all times, but lazy-load the
  // heavier support inbox only after the admin clicks it. This avoids doing
  // Firestore support work on the sign-in screen while preserving navigation.
  const chatIcon='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11.4a7.4 7.4 0 0 1-7.7 7.1 8.8 8.8 0 0 1-3.2-.6L4 20l1.5-4.1A6.8 6.8 0 0 1 4 11.4a7.4 7.4 0 0 1 7.9-7.1A7.4 7.4 0 0 1 20 11.4Z"/><path d="M8.2 10.8h7.6M8.2 13.8h4.8"/></svg>';
  const ensureSupportNav=()=>{
    const nav=document.querySelector('.admin-nav');
    if(!nav)return null;
    let button=document.getElementById('adminSupportNav');
    if(!button){
      button=document.createElement('button');
      button.id='adminSupportNav';
      button.type='button';
      nav.appendChild(button);
    }
    if(!button.dataset.ready){
      button.innerHTML=`<span style="display:inline-grid;place-items:center;vertical-align:middle">${chatIcon}</span>&nbsp; Chat Support <b id="aspUnread"></b>`;
      button.dataset.ready='1';
    }
    return button;
  };

  let supportPromise=null;
  const loadSupport=()=>{
    if(!supportPromise){
      supportPromise=import('./admin-support-v1.js?v=admin-support-v12').catch(err=>{
        supportPromise=null;
        console.warn('Admin support inbox unavailable:',err);
        throw err;
      });
    }
    return supportPromise;
  };

  ensureSupportNav();
  const observer=new MutationObserver(()=>ensureSupportNav());
  observer.observe(document.getElementById('adminApp'),{childList:true,subtree:true});

  document.addEventListener('click',event=>{
    const target=event.target.closest('#adminSupportNav');
    if(!target)return;
    event.preventDefault();
    loadSupport().then(()=>{
      // admin-support-v1 attaches its handler when loaded. Re-trigger once so
      // the first click opens the inbox instead of requiring a second click.
      if(!target.dataset.supportRetried){
        target.dataset.supportRetried='1';
        target.click();
        setTimeout(()=>delete target.dataset.supportRetried,0);
      }
    }).catch(()=>{});
  },true);
}
