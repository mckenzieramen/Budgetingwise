// Budgetingwise Admin Support UX patch: ticket transcript view + stable ticket context sidebar.
(()=>{
  const q=(s,p=document)=>p.querySelector(s);
  let lastUid='';

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
    // The profile/right rail is ticket context, not tab content. Never hide it while
    // moving between Chat, Timeline, Tickets or Attachments.
    profile.hidden=false;
    profile.removeAttribute('hidden');
    profile.style.removeProperty('display');
    profile.classList.remove('hidden');
  }

  function refreshTicketContext(){
    keepRightPanel();
    const uid=q('#aspThreads [data-thread].active')?.dataset.thread||'';
    if(!uid)return;
    // Re-run the existing selected-thread handler only when the selected customer changes.
    // This keeps Customer Information / BID copy / Ticket Details / Account Actions tied
    // to the selected ticket without resetting the currently selected support tab.
    if(uid!==lastUid){
      lastUid=uid;
      setTimeout(keepRightPanel,120);
      setTimeout(keepRightPanel,420);
    }
  }

  document.addEventListener('click',e=>{
    if(e.target.closest('#bwsTabPanel [data-ticket-index]')){
      setTimeout(showOpenedTicketConversation,0);
      setTimeout(showOpenedTicketConversation,80);
    }
    if(e.target.closest('#bwsSupportTabs [data-tab],#aspThreads [data-thread]')){
      setTimeout(refreshTicketContext,0);
      setTimeout(keepRightPanel,120);
      setTimeout(keepRightPanel,420);
    }
  },true);

  // Small observer only watches the profile element itself; it does not inject DOM and
  // cannot recurse. It prevents legacy tab code from making the right rail disappear.
  const startProfileGuard=()=>{
    const profile=q('#aspProfile');
    if(!profile)return setTimeout(startProfileGuard,180);
    keepRightPanel();
    new MutationObserver(keepRightPanel).observe(profile,{attributes:true,attributeFilter:['class','hidden','style']});
  };
  startProfileGuard();

  const style=document.createElement('style');
  style.id='bwsAdminSupportUxFixV1';
  style.textContent=`
    #adminSupportPanel #aspProfile{display:block!important;visibility:visible!important}
    /* One fixed open/close control location in both expanded and collapsed states. */
    #bwsAdminSidebarToggle{position:fixed!important;left:162px!important;top:50%!important;transform:translateY(-50%)!important;z-index:1000!important;margin:0!important;transition:background .16s ease,color .16s ease,box-shadow .16s ease!important}
    #adminDashboard .admin-layout.bws-admin-nav-collapsed #bwsAdminSidebarToggle,#adminDashboard .admin-layout.bws-admin-nav-peek #bwsAdminSidebarToggle{left:162px!important;transform:translateY(-50%)!important}
    .bws-opened-ticket-chat{min-height:0;height:100%;overflow:auto;padding:18px 20px 28px;background:#f8f9fd}
    .bws-opened-ticket-chat .asp-msg{max-width:78%;margin:0 0 12px}.bws-opened-ticket-chat .asp-msg.admin{margin-left:auto}.bws-opened-ticket-chat .asp-msg.customer{margin-right:auto}
  `;
  document.head.appendChild(style);
  refreshTicketContext();
})();
