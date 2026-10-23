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
  import('./admin-secure-client-create-v1.js?v=secure-create-v6').catch(err=>console.warn('Secure client creation unavailable:',err));
  import('./admin-support-ux-fix-v1.js?v=ticket-chat-sidebar-v1').catch(err=>console.warn('Admin support UX patch unavailable:',err));

  const supportNav=document.getElementById('adminSupportNav');

  // Keep Chat Support visually identical to the other primary navigation rows.
  if(supportNav){
    supportNav.classList.remove('admin-support-premium-nav');
    supportNav.innerHTML='<span>◌</span> Chat Support<span id="aspUnread" class="support-unread-badge" aria-label="Unread support messages"></span>';
    if(!document.getElementById('adminSupportPremiumNavStyle')){
      const style=document.createElement('style');
      style.id='adminSupportPremiumNavStyle';
      style.textContent=`.support-unread-badge{display:none!important;min-width:19px;height:19px;padding:0 5px;place-items:center;border-radius:99px;background:#ff5d70;color:#fff!important;font-size:8px!important;font-weight:900}.support-unread-badge.has-unread{display:grid!important}`;
      document.head.appendChild(style);
    }
  }

  let supportPromise=null;
  const loadAdminSupport=()=>{
    if(supportPromise)return supportPromise;
    supportNav?.classList.add('is-loading');
    supportPromise=import('./admin-support-v1.js?v=admin-support-direct-nav-v4')
      .then(()=>true)
      .catch(err=>{
        console.warn('Admin support inbox unavailable:',err);
        supportPromise=null;
        return false;
      })
      .finally(()=>supportNav?.classList.remove('is-loading'));
    return supportPromise;
  };

  const waitForSupportPanel=async()=>{
    for(let i=0;i<120;i++){
      const panel=document.getElementById('adminSupportPanel');
      if(panel)return panel;
      await new Promise(r=>setTimeout(r,50));
    }
    return null;
  };

  const openSupportDirectly=async()=>{
    const loaded=await loadAdminSupport();
    if(!loaded)return false;
    const panel=await waitForSupportPanel();
    if(!panel)return false;

    document.getElementById('adminDashboard')?.classList.remove('client-details-open');
    document.getElementById('clientDrawer')?.classList.remove('is-open');
    document.getElementById('drawerBackdrop')?.classList.add('hidden');

    document.querySelectorAll('.admin-nav button').forEach(btn=>btn.classList.toggle('active',btn===supportNav));
    document.querySelectorAll('#adminDashboard .admin-content>div').forEach(el=>el.classList.add('asp-dashboard-hidden'));
    panel.classList.remove('hidden');
    panel.removeAttribute('hidden');
    supportNav.dataset.supportReady='1';
    try{history.replaceState(null,'',location.pathname+location.search+'#support')}catch{}
    return true;
  };

  if(supportNav){
    supportNav.addEventListener('click',async event=>{
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      supportNav.classList.add('is-loading');
      const opened=await openSupportDirectly();
      supportNav.classList.remove('is-loading');
      if(!opened){
        console.warn('Chat Support panel did not initialize.');
        supportNav.title='Chat Support could not load. Refresh the Admin Portal and try again.';
      }
    },true);
  }

  loadAdminSupport();

  if(location.hash==='#support'){
    window.addEventListener('load',()=>openSupportDirectly());
  }
}
