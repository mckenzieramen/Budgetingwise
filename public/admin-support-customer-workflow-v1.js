(()=>{'use strict';
const root=()=>document.getElementById('adminSupportPanel');
const copySvg='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M5 15H4.5A2.5 2.5 0 0 1 2 12.5v-8A2.5 2.5 0 0 1 4.5 2h8A2.5 2.5 0 0 1 15 4.5V5"/></svg>';
function css(){if(document.getElementById('bwsCustomerWorkflowCss'))return;const s=document.createElement('style');s.id='bwsCustomerWorkflowCss';s.textContent=`
#adminSupportPanel .bws-info-item-v3{position:relative!important;padding-right:34px!important}
#adminSupportPanel .bws-inline-copy{position:absolute;right:7px;top:50%;transform:translateY(-8%);width:24px;height:24px;border:1px solid #ddd7fa;border-radius:7px;background:#fff;color:#5b43df;display:grid;place-items:center;cursor:pointer;transition:.15s ease}
#adminSupportPanel .bws-inline-copy:hover{background:#f3efff;border-color:#cfc5ff}
#adminSupportPanel .bws-inline-copy svg{width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
#adminSupportPanel .bws-inline-copy.copied{background:#ecfdf5;color:#0f8a5f;border-color:#bfe8d6}
#adminSupportPanel .bws-support-actions-v1{order:3;padding:12px;border:1px solid #e8e9f1;border-radius:12px;background:#fff;box-shadow:none}
#adminSupportPanel .bws-support-actions-v1 .bws-section-title{display:flex;align-items:center;justify-content:space-between;margin-bottom:9px!important}
#adminSupportPanel .bws-support-actions-grid-v1{display:grid;grid-template-columns:1fr 1fr;gap:6px}
#adminSupportPanel .bws-support-actions-grid-v1 button{min-height:34px;border:1px solid #ddd7fa;border-radius:9px;background:#fff;color:#5038c5;padding:7px 6px;font-size:6.8px;font-weight:850;cursor:pointer;white-space:normal;line-height:1.2}
#adminSupportPanel .bws-support-actions-grid-v1 button:hover{background:#f7f5ff;border-color:#cfc5ff}
#adminSupportPanel .bws-support-actions-grid-v1 button.primary{grid-column:1/-1;background:#f3efff;color:#5038c5;border-color:#d8d0ff}
#adminSupportPanel #bwsProfileExtras>.bws-email-history-v3{order:4!important}
#adminSupportPanel #bwsProfileExtras>.bws-account-actions{order:5!important}
#adminSupportPanel #bwsProfileExtras>.bws-view-profile{order:6!important}
#adminSupportPanel .bws-account-actions .bws-actions-grid button.bws-workflow-duplicate{display:none!important}
#adminSupportPanel .bws-account-actions .bws-actions-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
#adminSupportPanel .bws-account-actions .bws-section-title small{max-width:48%;text-align:right}
#adminSupportPanel .bws-workflow-toast{position:fixed;right:22px;bottom:22px;z-index:99999;padding:9px 12px;border-radius:9px;background:#24283b;color:#fff;font:700 11px Inter,ui-sans-serif,sans-serif;box-shadow:0 10px 26px rgba(25,30,50,.22);opacity:0;transform:translateY(8px);pointer-events:none;transition:.18s ease}
#adminSupportPanel .bws-workflow-toast.show{opacity:1;transform:translateY(0)}
@media(max-width:1250px){#adminSupportPanel .bws-support-actions-grid-v1{grid-template-columns:1fr}}
`;
document.head.appendChild(s)}
function toast(msg){const r=root();if(!r)return;let t=r.querySelector('.bws-workflow-toast');if(!t){t=document.createElement('div');t.className='bws-workflow-toast';r.appendChild(t)}t.textContent=msg;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),1400)}
async function copy(value,label,btn){if(!value||value==='—'||/guest/i.test(value)){toast(`${label} is not available.`);return}try{await navigator.clipboard.writeText(value);btn?.classList.add('copied');toast(`${label} copied.`);setTimeout(()=>btn?.classList.remove('copied'),900)}catch{toast(`Unable to copy ${label.toLowerCase()}.`)}}
function decorateCopies(r){r.querySelectorAll('.bws-client-info-v3 .bws-info-item-v3').forEach(item=>{const label=(item.querySelector('span')?.textContent||'').trim().toLowerCase();if(!label.includes('budget id')&&!label.includes('email'))return;const value=(item.querySelector('b')?.textContent||'').trim();let b=item.querySelector('.bws-inline-copy');if(!b){b=document.createElement('button');b.type='button';b.className='bws-inline-copy';b.innerHTML=copySvg;item.appendChild(b)}const nice=label.includes('budget id')?'Budget ID':'Email';b.title=`Copy ${nice}`;b.setAttribute('aria-label',`Copy ${nice}`);b.onclick=()=>copy(value,nice,b)})}
function proxy(account,key){account?.querySelector(`[data-aa="${key}"]`)?.click()}
function supportActions(r){const extras=r.querySelector('#bwsProfileExtras'),quick=extras?.querySelector('.bws-quick-actions-v3'),account=extras?.querySelector('.bws-account-actions');if(!extras||!quick||!account)return;let box=extras.querySelector('.bws-support-actions-v1');if(!box){box=document.createElement('section');box.className='bws-support-actions-v1';box.innerHTML='<div class="bws-section-title"><strong>Support Actions</strong><small>Tools to resolve customer concerns</small></div><div class="bws-support-actions-grid-v1"><button type="button" data-support="info">Resend account info</button><button type="button" data-support="unlock">Unlock account</button><button type="button" data-support="tickets">View ticket history</button><button type="button" data-support="notes">Open internal notes</button></div>';quick.insertAdjacentElement('afterend',box);box.querySelector('[data-support="info"]').onclick=()=>proxy(account,'info');box.querySelector('[data-support="unlock"]').onclick=()=>proxy(account,'unlock');box.querySelector('[data-support="tickets"]').onclick=()=>r.querySelector('#bwsSupportTabs [data-tab="tickets"]')?.click();box.querySelector('[data-support="notes"]').onclick=()=>r.querySelector('#bwsSupportTabs [data-tab="notes"]')?.click()}
const duplicates=new Set(['profile','recovery','key','info','copy','activity','unlock']);account.querySelectorAll('.bws-actions-grid [data-aa]').forEach(b=>b.classList.toggle('bws-workflow-duplicate',duplicates.has(b.dataset.aa)));
const title=account.querySelector('.bws-section-title strong'),small=account.querySelector('.bws-section-title small');if(title)title.textContent='Account & Security';if(small)small.textContent='Profile, login and risk controls';
let copyDetails=quick.querySelector('[data-workflow-copy]');if(!copyDetails){copyDetails=document.createElement('button');copyDetails.type='button';copyDetails.dataset.workflowCopy='1';copyDetails.textContent='Copy account details';copyDetails.onclick=()=>proxy(account,'copy');quick.querySelector('.bws-quick-grid-v3')?.appendChild(copyDetails)}}
function apply(){const r=root();if(!r||r.classList.contains('hidden'))return;css();decorateCopies(r);supportActions(r)}
let timer=0;const schedule=(d=80)=>{clearTimeout(timer);timer=setTimeout(apply,d)};const burst=()=>[0,120,320,700].forEach(x=>setTimeout(apply,x));if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',burst,{once:true});else burst();document.addEventListener('click',e=>{if(e.target.closest('#adminSupportPanel,#adminSupportNav'))schedule(120)},true);document.addEventListener('change',e=>{if(e.target.closest('#adminSupportPanel'))schedule(120)},true);
})();