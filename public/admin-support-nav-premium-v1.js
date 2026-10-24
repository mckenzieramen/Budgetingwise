(()=>{'use strict';
const q=(s,p=document)=>p.querySelector(s);
function install(){
  if(q('#bwsPremiumSupportNavCss'))return;
  const s=document.createElement('style');
  s.id='bwsPremiumSupportNavCss';
  s.textContent=`
/* Premium frozen Customer Details header + navigation stack. */
#adminSupportPanel .bws-v3-head{
  position:sticky!important;
  top:0!important;
  z-index:92!important;
  background:rgba(255,255,255,.985)!important;
  backdrop-filter:blur(18px) saturate(145%)!important;
  -webkit-backdrop-filter:blur(18px) saturate(145%)!important;
  border-bottom:1px solid rgba(96,72,190,.08)!important;
  box-shadow:0 4px 14px rgba(42,32,88,.04)!important;
}
#adminSupportPanel .bws-v3-nav{
  position:sticky!important;
  top:50px!important;
  z-index:91!important;
  display:grid!important;
  grid-template-columns:repeat(4,minmax(0,1fr))!important;
  padding:8px 9px 9px!important;
  gap:6px!important;
  margin:0!important;
  background:rgba(255,255,255,.98)!important;
  backdrop-filter:blur(18px) saturate(145%)!important;
  -webkit-backdrop-filter:blur(18px) saturate(145%)!important;
  border-bottom:1px solid rgba(96,72,190,.10)!important;
  box-shadow:0 10px 24px rgba(42,32,88,.08)!important;
}
#adminSupportPanel .bws-v3-nav:before{
  content:''!important;
  position:absolute!important;
  left:10px!important;right:10px!important;bottom:0!important;height:1px!important;
  background:linear-gradient(90deg,transparent,rgba(104,72,245,.24),transparent)!important;
  pointer-events:none!important;
}
#adminSupportPanel .bws-v3-nav button{
  position:relative!important;
  min-width:0!important;
  min-height:58px!important;
  height:auto!important;
  padding:6px 5px 7px!important;
  border:1px solid transparent!important;
  border-radius:13px!important;
  background:transparent!important;
  color:#697188!important;
  display:flex!important;
  flex-direction:column!important;
  align-items:center!important;
  justify-content:center!important;
  gap:4px!important;
  font-size:8.2px!important;
  line-height:1.08!important;
  font-weight:800!important;
  letter-spacing:-.05px!important;
  text-align:center!important;
  white-space:normal!important;
  overflow:visible!important;
  transition:background .18s ease,border-color .18s ease,box-shadow .18s ease,transform .18s ease,color .18s ease!important;
}
#adminSupportPanel .bws-v3-nav button:hover{
  background:linear-gradient(180deg,#fdfcff,#f6f3ff)!important;
  border-color:#e4ddff!important;
  color:#5137cf!important;
  box-shadow:0 7px 16px rgba(84,59,190,.09)!important;
  transform:translateY(-1px)!important;
}
#adminSupportPanel .bws-v3-nav button:active{transform:translateY(0) scale(.985)!important}
#adminSupportPanel .bws-v3-nav button.active{
  background:linear-gradient(145deg,#6849f5,#5232dc)!important;
  border-color:#6a4bf3!important;
  color:#fff!important;
  box-shadow:0 9px 20px rgba(84,54,214,.25),inset 0 1px 0 rgba(255,255,255,.22)!important;
}
#adminSupportPanel .bws-v3-nav button.active:after{
  content:''!important;
  position:absolute!important;
  left:24%!important;right:24%!important;bottom:4px!important;
  height:2px!important;border-radius:999px!important;
  background:rgba(255,255,255,.88)!important;
  box-shadow:0 0 8px rgba(255,255,255,.42)!important;
}
#adminSupportPanel .bws-v3-nav .bws-premium-semantic-icon{
  width:27px!important;height:27px!important;flex:0 0 27px!important;
  display:grid!important;place-items:center!important;
  border-radius:9px!important;
  background:linear-gradient(145deg,#fff,#f0ecff)!important;
  color:#5d42dd!important;
  box-shadow:0 4px 11px rgba(83,61,182,.11),inset 0 0 0 1px #ddd4ff!important;
  transition:transform .18s ease,box-shadow .18s ease,background .18s ease,color .18s ease!important;
}
#adminSupportPanel .bws-v3-nav .bws-premium-semantic-icon svg{width:14px!important;height:14px!important;stroke-width:1.75!important}
#adminSupportPanel .bws-v3-nav button:hover .bws-premium-semantic-icon{transform:scale(1.055)!important;box-shadow:0 6px 13px rgba(83,61,182,.15),inset 0 0 0 1px #d5caff!important}
#adminSupportPanel .bws-v3-nav button.active .bws-premium-semantic-icon{
  background:rgba(255,255,255,.17)!important;color:#fff!important;
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.30),0 4px 10px rgba(41,24,120,.16)!important;
}
#adminSupportPanel .bws-v3-nav button::before{
  content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;
  background:linear-gradient(120deg,transparent 18%,rgba(255,255,255,.36) 49%,transparent 78%);
  transform:translateX(-70%);transition:opacity .18s ease
}
#adminSupportPanel .bws-v3-nav button:hover::before{opacity:.35;animation:bwsPremiumSweep .7s ease both}
@keyframes bwsPremiumSweep{from{transform:translateX(-70%)}to{transform:translateX(70%)}}
#adminSupportPanel .bws-v3-nav button>span:not(.bws-premium-semantic-icon){position:relative;z-index:1;max-width:100%!important;overflow:visible!important;text-overflow:clip!important}
#adminSupportPanel .bws-v3-card{scroll-margin-top:128px!important}
@media(max-width:1240px){
  #adminSupportPanel .bws-v3-nav{gap:4px!important;padding:7px 7px 8px!important}
  #adminSupportPanel .bws-v3-nav button{min-height:56px!important;padding:5px 3px 6px!important;font-size:7.8px!important}
  #adminSupportPanel .bws-v3-nav .bws-premium-semantic-icon{width:25px!important;height:25px!important;flex-basis:25px!important}
}
`;
  document.head.appendChild(s)
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
document.addEventListener('click',e=>{if(e.target.closest('#adminSupportNav,#adminSupportPanel'))setTimeout(install,40)},true);
})();
