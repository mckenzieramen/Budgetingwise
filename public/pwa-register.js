// Registers the app shell only. Firebase data and authentication are never cached here.
if ('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(err=>console.warn('PWA registration failed:',err)));

if(document.getElementById('adminApp')){
  const addCss=(id,css)=>{if(document.getElementById(id))return;const s=document.createElement('style');s.id=id;s.textContent=css;document.head.appendChild(s)};
  const viewportStyle=document.createElement('link');viewportStyle.rel='stylesheet';viewportStyle.href='./admin-viewport-v1.css?v=admin-viewport-v1';document.head.appendChild(viewportStyle);
  import('./admin-premium-dialog-v1.js?v=admin-dialog-v2').then(()=>import('./admin-premium-actions-v1.js?v=admin-actions-v1')).catch(err=>console.warn('Premium admin dialogs unavailable:',err));
  import('./admin-drawer-resize-v1.js?v=admin-drawer-resize-v1').catch(err=>console.warn('Client details resize unavailable:',err));
  import('./admin-form-guard-v1.js?v=admin-form-guard-v1').catch(err=>console.warn('Admin customer form guard unavailable:',err));
  import('./admin-secure-client-create-v1.js?v=secure-create-v6').catch(err=>console.warn('Secure client creation unavailable:',err));

  const content=document.querySelector('#adminDashboard .admin-content');
  const dashboardNav=document.querySelector('.admin-nav button:first-of-type');
  const clientsNav=document.getElementById('focusClients');
  const supportNav=document.getElementById('adminSupportNav');
  const dashboardHead=content?.querySelector('.admin-head'),stats=content?.querySelector('.admin-stats'),grid=content?.querySelector('.admin-grid'),createPanel=document.getElementById('createClientPanel'),clientsPanel=document.getElementById('clientsPanel');

  const icons={dashboard:'▦',clients:'♙',support:'◉'};
  const prepareNavigation=()=>{
    const nav=document.querySelector('#adminDashboard .admin-nav');if(!nav)return;
    const defs=[[dashboardNav,'Dashboard',icons.dashboard],[clientsNav,'Clients',icons.clients],[supportNav,'Chat Support',icons.support]];
    defs.forEach(([b,label,icon])=>{if(!b)return;b.dataset.label=label;b.innerHTML=`<span class="bws-shell-icon">${icon}</span><span class="bws-nav-label">${label}</span>${b===supportNav?'<span id="aspUnread" class="support-unread-badge" aria-label="Unread support messages"></span>':''}`;b.title=label});
  };
  prepareNavigation();

  const setActiveNav=target=>{
    document.querySelectorAll('#adminDashboard .admin-nav button').forEach(b=>{const on=b===target;b.classList.toggle('active',on);b.classList.toggle('bws-glass-active',on);b.setAttribute('aria-current',on?'page':'false')});
  };

  const setupFoldableSidebar=()=>{
    const layout=document.querySelector('#adminDashboard .admin-layout'),side=document.querySelector('#adminDashboard .admin-sidebar');if(!layout||!side)return;
    side.dataset.foldReady='1';side.dataset.globalFoldReady='1';
    let btn=document.getElementById('bwsAdminSidebarToggle');if(!btn){btn=document.createElement('button');btn.type='button';btn.id='bwsAdminSidebarToggle';side.appendChild(btn)}
    let collapsed=localStorage.getItem('bwsAdminSidebarCollapsed')==='1';
    const apply=()=>{layout.classList.toggle('bws-admin-nav-collapsed',collapsed);side.classList.toggle('bws-admin-nav-collapsed',collapsed);layout.classList.remove('bws-admin-nav-peek');btn.textContent=collapsed?'›':'‹';btn.title=collapsed?'Expand sidebar':'Collapse sidebar';btn.setAttribute('aria-expanded',String(!collapsed));localStorage.setItem('bwsAdminSidebarCollapsed',collapsed?'1':'0')};
    if(!btn.dataset.bound){btn.dataset.bound='1';btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();collapsed=!collapsed;apply()});side.addEventListener('mouseenter',()=>{if(collapsed)layout.classList.add('bws-admin-nav-peek')});side.addEventListener('mouseleave',()=>{if(collapsed)layout.classList.remove('bws-admin-nav-peek')})}
    apply();
  };

  addCss('bwsAdminShellNavStyle',`
    #adminDashboard .admin-nav{position:relative;display:grid;gap:8px}
    #adminDashboard .admin-nav button{position:relative;height:42px;display:flex;align-items:center;gap:10px;background:transparent!important;color:#c8c5dc!important;border:1px solid transparent!important;box-shadow:none!important;transition:background .18s ease,border-color .18s ease,color .18s ease,box-shadow .18s ease}
    #adminDashboard .admin-nav button.active,#adminDashboard .admin-nav button.bws-glass-active{color:#fff!important;background:linear-gradient(90deg,#755cf43d,#ffffff0c)!important;border-color:#ffffff18!important;box-shadow:inset 0 1px 0 #ffffff18,0 7px 18px #08061926!important;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
    #adminDashboard .admin-nav>.bws-active-glass{display:none!important}
    #adminDashboard .bws-shell-icon{width:20px;display:grid;place-items:center;flex:0 0 20px}
    .support-unread-badge{display:none!important}.support-unread-badge.has-unread{display:grid!important;min-width:19px;height:19px;padding:0 5px;place-items:center;border-radius:99px;background:#ff5d70;color:#fff;font-size:8px;font-weight:900;margin-left:auto}
    #adminDashboard .admin-sidebar{position:relative!important;overflow:visible!important}
    #adminDashboard #bwsAdminSidebarToggle{display:grid!important;place-items:center!important;position:absolute!important;top:50%!important;right:-13px!important;transform:translateY(-50%)!important;width:26px!important;height:48px!important;padding:0!important;border:1px solid #ffffff26!important;border-radius:0 12px 12px 0!important;background:#17142f!important;color:#fff!important;z-index:1000!important;cursor:pointer!important;font-size:18px!important}
    #adminDashboard .admin-layout{transition:grid-template-columns .2s ease!important}
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
    #adminDashboard .admin-content:has(#adminSupportPanel:not(.hidden)){padding-top:16px!important}
  `);
  setupFoldableSidebar();

  const hideSupport=()=>{const p=document.getElementById('adminSupportPanel');if(p){p.classList.add('hidden');p.hidden=true}};
  const closeDrawer=()=>{document.getElementById('adminDashboard')?.classList.remove('client-details-open');document.getElementById('clientDrawer')?.classList.remove('is-open');document.getElementById('clientDrawer')?.classList.add('hidden');document.getElementById('drawerBackdrop')?.classList.add('hidden')};
  const showEl=(el,show)=>{if(!el)return;el.classList.toggle('hidden',!show);el.hidden=!show};
  const setHead=(title,description,showActions)=>{if(!dashboardHead)return;dashboardHead.querySelector('h1').textContent=title;dashboardHead.querySelector('p').textContent=description;dashboardHead.querySelector('.admin-actions')?.classList.toggle('hidden',!showActions)};
  const showDashboard=()=>{hideSupport();closeDrawer();setActiveNav(dashboardNav);showEl(dashboardHead,true);setHead('Dashboard','Overview of your Budgetingwise client accounts and account status.',false);showEl(stats,true);showEl(grid,false);showEl(createPanel,false);showEl(clientsPanel,false);history.replaceState(null,'',location.pathname+location.search+'#dashboard');window.scrollTo({top:0,behavior:'smooth'})};
  const showClients=()=>{hideSupport();closeDrawer();setActiveNav(clientsNav);showEl(dashboardHead,true);setHead('Client accounts','Create and manage the people who can use your budgeting page.',true);showEl(stats,false);showEl(grid,true);showEl(createPanel,true);showEl(clientsPanel,true);history.replaceState(null,'',location.pathname+location.search+'#clients');window.scrollTo({top:0,behavior:'smooth'})};
  let supportPromise=null;
  const loadAdminSupport=()=>supportPromise||(supportPromise=import('./admin-support-v1.js?v=admin-support-separated-v4').then(()=>true).catch(err=>{console.warn('Admin support inbox unavailable:',err);supportPromise=null;return false}));
  const waitForSupportPanel=async()=>{for(let i=0;i<120;i++){const p=document.getElementById('adminSupportPanel');if(p)return p;await new Promise(r=>setTimeout(r,50))}return null};
  const showSupport=async()=>{if(!await loadAdminSupport())return;const panel=await waitForSupportPanel();if(!panel)return;closeDrawer();setActiveNav(supportNav);showEl(dashboardHead,false);showEl(stats,false);showEl(grid,false);showEl(createPanel,false);showEl(clientsPanel,false);panel.classList.remove('hidden');panel.hidden=false;history.replaceState(null,'',location.pathname+location.search+'#support');window.scrollTo({top:0,behavior:'smooth'})};

  dashboardNav?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();showDashboard()},true);
  clientsNav?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();showClients()},true);
  supportNav?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();showSupport()},true);
  loadAdminSupport();
  window.addEventListener('load',()=>{setupFoldableSidebar();if(location.hash==='#clients')showClients();else if(location.hash==='#support')showSupport();else showDashboard()});
}
