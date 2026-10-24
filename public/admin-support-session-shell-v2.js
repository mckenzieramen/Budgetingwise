(()=>{'use strict';
const $=(s,p=document)=>p.querySelector(s);
function injectCss(){if($('#bwsSupportSessionShellCssV2'))return;$('#bwsSupportSessionShellCss')?.remove();const s=document.createElement('style');s.id='bwsSupportSessionShellCssV2';s.textContent=`
.admin-top-search{position:relative!important}
.admin-top-search::before,.admin-top-search svg,.admin-top-search .search-icon{display:none!important}
#topClientSearch{padding-left:12px!important}
.admin-sidebar .bws-sidebar-admin-account{margin-top:auto!important;margin-bottom:8px!important;padding:10px 11px;border:1px solid #ffffff14;border-radius:12px;background:#ffffff08;color:#fff;display:flex;align-items:center;gap:9px;min-width:0;flex-shrink:0}
.admin-sidebar .bws-sidebar-admin-account .admin-avatar{width:31px;height:31px;flex:0 0 31px;background:#6b4af3;color:#fff}
.admin-sidebar .bws-sidebar-admin-account>div:last-child{min-width:0}
.admin-sidebar .bws-sidebar-admin-account strong{display:block;color:#fff;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.admin-sidebar .bws-sidebar-admin-account small{display:block!important;color:#aaa5c8!important;font-size:8px!important;margin-top:2px}
.admin-sidebar #adminLogout{margin-top:0!important;flex-shrink:0}
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
