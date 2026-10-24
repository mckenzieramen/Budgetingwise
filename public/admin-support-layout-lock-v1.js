(()=>{'use strict';
const KEY='bwAdminSupportLayoutLockedV1';
const q=(s,p=document)=>p.querySelector(s);
const read=()=>{try{return localStorage.getItem(KEY)==='1'}catch{return false}};
const write=v=>{try{localStorage.setItem(KEY,v?'1':'0')}catch{}};
function style(){if(q('#bwsSupportLayoutLockCss'))return;const s=document.createElement('style');s.id='bwsSupportLayoutLockCss';s.textContent=`
#bwsSupportLayoutLock{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 10px;border:1px solid #ded9f7;border-radius:10px;background:#fff;color:#5b46c9;font-size:8px;font-weight:900;cursor:pointer;box-shadow:0 3px 10px rgba(55,43,112,.05);transition:.15s ease}
#bwsSupportLayoutLock:hover{border-color:#c6bcf5;background:#faf9ff}
#bwsSupportLayoutLock svg{width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
#bwsSupportLayoutLock[aria-pressed="true"]{background:#f1edff;border-color:#cfc4ff;color:#5338d4}
#adminSupportPanel.bws-support-layout-locked .asp-layout{transition:none!important}
#adminSupportPanel.bws-support-layout-locked .asp-profile{transition:none!important}
#adminSupportPanel.bws-support-layout-locked .client-drawer-resizer,#adminSupportPanel.bws-support-layout-locked [data-layout-resize]{display:none!important;pointer-events:none!important}
#adminSupportPanel.bws-support-layout-locked [data-layout-drag]{pointer-events:none!important}
`;document.head.appendChild(s)}
function icon(locked){return locked?'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"></rect><path d="M9 10V7a4 4 0 0 1 7.4-2"></path></svg>'}
function apply(panel,locked){panel.classList.toggle('bws-support-layout-locked',locked);panel.dataset.layoutLocked=locked?'1':'0';const b=q('#bwsSupportLayoutLock');if(b){b.setAttribute('aria-pressed',locked?'true':'false');b.innerHTML=icon(locked)+`<span>${locked?'Layout locked':'Lock layout'}</span>`;b.title=locked?'Unlock Chat Support layout':'Lock finalized Chat Support layout'}}
function mount(){style();const panel=q('#adminSupportPanel'),head=q('#adminSupportPanel .asp-page-head');if(!panel||!head)return false;let b=q('#bwsSupportLayoutLock');if(!b){b=document.createElement('button');b.id='bwsSupportLayoutLock';b.type='button';b.setAttribute('aria-label','Lock Chat Support layout');const summary=q('.asp-summary',head);if(summary)head.insertBefore(b,summary);else head.appendChild(b);b.onclick=()=>{const next=!panel.classList.contains('bws-support-layout-locked');write(next);apply(panel,next)}}apply(panel,read());return true}
if(!mount()){let n=0;const t=setInterval(()=>{if(mount()||++n>80)clearInterval(t)},80)}
document.addEventListener('click',e=>{if(e.target.closest('#adminSupportNav'))setTimeout(mount,80)},true)
})();