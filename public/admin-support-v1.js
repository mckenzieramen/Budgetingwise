import './admin-support-core-v1.js?v=local-core-v2';

const addOpenStatus=()=>{
  const menu=document.getElementById('aspStateMenu');
  if(!menu||menu.querySelector('[data-compose-status="open"]'))return;
  const open=document.createElement('button');
  open.type='button';
  open.dataset.composeStatus='open';
  open.innerHTML='<span class="asp-state-dot open"></span>Open';
  menu.prepend(open);
  open.addEventListener('click',async()=>{
    const label=document.getElementById('aspStateLabel');
    if(label)label.textContent='Open';
    menu.classList.add('hidden');
    const active=document.querySelector('#aspThreads [data-thread].active');
    if(!active)return;
    const firestore=await import('https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js');
    const firebaseApp=await import('https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js');
    await firestore.setDoc(firestore.doc(firestore.getFirestore(firebaseApp.getApp()),'supportThreads',active.dataset.thread),{status:'open',customerCanReply:true,updatedAt:firestore.serverTimestamp()},{merge:true});
  });
};
setTimeout(addOpenStatus,0);
document.addEventListener('click',()=>setTimeout(addOpenStatus,0));

import('./chat-ticket-history-v3.js?v=ticket-history-v3').catch(err=>console.warn('Support ticket history unavailable:',err));
import('./admin-ticket-history-sort-v1.js?v=history-sort-v1').catch(err=>console.warn('Ticket history sort unavailable:',err));

const suite=import('./admin-support-suite-v1.js?v=suite-v3-navigation');
suite.then(()=>{
  // The chat already has a native "/" command for common replies. Keep one source of truth.
  const cleanSavedReplyButton=()=>document.getElementById('bwsSavedReplies')?.remove();
  cleanSavedReplyButton();
  setTimeout(cleanSavedReplyButton,250);

  // If a ticket was already selected before the enhancement suite finished loading,
  // re-select it once so Timeline / Previous Tickets / Attachments / Internal Notes
  // receive the active ticket context immediately.
  setTimeout(()=>{
    const active=document.querySelector('#aspThreads [data-thread].active');
    if(active)active.click();
  },320);

  // Premium priority states. Keep the select readable and mirror its state on the control.
  const syncPriority=()=>{
    const select=document.querySelector('#bwsTicketControls [data-priority]');
    if(!select)return;
    const value=(select.value||'Normal').toLowerCase();
    select.dataset.priority=value;
    const controls=document.getElementById('bwsTicketControls');
    if(controls)controls.dataset.priority=value;
  };
  document.addEventListener('change',e=>{
    if(e.target.matches('#bwsTicketControls [data-priority]'))syncPriority();
  });
  setTimeout(syncPriority,360);

  // Defensive tab navigation: make every tab a real button target and prevent a stale
  // overlay/element from swallowing clicks. The suite's own switchTab handler still
  // owns rendering, this only guarantees the click reaches it.
  document.addEventListener('pointerdown',e=>{
    const tab=e.target.closest('#bwsSupportTabs [data-tab]');
    if(!tab)return;
    document.querySelectorAll('#bwsSupportTabs [data-tab]').forEach(b=>b.classList.toggle('active',b===tab));
  },true);
}).catch(err=>console.warn('Enhanced Admin Support unavailable:',err));

// Small visual patch kept here so priority colors work even while the suite stylesheet is cached.
if(!document.getElementById('bwsSupportStatePatch')){
  const style=document.createElement('style');
  style.id='bwsSupportStatePatch';
  style.textContent=`
    #bwsSavedReplies{display:none!important}
    #bwsSupportTabs{position:relative;z-index:8;pointer-events:auto!important}
    #bwsSupportTabs [data-tab]{position:relative;z-index:9;pointer-events:auto!important;user-select:none}
    #bwsTicketControls [data-priority]{font-weight:900!important;transition:.16s ease;border-width:1px!important}
    #bwsTicketControls [data-priority="low"]{color:#2563eb!important;background:#eff6ff!important;border-color:#bfdbfe!important}
    #bwsTicketControls [data-priority="normal"]{color:#15803d!important;background:#f0fdf4!important;border-color:#bbf7d0!important}
    #bwsTicketControls [data-priority="high"]{color:#c2410c!important;background:#fff7ed!important;border-color:#fed7aa!important}
    #bwsTicketControls [data-priority="urgent"]{color:#b91c1c!important;background:#fef2f2!important;border-color:#fecaca!important}
    #bwsSupportTabs [data-tab]:hover{background:#f7f5ff!important;color:#5e46e6!important}
    #bwsSupportTabs [data-tab].active{background:#faf9ff!important;color:#5e46e6!important}
  `;
  document.head.appendChild(style);
}
