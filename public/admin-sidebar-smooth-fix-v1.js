(()=>{
  'use strict';
  const root=document.getElementById('adminDashboard');
  if(!root||document.getElementById('bwsSidebarSmoothFixCss'))return;

  const style=document.createElement('style');
  style.id='bwsSidebarSmoothFixCss';
  style.textContent=`
    #adminDashboard .admin-layout.bws-admin-nav-collapsed,
    #adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek{
      grid-template-columns:64px minmax(0,1fr)!important;
    }
    #adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar{
      width:64px!important;
      min-width:64px!important;
      max-width:none!important;
      z-index:60!important;
      transition:width .26s cubic-bezier(.22,.8,.22,1),padding .26s cubic-bezier(.22,.8,.22,1),box-shadow .22s ease!important;
      will-change:width;
    }
    #adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar.bws-smooth-peek{
      width:230px!important;
      padding-left:14px!important;
      padding-right:14px!important;
      box-shadow:16px 0 34px rgba(12,9,35,.20)!important;
    }
    #adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar:not(.bws-smooth-peek) .admin-side-logo{
      justify-content:center!important;padding-left:0!important;padding-right:0!important;
    }
    #adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar:not(.bws-smooth-peek) .admin-side-logo>div,
    #adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar:not(.bws-smooth-peek) .bws-nav-label{
      width:0!important;max-width:0!important;opacity:0!important;margin:0!important;padding:0!important;transform:translateX(-8px)!important;pointer-events:none!important;
    }
    #adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar:not(.bws-smooth-peek) .admin-nav button,
    #adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar:not(.bws-smooth-peek) #adminLogout{
      justify-content:center!important;gap:0!important;padding-left:0!important;padding-right:0!important;
    }
    #adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar:not(.bws-smooth-peek) .admin-note{
      max-height:0!important;opacity:0!important;padding-top:0!important;padding-bottom:0!important;border-color:transparent!important;pointer-events:none!important;
    }
    #adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar.bws-smooth-peek .admin-side-logo{
      justify-content:flex-start!important;padding-left:5px!important;padding-right:5px!important;
    }
    #adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar.bws-smooth-peek .admin-side-logo>div,
    #adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar.bws-smooth-peek .bws-nav-label{
      width:auto!important;max-width:150px!important;opacity:1!important;margin:0!important;transform:translateX(0)!important;pointer-events:auto!important;
    }
    #adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar.bws-smooth-peek .admin-nav button,
    #adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar.bws-smooth-peek #adminLogout{
      justify-content:flex-start!important;gap:11px!important;padding-left:12px!important;padding-right:12px!important;
    }
    #adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar.bws-smooth-peek .admin-note{
      max-height:110px!important;opacity:1!important;padding:13px!important;border-color:#ffffff12!important;pointer-events:auto!important;
    }
    #adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar.bws-smooth-peek .support-unread-badge{
      position:static!important;min-width:19px!important;height:19px!important;padding:0 5px!important;font-size:8px!important;margin-left:auto!important;
    }
    #adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar:not(.bws-smooth-peek) .support-unread-badge{
      position:absolute!important;top:3px!important;right:3px!important;margin:0!important;min-width:14px!important;height:14px!important;padding:0 3px!important;font-size:7px!important;
    }
    @media(max-width:1050px){#adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar{width:auto!important;min-width:0!important}}
    @media(prefers-reduced-motion:reduce){#adminDashboard .admin-layout.bws-admin-nav-collapsed>.admin-sidebar{transition:none!important}}
  `;
  document.head.appendChild(style);

  const bind=()=>{
    const layout=root.querySelector('.admin-layout');
    const side=root.querySelector('.admin-sidebar');
    if(!layout||!side||side.dataset.bwsSmoothBound)return false;
    side.dataset.bwsSmoothBound='1';
    let closeTimer=0;
    const isCollapsed=()=>layout.classList.contains('bws-admin-nav-collapsed')||side.classList.contains('bws-admin-nav-collapsed');
    const clearLegacyPeek=()=>{layout.classList.remove('bws-admin-nav-peek');side.classList.remove('bws-admin-nav-peek')};
    const open=()=>{
      clearTimeout(closeTimer);
      if(!isCollapsed()){side.classList.remove('bws-smooth-peek');return;}
      clearLegacyPeek();
      side.classList.add('bws-smooth-peek');
    };
    const close=(delay=150)=>{
      clearTimeout(closeTimer);
      closeTimer=setTimeout(()=>{
        if(side.matches(':hover')||side.contains(document.activeElement))return;
        clearLegacyPeek();
        side.classList.remove('bws-smooth-peek');
      },delay);
    };
    side.addEventListener('mouseenter',open);
    side.addEventListener('mouseleave',()=>close(170));
    side.addEventListener('focusin',open);
    side.addEventListener('focusout',e=>{if(!side.contains(e.relatedTarget))close(120)});
    side.addEventListener('pointermove',()=>{if(isCollapsed()&&side.matches(':hover'))open()},{passive:true});
    const toggle=side.querySelector('#bwsAdminSidebarToggle');
    toggle?.addEventListener('click',()=>{clearTimeout(closeTimer);side.classList.remove('bws-smooth-peek');clearLegacyPeek()},{capture:true});
    return true;
  };

  if(!bind()){
    let n=0;
    const timer=setInterval(()=>{if(bind()||++n>30)clearInterval(timer)},100);
  }
})();
