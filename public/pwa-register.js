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

  // The sidebar belongs to the Admin shell. Support modules must never recreate its toggle.
  const setupFoldableSidebar=()=>{
    const layout=document.querySelector('#adminDashboard .admin-layout'),side=document.querySelector('#adminDashboard .admin-sidebar');
    if(!layout||!side)return;
    // admin-support-v1 checks this flag. Marking it here prevents Chat Support from
    // deleting/replacing the global toggle and breaking its click handler.
    side.dataset.foldReady='1';
    if(side.dataset.globalFoldReady)return;
    side.dataset.globalFoldReady='1';
    let btn=document.getElementById('bwsAdminSidebarToggle');
    if(!btn){btn=document.createElement('button');btn.type='button';btn.id='bwsAdminSidebarToggle';side.appendChild(btn)}
    let collapsed=localStorage.getItem('bwsAdminSidebarCollapsed')==='1';
    const apply=()=>{
      layout.classList.toggle('bws-admin-nav-collapsed',collapsed);side.classList.toggle('bws-admin-nav-collapsed',collapsed);
      layout.classList.remove('bws-admin-nav-peek');
      btn.textContent=collapsed?'›':'‹';btn.title=collapsed?'Expand sidebar':'Collapse sidebar';btn.setAttribute('aria-label',btn.title);btn.setAttribute('aria-expanded',String(!collapsed));
      localStorage.setItem('bwsAdminSidebarCollapsed',collapsed?'1':'0');
    };
    btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();collapsed=!collapsed;apply()});
    side.addEventListener('mouseenter',()=>{if(collapsed)layout.classList.add('bws-admin-nav-peek')});
    side.addEventListener('mouseleave',()=>{if(collapsed)layout.classList.remove('bws-admin-nav-peek')});
    apply();
    if(!document.getElementById('bwsGlobalFoldStyle')){const s=document.createElement('style');s.id='bwsGlobalFoldStyle';s.textContent=`
      #adminDashboard .admin-layout{transition:grid-template-columns .2s cubic-bezier(.2,.8,.2,1)!important}
      #adminDashboard .admin-sidebar{position:relative!important;overflow:visible!important;transition:width .2s cubic-bezier(.2,.8,.2,1),padding .2s ease!important}
      #adminDashboard #bwsAdminSidebarToggle{display:grid!important;place-items:center!important;position:absolute!important;top:50%!important;right:-13px!important;transform:translateY(-50%)!important;width:26px!important;height:48px!important;padding:0!important;border:1px solid #ffffff26!important;border-radius:0 12px 12px 0!important;background:#17142f!important;color:#fff!important;z-index:1000!important;cursor:pointer!important;font-size:18px!important;line-height:1!important;box-shadow:5px 0 16px #11102725!important}
      #adminDashboard .admin-layout.bws-admin-nav-collapsed{grid-template-columns:64px minmax(0,1fr)!important}
      #adminDashboard .admin-sidebar.bws-admin-nav-collapsed{width:64px!important;padding-left:8px!important;padding-right:8px!important}
      #adminDashboard .admin-sidebar.bws-admin-nav-collapsed .admin-side-logo{justify-content:center!important;padding-left:0!important;padding-right:0!important}
      #adminDashboard .admin-sidebar.bws-admin-nav-collapsed .admin-side-logo>div,#adminDashboard .admin-sidebar.bws-admin-nav-collapsed .bws-nav-label{display:none!important}
      #adminDashboard .admin-sidebar.bws-admin-nav-collapsed .admin-nav button,#adminDashboard .admin-sidebar.bws-admin-nav-collapsed #adminLogout{justify-content:center!important;padding-left:0!important;padding-right:0!important}
      #adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek{grid-template-columns:230px minmax(0,1fr)!important}
      #adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek .admin-sidebar{width:230px!important;padding-left:14px!important;padding-right:14px!important}
      #adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek .admin-sidebar .admin-side-logo{justify-content:flex-start!important}
      #adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek .admin-sidebar .admin-side-logo>div,#adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek .admin-sidebar .bws-nav-label{display:block!important}
      #adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek .admin-sidebar .admin-nav button,#adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek .admin-sidebar #adminLogout{justify-content:flex-start!important;padding-left:10px!important;padding-right:10px!important}
    `;document.head.appendChild(s)}
  };
  setupFoldableSidebar();

  const setActiveNav=target=>document.querySelectorAll('.admin-nav button').forEach(btn=>btn.classList.toggle('active',btn===target));
  const hideSupport=()=>{const p=document.getElementById('adminSupportPanel');if(p){p.classList.add('hidden');p.hidden=true}};
  const closeDrawer=()=>{document.getElementById('adminDashboard')?.classList.remove('client-details-open');document.getElementById('clientDrawer')?.classList.remove('is-open');document.getElementById('clientDrawer')?.classList.add('hidden');document.getElementById('drawerBackdrop')?.classList.add('hidden')};
  const showEl=(el,show)=>{if(!el)return;el.classList.toggle('hidden',!show);el.hidden=!show};
  const setHead=(title,description,showActions)=>{if(!dashboardHead)return;const h=dashboardHead.querySelector('h1'),p=dashboardHead.querySelector('p');if(h)h.textContent=title;if(p)p.textContent=description;const actions=dashboardHead.querySelector('.admin-actions');if(actions)actions.classList.toggle('hidden',!showActions)};

  const showDashboard=()=>{hideSupport();closeDrawer();setActiveNav(dashboardNav);showEl(dashboardHead,true);setHead('Dashboard','Overview of your Budgetingwise client accounts and account status.',false);showEl(stats,true);showEl(grid,false);showEl(createPanel,false);showEl(clientsPanel,false);try{history.replaceState(null,'',location.pathname+location.search+'#dashboard')}catch{}requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'smooth'}))};
  const showClients=()=>{hideSupport();closeDrawer();setActiveNav(clientsNav);showEl(dashboardHead,true);setHead('Client accounts','Create and manage the people who can use your budgeting page.',true);showEl(stats,false);showEl(grid,true);showEl(createPanel,true);showEl(clientsPanel,true);try{history.replaceState(null,'',location.pathname+location.search+'#clients')}catch{}requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'smooth'}))};

  let supportPromise=null;
  const loadAdminSupport=()=>{if(supportPromise)return supportPromise;supportPromise=import('./admin-support-v1.js?v=admin-support-separated-v3').then(()=>true).catch(err=>{console.warn('Admin support inbox unavailable:',err);supportPromise=null;return false});return supportPromise};
  const waitForSupportPanel=async()=>{for(let i=0;i<120;i++){const panel=document.getElementById('adminSupportPanel');if(panel)return panel;await new Promise(r=>setTimeout(r,50))}return null};
  const showSupport=async()=>{const loaded=await loadAdminSupport();if(!loaded)return false;const panel=await waitForSupportPanel();if(!panel)return false;closeDrawer();setActiveNav(supportNav);showEl(dashboardHead,false);showEl(stats,false);showEl(grid,false);showEl(createPanel,false);showEl(clientsPanel,false);panel.classList.remove('hidden');panel.hidden=false;try{history.replaceState(null,'',location.pathname+location.search+'#support')}catch{}requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'smooth'}));return true};

  dashboardNav?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();showDashboard()},true);
  clientsNav?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();showClients()},true);
  supportNav?.addEventListener('click',async e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();await showSupport()},true);

  loadAdminSupport();
  window.addEventListener('load',()=>{setupFoldableSidebar();if(location.hash==='#support')showSupport();else if(location.hash==='#clients')showClients();else showDashboard()});
}
