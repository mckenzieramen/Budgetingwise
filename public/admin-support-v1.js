import './admin-support-core-v1.js?v=local-core-v2';

const addOpenStatus=()=>{const menu=document.getElementById('aspStateMenu');if(!menu||menu.querySelector('[data-compose-status="open"]'))return;const open=document.createElement('button');open.type='button';open.dataset.composeStatus='open';open.innerHTML='<span class="asp-state-dot open"></span>Open';menu.prepend(open);open.addEventListener('click',async()=>{const label=document.getElementById('aspStateLabel');if(label)label.textContent='Open';menu.classList.add('hidden');const active=document.querySelector('#aspThreads [data-thread].active');if(!active)return;const firestore=await import('https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js');const firebaseApp=await import('https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js');await firestore.setDoc(firestore.doc(firestore.getFirestore(firebaseApp.getApp()),'supportThreads',active.dataset.thread),{status:'open',customerCanReply:true,updatedAt:firestore.serverTimestamp()},{merge:true})})};
setTimeout(addOpenStatus,0);document.addEventListener('click',()=>setTimeout(addOpenStatus,0));
import('./chat-ticket-history-v3.js?v=ticket-history-v3').catch(err=>console.warn('Support ticket history unavailable:',err));
import('./admin-ticket-history-sort-v1.js?v=history-sort-v1').catch(err=>console.warn('Ticket history sort unavailable:',err));

const suite=import('./admin-support-suite-v1.js?v=suite-v4-tabs');
suite.then(()=>{
 const clean=()=>document.getElementById('bwsSavedReplies')?.remove();clean();setTimeout(clean,250);
 setTimeout(()=>{document.querySelector('#aspThreads [data-thread].active')?.click()},320);
 const syncPriority=()=>{const s=document.querySelector('#bwsTicketControls [data-priority]');if(!s)return;const v=(s.value||'Normal').toLowerCase();s.dataset.priority=v;document.getElementById('bwsTicketControls')?.setAttribute('data-priority',v)};document.addEventListener('change',e=>{if(e.target.matches('#bwsTicketControls [data-priority]'))syncPriority()});setTimeout(syncPriority,360);
 // The suite owns tab rendering. Do not intercept pointerdown/click here; that previously left Chat visible behind other pages.
}).catch(err=>console.warn('Enhanced Admin Support unavailable:',err));

const setupAdminSidebar=()=>{const layout=document.querySelector('#adminDashboard .admin-layout'),side=document.querySelector('#adminDashboard .admin-sidebar');if(!layout||!side||side.dataset.foldReady)return;side.dataset.foldReady='1';const btn=document.createElement('button');btn.type='button';btn.id='bwsAdminSidebarToggle';btn.title='Fold / pin admin menu';btn.setAttribute('aria-label','Fold or pin admin navigation');btn.innerHTML='‹';side.appendChild(btn);let pinned=true;const apply=()=>{layout.classList.toggle('bws-admin-nav-collapsed',!pinned);side.classList.toggle('bws-admin-nav-collapsed',!pinned);btn.innerHTML=pinned?'‹':'›';btn.setAttribute('aria-expanded',String(pinned))};btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();pinned=!pinned;apply()});side.addEventListener('mouseenter',()=>{if(!pinned)layout.classList.add('bws-admin-nav-peek')});side.addEventListener('mouseleave',()=>layout.classList.remove('bws-admin-nav-peek'));apply()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setupAdminSidebar,{once:true});else setupAdminSidebar();setTimeout(setupAdminSidebar,350);

