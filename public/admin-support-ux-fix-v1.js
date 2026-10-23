// Budgetingwise Admin Support UX stability patch.
(()=>{
  const q=(s,p=document)=>p.querySelector(s),qa=(s,p=document)=>[...p.querySelectorAll(s)];
  let repairing=false,lastRepair=0;

  function supportVisible(){const p=q('#adminSupportPanel');return !!p&&!p.classList.contains('hidden')&&!p.hidden}
  function keepRightPanel(){const p=q('#aspProfile');if(!p)return;p.hidden=false;p.removeAttribute('hidden');p.style.removeProperty('display');p.classList.remove('hidden')}

  function showOpenedTicketConversation(){
    const panel=q('#bwsTabPanel'),note=panel&&q('.bws-current-ticket-note',panel),live=q('#aspMessages');
    if(!panel||!note||!live)return;
    const transcript=document.createElement('div');transcript.className='bws-opened-ticket-chat';
    transcript.innerHTML=live.innerHTML||'<div class="bws-empty">No conversation messages yet.</div>';note.replaceWith(transcript)
  }

  // A complete support workspace always has the premium tabs, ticket controls,
  // customer identity and the full right-rail sections. If any legacy render removes
  // one of them, reselect the SAME thread so the suite rebuilds the whole workspace.
  function workspaceComplete(){
    const card=q('#aspProfile .asp-profile-card');
    if(!card)return false;
    return !!(q('#bwsSupportTabs')&&q('#bwsTicketControls')&&q('#bwsCustomerIdentity',card)&&q('#bwsProfileExtras',card)&&q('.bws-account-actions',card)&&q('.bws-ticket-details',card)&&q('.bws-email-log',card));
  }
  function repairWorkspace(){
    if(!supportVisible())return;
    keepRightPanel();
    const active=q('#aspThreads [data-thread].active');if(!active||workspaceComplete())return;
    const now=Date.now();if(repairing||now-lastRepair<1000)return;
    repairing=true;lastRepair=now;
    active.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));
    setTimeout(()=>{repairing=false;keepRightPanel()},650)
  }

  function normalizeWorkspace(){
    keepRightPanel();
    // Internal Notes and the duplicate Saved Replies panel were intentionally removed.
    q('#bwsSupportTabs [data-tab="notes"]')?.remove();
    q('#bwsSavedReplies')?.remove();
    qa('#aspProfile .bw-admin-account-actions').forEach(x=>x.style.display='none');
    setTimeout(repairWorkspace,120);setTimeout(repairWorkspace,520)
  }

  document.addEventListener('click',e=>{
    if(e.target.closest('#bwsTabPanel [data-ticket-index]')){setTimeout(showOpenedTicketConversation,0);setTimeout(showOpenedTicketConversation,80)}
    if(e.target.closest('#bwsSupportTabs [data-tab],#aspThreads [data-thread],#adminSupportNav')){setTimeout(normalizeWorkspace,0);setTimeout(normalizeWorkspace,380)}
  },true);

  const startGuard=()=>{
    const panel=q('#adminSupportPanel');if(!panel)return setTimeout(startGuard,200);
    keepRightPanel();
    // Watch only top-level support containers. Debounced repair prevents observer loops.
    const observer=new MutationObserver(()=>{if(!supportVisible())return;clearTimeout(startGuard.t);startGuard.t=setTimeout(normalizeWorkspace,90)});
    observer.observe(panel,{childList:true,subtree:false,attributes:true,attributeFilter:['class','hidden']});
    const profile=q('#aspProfile');if(profile)observer.observe(profile,{childList:true,subtree:false,attributes:true,attributeFilter:['class','hidden','style']});
    setInterval(()=>{if(supportVisible())normalizeWorkspace()},1800)
  };
  startGuard();

  const style=document.createElement('style');style.id='bwsAdminSupportUxFixV1';style.textContent=`
    #adminSupportPanel #aspProfile{display:block!important;visibility:visible!important}
    #adminSupportPanel #aspProfile .bw-admin-account-actions{display:none!important}
    #adminSupportPanel #bwsCustomerIdentity,#adminSupportPanel #bwsProfileExtras,#adminSupportPanel .bws-account-actions,#adminSupportPanel .bws-ticket-details,#adminSupportPanel .bws-email-log{visibility:visible!important}
    #adminSupportPanel #bwsProfileExtras{display:flex!important}
    #adminSupportPanel .bws-account-actions,#adminSupportPanel .bws-ticket-details,#adminSupportPanel .bws-email-log{display:block!important}
    #adminSupportPanel .bws-actions-grid{display:grid!important}
    #adminSupportPanel #bwsSupportTabs [data-tab="notes"],#adminSupportPanel #bwsSavedReplies{display:none!important}
    #bwsAdminSidebarToggle{position:fixed!important;left:162px!important;top:50%!important;transform:translateY(-50%)!important;z-index:1000!important;margin:0!important;transition:background .16s ease,color .16s ease,box-shadow .16s ease!important}
    #adminDashboard .admin-layout.bws-admin-nav-collapsed #bwsAdminSidebarToggle,#adminDashboard .admin-layout.bws-admin-nav-peek #bwsAdminSidebarToggle{left:162px!important;transform:translateY(-50%)!important}
    .bws-opened-ticket-chat{min-height:0;height:100%;overflow:auto;padding:18px 20px 28px;background:#f8f9fd}.bws-opened-ticket-chat .asp-msg{max-width:78%;margin:0 0 12px}.bws-opened-ticket-chat .asp-msg.admin{margin-left:auto}.bws-opened-ticket-chat .asp-msg.customer{margin-right:auto}
  `;document.head.appendChild(style);normalizeWorkspace()
})();
