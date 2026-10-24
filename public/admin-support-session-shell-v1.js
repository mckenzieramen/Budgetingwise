(()=>{'use strict';
const KEY='bwSupportSelectedUid';
const $=(s,p=document)=>p.querySelector(s);
function getStored(){try{return sessionStorage.getItem(KEY)||''}catch{return''}}
function setStored(v){try{v?sessionStorage.setItem(KEY,v):sessionStorage.removeItem(KEY)}catch{}}
function injectCss(){if($('#bwsSupportSessionShellCss'))return;const s=document.createElement('style');s.id='bwsSupportSessionShellCss';s.textContent=`
#adminSupportPanel .bws-drawer-close{display:none!important}
.admin-top-search{position:relative!important}
.admin-top-search::before,.admin-top-search svg,.admin-top-search .search-icon{display:none!important}
#topClientSearch{padding-left:12px!important}
.admin-sidebar .bws-sidebar-admin-account{margin-top:8px;padding:10px 11px;border:1px solid #ffffff14;border-radius:12px;background:#ffffff08;color:#fff;display:flex;align-items:center;gap:9px;min-width:0}
.admin-sidebar .bws-sidebar-admin-account .admin-avatar{width:31px;height:31px;flex:0 0 31px;background:#6b4af3;color:#fff}
.admin-sidebar .bws-sidebar-admin-account>div:last-child{min-width:0}
.admin-sidebar .bws-sidebar-admin-account strong{display:block;color:#fff;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.admin-sidebar .bws-sidebar-admin-account small{display:block!important;color:#aaa5c8!important;font-size:8px!important;margin-top:2px}
`;
document.head.appendChild(s)}
function cleanHeader(){injectCss();const search=$('#topClientSearch');if(search){search.placeholder='Search clients by Budget ID, name, or email…';search.setAttribute('aria-label','Search clients')}const user=$('.admin-user');const sidebar=$('.admin-sidebar');const logout=$('#adminLogout');if(user&&sidebar&&logout){user.classList.add('bws-sidebar-admin-account');if(user.parentElement!==sidebar)logout.insertAdjacentElement('afterend',user)}}
function supportVisible(){const r=$('#adminSupportPanel');return !!(r&&!r.classList.contains('hidden'))}
function matchingThread(uid){if(!uid)return null;try{return $(`#adminSupportPanel #aspThreads [data-thread="${CSS.escape(uid)}"]`)}catch{return null}}
function currentUid(){return $('#adminSupportPanel #aspThreads [data-thread].active')?.dataset.thread||''}
function rememberCurrent(){const uid=currentUid();if(uid)setStored(uid);return uid}
function ensureDrawer(){if(!supportVisible())return;let uid=getStored()||currentUid();if(!uid)return;setStored(uid);const r=$('#adminSupportPanel');const d=$('#aspProfile .bws-persistent-drawer');if(r?.classList.contains('bws-customer-open')&&d?.dataset.uid===uid)return;const thread=matchingThread(uid);if(thread){thread.click();return}const active=$('#adminSupportPanel #aspThreads [data-thread].active');if(active){setStored(active.dataset.thread||'');active.click()}}
function clearCustomerContext(){setStored('');const r=$('#adminSupportPanel');r?.classList.remove('bws-customer-open')}
function scheduleRestore(){[60,180,420].forEach(ms=>setTimeout(ensureDrawer,ms))}
function boot(){cleanHeader();if(supportVisible()){rememberCurrent();scheduleRestore()}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
document.addEventListener('click',e=>{
  const thread=e.target.closest('#adminSupportPanel #aspThreads [data-thread]');
  if(thread){setStored(thread.dataset.thread||'');scheduleRestore();return}
  const nav=e.target.closest('.admin-nav button');
  if(nav&&nav.id!=='adminSupportNav'){clearCustomerContext();return}
  if(nav?.id==='adminSupportNav'){scheduleRestore();return}
  if(e.target.closest('#adminSupportPanel')&&getStored())scheduleRestore();
},true);
document.addEventListener('change',e=>{if(e.target.closest('#adminSupportPanel')&&getStored())scheduleRestore()},true);
window.addEventListener('popstate',()=>{if(supportVisible())scheduleRestore();else clearCustomerContext()});
setTimeout(cleanHeader,120);setTimeout(cleanHeader,500);
})();