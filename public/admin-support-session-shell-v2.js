(()=>{'use strict';
const $=(s,p=document)=>p.querySelector(s);
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
function cleanHeader(){injectCss();const search=$('#topClientSearch');if(search){search.placeholder='Search clients by Budget ID, name, or email…';search.setAttribute('aria-label','Search clients')}const user=$('.admin-user');const sidebar=$('.admin-sidebar');const logout=$('#adminLogout');if(user&&sidebar&&logout){user.classList.add('bws-sidebar-admin-account');if(user.parentElement!==sidebar||user.nextElementSibling!==logout)sidebar.insertBefore(user,logout)}}
function boot(){cleanHeader();setTimeout(cleanHeader,120);setTimeout(cleanHeader,500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
document.addEventListener('click',e=>{if(e.target.closest('#adminSupportNav,.admin-nav button,#adminLogout'))setTimeout(cleanHeader,40)},true);
})();
import('./admin-premium-dialog-v1.js?v=premium-dialog-v2').catch(error=>console.warn('Premium dialogs unavailable:',error));
import('./admin-support-drawer-insights-v1.js?v=drawer-insights-v1').catch(error=>console.warn('Support drawer insights unavailable:',error));
import('./admin-support-drawer-readability-v1.js?v=drawer-readability-v2-visible-icons').catch(error=>console.warn('Support drawer readability unavailable:',error));
import('./admin-support-nav-premium-v1.js?v=support-nav-premium-v2-frozen').catch(error=>console.warn('Support premium navigation unavailable:',error));
import('./admin-support-account-match-v1.js?v=account-match-v1').catch(error=>console.warn('Support account matching unavailable:',error));
import('./admin-support-premium-dialog-bridge-v1.js?v=premium-support-dialog-v1').catch(error=>console.warn('Support premium dialog bridge unavailable:',error));
