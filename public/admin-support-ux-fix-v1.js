// Budgetingwise Admin Support UX patch — passive only; never re-clicks navigation.
(()=>{
  const q=(s,p=document)=>p.querySelector(s),qa=(s,p=document)=>[...p.querySelectorAll(s)];

  function keepRightPanel(){const p=q('#aspProfile');if(!p)return;p.hidden=false;p.removeAttribute('hidden');p.style.removeProperty('display');p.classList.remove('hidden')}
  function normalizeStaticUi(){
    keepRightPanel();
    q('#bwsSupportTabs [data-tab="notes"]')?.remove();
    q('#bwsSavedReplies')?.remove();
    qa('#aspProfile .bw-admin-account-actions').forEach(x=>x.style.display='none');
  }
  function showOpenedTicketConversation(){
    const panel=q('#bwsTabPanel'),note=panel&&q('.bws-current-ticket-note',panel),live=q('#aspMessages');
    if(!panel||!note||!live)return;
    const transcript=document.createElement('div');transcript.className='bws-opened-ticket-chat';
    transcript.innerHTML=live.innerHTML||'<div class="bws-empty">No conversation messages yet.</div>';note.replaceWith(transcript)
  }

  // Passive post-click cleanup only. No synthetic clicks, polling, observers or
  // re-render loops, so Dashboard / Clients / Chat Support navigation stays responsive.
  document.addEventListener('click',e=>{
    if(e.target.closest('#bwsTabPanel [data-ticket-index]')){setTimeout(showOpenedTicketConversation,0);setTimeout(showOpenedTicketConversation,80)}
    if(e.target.closest('#bwsSupportTabs [data-tab],#aspThreads [data-thread],#adminSupportNav'))setTimeout(normalizeStaticUi,120)
  },true);

  const style=document.createElement('style');style.id='bwsAdminSupportUxFixV1';style.textContent=`
    #adminSupportPanel #aspProfile{display:block!important;visibility:visible!important}
    #adminSupportPanel #aspProfile .bw-admin-account-actions{display:none!important}
    #adminSupportPanel #bwsSupportTabs [data-tab="notes"],#adminSupportPanel #bwsSavedReplies{display:none!important}
    #bwsAdminSidebarToggle{position:fixed!important;left:162px!important;top:50%!important;transform:translateY(-50%)!important;z-index:1000!important;margin:0!important}
    #adminDashboard .admin-layout.bws-admin-nav-collapsed #bwsAdminSidebarToggle,#adminDashboard .admin-layout.bws-admin-nav-peek #bwsAdminSidebarToggle{left:162px!important;transform:translateY(-50%)!important}
    .bws-opened-ticket-chat{min-height:0;height:100%;overflow:auto;padding:18px 20px 28px;background:#f8f9fd}.bws-opened-ticket-chat .asp-msg{max-width:78%;margin:0 0 12px}.bws-opened-ticket-chat .asp-msg.admin{margin-left:auto}.bws-opened-ticket-chat .asp-msg.customer{margin-right:auto}
  `;document.head.appendChild(style);normalizeStaticUi()
})();
