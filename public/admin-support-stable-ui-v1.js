(()=>{'use strict';
const root=()=>document.getElementById('adminSupportPanel');
const icon=(path)=>`<span class="bws-stable-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${path}</svg></span>`;
const icons={check:'<circle cx="12" cy="12" r="8.5"/><path d="m8.8 12 2 2 4.6-4.8"/>'};
function addCss(){if(document.getElementById('bwsStableSupportCss'))return;const s=document.createElement('style');s.id='bwsStableSupportCss';s.textContent=`
#adminSupportPanel{--bws-p:#5b36ef;--bws-soft:#f5f2ff;--bws-line:#e7e9f1;--bws-text:#252b43;--bws-muted:#868ea2;background:#f8f9fc!important;color:var(--bws-text)!important}
#adminSupportPanel .asp-layout,#adminSupportPanel .asp-inbox,#adminSupportPanel .asp-chat,#adminSupportPanel .asp-profile,#adminSupportPanel .asp-profile-card,#adminSupportPanel .asp-list-head,#adminSupportPanel .asp-chat>header,#adminSupportPanel #bwsSupportTabs,#adminSupportPanel #aspForm{background:#fff!important}
#adminSupportPanel .asp-layout{border-color:var(--bws-line)!important;box-shadow:0 8px 26px rgba(35,42,70,.05)!important}
#adminSupportPanel .asp-messages{background:linear-gradient(180deg,#fff,#fbfcff)!important}
#adminSupportPanel .asp-msg.customer p{background:#f5f6f9!important;color:#30364a!important;border:1px solid #eceef3!important}
#adminSupportPanel .asp-msg.admin p{background:#f0ecff!important;color:#4f35c9!important;border:1px solid #ddd5ff!important;box-shadow:none!important}
#adminSupportPanel .asp-threads button.active{background:#f4f1ff!important;border-color:#ddd6ff!important;box-shadow:inset 3px 0 var(--bws-p)!important}
#adminSupportPanel .bws-client-info-v3,#adminSupportPanel .bws-ticket-details,#adminSupportPanel .bws-quick-actions-v3,#adminSupportPanel .bws-email-history-v3,#adminSupportPanel .bws-account-actions{background:#fff!important;border-color:var(--bws-line)!important;box-shadow:none!important}
#adminSupportPanel .bws-actions-grid button,#adminSupportPanel .bws-quick-grid-v3 button,#adminSupportPanel .bws-profile-nav-v3 button{background:#fff!important;border-color:#e1ddf7!important;color:#5941cf!important;box-shadow:none!important}
#adminSupportPanel .bws-profile-nav-v3 button.active{background:#f2eeff!important;border-color:#d4ccff!important;color:#553bd5!important}
#adminSupportPanel .bws-quick-grid-v3 .primary,#adminSupportPanel #bwsNewTicket,#adminSupportPanel .asp-send-btn{background:linear-gradient(135deg,#6949f4,#5838df)!important;color:#fff!important;border:0!important;box-shadow:0 6px 14px rgba(91,54,239,.14)!important}
#adminSupportPanel .bws-stable-icon{display:inline-grid;width:16px;height:16px;place-items:center;flex:0 0 16px;color:currentColor}#adminSupportPanel .bws-stable-icon svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
#adminSupportPanel.is-ticket-closed #aspForm,#adminSupportPanel.is-ticket-closed #aspQuick,#adminSupportPanel.is-ticket-closed #bwsSavedReplies{display:none!important}
#adminSupportPanel.is-ticket-closed #aspSolvedNotice{display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;min-height:58px!important;margin-top:auto!important;background:#f6f8ff!important;color:#52668a!important;border-color:#e2e7f2!important;font-size:8px!important;font-weight:800!important}
#adminSupportPanel .bws-stable-closed-actions{display:none!important}
#adminSupportPanel .bws-actions-grid button .bws-premium-icon~.bws-premium-icon,#adminSupportPanel .bws-actions-grid button .bws-fd-icon~.bws-fd-icon,#adminSupportPanel .bws-actions-grid button .bws-final-icon~.bws-final-icon{display:none!important}
`;document.head.appendChild(s)}
const text=e=>String(e?.textContent||'').trim();
function closedState(r){const selected=r.querySelector('#aspThreads [data-thread].active .asp-status');const notice=r.querySelector('#aspSolvedNotice');const ctl=[...r.querySelectorAll('.bws-ticket-controls select,.bws-ticket-controls button')].map(text).join(' ');return /closed|solved/i.test(text(selected))||/conversation closed/i.test(text(notice))||/closed|solved/i.test(ctl)}
function dedupeIcons(r){r.querySelectorAll('.bws-actions-grid button,.bws-quick-grid-v3 button').forEach(b=>{const all=[...b.querySelectorAll('.bws-premium-icon,.bws-fd-icon,.bws-final-icon,.bws-stable-icon')];all.slice(1).forEach(x=>x.remove())})}
function sync(){const r=root();if(!r||r.classList.contains('hidden'))return;addCss();dedupeIcons(r);const closed=closedState(r);r.classList.toggle('is-ticket-closed',closed);
r.querySelectorAll('.bws-stable-closed-actions').forEach(x=>x.remove());
const start=r.querySelector('#bwsNewTicket');if(start){start.setAttribute('aria-label','Start new ticket');start.title='Start a new support ticket for the selected customer';if(!/start new ticket/i.test(text(start)))start.textContent='Start new ticket'}
if(closed){const notice=r.querySelector('#aspSolvedNotice'),chat=r.querySelector('#aspChat');if(notice){if(!notice.dataset.stableClosed){notice.dataset.stableClosed='1';notice.innerHTML=`${icon(icons.check)}<span><strong>Conversation closed</strong><small style="display:block;margin-top:3px;font-weight:600">This ticket is read-only. Use Start new ticket above to continue helping this customer.</small></span>`}if(chat&&notice.parentElement===chat)chat.appendChild(notice)}}}
let timer=0;const schedule=(delay=80)=>{clearTimeout(timer);timer=setTimeout(sync,delay)};const burst=()=>{[0,120,300,650,1200].forEach(ms=>setTimeout(sync,ms))};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',burst,{once:true});else burst();
document.addEventListener('click',e=>{if(e.target.closest('#adminSupportNav,#adminSupportPanel'))schedule(100)},true);
document.addEventListener('change',e=>{if(e.target.closest('#adminSupportPanel'))schedule(100)},true);
})();