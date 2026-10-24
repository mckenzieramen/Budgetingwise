(()=>{'use strict';
const $=(s,p=document)=>p.querySelector(s);
function style(){if($('#bwsComposerPremiumCss'))return;const s=document.createElement('style');s.id='bwsComposerPremiumCss';s.textContent=`
#adminSupportPanel #aspForm{grid-template-columns:38px minmax(0,1fr) auto 38px 42px!important;gap:8px!important;padding:10px 14px 12px!important;background:linear-gradient(180deg,#fff,#fbfbfe)!important;border-top:1px solid #e6e8f1!important;align-items:end!important}
#adminSupportPanel #aspForm.bws-composer-ready{position:relative!important}
#adminSupportPanel #aspAttach{grid-column:1!important;width:38px!important;height:44px!important;border-radius:11px!important;border:1px solid #dfe3ed!important;background:#fff!important;color:#626b82!important;font-size:18px!important;box-shadow:0 4px 12px rgba(30,35,70,.025)!important;transition:.16s ease!important}
#adminSupportPanel #aspAttach:hover{background:#f7f5ff!important;color:#5d44d8!important;border-color:#d5cff5!important;transform:translateY(-1px)}
#adminSupportPanel .bws-composer-shell{grid-column:2;min-width:0;position:relative}
#adminSupportPanel .bws-composer-shell #aspInput{width:100%!important;min-height:44px!important;max-height:132px!important;height:44px!important;padding:11px 68px 11px 12px!important;border:1px solid #dfe3ed!important;border-radius:12px!important;background:#fff!important;box-shadow:0 4px 14px rgba(31,35,66,.025)!important;transition:border-color .16s ease,box-shadow .16s ease,background .16s ease!important;box-sizing:border-box!important}
#adminSupportPanel .bws-composer-shell #aspInput:focus{border-color:#8b73f5!important;box-shadow:0 0 0 3px rgba(101,68,239,.08),0 7px 18px rgba(40,35,86,.05)!important}
#adminSupportPanel .bws-composer-meta{position:absolute;right:9px;bottom:8px;display:flex;align-items:center;gap:6px;pointer-events:none}
#adminSupportPanel .bws-char-count{font-size:7px;font-weight:800;color:#9aa0b2;letter-spacing:.02em}
#adminSupportPanel .bws-char-count.warn{color:#b7791f}#adminSupportPanel .bws-char-count.limit{color:#c74655}
#adminSupportPanel .bws-composer-hint{font-size:7px;color:#a0a6b5;white-space:nowrap}
#adminSupportPanel #aspForm .asp-state-wrap{grid-column:3;align-self:end}
#adminSupportPanel #aspStateBtn{height:44px!important;min-width:108px!important;padding:0 11px!important;border-radius:11px!important;background:#fff!important;border:1px solid #dfe3ed!important;color:#4e5870!important;box-shadow:0 4px 12px rgba(30,35,70,.025)!important}
#adminSupportPanel #aspStateBtn:before{content:'Status';display:block;font-size:6.5px;line-height:1;color:#9aa1b1;font-weight:800;margin-bottom:3px}
#adminSupportPanel .bws-replies-launch{grid-column:4;width:38px;height:44px;border:1px solid #ddd9f4;border-radius:11px;background:#f8f6ff;color:#5d44d8;display:grid;place-items:center;cursor:pointer;font-size:14px;font-weight:900;transition:.16s ease;box-shadow:0 4px 12px rgba(85,58,190,.05)}
#adminSupportPanel .bws-replies-launch:hover{background:#eeeaff;border-color:#cfc7ff;transform:translateY(-1px)}
#adminSupportPanel #aspSend{grid-column:5;width:42px!important;height:44px!important;border-radius:11px!important;display:grid!important;place-items:center!important;box-shadow:0 7px 16px rgba(89,57,218,.2)!important;transition:.16s ease!important}
#adminSupportPanel #aspSend:not(:disabled):hover{transform:translateY(-1px) scale(1.02)}
#adminSupportPanel #aspSend:disabled{opacity:.42!important;box-shadow:none!important;cursor:not-allowed!important}
#adminSupportPanel #aspSend.bws-empty-send{opacity:.72}
#adminSupportPanel #aspQuick{border-radius:14px!important;border-color:#e3e0f2!important;box-shadow:0 20px 50px rgba(36,31,75,.14)!important}
#adminSupportPanel .asp-quick-head{padding:12px!important;background:linear-gradient(180deg,#fff,#fbfaff)!important}
#adminSupportPanel .asp-quick-head strong{font-size:11px!important;color:#2d3148!important}.asp-quick-head small{font-size:8px!important}
#adminSupportPanel .asp-quick-row>button[data-quick]{padding:11px 12px!important;transition:.14s ease!important}.asp-quick-row>button[data-quick]:hover{background:#f7f4ff!important}
#adminSupportPanel .bws-composer-foot{position:absolute;left:60px;bottom:1px;font-size:6.5px;color:#a3a8b7;pointer-events:none}
@media(max-width:860px){#adminSupportPanel #aspForm{grid-template-columns:36px minmax(0,1fr) 36px 40px!important}#adminSupportPanel #aspForm .asp-state-wrap{display:none!important}#adminSupportPanel .bws-replies-launch{grid-column:3;width:36px}#adminSupportPanel #aspSend{grid-column:4}.bws-composer-hint{display:none}}
`;document.head.appendChild(s)}
function mount(){const form=$('#adminSupportPanel #aspForm'),input=$('#adminSupportPanel #aspInput'),attach=$('#adminSupportPanel #aspAttach'),send=$('#adminSupportPanel #aspSend');if(!form||!input||!attach||!send)return;if(form.dataset.premiumComposer==='1'){sync();return}form.dataset.premiumComposer='1';form.classList.add('bws-composer-ready');const shell=document.createElement('div');shell.className='bws-composer-shell';input.parentNode.insertBefore(shell,input);shell.appendChild(input);const meta=document.createElement('div');meta.className='bws-composer-meta';meta.innerHTML='<span class="bws-composer-hint">Enter to send · Shift+Enter for new line</span><span class="bws-char-count">0/800</span>';shell.appendChild(meta);const launch=document.createElement('button');launch.type='button';launch.className='bws-replies-launch';launch.title='Quick replies';launch.setAttribute('aria-label','Open quick replies');launch.textContent='⌁';form.insertBefore(launch,send);const helper=document.createElement('small');helper.className='bws-composer-foot';helper.textContent='＋ photo · ⌁ quick replies · / shortcut';form.appendChild(helper);launch.onclick=()=>{input.value='/';input.dispatchEvent(new Event('input',{bubbles:true}));input.focus()};input.addEventListener('input',sync);form.addEventListener('submit',()=>setTimeout(sync,0));attach.title='Attach photo';sync()}
function sync(){const input=$('#adminSupportPanel #aspInput'),form=$('#adminSupportPanel #aspForm'),send=$('#adminSupportPanel #aspSend'),count=$('#adminSupportPanel .bws-char-count');if(!input||!form||!send||!count)return;const n=input.value.length;count.textContent=`${n}/800`;count.classList.toggle('warn',n>=650&&n<780);count.classList.toggle('limit',n>=780);send.classList.toggle('bws-empty-send',!input.value.trim())}
function boot(){style();let tries=0;const t=setInterval(()=>{mount();if($('#adminSupportPanel #aspForm')||++tries>100)clearInterval(t)},80);document.addEventListener('click',e=>{if(e.target.closest('#adminSupportNav,#aspThreads [data-thread],#bwsSupportTabs [data-tab="chat"]'))setTimeout(mount,180)},true)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