if(!document.getElementById('bwsSupportStatePatch')){const style=document.createElement('style');style.id='bwsSupportStatePatch';style.textContent=`
#bwsSavedReplies{display:none!important}
#bwsTicketControls [data-priority]{font-weight:900!important;transition:.16s ease;border-width:1px!important}
#bwsTicketControls [data-priority="low"]{color:#2563eb!important;background:#eff6ff!important;border-color:#bfdbfe!important}
#bwsTicketControls [data-priority="normal"]{color:#15803d!important;background:#f0fdf4!important;border-color:#bbf7d0!important}
#bwsTicketControls [data-priority="high"]{color:#c2410c!important;background:#fff7ed!important;border-color:#fed7aa!important}
#bwsTicketControls [data-priority="urgent"]{color:#b91c1c!important;background:#fef2f2!important;border-color:#fecaca!important}

/* Premium support tabs: clear spacing, one visible workspace at a time. */
#bwsSupportTabs{position:relative;z-index:8;display:flex!important;align-items:center;gap:6px!important;padding:8px 12px!important;border-bottom:1px solid #ebeaf3!important;background:#fff!important;overflow-x:auto;scrollbar-width:none}
#bwsSupportTabs::-webkit-scrollbar{display:none}
#bwsSupportTabs [data-tab]{position:relative;z-index:9;pointer-events:auto!important;user-select:none;flex:0 0 auto!important;min-height:38px!important;padding:9px 14px!important;border:0!important;border-radius:9px!important;background:transparent!important;color:#626a83!important;font-size:11px!important;font-weight:800!important;letter-spacing:.01em;transition:background .16s ease,color .16s ease,box-shadow .16s ease!important}
#bwsSupportTabs [data-tab]:hover{background:#f5f3ff!important;color:#5e46e6!important}
#bwsSupportTabs [data-tab].active{background:#eeeaff!important;color:#5138df!important;box-shadow:inset 0 0 0 1px #dcd5ff!important}
#bwsTabPanel:not(.hidden){display:block!important;min-height:0!important;height:100%!important;overflow:auto!important;padding:18px 20px!important;background:#fbfbfe!important;box-sizing:border-box}
#bwsTabPanel.hidden{display:none!important}
#bwsTabPanel .bws-panel-head{margin-bottom:16px!important;padding-bottom:12px!important;border-bottom:1px solid #e8e8f1!important}
#bwsTabPanel .bws-panel-head strong{font-size:14px!important;color:#171b32!important}
#bwsTabPanel .bws-panel-head small{display:block;margin-top:4px;color:#81889d!important}
#bwsTabPanel .bws-empty{margin:16px 0!important;padding:24px!important;border:1px dashed #d9d8e8!important;border-radius:12px!important;background:#fff!important;text-align:center;color:#858ca0!important}
#adminSupportPanel .bws-fold-toggle{display:none!important}
#adminSupportPanel .asp-layout{transition:none!important}

/* Main black admin sidebar. Collapsed state shows ONLY the Budgetingwise logo. Hover restores the full menu. */
#adminDashboard .admin-layout{transition:grid-template-columns .28s cubic-bezier(.2,.8,.2,1)!important}
#adminDashboard .admin-sidebar{position:sticky!important;transition:width .28s cubic-bezier(.2,.8,.2,1),padding .28s ease,box-shadow .2s ease!important;overflow:hidden;z-index:30}
#adminDashboard .admin-main{min-width:0;transition:width .28s ease}
#bwsAdminSidebarToggle{position:absolute;right:8px;bottom:18px;width:30px;height:30px;border:1px solid #ffffff24;border-radius:9px;background:#ffffff12;color:#fff;font-size:20px;font-weight:900;cursor:pointer;z-index:35;transition:background .18s ease,transform .18s ease}
#bwsAdminSidebarToggle:hover{background:#5b43ea;transform:scale(1.05)}
#adminDashboard .admin-layout.bws-admin-nav-collapsed{grid-template-columns:64px minmax(0,1fr)!important}
#adminDashboard .admin-sidebar.bws-admin-nav-collapsed{width:64px!important;padding:16px 10px!important}
#adminDashboard .admin-sidebar.bws-admin-nav-collapsed .admin-side-logo{justify-content:center!important;padding:0!important;border:0!important}
#adminDashboard .admin-sidebar.bws-admin-nav-collapsed .admin-side-logo img{width:40px!important;height:40px!important;object-fit:cover}
#adminDashboard .admin-sidebar.bws-admin-nav-collapsed .admin-side-logo>div,#adminDashboard .admin-sidebar.bws-admin-nav-collapsed .admin-nav,#adminDashboard .admin-sidebar.bws-admin-nav-collapsed .admin-note,#adminDashboard .admin-sidebar.bws-admin-nav-collapsed #adminLogout,#adminDashboard .admin-sidebar.bws-admin-nav-collapsed #bwsAdminSidebarToggle{opacity:0!important;visibility:hidden!important;pointer-events:none!important}
#adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek{grid-template-columns:230px minmax(0,1fr)!important}
#adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek .admin-sidebar{width:230px!important;padding:18px 14px!important;box-shadow:14px 0 35px #17142f28}
#adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek .admin-sidebar .admin-side-logo{justify-content:flex-start!important;padding:0 5px 20px!important;border-bottom:1px solid #ffffff14!important}
#adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek .admin-sidebar .admin-side-logo>div,#adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek .admin-sidebar .admin-nav,#adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek .admin-sidebar .admin-note,#adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek .admin-sidebar #adminLogout,#adminDashboard .admin-layout.bws-admin-nav-collapsed.bws-admin-nav-peek .admin-sidebar #bwsAdminSidebarToggle{opacity:1!important;visibility:visible!important;pointer-events:auto!important;transition:opacity .15s ease .07s}
@media(max-width:1050px){#bwsAdminSidebarToggle{display:none!important}}
`;document.head.appendChild(style)}
