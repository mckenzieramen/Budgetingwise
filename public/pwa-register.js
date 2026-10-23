// Registers the app shell only. Firebase data and authentication are never cached here.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(err => console.warn('PWA registration failed:', err));
  });
}

if(document.getElementById('adminApp')){
  const viewportStyle=document.createElement('link');viewportStyle.rel='stylesheet';viewportStyle.href='./admin-viewport-v1.css?v=admin-viewport-v1';document.head.appendChild(viewportStyle);
  import('./admin-premium-dialog-v1.js?v=admin-dialog-v2').then(()=>import('./admin-premium-actions-v1.js?v=admin-actions-v1')).catch(err=>console.warn('Premium admin dialogs unavailable:',err));
  import('./admin-drawer-resize-v1.js?v=admin-drawer-resize-v1').catch(err=>console.warn('Client details resize unavailable:',err));
  import('./admin-form-guard-v1.js?v=admin-form-guard-v1').catch(err=>console.warn('Admin customer form guard unavailable:',err));
  import('./admin-secure-client-create-v1.js?v=secure-create-v6').catch(err=>console.warn('Secure client creation unavailable:',err));

  const navButtons=[...document.querySelectorAll('.admin-nav button')],dashboardNav=navButtons[0],clientsNav=document.getElementById('focusClients'),supportNav=document.getElementById('adminSupportNav');
  if(supportNav){supportNav.classList.remove('admin-support-premium-nav');supportNav.innerHTML='<span>◌</span> Chat Support<span id="aspUnread" class="support-unread-badge" aria-label="Unread support messages"></span>';if(!document.getElementById('adminSupportPremiumNavStyle')){const style=document.createElement('style');style.id='adminSupportPremiumNavStyle';style.textContent='.support-unread-badge{display:none!important;min-width:19px;height:19px;padding:0 5px;place-items:center;border-radius:99px;background:#ff5d70;color:#fff!important;font-size:8px!important;font-weight:900}.support-unread-badge.has-unread{display:grid!important}';document.head.appendChild(style)}}

  const setActiveNav=target=>document.querySelectorAll('.admin-nav button').forEach(btn=>btn.classList.toggle('active',btn===target));
  const showMainAdmin=(target,scrollTarget)=>{
    const support=document.getElementById('adminSupportPanel');if(support){support.classList.add('hidden');support.setAttribute('hidden','')}
    document.querySelectorAll('#adminDashboard .admin-content>div').forEach(el=>el.classList.remove('asp-dashboard-hidden'));
    document.getElementById('adminDashboard')?.classList.remove('client-details-open');
    document.getElementById('clientDrawer')?.classList.remove('is-open');document.getElementById('clientDrawer')?.classList.add('hidden');document.getElementById('drawerBackdrop')?.classList.add('hidden');
    setActiveNav(target);try{history.replaceState(null,'',location.pathname+location.search)}catch{}
    if(scrollTarget)requestAnimationFrame(()=>document.getElementById(scrollTarget)?.scrollIntoView({behavior:'smooth',block:'start'}));else requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'smooth'}));
  };
  dashboardNav?.addEventListener('click',e=>{e.preventDefault();showMainAdmin(dashboardNav,null)},true);
  clientsNav?.addEventListener('click',e=>{e.preventDefault();showMainAdmin(clientsNav,'clientsPanel')},true);

  let supportPromise=null;
  const loadAdminSupport=()=>{if(supportPromise)return supportPromise;supportPromise=import('./admin-support-v1.js?v=admin-support-direct-nav-v5').then(()=>true).catch(err=>{console.warn('Admin support inbox unavailable:',err);supportPromise=null;return false});return supportPromise};
  const waitForSupportPanel=async()=>{for(let i=0;i<120;i++){const panel=document.getElementById('adminSupportPanel');if(panel)return panel;await new Promise(r=>setTimeout(r,50))}return null};
  const openSupportDirectly=async()=>{const loaded=await loadAdminSupport();if(!loaded)return false;const panel=await waitForSupportPanel();if(!panel)return false;document.getElementById('adminDashboard')?.classList.remove('client-details-open');document.getElementById('clientDrawer')?.classList.remove('is-open');document.getElementById('drawerBackdrop')?.classList.add('hidden');setActiveNav(supportNav);document.querySelectorAll('#adminDashboard .admin-content>div').forEach(el=>el.classList.add('asp-dashboard-hidden'));panel.classList.remove('hidden');panel.removeAttribute('hidden');supportNav.dataset.supportReady='1';try{history.replaceState(null,'',location.pathname+location.search+'#support')}catch{}return true};
  supportNav?.addEventListener('click',async e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();await openSupportDirectly()},true);
  loadAdminSupport();
  if(location.hash==='#support')window.addEventListener('load',()=>openSupportDirectly());
}
