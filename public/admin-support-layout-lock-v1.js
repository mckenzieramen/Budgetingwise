(()=>{'use strict';
// Central development lock registry.
// These locks protect approved implementation/layout choices from unrelated future edits.
// They do NOT lock customer data or normal Admin business actions.
const FEATURE_LOCKS=Object.freeze({
  adminSidebar:Object.freeze({locked:true,label:'Admin Sidebar',note:'Click-only compact sidebar; no hover expansion or drag.'}),
  supportInboxLayout:Object.freeze({locked:true,label:'Chat Support inbox layout',note:'Keep the approved three-column support workspace and current search/filter placement.'}),
  supportSearchIcon:Object.freeze({locked:true,label:'Chat Support search icon',note:'Keep the clean inline SVG search icon.'}),
  customerBidSource:Object.freeze({locked:true,label:'Customer BID source',note:'Display BID only from users/{uid}.budgetId.'}),
  supportCustomerDrawerStructure:Object.freeze({locked:false,label:'Customer Details structure',note:'Single-owner structure is intended, but keep unlocked until current behavior is fully verified.'}),
  ticketLifecycle:Object.freeze({locked:false,label:'Ticket lifecycle boundary',note:'Keep unlocked until Ticket 1 → 2 → 3 and recovery/new-concern paths are fully verified.'}),
  adminHeader:Object.freeze({locked:false,label:'Admin header',note:'Verify current state before marking locked.'}),
  customerRecoveryFlow:Object.freeze({locked:false,label:'Customer recovery flow',note:'Keep under verification until full end-to-end testing is complete.'})
});

Object.defineProperty(window,'BW_FEATURE_LOCKS',{value:FEATURE_LOCKS,writable:false,configurable:false});
window.bwIsFeatureLocked=name=>FEATURE_LOCKS[name]?.locked===true;

function applyProtection(){
  const panel=document.getElementById('adminSupportPanel');
  if(!panel)return false;
  // No visible lock toggle: this is a development/configuration guard, not a business control.
  document.getElementById('bwsSupportLayoutLock')?.remove();
  panel.classList.toggle('bws-support-layout-locked',FEATURE_LOCKS.supportInboxLayout.locked);
  panel.dataset.layoutLocked=FEATURE_LOCKS.supportInboxLayout.locked?'1':'0';
  panel.dataset.featureLocks='registry-v1';
  return true
}

function style(){
  if(document.getElementById('bwsFeatureLockProtectionCss'))return;
  const s=document.createElement('style');
  s.id='bwsFeatureLockProtectionCss';
  s.textContent=`
#adminSupportPanel.bws-support-layout-locked .asp-layout{transition:none!important}
#adminSupportPanel.bws-support-layout-locked .asp-profile{transition:none!important}
#adminSupportPanel.bws-support-layout-locked .client-drawer-resizer,
#adminSupportPanel.bws-support-layout-locked [data-layout-resize]{display:none!important;pointer-events:none!important}
#adminSupportPanel.bws-support-layout-locked [data-layout-drag]{pointer-events:none!important}
`;
  document.head.appendChild(s)
}

style();
if(!applyProtection()){
  let tries=0;
  const timer=setInterval(()=>{if(applyProtection()||++tries>80)clearInterval(timer)},80)
}
document.addEventListener('click',event=>{
  if(event.target.closest('#adminSupportNav'))setTimeout(applyProtection,80)
},true);
})();