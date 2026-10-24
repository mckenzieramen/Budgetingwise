(()=>{'use strict';
const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];
function injectCss(){if($('#bwsSupportSessionShellCssV2'))return;$('#bwsSupportSessionShellCss')?.remove();const s=document.createElement('style');s.id='bwsSupportSessionShellCssV2';s.textContent=`
.admin-top-search{position:relative!important}
.admin-top-search::before,.admin-top-search svg,.admin-top-search .search-icon{display:none!important}
#topClientSearch{padding-left:12px!important}
#adminDashboard .admin-layout{grid-template-columns:228px minmax(0,1fr)!important}
#adminDashboard .admin-sidebar{width:228px!important;min-width:228px!important;max-width:228px!important;padding:18px 14px 12px!important;overflow:hidden!important;transform:none!important;transition:none!important}
#adminDashboard .admin-sidebar .admin-side-logo{justify-content:flex-start!important;gap:10px!important;padding-left:4px!important;padding-right:4px!important}
#adminDashboard .admin-sidebar .admin-side-logo>div{display:block!important;width:auto!important;max-width:154px!important;opacity:1!important;visibility:visible!important;transform:none!important;pointer-events:auto!important;overflow:hidden!important}
#adminDashboard .admin-sidebar .bws-nav-label{display:block!important;width:auto!important;max-width:160px!important;opacity:1!important;visibility:visible!important;margin:0!important;padding:0!important;transform:none!important;pointer-events:auto!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
#adminDashboard .admin-sidebar .admin-nav button{justify-content:flex-start!important;gap:12px!important;padding-left:13px!important;padding-right:13px!important}
#adminDashboard .admin-sidebar #adminLogout{order:100!important;justify-content:flex-start!important;gap:11px!important;padding-left:12px!important;padding-right:12px!important;width:100%!important;min-height:38px!important;margin:0!important;flex-shrink:0!important;position:relative!important;z-index:2!important;box-sizing:border-box!important}
#adminDashboard #bwsAdminSidebarToggle,#adminDashboard [data-sidebar-toggle],#adminDashboard .bws-admin-sidebar-toggle{display:none!important}
.admin-sidebar .bws-sidebar-admin-account{order:90!important;margin-top:auto!important;margin-bottom:8px!important;min-height:58px!important;padding:10px 11px!important;border:1px solid #ffffff14!important;border-radius:12px!important;background:#ffffff08!important;color:#fff!important;display:flex!important;align-items:center!important;gap:9px!important;min-width:0!important;flex-shrink:0!important;position:relative!important;z-index:3!important;box-sizing:border-box!important;transform:none!important}
.admin-sidebar .bws-sidebar-admin-account .admin-avatar{width:34px!important;height:34px!important;flex:0 0 34px!important;background:#6b4af3!important;color:#fff!important}
.admin-sidebar .bws-sidebar-admin-account>div:last-child{display:block!important;width:auto!important;min-width:0!important;overflow:hidden!important;opacity:1!important;visibility:visible!important}
.admin-sidebar .bws-sidebar-admin-account strong{display:block!important;color:#fff!important;font-size:10px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.admin-sidebar .bws-sidebar-admin-account small{display:block!important;color:#aaa5c8!important;font-size:8px!important;margin-top:2px!important}
.admin-sidebar .admin-note{margin-top:12px!important}
`;document.head.appendChild(s)}
function enforceStaticSidebar(){const dash=$('#adminDashboard'),layout=$('#adminDashboard .admin-layout'),side=$('#adminDashboard .admin-sidebar');if(!dash||!layout||!side)return;layout.classList.remove('bws-admin-nav-collapsed','bws-admin-nav-peek');side.classList.remove('bws-admin-nav-collapsed','bws-admin-nav-peek');dash.classList.remove('bws-admin-nav-collapsed','bws-admin-nav-peek');$$('.bws-nav-label',side).forEach(el=>{el.style.setProperty('display','block','important');el.style.setProperty('width','auto','important');el.style.setProperty('opacity','1','important');el.style.setProperty('visibility','visible','important')});}
function cleanHeader(){injectCss();const search=$('#topClientSearch');if(search){search.placeholder='Search clients by Budget ID, name, or email…';search.setAttribute('aria-label','Search clients')}const user=$('.admin-user');const sidebar=$('.admin-sidebar');const logout=$('#adminLogout');if(user&&sidebar&&logout){user.classList.add('bws-sidebar-admin-account');if(user.parentElement!==sidebar||user.nextElementSibling!==logout)sidebar.insertBefore(user,logout)}enforceStaticSidebar()}
function boot(){cleanHeader();setTimeout(cleanHeader,120);setTimeout(cleanHeader,500);setTimeout(enforceStaticSidebar,900)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
document.addEventListener('click',e=>{if(e.target.closest('#adminSupportNav,.admin-nav button,#adminLogout'))setTimeout(cleanHeader,40)},true);
window.addEventListener('resize',()=>requestAnimationFrame(enforceStaticSidebar));
})();
import('./admin-premium-dialog-v1.js?v=premium-dialog-v2').catch(error=>console.warn('Premium dialogs unavailable:',error));
import('./admin-support-drawer-insights-v1.js?v=drawer-insights-v1').catch(error=>console.warn('Support drawer insights unavailable:',error));
import('./admin-support-drawer-readability-v1.js?v=drawer-readability-v2-visible-icons').catch(error=>console.warn('Support drawer readability unavailable:',error));
import('./admin-support-nav-premium-v1.js?v=support-nav-premium-v7-hide-linked-email').catch(error=>console.warn('Support premium navigation unavailable:',error));
import('./admin-support-account-match-v1.js?v=account-match-v5-email-change-trigger').catch(error=>console.warn('Support account matching unavailable:',error));
import('./admin-support-account-link-sync-v1.js?v=account-link-sync-v1').catch(error=>console.warn('Support account identity sync unavailable:',error));
import('./admin-support-ticket-modal-polish-v1.js?v=ticket-modal-v3-verified-flow').catch(error=>console.warn('Support ticket modal polish unavailable:',error));
import('./admin-support-premium-dialog-bridge-v1.js?v=premium-support-dialog-v1').catch(error=>console.warn('Support premium dialog bridge unavailable:',error));
import('./admin-support-ticket-insights-v1.js?v=ticket-insights-v1').catch(error=>console.warn('Support ticket insights unavailable:',error));
import('./admin-support-composer-premium-v1.js?v=composer-premium-v1').catch(error=>console.warn('Support premium composer unavailable:',error));
