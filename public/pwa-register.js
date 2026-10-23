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

  const content=document.querySelector('#adminDashboard .admin-content');
  const navButtons=[...document.querySelectorAll('.admin-nav button')],dashboardNav=navButtons[0],clientsNav=document.getElementById('focusClients'),supportNav=document.getElementById('adminSupportNav');
  const dashboardHead=content?.querySelector('.admin-head'),stats=content?.querySelector('.admin-stats'),grid=content?.querySelector('.admin-grid'),createPanel=document.getElementById('createClientPanel'),clientsPanel=document.getElementById('clientsPanel');

  if(supportNav){supportNav.classList.remove('admin-support-premium-nav');supportNav.innerHTML='<span>◌</span> Chat Support<span id="aspUnread" class="support-unread-badge" aria-label="Unread support messages"></span>';if(!document.getElementById('adminSupportPremiumNavStyle')){const style=document.createElement('style');style.id='adminSupportPremiumNavStyle';style.textContent='.support-unread-badge{display:none!important;min-width:19px;height:19px;padding:0 5px;place-items:center;border-radius:99px;background:#ff5d70;color:#fff!important;font-size:8px!important;font-weight:900}.support-unread-badge.has-unread{display:grid!important}';document.head.appendChild(style)}}

  const setActiveNav=target=>document.querySelectorAll('.admin-nav button').forEach(btn=>btn.classList.toggle('active',btn===target));
  const hideSupport=()=>{const p=document.getElementById('adminSupportPanel');if(p){p.classList.add('hidden');p.hidden=true}};
  const closeDrawer=()=>{document.getElementById('adminDashboard')?.classList.remove('client-details-open');document.getElementById('clientDrawer')?.classList.remove('is-open');document.getElementById('clientDrawer')?.classList.add('hidden');document.getElementById('drawerBackdrop')?.classList.add('hidden')};
  const showEl=(el,show)=>{if(!el)return;el.classList.toggle('hidden',!show);el.hidden=!show};
  const setHead=(title,description,showActions)=>{if(!dashboardHead)return;const h=dashboardHead.querySelector('h1'),p=dashboardHead.querySelector('p');if(h)h.textContent=title;if(p)p.textContent=description;const actions=dashboardHead.querySelector('.admin-actions');if(actions)actions.classList.toggle('hidden',!showActions)};

  // Dashboard = overview only. It is intentionally separate from client account management.
  const showDashboard=()=>{
    hideSupport();closeDrawer();setActiveNav(dashboardNav);
    showEl(dashboardHead,true);setHead('Dashboard','Overview of your Budgetingwise client accounts and account status.',false);
    showEl(stats,true);showEl(grid,false);showEl(createPanel,false);showEl(clientsPanel,false);
    try{history.replaceState(null,'',location.pathname+location.search+'#dashboard')}catch{}
    requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'smooth'}));
  };

  // Clients = literal client-account management: create account + client table.
  const showClients=()=>{
    hideSupport();closeDrawer();setActiveNav(clientsNav);
    showEl(dashboardHead,true);setHead('Client accounts','Create and manage the people who can use your budgeting page.',true);
    showEl(stats,false);showEl(grid,true);showEl(createPanel,true);showEl(clientsPanel,true);
    try{history.replaceState(null,'',location.pathname+location.search+'#clients')}catch{}
    requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'smooth'}));
  };

  let supportPromise=null;
  const loadAdminSupport=()=>{if(supportPromise)return supportPromise;supportPromise=import('./admin-support-v1.js?v=admin-support-separated-v1').then(()=>true).catch(err=>{console.warn('Admin support inbox unavailable:',err);supportPromise=null;return false});return supportPromise};
  const waitForSupportPanel=async()=>{for(let i=0;i<120;i++){const panel=document.getElementById('adminSupportPanel');if(panel)return panel;await new Promise(r=>setTimeout(r,50))}return null};
  // Chat Support = literal support inbox only. No dashboard/client panels remain visible behind it.
  const showSupport=async()=>{
    const loaded=await loadAdminSupport();if(!loaded)return false;const panel=await waitForSupportPanel();if(!panel)return false;
    closeDrawer();setActiveNav(supportNav);
    showEl(dashboardHead,false);showEl(stats,false);showEl(grid,false);showEl(createPanel,false);showEl(clientsPanel,false);
    panel.classList.remove('hidden');panel.hidden=false;
    try{history.replaceState(null,'',location.pathname+location.search+'#support')}catch{}
    requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'smooth'}));return true;
  };

  dashboardNav?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();showDashboard()},true);
  clientsNav?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();showClients()},true);
  supportNav?.addEventListener('click',async e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();await showSupport()},true);

  loadAdminSupport();
  window.addEventListener('load',()=>{if(location.hash==='#support')showSupport();else if(location.hash==='#clients')showClients();else showDashboard()});
}
