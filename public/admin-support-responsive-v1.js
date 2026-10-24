(()=>{'use strict';
function apply(){
  const r=document.getElementById('adminSupportPanel');
  if(!r)return;
  if(!document.getElementById('bwsSupportResponsiveCss')){
    const s=document.createElement('style');
    s.id='bwsSupportResponsiveCss';
    s.textContent=`
#adminSupportPanel{min-width:0!important;overflow:hidden!important}
#adminSupportPanel .asp-page-head{min-width:0!important;flex-wrap:wrap!important}
#adminSupportPanel .asp-layout{width:100%!important;max-width:100%!important;min-width:0!important;grid-template-columns:220px minmax(0,1fr) 320px!important;overflow:hidden!important}
#adminSupportPanel .asp-layout>*{min-width:0!important;max-width:100%!important}
#adminSupportPanel .asp-inbox,#adminSupportPanel .asp-chat,#adminSupportPanel .asp-profile{min-width:0!important;overflow:hidden!important}
#adminSupportPanel .asp-profile{overflow-y:auto!important;overflow-x:hidden!important}
#adminSupportPanel .asp-chat{display:flex!important;flex-direction:column!important}
#adminSupportPanel .asp-chat>header{min-width:0!important;gap:8px!important;flex-wrap:wrap!important}
#adminSupportPanel #aspCustomer{min-width:130px!important;flex:1 1 150px!important}
#adminSupportPanel .bws-ticket-controls{margin-left:auto!important;display:flex!important;flex-wrap:wrap!important;justify-content:flex-end!important;gap:5px!important;min-width:0!important}
#adminSupportPanel #bwsSupportTabs{overflow-x:auto!important;overflow-y:hidden!important;scrollbar-width:none!important;white-space:nowrap!important}
#adminSupportPanel #bwsSupportTabs::-webkit-scrollbar{display:none!important}
#adminSupportPanel #bwsSupportTabs button{flex:0 0 auto!important}
#adminSupportPanel .asp-messages{min-width:0!important;overflow-x:hidden!important}
#adminSupportPanel .asp-msg{max-width:min(78%,520px)!important;min-width:0!important}
#adminSupportPanel .asp-msg p,#adminSupportPanel .asp-msg img{max-width:100%!important;box-sizing:border-box!important}
#adminSupportPanel .asp-msg img{height:auto!important;object-fit:contain!important}
#adminSupportPanel #aspForm{min-width:0!important;grid-template-columns:36px minmax(0,1fr) 92px 38px!important}
#adminSupportPanel #aspInput{min-width:0!important;width:100%!important;box-sizing:border-box!important}
#adminSupportPanel .asp-profile-card{min-width:0!important;overflow:hidden!important}
#adminSupportPanel .bws-profile-nav-v3{grid-template-columns:repeat(4,minmax(0,1fr))!important}
#adminSupportPanel .bws-profile-nav-v3 button{min-width:0!important;padding:0 3px!important;font-size:6.6px!important}
#adminSupportPanel .bws-info-grid-v3{grid-template-columns:1fr 1fr!important}
#adminSupportPanel .bws-info-item-v3,#adminSupportPanel .bws-detail-grid span{min-width:0!important;overflow:hidden!important}
#adminSupportPanel .bws-info-item-v3 b,#adminSupportPanel .bws-detail-grid strong{overflow-wrap:anywhere!important}
#adminSupportPanel .bws-quick-grid-v3{grid-template-columns:1fr 1fr!important}
#adminSupportPanel .bws-actions-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
#adminSupportPanel .bws-actions-grid button,#adminSupportPanel .bws-quick-grid-v3 button{min-width:0!important;white-space:normal!important;line-height:1.2!important;padding:6px 4px!important}
#adminSupportPanel .bws-email-tabs-v3{max-width:100%!important;overflow-x:auto!important;scrollbar-width:none!important}
#adminSupportPanel .bws-email-tabs-v3::-webkit-scrollbar{display:none!important}
#adminSupportPanel .bws-email-list-v3{max-width:100%!important;overflow-x:hidden!important}
#adminSupportPanel .bws-compose-v3 input,#adminSupportPanel .bws-compose-v3 textarea{min-width:0!important;max-width:100%!important}
#adminSupportPanel .bws-stable-closed-actions{flex-wrap:wrap!important}

/* Conversation chooser: search on first row, filters on second row */
#adminSupportPanel #bwsInboxTools,#adminSupportPanel .bws-inbox-tools{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:8px!important;width:100%!important;min-width:0!important;align-items:stretch!important}
#adminSupportPanel #bwsInboxTools>input,#adminSupportPanel .bws-inbox-tools>input{grid-column:1/-1!important;width:100%!important;min-width:0!important;height:36px!important;box-sizing:border-box!important}
#adminSupportPanel #bwsInboxTools>div,#adminSupportPanel .bws-inbox-tools>div{grid-column:1/-1!important;display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:8px!important;width:100%!important;min-width:0!important}
#adminSupportPanel #bwsInboxTools select,#adminSupportPanel .bws-inbox-tools select{width:100%!important;min-width:0!important;height:34px!important;box-sizing:border-box!important}

@media(min-width:1550px){#adminSupportPanel .asp-layout{grid-template-columns:235px minmax(0,1fr) 355px!important}#adminSupportPanel .bws-actions-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}}
@media(max-width:1250px){#adminSupportPanel .asp-layout{grid-template-columns:205px minmax(0,1fr) 300px!important}#adminSupportPanel .asp-summary{order:3;width:100%;justify-content:flex-end}#adminSupportPanel .asp-summary button{min-width:58px!important}}
@media(max-width:1080px){#adminSupportPanel .asp-layout{grid-template-columns:210px minmax(0,1fr)!important}#adminSupportPanel .asp-profile{display:none!important}}
`;
    document.head.appendChild(s);
  }
  r.classList.add('bws-responsive-ready');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
document.addEventListener('click',e=>{if(e.target.closest('#adminSupportNav'))setTimeout(apply,0)},true);
})();