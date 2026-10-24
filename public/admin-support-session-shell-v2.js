(()=>{'use strict';
const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];
function injectCss(){if($('#bwsSupportSessionShellCssV2'))return;$('#bwsSupportSessionShellCss')?.remove();const s=document.createElement('style');s.id='bwsSupportSessionShellCssV2';s.textContent=`
.admin-top-search{position:relative!important}
.admin-top-search::before,.admin-top-search svg,.admin-top-search .search-icon{display:none!important}
#topClientSearch{padding-left:12px!important}
.admin-sidebar .bws-sidebar-admin-account{order:90!important;margin-top:auto!important;margin-bottom:9px!important;min-height:54px!important;padding:10px 11px!important;border:1px solid #ffffff14!important;border-radius:12px!important;background:#ffffff08!important;color:#fff!important;display:flex!important;align-items:center!important;gap:9px!important;min-width:0!important;flex-shrink:0!important;position:relative!important;z-index:3!important;box-sizing:border-box!important}
.admin-sidebar .bws-sidebar-admin-account .admin-avatar{width:31px!important;height:31px!important;flex:0 0 31px!important;background:#6b4af3!important;color:#fff!important}
.admin-sidebar .bws-sidebar-admin-account>div:last-child{min-width:0!important;overflow:hidden!important}
.admin-sidebar .bws-sidebar-admin-account strong{display:block!important;color:#fff!important;font-size:10px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.admin-sidebar .bws-sidebar-admin-account small{display:block!important;color:#aaa5c8!important;font-size:8px!important;margin-top:2px!important}
.admin-sidebar #adminLogout{order:91!important;width:100%!important;min-height:38px!important;margin:0!important;flex-shrink:0!important;position:relative!important;z-index:2!important;box-sizing:border-box!important}
.admin-sidebar .admin-note{margin-top:12px!important}
`;document.head.appendChild(s)}
function force(el,prop,value){if(!el)return;el.style.setProperty(prop,value,'important')}
function clearForced(el,props){if(!el)return;props.forEach(p=>el.style.removeProperty(p))}
function syncSidebarLabels(){
  const side=$('#adminDashboard .admin-sidebar'),layout=$('#adminDashboard .admin-layout');if(!side||!layout)return;
  const visiblyWide=side.getBoundingClientRect().width>110||layout.classList.contains('bws-admin-nav-peek')||side.classList.contains('bws-admin-nav-peek')||!layout.classList.contains('bws-admin-nav-collapsed');
  const labels=$$('.bws-nav-label',side),buttons=$$('.admin-nav button',side),logout=$('#adminLogout',side),logoText=$('.admin-side-logo>div',side),logo=$('.admin-side-logo',side),accountText=$('.bws-sidebar-admin-account>div:last-child',side);
  if(visiblyWide){
    labels.forEach(el=>{force(el,'display','block');force(el,'width','auto');force(el,'max-width','160px');force(el,'opacity','1');force(el,'margin','0');force(el,'transform','none');force(el,'pointer-events','auto')});
    buttons.forEach(el=>{force(el,'justify-content','flex-start');force(el,'gap','11px');force(el,'padding-left','12px');force(el,'padding-right','12px')});
    [logout].forEach(el=>{force(el,'justify-content','flex-start');force(el,'gap','11px');force(el,'padding-left','12px');force(el,'padding-right','12px')});
    force(logoText,'display','block');force(logoText,'width','auto');force(logoText,'max-width','150px');force(logoText,'opacity','1');force(logoText,'transform','none');force(logoText,'pointer-events','auto');
    force(logo,'justify-content','flex-start');force(accountText,'display','block');force(accountText,'width','auto');force(accountText,'opacity','1');
  }else{
    labels.forEach(el=>clearForced(el,['display','width','max-width','opacity','margin','transform','pointer-events']));
    buttons.forEach(el=>clearForced(el,['justify-content','gap','padding-left','padding-right']));
    clearForced(logout,['justify-content','gap','padding-left','padding-right']);
    clearForced(logoText,['display','width','max-width','opacity','transform','pointer-events']);clearForced(logo,['justify-content']);clearForced(accountText,['display','width','opacity']);
  }
}
function cleanHeader(){injectCss();const search=$('#topClientSearch');if(search){search.placeholder='Search clients by Budget ID, name, or email…';search.setAttribute('aria-label','Search clients')}const user=$('.admin-user');const sidebar=$('.admin-sidebar');const logout=$('#adminLogout');if(user&&sidebar&&logout){user.classList.add('bws-sidebar-admin-account');if(user.parentElement!==sidebar||user.nextElementSibling!==logout)sidebar.insertBefore(user,logout)}syncSidebarLabels()}
function refreshSidebar(){requestAnimationFrame(()=>requestAnimationFrame(syncSidebarLabels))}
function boot(){cleanHeader();setTimeout(cleanHeader,120);setTimeout(cleanHeader,500);setTimeout(syncSidebarLabels,900)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
document.addEventListener('click',e=>{if(e.target.closest('#bwsAdminSidebarToggle,#adminSupportNav,.admin-nav button,#adminLogout')){setTimeout(cleanHeader,40);setTimeout(syncSidebarLabels,360)}},true);
const bindSideState=()=>{const side=$('#adminDashboard .admin-sidebar');if(!side||side.dataset.bwsLabelSyncBound)return;side.dataset.bwsLabelSyncBound='1';side.addEventListener('mouseenter',()=>setTimeout(syncSidebarLabels,40));side.addEventListener('mouseleave',()=>setTimeout(syncSidebarLabels,360));window.addEventListener('resize',refreshSidebar)};
setTimeout(bindSideState,120);setTimeout(bindSideState,600);
})();
import('./admin-premium-dialog-v1.js?v=premium-dialog-v2').catch(error=>console.warn('Premium dialogs unavailable:',error));
import('./admin-support-drawer-insights-v1.js?v=drawer-insights-v1').catch(error=>console.warn('Support drawer insights unavailable:',error));
import('./admin-support-drawer-readability-v1.js?v=drawer-readability-v2-visible-icons').catch(error=>console.warn('Support drawer readability unavailable:',error));
import('./admin-support-nav-premium-v1.js?v=support-nav-premium-v7-hide-linked-email').catch(error=>console.warn('Support premium navigation unavailable:',error));
import('./admin-support-account-match-v1.js?v=account-match-v5-email-change-trigger').catch(error=>console.warn('Support account matching unavailable:',error));
import('./admin-support-account-link-sync-v1.js?v=account-link-sync-v1').catch(error=>console.warn('Support account identity sync unavailable:',error));
import('./admin-support-ticket-modal-polish-v1.js?v=ticket-modal-v2-customer-preview').catch(error=>console.warn('Support ticket modal polish unavailable:',error));
import('./admin-support-premium-dialog-bridge-v1.js?v=premium-support-dialog-v1').catch(error=>console.warn('Support premium dialog bridge unavailable:',error));
