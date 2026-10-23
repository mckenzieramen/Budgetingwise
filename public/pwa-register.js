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

  // Premium Chat Support navigation treatment.
  const supportNav=document.getElementById('adminSupportNav');
  if(supportNav){
    supportNav.classList.add('admin-support-premium-nav');
    supportNav.innerHTML=`
      <span class="support-premium-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" role="img">
          <path d="M5 13v-1a7 7 0 0 1 14 0v1"/>
          <path d="M5 13H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2v-6Z"/>
          <path d="M19 13h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2v-6Z"/>
          <path d="M18 19c0 1.1-.9 2-2 2h-3"/>
          <path d="M9 9.5c.7-.6 1.7-1 3-1s2.3.4 3 1"/>
        </svg>
      </span>
      <span class="support-nav-copy"><strong>Chat Support</strong><small>Inbox & tickets</small></span>
      <span id="aspUnread" class="support-unread-badge" aria-label="Unread support messages"></span>`;

    if(!document.getElementById('adminSupportPremiumNavStyle')){
      const style=document.createElement('style');
      style.id='adminSupportPremiumNavStyle';
      style.textContent=`
        .admin-support-premium-nav{position:relative!important;display:grid!important;grid-template-columns:38px minmax(0,1fr) auto!important;align-items:center!important;gap:10px!important;min-height:54px!important;padding:7px 10px!important;overflow:hidden!important;isolation:isolate!important}
        .admin-support-premium-nav:before{content:'';position:absolute;inset:0;z-index:-1;border-radius:10px;background:linear-gradient(110deg,rgba(111,82,245,.12),rgba(86,62,217,.02));opacity:0;transition:opacity .18s ease}
        .admin-support-premium-nav:hover:before,.admin-support-premium-nav.active:before{opacity:1}
        .support-premium-mark{width:36px;height:36px;display:grid;place-items:center;border-radius:11px;background:linear-gradient(145deg,#7659f6,#5436d7);color:#fff;box-shadow:0 8px 20px rgba(85,54,215,.34),inset 0 1px 0 rgba(255,255,255,.24);transition:transform .18s ease,box-shadow .18s ease}
        .admin-support-premium-nav:hover .support-premium-mark{transform:translateY(-1px) scale(1.03);box-shadow:0 11px 24px rgba(85,54,215,.4),inset 0 1px 0 rgba(255,255,255,.28)}
        .support-premium-mark svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
        .support-nav-copy{min-width:0;display:block!important;text-align:left;line-height:1.15}
        .support-nav-copy strong{display:block;color:inherit;font-size:11px;font-weight:850;white-space:nowrap}
        .support-nav-copy small{display:block!important;margin-top:3px;color:#938eae!important;font-size:8px!important;font-weight:650;letter-spacing:.01em;white-space:nowrap}
        .admin-support-premium-nav.active .support-nav-copy small{color:#d8d2ff!important}
        .support-unread-badge{display:none!important;min-width:19px;height:19px;padding:0 5px;place-items:center;border-radius:99px;background:#ff5d70;color:#fff!important;font-size:8px!important;font-weight:900;box-shadow:0 4px 10px rgba(255,93,112,.32)}
        .support-unread-badge.has-unread{display:grid!important}
        .admin-support-premium-nav.is-loading .support-premium-mark svg{animation:bwsSupportPulse .8s ease-in-out infinite alternate}
        @keyframes bwsSupportPulse{from{opacity:.48;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
        @media(max-width:1050px){.admin-support-premium-nav{grid-template-columns:36px minmax(0,1fr) auto!important}}
      `;
      document.head.appendChild(style);
    }
  }

  // Chat Support must work on the very first click. Start loading immediately,
  // and intercept an early click only until the module owns the button.
  let supportPromise=null;
  const loadAdminSupport=()=>{
    if(supportPromise)return supportPromise;
    supportNav?.classList.add('is-loading');
    supportPromise=import('./admin-support-v1.js?v=admin-support-nav-fix-v1')
      .then(()=>{
        supportNav?.classList.remove('is-loading');
        if(supportNav)supportNav.dataset.supportReady='1';
        return true;
      })
      .catch(err=>{
        console.warn('Admin support inbox unavailable:',err);
        supportNav?.classList.remove('is-loading');
        supportPromise=null;
        return false;
      });
    return supportPromise;
  };

  if(supportNav){
    supportNav.addEventListener('click',event=>{
      if(supportNav.dataset.supportReady==='1'||document.getElementById('adminSupportPanel'))return;
      event.preventDefault();
      event.stopImmediatePropagation();
      loadAdminSupport().then(ok=>{
        if(ok)requestAnimationFrame(()=>supportNav.click());
      });
    },true);
  }

  // Preload now instead of waiting for browser idle, so navigation is responsive.
  loadAdminSupport();
}
