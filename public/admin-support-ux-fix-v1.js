// Budgetingwise Admin Support UX patch: ticket transcript view + fixed sidebar toggle.
(()=>{
  const q=(s,p=document)=>p.querySelector(s);

  function showOpenedTicketConversation(){
    const panel=q('#bwsTabPanel');
    if(!panel||!q('.bws-current-ticket-note',panel))return;
    const live=q('#aspMessages');
    const note=q('.bws-current-ticket-note',panel);
    if(!live||!note)return;
    const transcript=document.createElement('div');
    transcript.className='bws-opened-ticket-chat';
    transcript.innerHTML=live.innerHTML||'<div class="bws-empty">No conversation messages yet.</div>';
    note.replaceWith(transcript);
  }

  // Opening any ticket keeps the ticket selected and replaces the ticket list
  // with that ticket's conversation. The normal Chat tab restores the live chat.
  document.addEventListener('click',e=>{
    if(e.target.closest('#bwsTabPanel [data-ticket-index]')){
      setTimeout(showOpenedTicketConversation,0);
      setTimeout(showOpenedTicketConversation,80);
    }
  },true);

  const style=document.createElement('style');
  style.id='bwsAdminSupportUxFixV1';
  style.textContent=`
    /* One fixed open/close control location in both expanded and collapsed states. */
    #bwsAdminSidebarToggle{
      position:fixed!important;
      left:162px!important;
      top:50%!important;
      transform:translateY(-50%)!important;
      z-index:1000!important;
      margin:0!important;
      transition:background .16s ease,color .16s ease,box-shadow .16s ease!important;
    }
    #adminDashboard .admin-layout.bws-admin-nav-collapsed #bwsAdminSidebarToggle,
    #adminDashboard .admin-layout.bws-admin-nav-peek #bwsAdminSidebarToggle{
      left:162px!important;
      transform:translateY(-50%)!important;
    }
    .bws-opened-ticket-chat{
      min-height:0;
      height:100%;
      overflow:auto;
      padding:18px 20px 28px;
      background:#f8f9fd;
    }
    .bws-opened-ticket-chat .asp-msg{max-width:78%;margin:0 0 12px}
    .bws-opened-ticket-chat .asp-msg.admin{margin-left:auto}
    .bws-opened-ticket-chat .asp-msg.customer{margin-right:auto}
  `;
  document.head.appendChild(style);
})();
