(()=>{'use strict';
const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)],root=()=>$('#adminSupportPanel');
const svg={user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.2-5 4-7 8-7s6.8 2 8 7"/>',link:'<path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1"/><path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1"/>',mail:'<path d="M3 6h18v12H3z"/><path d="m3 7 9 7 9-7"/>',copy:'<rect x="8" y="8" width="11" height="11" rx="2"/><path d="M5 15H4.5A2.5 2.5 0 0 1 2 12.5v-8A2.5 2.5 0 0 1 4.5 2h8A2.5 2.5 0 0 1 15 4.5V5"/>',edit:'<path d="m4 16-1 5 5-1L19 9l-4-4z"/><path d="m13 7 4 4"/>',lock:'<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',ticket:'<path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/>',activity:'<path d="M3 12h4l2-5 4 10 2-5h6"/>',logout:'<path d="M10 5H5v14h5"/><path d="M13 8l4 4-4 4M17 12H9"/>',alert:'<path d="M12 3 2 21h20z"/><path d="M12 9v5M12 18h.01"/>'};
const I=n=>`<span class="bws-final-icon"><svg viewBox="0 0 24 24">${svg[n]||svg.ticket}</svg></span>`;
function css(){if($('#bwsFinalReferenceCss'))return;const s=document.createElement('style');s.id='bwsFinalReferenceCss';s.textContent=`
#adminSupportPanel{--p:#5d39f2;--p2:#6b45ff;--ink:#171b2d;--muted:#7c859b;--line:#e7eaf2;background:#f7f8fc!important}
#adminSupportPanel .asp-layout{grid-template-columns:205px minmax(0,1fr) 340px!important;border:1px solid #e5e8f0!important;border-radius:14px!important;overflow:hidden!important;background:#fff!important;box-shadow:0 8px 28px rgba(25,30,55,.045)!important}
#adminSupportPanel .asp-inbox{background:#fff!important;border-right:1px solid #e8eaf2!important}
#adminSupportPanel .asp-list-head{padding:14px 12px 12px!important}
#adminSupportPanel #bwsInboxTools,#adminSupportPanel .bws-inbox-tools{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important}
#adminSupportPanel #bwsInboxTools>input,#adminSupportPanel .bws-inbox-tools>input{grid-column:1/-1!important;width:100%!important;height:35px!important;border-radius:9px!important;background:#fbfcff!important;border:1px solid #dfe3ed!important;font-size:8px!important}
#adminSupportPanel #bwsInboxTools>div,#adminSupportPanel .bws-inbox-tools>div{grid-column:1/-1!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important}
#adminSupportPanel #bwsInboxTools select,#adminSupportPanel .bws-inbox-tools select{width:100%!important;height:34px!important;border-radius:9px!important;font-size:8px!important}
#adminSupportPanel .asp-threads button{min-height:72px!important;padding:11px 12px!important;border-radius:0!important;border-bottom:1px solid #f0f1f5!important}
#adminSupportPanel .asp-threads button.active{background:#f3efff!important;box-shadow:inset 3px 0 var(--p)!important}
#adminSupportPanel .asp-chat>header{min-height:62px!important;padding:14px 16px!important}
#adminSupportPanel #bwsSupportTabs{padding:8px 14px!important}
#adminSupportPanel #bwsSupportTabs button{font-size:8.3px!important;padding:9px 11px!important}
#adminSupportPanel .asp-messages{padding:20px 24px!important;background:#fff!important}
#adminSupportPanel .asp-msg{max-width:min(72%,520px)!important}
#adminSupportPanel .asp-msg.admin p{background:linear-gradient(135deg,#6848f7,#5834ed)!important;color:#fff!important;border:0!important;border-radius:12px!important;padding:11px 13px!important;box-shadow:none!important}
#adminSupportPanel .asp-msg.customer p{background:#f5f6f9!important;color:#2f3549!important;border:1px solid #eceef3!important;border-radius:12px!important;padding:11px 13px!important}
#adminSupportPanel .asp-profile{padding:0!important;background:#fff!important;border-left:1px solid #e8eaf2!important;overflow-y:auto!important;overflow-x:hidden!important}
#adminSupportPanel .asp-profile-card{padding:0 10px 14px!important;text-align:left!important}
#adminSupportPanel .bws-customer-brand{position:sticky!important;top:0!important;z-index:20!important;height:50px!important;margin:0 -10px!important;padding:9px 11px!important;background:rgba(255,255,255,.985)!important;border-bottom:1px solid #eceef4!important;display:flex!important;align-items:center!important;gap:9px!important}
#adminSupportPanel .bws-customer-brand img{width:30px!important;height:30px!important;border-radius:9px!important;object-fit:contain!important;padding:3px!important;box-sizing:border-box!important;background:linear-gradient(145deg,#6747ff,#4f2ed7)!important;box-shadow:0 4px 12px rgba(91,54,239,.18)!important}
#adminSupportPanel .bws-customer-brand strong{font-size:10px!important;font-weight:900!important;color:#20243a!important}
#adminSupportPanel .bws-customer-brand small{font-size:6.5px!important;color:#9198aa!important}
#adminSupportPanel .bws-profile-nav-v3{position:sticky!important;top:50px!important;z-index:19!important;display:grid!important;grid-template-columns:1.05fr 1.1fr 1.05fr .9fr!important;gap:0!important;margin:0 -10px 8px!important;padding:0 7px!important;background:#fff!important;border-bottom:1px solid #eceef4!important}
#adminSupportPanel .bws-profile-nav-v3 button{height:38px!important;border:0!important;border-radius:0!important;background:transparent!important;color:#70788e!important;font-size:7.2px!important;font-weight:850!important;position:relative!important}
#adminSupportPanel .bws-profile-nav-v3 button.active{color:#5a39e7!important;background:#faf9ff!important}
#adminSupportPanel .bws-profile-nav-v3 button.active:after{content:'';position:absolute;left:8px;right:8px;bottom:-1px;height:2px;border-radius:3px;background:#6544ef}
#adminSupportPanel .asp-profile-card.bws-detailed-ready>.asp-profile-avatar,#adminSupportPanel .asp-profile-card.bws-detailed-ready>h3,#adminSupportPanel .asp-profile-card.bws-detailed-ready>.asp-status,#adminSupportPanel .asp-profile-card.bws-detailed-ready>.asp-profile-info{display:none!important}
#adminSupportPanel .bws-client-info-v3,#adminSupportPanel .bws-linked-final,#adminSupportPanel .bws-ticket-details,#adminSupportPanel .bws-quick-actions-v3,#adminSupportPanel .bws-support-actions-v1,#adminSupportPanel .bws-account-actions{margin:8px 0 0!important;padding:11px!important;border:1px solid var(--line)!important;border-radius:11px!important;background:#fff!important;box-shadow:0 3px 12px rgba(32,38,64,.035)!important}
#adminSupportPanel .bws-client-info-v3{margin-top:0!important}
#adminSupportPanel .bws-card-head-v3,#adminSupportPanel .bws-section-title{display:flex!important;align-items:center!important;justify-content:space-between!important;margin:0 0 9px!important;padding:0 0 7px!important;border-bottom:1px solid #f0f1f5!important}
#adminSupportPanel .bws-card-head-v3 strong,#adminSupportPanel .bws-section-title strong{font-size:9.4px!important;font-weight:900!important;color:#24293d!important}
#adminSupportPanel .bws-card-head-v3 small,#adminSupportPanel .bws-section-title small{font-size:6.3px!important;color:#969daf!important}
#adminSupportPanel .bws-info-grid-v3{grid-template-columns:1fr 1fr!important;gap:6px!important}
#adminSupportPanel .bws-info-item-v3{min-width:0!important;padding:7px 30px 7px 8px!important;border:1px solid #edf0f5!important;border-radius:8px!important;background:#fbfcff!important}
#adminSupportPanel .bws-info-item-v3 span{font-size:6.2px!important;color:#858ea3!important}
#adminSupportPanel .bws-info-item-v3 b{font-size:7.4px!important;color:#2b3148!important}
#adminSupportPanel .bws-info-item-v3.wide{grid-column:1/-1!important}
#adminSupportPanel .bws-inline-copy{width:22px!important;height:22px!important;right:6px!important;top:50%!important;transform:translateY(-50%)!important}
#adminSupportPanel .bws-linked-row{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;padding:8px 9px;border-radius:8px;background:#f8f9fc;margin-top:6px}
#adminSupportPanel .bws-linked-row small{display:block;font-size:6.2px;color:#7e879b}
#adminSupportPanel .bws-linked-row strong{display:block;margin-top:2px;font-size:7.4px;color:#30364d;word-break:break-all}
#adminSupportPanel .bws-linked-badge{padding:3px 7px;border-radius:99px;font-size:6px;font-weight:900;background:#e8f8ef;color:#11835a}
#adminSupportPanel .bws-linked-badge.muted{background:#fff1e8;color:#c66a15}
#adminSupportPanel .bws-merge-review{width:100%;height:31px;margin-top:7px;border:1px solid #d8d1fb;border-radius:8px;background:#fff;color:#5a40d5;font-size:7px;font-weight:900}
#adminSupportPanel .bws-merge-review:disabled{opacity:.48}
#adminSupportPanel .bws-detail-grid{grid-template-columns:1fr 1fr!important;gap:6px!important}
#adminSupportPanel .bws-detail-grid span{padding:7px!important;background:#f8f9fc!important;border:1px solid #eef0f5!important;border-radius:8px!important;font-size:6.3px!important}
#adminSupportPanel .bws-detail-grid strong{font-size:7.3px!important}
#adminSupportPanel .bws-quick-grid-v3,#adminSupportPanel .bws-support-actions-grid-v1,#adminSupportPanel .bws-actions-grid{display:grid!important;grid-template-columns:1fr 1fr!important;gap:6px!important}
#adminSupportPanel .bws-quick-grid-v3 button,#adminSupportPanel .bws-support-actions-grid-v1 button,#adminSupportPanel .bws-actions-grid button{min-height:32px!important;border:1px solid #ded8fa!important;border-radius:8px!important;background:#fff!important;color:#553dd2!important;padding:6px 7px!important;font-size:6.7px!important;font-weight:850!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:5px!important;line-height:1.15!important}
#adminSupportPanel .bws-quick-grid-v3 .primary{grid-column:1/-1!important;min-height:36px!important;background:linear-gradient(135deg,#6847f4,#5835ec)!important;color:#fff!important;border:0!important}
#adminSupportPanel .bws-actions-grid button.danger{background:#fff7f7!important;color:#d93e4d!important;border-color:#ffcdd3!important}
#adminSupportPanel .bws-account-actions .bws-actions-grid button.bws-workflow-duplicate{display:none!important}
#adminSupportPanel .bws-final-icon{display:inline-grid;width:14px;height:14px;place-items:center;flex:0 0 14px}
#adminSupportPanel .bws-final-icon svg{width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
#adminSupportPanel .bws-email-history-v3{margin-top:8px!important;border-radius:11px!important}
#adminSupportPanel .bws-view-profile{margin-top:8px!important;height:34px!important;border-radius:9px!important}
@media(min-width:1500px){#adminSupportPanel .asp-layout{grid-template-columns:220px minmax(0,1fr) 360px!important}}
@media(max-width:1240px){#adminSupportPanel .asp-layout{grid-template-columns:195px minmax(0,1fr) 310px!important}}
@media(max-width:1080px){#adminSupportPanel .asp-layout{grid-template-columns:200px minmax(0,1fr)!important}#adminSupportPanel .asp-profile{display:none!important}}
`;document.head.appendChild(s)}
function setIcon(b,n){if(!b||$('.bws-final-icon',b))return;b.insertAdjacentHTML('afterbegin',I(n))}
function infoMap(info){const m={};$$('.bws-info-item-v3',info).forEach(x=>m[(x.querySelector('span')?.textContent||'').trim().toLowerCase()]=(x.querySelector('b')?.textContent||'').trim());return m}
function linked(card,info){let b=$('.bws-linked-final',card),m=infoMap(info),email=Object.entries(m).find(([k])=>k.includes('email'))?.[1]||'—';if(!b){b=document.createElement('section');b.className='bws-linked-final';info.insertAdjacentElement('afterend',b)}b.innerHTML=`<div class="bws-section-title"><strong>${I('link')}Linked Accounts / Email Merge</strong><small>Account emails</small></div><div class="bws-linked-row"><div><small>Primary Email</small><strong>${email}</strong></div><span class="bws-linked-badge">Primary</span></div><div class="bws-linked-row"><div><small>Other Email</small><strong>No secondary email linked</strong></div><span class="bws-linked-badge muted">Unlinked</span></div><button type="button" class="bws-merge-review" disabled>Review email merge</button>`}
function apply(){const r=root();if(!r||r.classList.contains('hidden'))return;css();const card=$('#aspProfile .asp-profile-card',r),extras=$('#bwsProfileExtras',r);if(!card||!extras)return;card.classList.add('bws-detailed-ready');const info=$('.bws-client-info-v3',card);if(!info)return;
let h=$('.bws-card-head-v3 strong',info),sm=$('.bws-card-head-v3 small',info);if(h)h.textContent='Customer Information';if(sm)sm.textContent='Synced from Admin Clients';$$('.bws-info-item-v3',info).forEach(x=>{let t=(x.querySelector('span')?.textContent||'').toLowerCase();if(t.includes('current concern')||t.includes('ticket id'))x.remove()});
const brand=$('.bws-customer-brand',card);if(brand){brand.querySelector('strong').textContent='Customer Details';brand.querySelector('small').textContent='Budgetingwise Support'}
const nav=$('.bws-profile-nav-v3',card);if(nav){const n={overview:'Customer',ticket:'Ticket Details',email:'Email History',account:'Account'};$$('[data-jump]',nav).forEach(b=>b.textContent=n[b.dataset.jump]||b.textContent)}
linked(card,info);
const quick=$('.bws-quick-actions-v3',extras),support=$('.bws-support-actions-v1',extras),account=$('.bws-account-actions',extras);if(quick){$('.bws-section-title strong',quick).textContent='Quick Actions';const qsmall=$('.bws-section-title small',quick);if(qsmall)qsmall.textContent='Recommended'}
if(support){$('.bws-section-title strong',support).textContent='Additional Support Actions';const ss=$('.bws-section-title small',support);if(ss)ss.textContent='More tools'}
if(account){$('.bws-section-title strong',account).textContent='Account Actions';const as=$('.bws-section-title small',account);if(as)as.textContent='Security & account controls'}
const map={recovery:'mail',key:'mail',profile:'edit',activity:'activity',copy:'copy',info:'mail',unlock:'lock',bid:'edit',email:'mail',signout:'logout',suspend:'alert',tickets:'ticket',notes:'ticket'};
$$('[data-proxy],[data-aa],[data-support],[data-workflow-copy]',r).forEach(b=>{const k=b.dataset.proxy||b.dataset.aa||b.dataset.support||(b.dataset.workflowCopy?'copy':'');setIcon(b,map[k]||'ticket')})
}
let t=0;const schedule=()=>{clearTimeout(t);t=setTimeout(apply,100)};[0,150,400,800].forEach(x=>setTimeout(apply,x));document.addEventListener('click',e=>{if(e.target.closest('#adminSupportNav,#aspThreads [data-thread],#adminSupportPanel .bws-profile-nav-v3'))schedule()},true);document.addEventListener('change',e=>{if(e.target.closest('#adminSupportPanel'))schedule()},true);
})();