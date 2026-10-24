(()=>{'use strict';
const q=(s,p=document)=>p.querySelector(s),qa=(s,p=document)=>[...p.querySelectorAll(s)];
const icons={
  linked:'<circle cx="12" cy="8" r="3"/><path d="M5.5 19c.8-3.2 3-5 6.5-5s5.7 1.8 6.5 5"/>',
  ticket:'<path d="M5 5h14v14H5z"/><path d="M8 9h8M8 12h6M8 15h4"/>',
  email:'<rect x="4" y="6" width="16" height="12" rx="2"/><path d="m5 8 7 5 7-5"/>',
  account:'<path d="M12 3.5 19 6v5.2c0 4.3-2.7 7.4-7 9.3-4.3-1.9-7-5-7-9.3V6z"/><path d="m9.3 12 1.8 1.8 3.8-4"/>'
};
function ensureNavIcons(){
  const drawer=q('#adminSupportPanel .bws-stable-drawer-v3');if(!drawer)return;
  qa('.bws-v3-nav button[data-jump]',drawer).forEach(btn=>{
    let icon=q(':scope > .bws-premium-semantic-icon',btn);
    if(!icon){icon=document.createElement('span');icon.className='bws-premium-semantic-icon';icon.setAttribute('aria-hidden','true');btn.prepend(icon)}
    icon.innerHTML=`<svg viewBox="0 0 24 24">${icons[btn.dataset.jump]||icons.linked}</svg>`;
  })
}
function install(){
  if(!q('#bwsPremiumSupportNavCss')){
    const s=document.createElement('style');s.id='bwsPremiumSupportNavCss';s.textContent=`
#adminSupportPanel .asp-profile{position:relative!important}
#adminSupportPanel .bws-v3-head{position:sticky!important;top:0!important;z-index:102!important;height:58px!important;box-sizing:border-box!important;background:rgba(255,255,255,.99)!important;backdrop-filter:blur(18px) saturate(145%)!important;-webkit-backdrop-filter:blur(18px) saturate(145%)!important;border-bottom:1px solid rgba(96,72,190,.08)!important;box-shadow:0 3px 12px rgba(42,32,88,.035)!important}
#adminSupportPanel .bws-v3-nav{position:sticky!important;top:58px!important;z-index:101!important;display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;padding:8px 9px 9px!important;gap:6px!important;margin:0!important;background:rgba(255,255,255,.99)!important;backdrop-filter:blur(18px) saturate(145%)!important;-webkit-backdrop-filter:blur(18px) saturate(145%)!important;border-bottom:1px solid rgba(96,72,190,.10)!important;box-shadow:0 10px 24px rgba(42,32,88,.08)!important}
#adminSupportPanel .bws-v3-nav:before{content:''!important;position:absolute!important;left:10px!important;right:10px!important;bottom:0!important;height:1px!important;background:linear-gradient(90deg,transparent,rgba(104,72,245,.24),transparent)!important;pointer-events:none!important}
#adminSupportPanel .bws-v3-nav button{position:relative!important;min-width:0!important;min-height:58px!important;height:auto!important;padding:6px 5px 7px!important;border:1px solid transparent!important;border-radius:13px!important;background:transparent!important;color:#697188!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:4px!important;font-size:8.2px!important;line-height:1.08!important;font-weight:800!important;text-align:center!important;white-space:normal!important;overflow:visible!important;transition:background .18s ease,border-color .18s ease,box-shadow .18s ease,transform .18s ease,color .18s ease!important}
#adminSupportPanel .bws-v3-nav button:hover{background:linear-gradient(180deg,#fdfcff,#f6f3ff)!important;border-color:#e4ddff!important;color:#5137cf!important;box-shadow:0 7px 16px rgba(84,59,190,.09)!important;transform:translateY(-1px)!important}
#adminSupportPanel .bws-v3-nav button:active{transform:translateY(0) scale(.985)!important}
#adminSupportPanel .bws-v3-nav button.active{background:linear-gradient(145deg,#6849f5,#5232dc)!important;border-color:#6a4bf3!important;color:#fff!important;box-shadow:0 9px 20px rgba(84,54,214,.25),inset 0 1px 0 rgba(255,255,255,.22)!important}
#adminSupportPanel .bws-v3-nav button.active:after{content:''!important;position:absolute!important;left:24%!important;right:24%!important;bottom:4px!important;height:2px!important;border-radius:999px!important;background:rgba(255,255,255,.88)!important;box-shadow:0 0 8px rgba(255,255,255,.42)!important}
#adminSupportPanel .bws-v3-nav .bws-premium-semantic-icon{width:27px!important;height:27px!important;flex:0 0 27px!important;display:grid!important;place-items:center!important;border-radius:9px!important;background:linear-gradient(145deg,#fff,#f0ecff)!important;color:#5d42dd!important;box-shadow:0 4px 11px rgba(83,61,182,.11),inset 0 0 0 1px #ddd4ff!important}
#adminSupportPanel .bws-v3-nav .bws-premium-semantic-icon svg{width:14px!important;height:14px!important;display:block!important;fill:none!important;stroke:currentColor!important;stroke-width:1.75!important;stroke-linecap:round!important;stroke-linejoin:round!important}
#adminSupportPanel .bws-v3-nav button.active .bws-premium-semantic-icon{background:rgba(255,255,255,.17)!important;color:#fff!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.30),0 4px 10px rgba(41,24,120,.16)!important}
#adminSupportPanel .bws-v3-card{scroll-margin-top:132px!important}
@media(max-width:1240px){#adminSupportPanel .bws-v3-nav{gap:4px!important;padding:7px 7px 8px!important}#adminSupportPanel .bws-v3-nav button{min-height:56px!important;padding:5px 3px 6px!important;font-size:7.8px!important}#adminSupportPanel .bws-v3-nav .bws-premium-semantic-icon{width:25px!important;height:25px!important;flex-basis:25px!important}}
`;document.head.appendChild(s)
  }
  ensureNavIcons()
}
function refresh(){install();setTimeout(ensureNavIcons,80);setTimeout(ensureNavIcons,220);setTimeout(ensureNavIcons,500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});else refresh();
document.addEventListener('click',e=>{if(e.target.closest('#adminSupportNav,#adminSupportPanel #aspThreads [data-thread],#adminSupportPanel .bws-v3-nav'))refresh()},true);
})();
