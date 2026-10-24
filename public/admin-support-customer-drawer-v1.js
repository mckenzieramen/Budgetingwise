(()=>{'use strict';
const $=(s,p=document)=>p.querySelector(s);
const root=()=>document.getElementById('adminSupportPanel');
let selectedUid='';
let settleTimer=0;
function css(){if(document.getElementById('bwsCustomerDrawerCss'))return;const s=document.createElement('style');s.id='bwsCustomerDrawerCss';s.textContent=`
#adminSupportPanel .asp-layout{transition:grid-template-columns .24s ease!important}
#adminSupportPanel .asp-profile{transition:transform .24s ease,opacity .18s ease!important;will-change:transform,opacity}
#adminSupportPanel:not(.bws-customer-open) .asp-layout{grid-template-columns:205px minmax(0,1fr) 0!important}
#adminSupportPanel:not(.bws-customer-open) .asp-profile{width:0!important;min-width:0!important;max-width:0!important;opacity:0!important;transform:translateX(100%)!important;pointer-events:none!important;border-left:0!important;overflow:hidden!important;padding:0!important}
#adminSupportPanel.bws-customer-open .asp-profile{opacity:1!important;transform:translateX(0)!important;pointer-events:auto!important}
#adminSupportPanel .bws-linked-final{order:-30!important}
#adminSupportPanel .bws-client-info-v3{order:-29!important}
#adminSupportPanel .asp-profile-card{display:flex!important;flex-direction:column!important}
#adminSupportPanel .bws-customer-brand{order:-50!important}
#adminSupportPanel .bws-profile-nav-v3{order:-40!important}
#adminSupportPanel .bws-linked-final{margin-top:0!important}
#adminSupportPanel .bws-client-info-v3{margin-top:8px!important}
@media(min-width:1500px){#adminSupportPanel:not(.bws-customer-open) .asp-layout{grid-template-columns:220px minmax(0,1fr) 0!important}#adminSupportPanel.bws-customer-open .asp-layout{grid-template-columns:220px minmax(0,1fr) 360px!important}}
@media(min-width:1241px) and (max-width:1499px){#adminSupportPanel.bws-customer-open .asp-layout{grid-template-columns:205px minmax(0,1fr) 340px!important}}
@media(max-width:1240px) and (min-width:1081px){#adminSupportPanel:not(.bws-customer-open) .asp-layout{grid-template-columns:195px minmax(0,1fr) 0!important}#adminSupportPanel.bws-customer-open .asp-layout{grid-template-columns:195px minmax(0,1fr) 310px!important}}
@media(max-width:1080px){#adminSupportPanel .asp-layout{grid-template-columns:200px minmax(0,1fr)!important}#adminSupportPanel .asp-profile{display:none!important}}
`;document.head.appendChild(s)}
function activeButton(){const r=root();return r?.querySelector('#aspThreads [data-thread].active')||null}
function hasThread(uid){const r=root();return !!(uid&&r?.querySelector(`#aspThreads [data-thread="${CSS.escape(uid)}"]`))}
function select(uid){const r=root();if(!r)return;if(uid)selectedUid=uid;if(selectedUid&&hasThread(selectedUid)){
  r.classList.add('bws-customer-open');
  const profile=r.querySelector('.asp-profile');if(profile){profile.dataset.customerUid=selectedUid;profile.scrollTop=0}
  const card=r.querySelector('#aspProfile .asp-profile-card');
  if(card){const linked=card.querySelector('.bws-linked-final'),info=card.querySelector('.bws-client-info-v3'),extras=card.querySelector('#bwsProfileExtras');if(linked&&info){const nav=card.querySelector('.bws-profile-nav-v3');if(nav)nav.insertAdjacentElement('afterend',linked);linked.insertAdjacentElement('afterend',info)}if(extras&&info&&!extras.contains(info))info.insertAdjacentElement('afterend',extras)}
}else{r.classList.remove('bws-customer-open')}
}
function sync(){const r=root();if(!r||r.classList.contains('hidden'))return;css();const a=activeButton();if(a?.dataset.thread)selectedUid=a.dataset.thread;select(selectedUid)}
function settle(){clearTimeout(settleTimer);[0,80,180,360,700].forEach(ms=>setTimeout(sync,ms))}
function clearIfTrulyEmpty(){const r=root();if(!r)return;const any=r.querySelector('#aspThreads [data-thread]');const active=activeButton();if(!any||(!active&&!selectedUid)){selectedUid='';r.classList.remove('bws-customer-open')}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',settle,{once:true});else settle();
document.addEventListener('click',e=>{
  const thread=e.target.closest('#adminSupportPanel #aspThreads [data-thread]');
  if(thread){selectedUid=thread.dataset.thread||'';const r=root();if(r)r.classList.add('bws-customer-open');settle();return}
  if(e.target.closest('#adminSupportNav')){setTimeout(()=>{clearIfTrulyEmpty();sync()},120)}
},true);
document.addEventListener('change',e=>{if(e.target.closest('#adminSupportPanel'))settle()},true);
window.addEventListener('popstate',()=>setTimeout(sync,80));
})();