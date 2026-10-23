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

  const iconSvg={
    dashboard:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    clients:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    support:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a7.7 7.7 0 0 1-8 7.5 8.9 8.9 0 0 1-3.45-.68L4 20l1.35-3.6A7.45 7.45 0 0 1 4 12a8 8 0 0 1 16-.5Z"/><path d="M8.5 10.25h7M8.5 13.5h4.75"/></svg>'
  };
  const prepareNavigation=()=>{
    const nav=document.querySelector('#adminDashboard .admin-nav');
    const defs=[[dashboardNav,'Dashboard',iconSvg.dashboard],[clientsNav,'Clients',iconSvg.clients],[supportNav,'Chat Support',iconSvg.support]];
    defs.forEach(([b,label,icon])=>{if(!b)return;b.dataset.label=label;b.innerHTML=`<span class="bws-shell-icon">${icon}</span><span class="bws-nav-label">${label}</span>${b===supportNav?'<span id="aspUnread" class="support-unread-badge" aria-label="Unread support messages"></span>':''}`;b.title=label});
    if(nav&&!nav.querySelector('.bws-active-glass')){const glass=document.createElement('span');glass.className='bws-active-glass';glass.setAttribute('aria-hidden','true');nav.prepend(glass)}
  };
  prepareNavigation();

  const moveGlass=target=>{
    const nav=document.querySelector('#adminDashboard .admin-nav'),glass=nav?.querySelector('.bws-active-glass');if(!nav||!glass||!target)return;
    const nr=nav.getBoundingClientRect(),tr=target.getBoundingClientRect();
    glass.style.width=`${tr.width}px`;glass.style.height=`${tr.height}px`;glass.style.transform=`translate3d(${tr.left-nr.left}px,${tr.top-nr.top}px,0)`;glass.classList.add('is-ready');
  };
  const setActiveNav=target=>{document.querySelectorAll('#adminDashboard .admin-nav button').forEach(b=>{const on=b===target;b.classList.toggle('active',on);b.setAttribute('aria-current',on?'page':'false')});requestAnimationFrame(()=>moveGlass(target))};

  const setupFoldableSidebar=()=>{
    const layout=document.querySelector('#adminDashboard .admin-layout'),side=document.querySelector('#adminDashboard .admin-sidebar');if(!layout||!side)return;
    side.dataset.foldReady='1';side.dataset.globalFoldReady='1';
    let btn=document.getElementById('bwsAdminSidebarToggle');if(!btn){btn=document.createElement('button');btn.type='button';btn.id='bwsAdminSidebarToggle';side.appendChild(btn)}
    let collapsed=localStorage.getItem('bwsAdminSidebarCollapsed')==='1';
    const active=()=>document.querySelector('#adminDashboard .admin-nav button.active');
    const apply=()=>{layout.classList.toggle('bws-admin-nav-collapsed',collapsed);side.classList.toggle('bws-admin-nav-collapsed',collapsed);layout.classList.remove('bws-admin-nav-peek');btn.textContent=collapsed?'›':'‹';btn.title=collapsed?'Expand sidebar':'Collapse sidebar';btn.setAttribute('aria-expanded',String(!collapsed));localStorage.setItem('bwsAdminSidebarCollapsed',collapsed?'1':'0');setTimeout(()=>moveGlass(active()),220)};
    if(!btn.dataset.bound){btn.dataset.bound='1';btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();collapsed=!collapsed;apply()})}
    apply();
  };

  addCss('bwsAdminShellNavStyle',`
    #adminDashboard .admin-nav{position:relative;display:grid;gap:8px;isolation:isolate}
    #adminDashboard .admin-nav button{position:relative;z-index:2;height:44px;display:flex;align-items:center;gap:11px;padding:0 12px!important;border-radius:11px!important;background:transparent!important;color:#c8c5dc!important;border:1px solid transparent!important;box-shadow:none!important;transition:color .18s ease}
    #adminDashboard .admin-nav button:hover{color:#fff!important}
    #adminDashboard .admin-nav button.active{color:#fff!important;background:transparent!important;border-color:transparent!important;box-shadow:none!important}
    #adminDashboard .admin-nav .bws-active-glass{position:absolute;z-index:1;left:0;top:0;display:block!important;border-radius:11px;background:linear-gradient(135deg,rgba(119,83,255,.88),rgba(88,53,224,.68));border:1px solid rgba(184,166,255,.58);box-shadow:inset 0 1px 0 rgba(255,255,255,.22),0 9px 24px rgba(91,56,245,.25);backdrop-filter:blur(13px);-webkit-backdrop-filter:blur(13px);opacity:0;pointer-events:none;transition:transform .28s cubic-bezier(.22,.8,.24,1),width .22s ease,height .22s ease,opacity .15s ease}
    #adminDashboard .admin-nav .bws-active-glass.is-ready{opacity:1}
    #adminDashboard .admin-nav .bws-active-glass:before{content:'';position:absolute;left:-1px;top:10px;bottom:10px;width:3px;border-radius:0 4px 4px 0;background:#c6b8ff;box-shadow:0 0 10px rgba(183,161,255,.9)}
    #adminDashboard .bws-shell-icon{width:20px;height:20px;display:grid;place-items:center;flex:0 0 20px}
    #adminDashboard .bws-shell-icon svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
    #adminDashboard #adminSupportNav .bws-shell-icon svg{width:18px;height:18px;stroke-width:1.75}
    #adminDashboard #adminSupportNav .bws-nav-label{font-weight:700;letter-spacing:-.01em}
    .support-unread-badge{display:none!important}.support-unread-badge.has-unread{display:grid!important;min-width:19px;height:19px;padding:0 5px;place-items:center;border-radius:99px;background:#ff5d70;color:#fff;font-size:8px;font-weight:900;margin-left:auto;box-shadow:0 0 0 3px rgba(255,93,112,.14)}
    #adminDashboard .admin-sidebar{position:relative!important;overflow:visible!important}
    #adminDashboard #bwsAdminSidebarToggle{display:grid!important;place-items:center!important;position:absolute!important;top:50%!important;right:-13px!important;transform:translateY(-50%)!important;width:26px!important;height:48px!important;padding:0!important;border:1px solid #ffffff26!important;border-radius:0 12px 12px 0!important;background:#17142f!important;color:#fff!important;z-index:1000!important;cursor:pointer!important;font-size:18px!important}
    #adminDashboard .admin-layout{transition:grid-template-columns .2s ease!important}
    #adminDashboard .admin-layout.bws-admin-nav-collapsed{grid-template-columns:64px minmax(0,1fr)!important}
    #adminDashboard .admin-sidebar.bws-admin-nav-collapsed{width:64px!important;padding-left:8px!important;padding-right:8px!important}
    #adminDashboard .admin-sidebar.bws-admin-nav-collapsed .admin-side-logo{justify-content:center!important;padding-left:0!important;padding-right:0!important;overflow:hidden!important}
    #adminDashboard .admin-sidebar.bws-admin-nav-collapsed .admin-side-logo>div,#adminDashboard .admin-sidebar.bws-admin-nav-collapsed .bws-nav-label{display:none!important}
    #adminDashboard .admin-sidebar.bws-admin-nav-collapsed .admin-nav{width:46px!important;margin-left:auto!important;margin-right:auto!important;overflow:hidden!important}
    #adminDashboard .admin-sidebar.bws-admin-nav-collapsed .admin-nav button,#adminDashboard .admin-sidebar.bws-admin-nav-collapsed #adminLogout{width:46px!important;min-width:46px!important;max-width:46px!important;justify-content:center!important;gap:0!important;padding-left:0!important;padding-right:0!important;overflow:hidden!important}
    #adminDashboard .admin-sidebar.bws-admin-nav-collapsed .bws-shell-icon{flex:0 0 20px!important;margin:0!important}
    #adminDashboard .admin-sidebar.bws-admin-nav-collapsed .support-unread-badge{position:absolute!important;top:3px!important;right:3px!important;margin:0!important;min-width:14px!important;height:14px!important;padding:0 3px!important;font-size:7px!important}
    #adminDashboard .admin-sidebar.bws-admin-nav-collapsed #bwsAdminSidebarToggle{right:-13px!important}
    #adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek{grid-template-columns:64px minmax(0,1fr)!important}
    #adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek .admin-sidebar{width:64px!important;padding-left:8px!important;padding-right:8px!important}
    #adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek .admin-sidebar .admin-side-logo{justify-content:center!important;padding-left:0!important;padding-right:0!important}
    #adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek .admin-sidebar .admin-side-logo>div,#adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek .admin-sidebar .bws-nav-label{display:none!important}
    #adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek .admin-sidebar .admin-nav button,#adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek .admin-sidebar #adminLogout{width:46px!important;min-width:46px!important;max-width:46px!important;justify-content:center!important;gap:0!important;padding-left:0!important;padding-right:0!important;overflow:hidden!important}
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
  window.addEventListener('resize',()=>moveGlass(document.querySelector('#adminDashboard .admin-nav button.active')));
  loadAdminSupport();
  window.addEventListener('load',()=>{setupFoldableSidebar();if(location.hash==='#clients')showClients();else if(location.hash==='#support')showSupport();else showDashboard()});
}
