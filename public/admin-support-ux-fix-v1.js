// Budgetingwise Admin Support UX patch: ticket transcript view + stable ticket context sidebar.
(()=>{
  const q=(s,p=document)=>p.querySelector(s);
  let lastUid='',repairing=false,lastRepair=0;

  function showOpenedTicketConversation(){
    const panel=q('#bwsTabPanel');
    if(!panel||!q('.bws-current-ticket-note',panel))return;
    const live=q('#aspMessages'),note=q('.bws-current-ticket-note',panel);
    if(!live||!note)return;
    const transcript=document.createElement('div');
    transcript.className='bws-opened-ticket-chat';
    transcript.innerHTML=live.innerHTML||'<div class="bws-empty">No conversation messages yet.</div>';
    note.replaceWith(transcript);
  }

  function keepRightPanel(){
    const profile=q('#aspProfile');
    if(!profile)return;
    profile.hidden=false;
    profile.removeAttribute('hidden');
    profile.style.removeProperty('display');
    profile.classList.remove('hidden');
  }

  // The premium suite owns the complete action set. If another render replaces the
  // profile with the small legacy action card, reselect the SAME customer once so the
  // suite rebuilds Customer Information, Copy BID, all account actions, ticket details
  // and email log. Cooldown prevents click/render loops.
  function repairRightPanel(){
    keepRightPanel();
    const active=q('#aspThreads [data-thread].active');
    if(!active)return;
    const card=q('#aspProfile .asp-profile-card');
    if(!card)return;
    const complete=q('#bwsProfileExtras',card);
    const identity=q('#bwsCustomerIdentity',card);
    if(complete&&identity){repairing=false;return}
    const now=Date.now();
    if(repairing||now-lastRepair<1200)return;
    repairing=true;lastRepair=now;
    active.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));
    setTimeout(()=>{repairing=false;keepRightPanel()},700);
  }

  function refreshTicketContext(){
    keepRightPanel();
    const uid=q('#aspThreads [data-thread].active')?.dataset.thread||'';
    if(!uid)return;
    if(uid!==lastUid)lastUid=uid;
    setTimeout(repairRightPanel,180);
    setTimeout(repairRightPanel,650);
  }

  document.addEventListener('click',e=>{
    if(e.target.closest('#bwsTabPanel [data-ticket-index]')){
      setTimeout(showOpenedTicketConversation,0);
      setTimeout(showOpenedTicketConversation,80);
    }
    if(e.target.closest('#bwsSupportTabs [data-tab],#aspThreads [data-thread]')){
      setTimeout(refreshTicketContext,0);
      setTimeout(keepRightPanel,120);
      setTimeout(repairRightPanel,520);
    }
  },true);

  const startProfileGuard=()=>{
    const profile=q('#aspProfile');
    if(!profile)return setTimeout(startProfileGuard,180);
    keepRightPanel();
    // Attribute-only guard: no DOM injection and no recursive child observer.
    new MutationObserver(keepRightPanel).observe(profile,{attributes:true,attributeFilter:['class','hidden','style']});
    setInterval(()=>{
      if(q('#adminSupportPanel')&&!q('#adminSupportPanel.hidden'))repairRightPanel();
    },1600);
  };
  startProfileGuard();

  const style=document.createElement('style');
  style.id='bwsAdminSupportUxFixV1';
  style.textContent=`
    #adminSupportPanel #aspProfile{display:block!important;visibility:visible!important}
    /* Never show the reduced legacy four-button card when the premium support suite is active. */
    #adminSupportPanel #aspProfile .bw-admin-account-actions{display:none!important}
    #adminSupportPanel #bwsProfileExtras{display:flex!important;visibility:visible!important}
    #adminSupportPanel #bwsCustomerIdentity{display:block!important;visibility:visible!important}
    #adminSupportPanel .bws-account-actions{display:block!important;visibility:visible!important}
    #adminSupportPanel .bws-actions-grid{display:grid!important}
    /* One fixed open/close control location in both expanded and collapsed states. */
    #bwsAdminSidebarToggle{position:fixed!important;left:162px!important;top:50%!important;transform:translateY(-50%)!important;z-index:1000!important;margin:0!important;transition:background .16s ease,color .16s ease,box-shadow .16s ease!important}
    #adminDashboard .admin-layout.bws-admin-nav-collapsed #bwsAdminSidebarToggle,#adminDashboard .admin-layout.bws-admin-nav-peek #bwsAdminSidebarToggle{left:162px!important;transform:translateY(-50%)!important}
    .bws-opened-ticket-chat{min-height:0;height:100%;overflow:auto;padding:18px 20px 28px;background:#f8f9fd}
    .bws-opened-ticket-chat .asp-msg{max-width:78%;margin:0 0 12px}.bws-opened-ticket-chat .asp-msg.admin{margin-left:auto}.bws-opened-ticket-chat .asp-msg.customer{margin-right:auto}
  `;
  document.head.appendChild(style);
  refreshTicketContext();
})();
