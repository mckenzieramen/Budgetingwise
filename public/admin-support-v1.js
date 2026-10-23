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
  const cleanSavedReplyButton=()=>document.getElementById('bwsSavedReplies')?.remove();
  cleanSavedReplyButton();setTimeout(cleanSavedReplyButton,250);
  setTimeout(()=>{const active=document.querySelector('#aspThreads [data-thread].active');if(active)active.click()},320);
  const syncPriority=()=>{const select=document.querySelector('#bwsTicketControls [data-priority]');if(!select)return;const value=(select.value||'Normal').toLowerCase();select.dataset.priority=value;const controls=document.getElementById('bwsTicketControls');if(controls)controls.dataset.priority=value};
  document.addEventListener('change',e=>{if(e.target.matches('#bwsTicketControls [data-priority]'))syncPriority()});setTimeout(syncPriority,360);
  document.addEventListener('pointerdown',e=>{const tab=e.target.closest('#bwsSupportTabs [data-tab]');if(!tab)return;document.querySelectorAll('#bwsSupportTabs [data-tab]').forEach(b=>b.classList.toggle('active',b===tab))},true);
}).catch(err=>console.warn('Enhanced Admin Support unavailable:',err));

// Main black Admin navigation: fold to an icon rail, hover to preview-open, click to pin.
const setupAdminSidebar=()=>{
  const layout=document.querySelector('#adminDashboard .admin-layout'),side=document.querySelector('#adminDashboard .admin-sidebar');
  if(!layout||!side||side.dataset.foldReady)return;
  side.dataset.foldReady='1';
  const btn=document.createElement('button');btn.type='button';btn.id='bwsAdminSidebarToggle';btn.title='Fold / pin admin menu';btn.setAttribute('aria-label','Fold or pin admin navigation');btn.innerHTML='‹';side.appendChild(btn);
  let pinned=true;
  const apply=()=>{layout.classList.toggle('bws-admin-nav-collapsed',!pinned);side.classList.toggle('bws-admin-nav-collapsed',!pinned);btn.innerHTML=pinned?'‹':'›';btn.setAttribute('aria-expanded',String(pinned))};
  btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();pinned=!pinned;apply()});
  side.addEventListener('mouseenter',()=>{if(!pinned)layout.classList.add('bws-admin-nav-peek')});
  side.addEventListener('mouseleave',()=>layout.classList.remove('bws-admin-nav-peek'));
  apply();
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setupAdminSidebar,{once:true});else setupAdminSidebar();setTimeout(setupAdminSidebar,350);

if(!document.getElementById('bwsSupportStatePatch')){
  const style=document.createElement('style');style.id='bwsSupportStatePatch';style.textContent=`
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

    /* Restore Chat Support's own three-column workspace: no folding inside the ticket area. */
    #adminSupportPanel .bws-fold-toggle{display:none!important}
    #adminSupportPanel .asp-layout{transition:none!important}

    #adminDashboard .admin-layout{transition:grid-template-columns .28s cubic-bezier(.2,.8,.2,1)!important}
    #adminDashboard .admin-sidebar{transition:width .28s cubic-bezier(.2,.8,.2,1),padding .28s ease,box-shadow .2s ease!important;overflow:hidden;z-index:30}
    #adminDashboard .admin-main{min-width:0;transition:width .28s ease}
    #bwsAdminSidebarToggle{position:absolute;right:8px;bottom:70px;width:30px;height:30px;border:1px solid #ffffff24;border-radius:9px;background:#ffffff12;color:#fff;font-size:20px;font-weight:900;cursor:pointer;z-index:35;transition:background .18s ease,transform .18s ease}
    #bwsAdminSidebarToggle:hover{background:#5b43ea;transform:scale(1.05)}
    #adminDashboard .admin-layout.bws-admin-nav-collapsed{grid-template-columns:64px minmax(0,1fr)!important}
    #adminDashboard .admin-sidebar.bws-admin-nav-collapsed{width:64px!important;padding-left:9px!important;padding-right:9px!important}
    #adminDashboard .admin-sidebar.bws-admin-nav-collapsed .admin-side-logo>div,#adminDashboard .admin-sidebar.bws-admin-nav-collapsed .admin-note{opacity:0;pointer-events:none}
    #adminDashboard .admin-sidebar.bws-admin-nav-collapsed .admin-side-logo{justify-content:center;padding-left:0;padding-right:0}
    #adminDashboard .admin-sidebar.bws-admin-nav-collapsed .admin-nav button{width:46px;overflow:hidden;white-space:nowrap;padding-left:13px;padding-right:0;font-size:0}
    #adminDashboard .admin-sidebar.bws-admin-nav-collapsed .admin-nav button::first-letter{font-size:16px}
    #adminDashboard .admin-sidebar.bws-admin-nav-collapsed #adminLogout{font-size:0;width:46px;min-height:36px}
    #adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek{grid-template-columns:230px minmax(0,1fr)!important}
    #adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek .admin-sidebar{width:230px!important;padding:18px 14px!important;box-shadow:14px 0 35px #17142f28}
    #adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek .admin-sidebar .admin-side-logo>div,#adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek .admin-sidebar .admin-note{opacity:1;pointer-events:auto;transition:opacity .16s ease .08s}
    #adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek .admin-sidebar .admin-side-logo{justify-content:flex-start}
    #adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek .admin-sidebar .admin-nav button{width:auto;padding:12px 13px;font-size:inherit}
    #adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek .admin-sidebar #adminLogout{font-size:inherit;width:auto}
    @media(max-width:1050px){#bwsAdminSidebarToggle{display:none!important}}
  `;document.head.appendChild(style);
}
