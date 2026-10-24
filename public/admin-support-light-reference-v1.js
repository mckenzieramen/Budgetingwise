(()=>{'use strict';
const apply=()=>{const r=document.getElementById('adminSupportPanel');if(!r)return;if(!document.getElementById('bwsSupportLightRefCss')){const s=document.createElement('style');s.id='bwsSupportLightRefCss';s.textContent=`
#adminSupportPanel{--lr-purple:#5b36ef;--lr-soft:#f6f3ff;--lr-line:#e8eaf2;--lr-text:#252b43;--lr-muted:#858da1;background:#f8f9fc!important;color:var(--lr-text)!important}
#adminSupportPanel .asp-page-head,#adminSupportPanel .asp-inbox,#adminSupportPanel .asp-chat,#adminSupportPanel .asp-profile,#adminSupportPanel .asp-profile-card,#adminSupportPanel .asp-list-head,#adminSupportPanel .asp-chat>header,#adminSupportPanel #bwsSupportTabs,#adminSupportPanel #aspForm,#adminSupportPanel .bws-customer-brand,#adminSupportPanel .bws-profile-nav-v3,#adminSupportPanel .bws-final-profile-nav{background:#fff!important;color:var(--lr-text)!important}
#adminSupportPanel .asp-layout{background:#fff!important;border-color:var(--lr-line)!important;box-shadow:0 8px 26px rgba(35,42,70,.05)!important}
#adminSupportPanel .asp-messages{background:linear-gradient(180deg,#fff 0%,#fbfcff 100%)!important}
#adminSupportPanel .asp-msg.customer p{background:#f5f6f9!important;color:#30364a!important;border:1px solid #eceef3!important}
#adminSupportPanel .asp-msg.admin p{background:#f0ecff!important;color:#4f35c9!important;border:1px solid #dcd4ff!important;box-shadow:none!important}
#adminSupportPanel .asp-thread-copy strong,#adminSupportPanel #aspCustomer strong,#adminSupportPanel .asp-profile-card h3,#adminSupportPanel .bws-section-title strong,#adminSupportPanel .bws-card-head-v3 strong{color:#252b43!important}
#adminSupportPanel .asp-thread-copy small,#adminSupportPanel #aspCustomer small,#adminSupportPanel .bws-section-title small,#adminSupportPanel .bws-card-head-v3 small{color:#8a92a5!important}
#adminSupportPanel .asp-threads button.active{background:#f4f1ff!important;border-color:#ddd6ff!important;box-shadow:inset 3px 0 #5b36ef!important}
#adminSupportPanel .asp-avatar,#adminSupportPanel .asp-profile-avatar{background:#eee9ff!important;color:#5b36ef!important;border-color:#ddd4ff!important;box-shadow:none!important}
#adminSupportPanel .bws-client-info-v3,#adminSupportPanel .bws-final-overview,#adminSupportPanel .bws-ticket-details,#adminSupportPanel .bws-quick-actions-v3,#adminSupportPanel .bws-final-quick,#adminSupportPanel .bws-email-history-v3,#adminSupportPanel .bws-account-actions{background:#fff!important;border:1px solid var(--lr-line)!important;box-shadow:none!important}
#adminSupportPanel .bws-info-item-v3,#adminSupportPanel .bws-final-info,#adminSupportPanel .bws-detail-grid span,#adminSupportPanel .bws-email-card-v3{background:#fbfcff!important;border-color:#eceef4!important;color:#30364a!important}
#adminSupportPanel .bws-profile-nav-v3 button,#adminSupportPanel .bws-final-profile-nav button,#adminSupportPanel .bws-email-tabs-v3 button,#adminSupportPanel .bws-actions-grid button,#adminSupportPanel .bws-quick-grid-v3 button,#adminSupportPanel .bws-final-quick-grid button{background:#fff!important;border-color:#e1ddf7!important;color:#5a43cf!important;box-shadow:none!important}
#adminSupportPanel .bws-profile-nav-v3 button.active,#adminSupportPanel .bws-final-profile-nav button.active,#adminSupportPanel .bws-email-tabs-v3 button.active{background:#f2eeff!important;border-color:#d4ccff!important;color:#553bd5!important}
#adminSupportPanel .bws-quick-grid-v3 .primary,#adminSupportPanel .bws-final-quick-grid .primary,#adminSupportPanel #bwsNewTicket,#adminSupportPanel .asp-send-btn,#adminSupportPanel .bws-closed-actions .primary{background:linear-gradient(135deg,#6a49f5,#5838df)!important;color:#fff!important;border:0!important;box-shadow:0 6px 14px rgba(91,54,239,.14)!important}
#adminSupportPanel #aspSolvedNotice{background:#f6f8ff!important;color:#52668a!important;border-color:#e2e7f2!important}
#adminSupportPanel .bws-closed-actions{background:#fff!important;border-color:#eceef3!important}
#adminSupportPanel .bws-compose-v3{background:#faf9ff!important;border-color:#e4defb!important}
#adminSupportPanel .bws-compose-v3 input,#adminSupportPanel .bws-compose-v3 textarea,#adminSupportPanel #aspInput,#adminSupportPanel .bws-inbox-tools input,#adminSupportPanel .bws-inbox-tools select{background:#fff!important;color:#30364a!important;border-color:#e0e3eb!important}
#adminSupportPanel .bws-final-icon,#adminSupportPanel .bws-premium-icon,#adminSupportPanel .bws-fd-icon{color:#6548e8!important}
#adminSupportPanel .asp-status,#adminSupportPanel .status-pill{filter:none!important}
#adminSupportPanel .bws-account-actions .danger,#adminSupportPanel .bws-actions-grid button.danger{background:#fffafa!important;color:#c64555!important;border-color:#f5cdd3!important}
@media(min-width:1380px){#adminSupportPanel .asp-layout{grid-template-columns:minmax(250px,19%) minmax(610px,1fr) minmax(405px,29%)!important}}
`;document.head.appendChild(s)}r.classList.add('bws-light-reference')};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();new MutationObserver(apply).observe(document.documentElement,{childList:true,subtree:true});})();