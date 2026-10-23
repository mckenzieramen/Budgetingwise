(()=>{'use strict';const MIN=300,MAX=620,KEY='bwAdminClientDrawerWidth';function init(){const dashboard=document.getElementById('adminDashboard'),drawer=document.getElementById('clientDrawer');if(!dashboard||!drawer||drawer.dataset.resizeReady)return;drawer.dataset.resizeReady='1';const handle=document.createElement('div');handle.className='client-drawer-resizer';handle.setAttribute('role','separator');handle.setAttribute('aria-label','Resize client details');handle.setAttribute('aria-orientation','vertical');handle.tabIndex=0;drawer.prepend(handle);const clamp=n=>Math.max(MIN,Math.min(Math.min(MAX,window.innerWidth*.55),n));const apply=n=>{const w=Math.round(clamp(n));dashboard.style.setProperty('--client-drawer-width',w+'px');handle.setAttribute('aria-valuenow',String(w));try{localStorage.setItem(KEY,String(w))}catch{}};try{const saved=Number(localStorage.getItem(KEY));if(saved)apply(saved)}catch{}let dragging=false;const move=e=>{if(!dragging)return;apply(window.innerWidth-e.clientX)};const stop=()=>{if(!dragging)return;dragging=false;document.body.classList.remove('client-drawer-resizing');window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',stop);window.removeEventListener('pointercancel',stop)};handle.addEventListener('pointerdown',e=>{if(e.button!==0)return;dragging=true;handle.setPointerCapture?.(e.pointerId);document.body.classList.add('client-drawer-resizing');window.addEventListener('pointermove',move);window.addEventListener('pointerup',stop);window.addEventListener('pointercancel',stop);e.preventDefault()});handle.addEventListener('keydown',e=>{const current=parseFloat(getComputedStyle(dashboard).getPropertyValue('--client-drawer-width'))||395;if(e.key==='ArrowLeft'){apply(current+20);e.preventDefault()}else if(e.key==='ArrowRight'){apply(current-20);e.preventDefault()}else if(e.key==='Home'){apply(MIN);e.preventDefault()}else if(e.key==='End'){apply(MAX);e.preventDefault()}});window.addEventListener('resize',()=>{const current=parseFloat(getComputedStyle(dashboard).getPropertyValue('--client-drawer-width'))||395;apply(current)})}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();new MutationObserver(init).observe(document.documentElement,{childList:true,subtree:true})})();

const applyApprovedSupportDesign=()=>{
  if(!document.getElementById('bwsApprovedSupportDesign')){
    const style=document.createElement('style');style.id='bwsApprovedSupportDesign';style.textContent=`
#adminDashboard{--bw-purple:#5b35f5;--bw-purple-2:#6f48ff;--bw-purple-soft:#f2efff;--bw-ink:#17203a;--bw-muted:#7a849d;--bw-line:#e7eaf2;--bw-soft:#f8f9fd}
#adminDashboard .admin-content:has(#adminSupportPanel:not(.hidden)){padding:12px 14px 0!important;height:calc(100vh - 72px)!important;min-height:calc(100vh - 72px)!important;background:#f7f8fc!important}
#adminSupportPanel{font-family:Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;color:var(--bw-ink)!important}
#adminSupportPanel .asp-page-head{margin:0 0 10px!important;padding:0 2px!important;align-items:center!important}
#adminSupportPanel .asp-page-head h1{font-size:22px!important;line-height:1.1!important;letter-spacing:-.025em!important;font-weight:800!important;color:#17203a!important}
#adminSupportPanel .asp-page-head p{font-size:9px!important;color:#8992a8!important;margin-top:3px!important}
#adminSupportPanel .asp-summary{gap:7px!important}
#adminSupportPanel .asp-summary button{min-width:70px!important;padding:7px 10px!important;border-radius:10px!important;border-color:#e2e5ee!important;box-shadow:none!important}
#adminSupportPanel .asp-summary button.active{border-color:#8068ff!important;background:#f4f1ff!important;box-shadow:0 4px 12px rgba(91,53,245,.08)!important}
#adminSupportPanel .asp-summary strong{font-size:13px!important}#adminSupportPanel .asp-summary span{font-size:8px!important}
#adminSupportPanel .asp-layout{grid-template-columns:minmax(245px,19%) minmax(560px,1fr) minmax(375px,29%)!important;border-radius:14px 14px 0 0!important;border:1px solid #e2e6ef!important;box-shadow:0 8px 28px rgba(24,32,56,.05)!important;background:#fff!important}
#adminSupportPanel .asp-inbox{background:#fff!important;border-right:1px solid #e8ebf2!important}
#adminSupportPanel .asp-list-head{padding:13px 12px 12px!important}.asp-list-head strong{font-size:11px!important}.asp-list-head small{font-size:8px!important;line-height:1.4!important}
#adminSupportPanel .bws-inbox-tools{gap:6px!important;padding-top:8px!important}#adminSupportPanel .bws-inbox-tools input,#adminSupportPanel .bws-inbox-tools select{height:33px!important;border-radius:8px!important;font-size:8px!important}
#adminSupportPanel .asp-threads button{padding:11px 12px!important;grid-template-columns:36px minmax(0,1fr) auto!important;gap:9px!important;min-height:72px!important}
#adminSupportPanel .asp-threads button.active{background:linear-gradient(90deg,#f0ecff,#faf9ff)!important;box-shadow:inset 3px 0 var(--bw-purple)!important}
#adminSupportPanel .asp-avatar{width:34px!important;height:34px!important;border-radius:50%!important;background:#f0edff!important;color:#5e43e8!important;font-size:11px!important}
#adminSupportPanel .asp-thread-copy strong{font-size:9px!important;color:#252b43!important}#adminSupportPanel .asp-thread-copy small{font-size:8px!important;margin:2px 0 5px!important;color:#80899f!important}
#adminSupportPanel .asp-status{font-size:7px!important;padding:3px 7px!important}
#adminSupportPanel .asp-layout>main{background:#fff!important}
#adminSupportPanel .asp-chat>header{padding:11px 14px!important;min-height:48px!important;background:#fff!important}
#adminSupportPanel .asp-chat>header strong{font-size:10px!important;letter-spacing:.01em!important}#adminSupportPanel .asp-chat>header small{font-size:8px!important}
#adminSupportPanel .bws-ticket-controls{gap:5px!important}.bws-ticket-controls select,.bws-ticket-controls button{height:29px!important;border-radius:8px!important;font-size:7px!important;padding:0 8px!important}
#adminSupportPanel #bwsSupportTabs{padding:6px 12px!important;gap:4px!important;min-height:46px!important}
#adminSupportPanel #bwsSupportTabs button{padding:8px 11px!important;font-size:8px!important;border-radius:8px!important;color:#555f77!important}
#adminSupportPanel #bwsSupportTabs button.active{color:#5b35f5!important;background:#f0ecff!important;box-shadow:inset 0 0 0 1px #d9d1ff!important}
#adminSupportPanel .asp-messages{padding:20px 18px!important;background:linear-gradient(#fff,#fcfcff)!important;gap:10px!important}
#adminSupportPanel .asp-msg{max-width:73%!important}.asp-msg p{font-size:9px!important;line-height:1.5!important;padding:10px 12px!important;border-radius:12px!important}.asp-msg.admin p{background:linear-gradient(135deg,#6846f6,#542ee8)!important;box-shadow:0 5px 14px rgba(91,53,245,.14)!important}.asp-msg small{font-size:7px!important}
#adminSupportPanel .asp-chat form{padding:10px 12px!important;grid-template-columns:38px minmax(0,1fr) 100px 40px!important;gap:7px!important}.asp-chat textarea{height:42px!important;border-radius:9px!important;font-size:9px!important}.asp-tool-btn,.asp-send-btn,.asp-state-btn{height:42px!important;border-radius:9px!important}
#adminSupportPanel .asp-profile{padding:0 12px 16px!important;background:#fff!important;border-left:1px solid #e7eaf2!important;scrollbar-width:thin;scrollbar-color:#b8bbc7 transparent}
#adminSupportPanel .asp-profile-card{text-align:center!important}
#adminSupportPanel .asp-profile-avatar{width:44px!important;height:44px!important;margin:14px auto 7px!important;font-size:14px!important;background:linear-gradient(135deg,#efeaff,#e8e1ff)!important;color:#5d3fee!important;border:1px solid #e1d8ff!important}
#adminSupportPanel .asp-profile-card>strong{font-size:10px!important;letter-spacing:.01em!important;color:#1f2540!important}
#adminSupportPanel .asp-profile-card>.asp-status{margin-top:4px!important}
#adminSupportPanel .asp-profile-info{margin-top:11px!important;border-top:1px solid #eceef3!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:0 10px!important;text-align:left!important}
#adminSupportPanel .asp-profile-info label{min-width:0!important;padding:9px 2px!important;border-bottom:1px solid #f0f1f5!important;font-size:7px!important;color:#818aa0!important}
#adminSupportPanel .asp-profile-info strong{font-size:8px!important;margin-top:3px!important;color:#222841!important;font-weight:800!important;line-height:1.35!important}
#adminSupportPanel #bwsProfileExtras{margin-top:0!important;text-align:left!important}
#adminSupportPanel .bws-ticket-details,#adminSupportPanel .bws-quick-actions-v2,#adminSupportPanel .bws-email-history-v2,#adminSupportPanel .bws-account-actions{padding:11px 0!important;border-top:1px solid #eceef3!important}
#adminSupportPanel .bws-section-title{margin-bottom:8px!important;align-items:center!important}.bws-section-title strong{font-size:10px!important;color:#242a43!important;font-weight:850!important}.bws-section-title small{font-size:7px!important;color:#9097a9!important}
#adminSupportPanel .bws-detail-grid{grid-template-columns:1fr 1fr!important;gap:6px!important}.bws-detail-grid span{padding:7px 8px!important;border-radius:8px!important;background:#fbfcff!important;border:1px solid #e7e9f2!important;font-size:7px!important;color:#8890a4!important}.bws-detail-grid strong{font-size:8px!important;margin-top:2px!important;color:#2d334b!important}
#adminSupportPanel .bws-tags{margin-top:7px!important}.bws-tags>small{font-size:7px!important;color:#7e879a!important}.bws-tags div{gap:5px!important;margin-top:5px!important}.bws-tags button{padding:4px 7px!important;font-size:7px!important;background:#faf8ff!important}
#adminSupportPanel .bws-quick-grid-v2{grid-template-columns:1fr 1fr!important;gap:6px!important}.bws-quick-grid-v2 button{min-height:32px!important;border-radius:8px!important;font-size:7px!important;padding:6px 7px!important}.bws-quick-grid-v2 button[data-quick-email]{min-height:34px!important;background:linear-gradient(135deg,#623cf4,#512ae4)!important;box-shadow:0 5px 13px rgba(91,53,245,.15)!important}
#adminSupportPanel .bws-email-tabs-v2{margin:5px 0 8px!important;gap:4px!important}.bws-email-tabs-v2 button{padding:4px 7px!important;font-size:7px!important}.bws-email-thread-v2{gap:6px!important;max-height:250px!important}.bws-email-card-v2{padding:8px 8px 7px 10px!important;border-radius:8px!important}.bws-email-card-v2 strong{font-size:7.5px!important}.bws-email-card-v2 time,.bws-email-card-v2 footer{font-size:6.5px!important}.bws-email-card-v2 p{font-size:7px!important;margin-top:4px!important;line-height:1.4!important}
#adminSupportPanel .bws-email-compose-v2{padding:8px!important;margin-top:8px!important;border-radius:9px!important}.bws-email-compose-v2>button{height:30px!important;font-size:7px!important}.bws-email-compose-v2 input,.bws-email-compose-v2 textarea{font-size:8px!important;padding:7px!important}.bws-email-compose-v2 textarea{min-height:68px!important}.bws-email-compose-actions-v2 button{height:29px!important;font-size:7px!important}
#adminSupportPanel .bws-account-actions>.bws-section-title{cursor:default!important}.bws-account-actions>.bws-section-title:after{display:none!important}#adminSupportPanel .bws-account-actions.is-collapsed>.bws-actions-grid{display:grid!important}
#adminSupportPanel .bws-actions-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:6px!important}.bws-actions-grid button{min-height:31px!important;padding:6px!important;border-radius:8px!important;font-size:7px!important;font-weight:850!important;background:#fff!important;color:#5038ca!important;border-color:#ddd6ff!important}.bws-actions-grid button.danger{color:#c33f50!important;border-color:#ffcdd2!important;background:#fffafa!important}.bws-actions-grid button.good{color:#16885f!important;border-color:#cbeada!important;background:#fbfffd!important}
#adminSupportPanel .bws-view-profile{height:31px!important;margin:0 0 10px!important;border-radius:8px!important;font-size:7px!important}
#adminSupportPanel .bws-email-log{display:none!important}
@media(min-width:1380px){#adminSupportPanel .asp-layout{grid-template-columns:minmax(250px,19%) minmax(610px,1fr) minmax(395px,29%)!important}#adminSupportPanel .bws-actions-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}}
@media(max-width:1180px){#adminSupportPanel .asp-layout{grid-template-columns:230px minmax(520px,1fr) 330px!important}#adminSupportPanel .asp-profile-info{grid-template-columns:1fr!important}#adminSupportPanel .bws-actions-grid{grid-template-columns:1fr 1fr!important}}
`;
    document.head.appendChild(style);
  }
  const extras=document.querySelector('#bwsProfileExtras');
  if(extras){
    const actions=extras.querySelector('.bws-account-actions');
    if(actions){actions.classList.remove('is-collapsed');const title=actions.querySelector('.bws-section-title strong'),note=actions.querySelector('.bws-section-title small');if(title)title.textContent='Account Actions';if(note)note.textContent='Manage this customer’s account';}
    const quick=extras.querySelector('.bws-quick-actions-v2 .bws-quick-grid-v2');
    if(quick&&!quick.querySelector('[data-approved-activity]')){const activity=document.createElement('button');activity.type='button';activity.dataset.approvedActivity='1';activity.textContent='View account activity';activity.onclick=()=>actions?.querySelector('[data-aa="activity"]')?.click();quick.appendChild(activity)}
  }
  const tab=document.querySelector('#bwsSupportTabs [data-tab="timeline"]');if(tab)tab.textContent='Email History';
};

import('./admin-customer-panel-v2.js?v=customer-panel-v3-approved').then(()=>{
  const run=()=>{applyApprovedSupportDesign();setTimeout(applyApprovedSupportDesign,60)};
  run();const root=document.getElementById('adminSupportPanel');if(root)new MutationObserver(run).observe(root,{childList:true,subtree:true});
}).catch(err=>console.warn('Customer details workspace unavailable:',err));