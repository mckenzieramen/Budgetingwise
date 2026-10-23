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
    support:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a7.7 7.7 0 0 1-8 7.5 8.9 8.9 0 0 1-3.45-.68L4 20l1.35-3.6A7.45 7.45 0 0 1 4 12a8 8 0 0 1 16-.5Z"/><path d="M8.5 10.25h7M8.5 13.5h4.75"/></svg>',
    logout:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4"/><path d="M14 8l4 4-4 4"/><path d="M9 12h9"/></svg>'
  };

  const prepareNavigation=()=>{
    const nav=document.querySelector('#adminDashboard .admin-nav');
    const defs=[[dashboardNav,'Dashboard',iconSvg.dashboard],[clientsNav,'Clients',iconSvg.clients],[supportNav,'Chat Support',iconSvg.support]];
    defs.forEach(([b,label,icon])=>{
      if(!b)return;
      const unread=b===supportNav?b.querySelector('#aspUnread')?.outerHTML||'<span id="aspUnread" class="support-unread-badge" aria-label="Unread support messages"></span>':'';
      b.dataset.label=label;
      b.innerHTML=`<span class="bws-shell-icon">${icon}</span><span class="bws-nav-label">${label}</span>${unread}`;
      b.title=label;
      b.setAttribute('aria-label',label);
    });
    const logout=document.getElementById('adminLogout');
    if(logout){logout.innerHTML=`<span class="bws-shell-icon">${iconSvg.logout}</span><span class="bws-nav-label">Log out</span>`;logout.title='Log out';logout.setAttribute('aria-label','Log out')}
    if(nav&&!nav.querySelector('.bws-active-glass')){const glass=document.createElement('span');glass.className='bws-active-glass';glass.setAttribute('aria-hidden','true');nav.prepend(glass)}
  };
  prepareNavigation();

  const moveGlass=target=>{
    const nav=document.querySelector('#adminDashboard .admin-nav'),glass=nav?.querySelector('.bws-active-glass');if(!nav||!glass||!target)return;
    const nr=nav.getBoundingClientRect(),tr=target.getBoundingClientRect();
    glass.style.height=`${tr.height}px`;
    glass.style.transform=`translate3d(0,${tr.top-nr.top}px,0)`;
    glass.classList.add('is-ready');
  };
  const setActiveNav=target=>{document.querySelectorAll('#adminDashboard .admin-nav button').forEach(b=>{const on=b===target;b.classList.toggle('active',on);b.setAttribute('aria-current',on?'page':'false')});requestAnimationFrame(()=>moveGlass(target))};

  const setupFoldableSidebar=()=>{
    const layout=document.querySelector('#adminDashboard .admin-layout'),side=document.querySelector('#adminDashboard .admin-sidebar');if(!layout||!side)return;
    const MIN_WIDTH=64,MAX_WIDTH=230,SNAP_WIDTH=(MIN_WIDTH+MAX_WIDTH)/2;
    side.dataset.foldReady='1';side.dataset.globalFoldReady='1';side.onmouseenter=null;side.onmouseleave=null;
    let btn=document.getElementById('bwsAdminSidebarToggle');
    if(!btn){btn=document.createElement('button');btn.type='button';btn.id='bwsAdminSidebarToggle';btn.innerHTML='<span class="bws-toggle-chevron" aria-hidden="true">‹</span>';side.appendChild(btn)}
    let collapsed=localStorage.getItem('bwsAdminSidebarCollapsed')==='1';
    const active=()=>document.querySelector('#adminDashboard .admin-nav button.active');
    const chevron=()=>btn.querySelector('.bws-toggle-chevron');
    const updateButton=()=>{
      const mark=chevron();if(mark)mark.textContent=collapsed?'›':'‹';
      btn.title=collapsed?'Expand sidebar':'Collapse sidebar';
      btn.setAttribute('aria-label',btn.title);btn.setAttribute('aria-expanded',String(!collapsed));
    };
    const clearDragVars=()=>{layout.style.removeProperty('--bws-sidebar-width');layout.style.removeProperty('--bws-sidebar-progress')};
    const apply=(animate=true)=>{
      if(!animate)layout.classList.add('bws-sidebar-no-transition');
      layout.classList.toggle('bws-admin-nav-collapsed',collapsed);side.classList.toggle('bws-admin-nav-collapsed',collapsed);
      layout.classList.remove('bws-admin-nav-peek');side.dataset.collapsed=collapsed?'1':'0';updateButton();
      localStorage.setItem('bwsAdminSidebarCollapsed',collapsed?'1':'0');
      requestAnimationFrame(()=>moveGlass(active()));
      if(!animate)requestAnimationFrame(()=>layout.classList.remove('bws-sidebar-no-transition'));
    };
    if(!btn.dataset.bound){
      btn.dataset.bound='1';
      let pointerId=null,startX=0,startWidth=0,lastWidth=0,dragging=false,suppressClick=false;
      const clamp=n=>Math.max(MIN_WIDTH,Math.min(MAX_WIDTH,n));
      btn.addEventListener('pointerdown',e=>{
        if(e.pointerType==='mouse'&&e.button!==0)return;
        pointerId=e.pointerId;startX=e.clientX;startWidth=side.getBoundingClientRect().width;lastWidth=startWidth;dragging=false;
        btn.classList.add('is-grabbing');btn.setPointerCapture?.(pointerId);
      });
      btn.addEventListener('pointermove',e=>{
        if(pointerId===null||e.pointerId!==pointerId)return;
        const delta=e.clientX-startX;if(!dragging&&Math.abs(delta)<4)return;
        dragging=true;e.preventDefault();
        const width=clamp(startWidth+delta),progress=(width-MIN_WIDTH)/(MAX_WIDTH-MIN_WIDTH);lastWidth=width;
        layout.classList.add('bws-sidebar-dragging');side.classList.add('bws-sidebar-dragging');
        layout.style.setProperty('--bws-sidebar-width',`${width}px`);layout.style.setProperty('--bws-sidebar-progress',String(progress));
        btn.setAttribute('aria-expanded',String(progress>=.5));requestAnimationFrame(()=>moveGlass(active()));
      });
      const finishDrag=e=>{
        if(pointerId===null||e.pointerId!==pointerId)return;
        try{btn.releasePointerCapture?.(pointerId)}catch(_){/* capture may already be released */}
        pointerId=null;btn.classList.remove('is-grabbing');
        if(!dragging){layout.classList.remove('bws-sidebar-dragging');side.classList.remove('bws-sidebar-dragging');clearDragVars();return}
        suppressClick=true;collapsed=lastWidth<SNAP_WIDTH;
        layout.classList.toggle('bws-admin-nav-collapsed',collapsed);side.classList.toggle('bws-admin-nav-collapsed',collapsed);side.dataset.collapsed=collapsed?'1':'0';
        updateButton();localStorage.setItem('bwsAdminSidebarCollapsed',collapsed?'1':'0');
        layout.classList.remove('bws-sidebar-dragging');side.classList.remove('bws-sidebar-dragging');
        requestAnimationFrame(()=>{clearDragVars();requestAnimationFrame(()=>moveGlass(active()))});
        setTimeout(()=>{suppressClick=false},0);dragging=false;
      };
      btn.addEventListener('pointerup',finishDrag);btn.addEventListener('pointercancel',finishDrag);
      btn.addEventListener('click',e=>{
        if(suppressClick){e.preventDefault();e.stopPropagation();return}
        e.preventDefault();e.stopPropagation();collapsed=!collapsed;apply(true);
      });
    }
    apply(false);
  };

  addCss('bwsAdminShellNavStyle',`
    #adminDashboard .admin-layout{--bws-sidebar-width:230px;--bws-sidebar-progress:1;grid-template-columns:var(--bws-sidebar-width) minmax(0,1fr)!important;transition:grid-template-columns .42s cubic-bezier(.22,.82,.2,1)!important;will-change:grid-template-columns}
    #adminDashboard .admin-layout.bws-admin-nav-collapsed{--bws-sidebar-width:64px;--bws-sidebar-progress:0}
    #adminDashboard .admin-layout.bws-sidebar-no-transition,#adminDashboard .admin-layout.bws-sidebar-no-transition *{transition:none!important}
    #adminDashboard .admin-layout.bws-sidebar-dragging{transition:none!important;user-select:none!important}
    #adminDashboard .admin-sidebar{position:relative!important;overflow:visible!important;width:100%!important;min-width:0!important;max-width:none!important;padding-left:14px!important;padding-right:14px!important;box-sizing:border-box!important;transition:padding .42s cubic-bezier(.22,.82,.2,1)!important;will-change:padding}
    #adminDashboard .admin-nav{position:relative;display:grid;gap:8px;isolation:isolate;width:100%!important;min-width:0!important;max-width:none!important;overflow:hidden!important}
    #adminDashboard .admin-nav button,#adminDashboard #adminLogout{position:relative;z-index:2;display:flex!important;width:100%!important;min-width:0!important;max-width:none!important;align-items:center!important;justify-content:flex-start!important;gap:11px!important;padding-left:12px!important;padding-right:12px!important;overflow:hidden!important;white-space:nowrap!important;transition:padding .38s cubic-bezier(.22,.82,.2,1),gap .3s ease,color .18s ease!important}
    #adminDashboard .admin-nav button{height:44px;border-radius:11px!important;background:transparent!important;color:#c8c5dc!important;border:1px solid transparent!important;box-shadow:none!important}
    #adminDashboard .admin-nav button:hover{color:#fff!important}
    #adminDashboard .admin-nav button.active{color:#fff!important;background:transparent!important;border-color:transparent!important;box-shadow:none!important}
    #adminDashboard .bws-nav-label{display:block!important;width:auto!important;max-width:150px!important;opacity:1!important;overflow:hidden!important;transform:translateX(0)!important;transition:max-width .34s cubic-bezier(.22,.82,.2,1),opacity .2s ease,transform .34s cubic-bezier(.22,.82,.2,1)!important}
    #adminDashboard .admin-side-logo{overflow:hidden!important;transition:padding .38s cubic-bezier(.22,.82,.2,1)!important}
    #adminDashboard .admin-side-logo>div{display:block!important;width:auto!important;max-width:150px!important;opacity:1!important;overflow:hidden!important;transform:translateX(0)!important;transition:max-width .34s cubic-bezier(.22,.82,.2,1),opacity .2s ease,transform .34s cubic-bezier(.22,.82,.2,1)!important}
    #adminDashboard .admin-note{overflow:hidden!important;transition:opacity .18s ease,max-height .28s ease,padding .28s ease,border-color .18s ease!important}
    #adminDashboard .admin-nav .bws-active-glass{position:absolute;z-index:1;left:0;top:0;display:block!important;width:100%!important;border-radius:11px;background:linear-gradient(135deg,rgba(119,83,255,.88),rgba(88,53,224,.68));border:1px solid rgba(184,166,255,.58);box-shadow:inset 0 1px 0 rgba(255,255,255,.22),0 9px 24px rgba(91,56,245,.25);backdrop-filter:blur(13px);-webkit-backdrop-filter:blur(13px);opacity:0;pointer-events:none;transition:transform .3s cubic-bezier(.22,.82,.2,1),opacity .15s ease!important}
    #adminDashboard .admin-nav .bws-active-glass.is-ready{opacity:1}
    #adminDashboard .admin-nav .bws-active-glass:before{content:'';position:absolute;left:-1px;top:10px;bottom:10px;width:3px;border-radius:0 4px 4px 0;background:#c6b8ff;box-shadow:0 0 10px rgba(183,161,255,.9)}
    #adminDashboard .bws-shell-icon,#adminDashboard .bws-nav-icon{width:20px!important;height:20px!important;display:grid!important;place-items:center!important;flex:0 0 20px!important;margin:0!important;color:inherit!important}
    #adminDashboard .bws-shell-icon svg,#adminDashboard .bws-nav-icon svg{width:18px!important;height:18px!important;fill:none!important;stroke:currentColor!important;stroke-width:1.8!important;stroke-linecap:round!important;stroke-linejoin:round!important}
    #adminDashboard #adminSupportNav .bws-nav-label{font-weight:700;letter-spacing:-.01em}
    .support-unread-badge{display:none!important}.support-unread-badge.has-unread{display:grid!important;min-width:19px;height:19px;padding:0 5px;place-items:center;border-radius:99px;background:#ff5d70;color:#fff;font-size:8px;font-weight:900;margin-left:auto;box-shadow:0 0 0 3px rgba(255,93,112,.14)}

    #adminDashboard #bwsAdminSidebarToggle{appearance:none!important;display:grid!important;place-items:center!important;position:absolute!important;top:50%!important;right:-15px!important;transform:translateY(-50%)!important;width:30px!important;height:42px!important;padding:0!important;border:1px solid rgba(255,255,255,.16)!important;border-radius:12px!important;background:linear-gradient(180deg,rgba(43,38,77,.98),rgba(27,24,55,.98))!important;color:#f5f3ff!important;box-shadow:0 7px 20px rgba(13,10,35,.24),inset 0 1px 0 rgba(255,255,255,.06)!important;z-index:1000!important;cursor:ew-resize!important;touch-action:none!important;user-select:none!important;transition:transform .18s ease,background .18s ease,border-color .18s ease,box-shadow .18s ease!important}
    #adminDashboard #bwsAdminSidebarToggle:hover{transform:translateY(-50%) scale(1.04)!important;background:linear-gradient(180deg,rgba(53,46,94,.99),rgba(31,27,64,.99))!important;border-color:rgba(255,255,255,.26)!important;box-shadow:0 9px 24px rgba(13,10,35,.3),0 0 0 3px rgba(111,82,255,.08)!important}
    #adminDashboard #bwsAdminSidebarToggle.is-grabbing{transform:translateY(-50%) scale(.97)!important;box-shadow:0 5px 14px rgba(13,10,35,.24),0 0 0 3px rgba(111,82,255,.12)!important}
    #adminDashboard .bws-toggle-chevron{display:block!important;font:700 18px/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;transform:translateY(-1px)!important;transition:transform .24s cubic-bezier(.22,.82,.2,1)!important;pointer-events:none!important}

    #adminDashboard .admin-sidebar.bws-admin-nav-collapsed,#adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar{width:100%!important;min-width:0!important;max-width:none!important;padding-left:8px!important;padding-right:8px!important;overflow:visible!important}
    #adminDashboard .admin-sidebar.bws-admin-nav-collapsed .admin-side-logo,#adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar .admin-side-logo{justify-content:center!important;padding-left:0!important;padding-right:0!important;overflow:hidden!important}
    #adminDashboard .admin-sidebar.bws-admin-nav-collapsed .admin-side-logo>div,#adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar .admin-side-logo>div{display:block!important;width:auto!important;max-width:0!important;opacity:0!important;margin:0!important;padding:0!important;overflow:hidden!important;transform:translateX(-8px)!important}
    #adminDashboard .admin-sidebar.bws-admin-nav-collapsed .admin-nav,#adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar .admin-nav{width:100%!important;min-width:0!important;max-width:none!important;margin-left:auto!important;margin-right:auto!important;overflow:hidden!important}
    #adminDashboard .admin-sidebar.bws-admin-nav-collapsed .admin-nav button,#adminDashboard .admin-sidebar.bws-admin-nav-collapsed #adminLogout,#adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar .admin-nav button,#adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar #adminLogout{display:flex!important;width:100%!important;min-width:0!important;max-width:none!important;height:44px!important;min-height:44px!important;align-items:center!important;justify-content:center!important;gap:0!important;padding-left:0!important;padding-right:0!important;margin-left:0!important;margin-right:0!important;overflow:hidden!important;white-space:nowrap!important}
    #adminDashboard .admin-sidebar.bws-admin-nav-collapsed .bws-nav-label,#adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar .bws-nav-label{display:block!important;width:0!important;max-width:0!important;opacity:0!important;overflow:hidden!important;transform:translateX(-8px)!important;margin:0!important;padding:0!important;pointer-events:none!important}
    #adminDashboard .admin-sidebar.bws-admin-nav-collapsed .bws-shell-icon,#adminDashboard .admin-sidebar.bws-admin-nav-collapsed .bws-nav-icon,#adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar .bws-shell-icon,#adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar .bws-nav-icon{display:grid!important;place-items:center!important;flex:0 0 20px!important;width:20px!important;height:20px!important;margin:0!important;color:#d4d0e8!important;font-size:18px!important}
    #adminDashboard .admin-sidebar.bws-admin-nav-collapsed .admin-nav button.active .bws-shell-icon,#adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar .admin-nav button.active .bws-shell-icon{color:#fff!important}
    #adminDashboard .admin-sidebar.bws-admin-nav-collapsed .admin-note,#adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar .admin-note{opacity:0!important;max-height:0!important;margin:0!important;padding:0!important;border-color:transparent!important;pointer-events:none!important}
    #adminDashboard .admin-sidebar.bws-admin-nav-collapsed #adminLogout,#adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar #adminLogout{margin-top:auto!important;border-radius:11px!important}
    #adminDashboard .admin-sidebar.bws-admin-nav-collapsed .support-unread-badge,#adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar .support-unread-badge{position:absolute!important;top:3px!important;right:3px!important;margin:0!important;min-width:14px!important;height:14px!important;padding:0 3px!important;font-size:7px!important;color:#fff!important}

    #adminDashboard .admin-layout.bws-sidebar-dragging>.admin-sidebar{padding-left:8px!important;padding-right:8px!important;transition:none!important}
    #adminDashboard .admin-layout.bws-sidebar-dragging>.admin-sidebar .admin-nav button,#adminDashboard .admin-layout.bws-sidebar-dragging>.admin-sidebar #adminLogout{justify-content:flex-start!important;gap:11px!important;padding-left:13px!important;padding-right:12px!important;transition:none!important}
    #adminDashboard .admin-layout.bws-sidebar-dragging>.admin-sidebar .bws-nav-label,#adminDashboard .admin-layout.bws-sidebar-dragging>.admin-sidebar .admin-side-logo>div{display:block!important;width:auto!important;max-width:150px!important;opacity:var(--bws-sidebar-progress)!important;transform:translateX(0)!important;transition:none!important}
    #adminDashboard .admin-layout.bws-sidebar-dragging>.admin-sidebar .admin-side-logo{justify-content:flex-start!important;padding-left:4px!important;padding-right:4px!important}
    #adminDashboard .admin-layout.bws-sidebar-dragging>.admin-sidebar .admin-note{display:none!important}
    #adminDashboard .admin-layout.bws-sidebar-dragging>.admin-sidebar #adminLogout{margin-top:auto!important}
    #adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek{--bws-sidebar-width:64px}
    #adminDashboard .admin-content:has(#adminSupportPanel:not(.hidden)){padding-top:16px!important}

    @media(max-width:1050px){#adminDashboard .admin-layout,#adminDashboard .admin-layout.bws-admin-nav-collapsed{grid-template-columns:1fr!important}#adminDashboard .admin-sidebar{display:none!important}}
    @media(prefers-reduced-motion:reduce){#adminDashboard .admin-layout,#adminDashboard .admin-sidebar,#adminDashboard .admin-nav button,#adminDashboard #adminLogout,#adminDashboard .bws-nav-label,#adminDashboard .admin-side-logo>div,#adminDashboard .admin-nav .bws-active-glass,#adminDashboard #bwsAdminSidebarToggle{transition:none!important}}
  `);
  setupFoldableSidebar();

  const hideSupport=()=>{const p=document.getElementById('adminSupportPanel');if(p){p.classList.add('hidden');p.hidden=true}};
  const closeDrawer=()=>{document.getElementById('adminDashboard')?.classList.remove('client-details-open');document.getElementById('clientDrawer')?.classList.remove('is-open');document.getElementById('clientDrawer')?.classList.add('hidden');document.getElementById('drawerBackdrop')?.classList.add('hidden')};
  const showEl=(el,show)=>{if(!el)return;el.classList.toggle('hidden',!show);el.hidden=!show};
  const setHead=(title,description,showActions)=>{if(!dashboardHead)return;dashboardHead.querySelector('h1').textContent=title;dashboardHead.querySelector('p').textContent=description;dashboardHead.querySelector('.admin-actions')?.classList.toggle('hidden',!showActions)};
  const showDashboard=()=>{hideSupport();closeDrawer();setActiveNav(dashboardNav);showEl(dashboardHead,true);setHead('Dashboard','Overview of your Budgetingwise client accounts and account status.',false);showEl(stats,true);showEl(grid,false);showEl(createPanel,false);showEl(clientsPanel,false);history.replaceState(null,'',location.pathname+location.search+'#dashboard');window.scrollTo({top:0,behavior:'smooth'})};
  const showClients=()=>{hideSupport();closeDrawer();setActiveNav(clientsNav);showEl(dashboardHead,true);setHead('Client accounts','Create and manage the people who can use your budgeting page.',true);showEl(stats,false);showEl(grid,true);showEl(createPanel,true);showEl(clientsPanel,true);history.replaceState(null,'',location.pathname+location.search+'#clients');window.scrollTo({top:0,behavior:'smooth'})};
  let supportPromise=null;
  const loadAdminSupport=()=>supportPromise||(supportPromise=import('./admin-support-v1.js?v=admin-support-separated-v4').then(()=>{prepareNavigation();setupFoldableSidebar();setTimeout(()=>moveGlass(document.querySelector('#adminDashboard .admin-nav button.active')),80);return true}).catch(err=>{console.warn('Admin support inbox unavailable:',err);supportPromise=null;return false}));
  const waitForSupportPanel=async()=>{for(let i=0;i<120;i++){const p=document.getElementById('adminSupportPanel');if(p)return p;await new Promise(r=>setTimeout(r,50))}return null};
  const showSupport=async()=>{if(!await loadAdminSupport())return;const panel=await waitForSupportPanel();if(!panel)return;closeDrawer();setActiveNav(supportNav);showEl(dashboardHead,false);showEl(stats,false);showEl(grid,false);showEl(createPanel,false);showEl(clientsPanel,false);panel.classList.remove('hidden');panel.hidden=false;history.replaceState(null,'',location.pathname+location.search+'#support');window.scrollTo({top:0,behavior:'smooth'})};

  dashboardNav?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();showDashboard()},true);
  clientsNav?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();showClients()},true);
  supportNav?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();showSupport()},true);
  window.addEventListener('resize',()=>moveGlass(document.querySelector('#adminDashboard .admin-nav button.active')));
  loadAdminSupport();
  window.addEventListener('load',()=>{prepareNavigation();setupFoldableSidebar();if(location.hash==='#clients')showClients();else if(location.hash==='#support')showSupport();else showDashboard()});
}
