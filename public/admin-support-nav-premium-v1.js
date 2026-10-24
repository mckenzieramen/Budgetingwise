(()=>{'use strict';
const q=(s,p=document)=>p.querySelector(s);
function install(){
  if(q('#bwsPremiumSupportNavCss'))return;
  const s=document.createElement('style');
  s.id='bwsPremiumSupportNavCss';
  s.textContent=`
#adminSupportPanel .bws-v3-nav{padding:8px!important;gap:7px!important;background:rgba(255,255,255,.96)!important;backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important;border-bottom:1px solid #ece9f8!important;box-shadow:0 10px 24px rgba(43,36,88,.06)!important}
#adminSupportPanel .bws-v3-nav button{position:relative!important;min-width:0!important;height:46px!important;padding:6px 7px!important;border:1px solid transparent!important;border-radius:12px!important;background:transparent!important;color:#697188!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;transition:background .18s ease,border-color .18s ease,box-shadow .18s ease,transform .18s ease,color .18s ease!important;overflow:hidden!important}
#adminSupportPanel .bws-v3-nav button:hover{background:linear-gradient(180deg,#fbfaff,#f5f2ff)!important;border-color:#e6e0ff!important;color:#5338d8!important;box-shadow:0 7px 16px rgba(84,59,190,.08)!important;transform:translateY(-1px)!important}
#adminSupportPanel .bws-v3-nav button:active{transform:translateY(0) scale(.985)!important}
#adminSupportPanel .bws-v3-nav button.active{background:linear-gradient(145deg,#6547ef,#5433df)!important;border-color:#6748ef!important;color:#fff!important;box-shadow:0 8px 18px rgba(84,54,214,.24),inset 0 1px 0 rgba(255,255,255,.18)!important}
#adminSupportPanel .bws-v3-nav button.active:after{content:''!important;position:absolute!important;left:18%!important;right:18%!important;bottom:4px!important;height:2px!important;border-radius:999px!important;background:rgba(255,255,255,.78)!important;box-shadow:0 0 8px rgba(255,255,255,.45)!important}
#adminSupportPanel .bws-v3-nav .bws-premium-semantic-icon{width:25px!important;height:25px!important;flex:0 0 25px!important;border-radius:8px!important;background:linear-gradient(145deg,#fff,#f1edff)!important;color:#5d42dd!important;box-shadow:0 4px 10px rgba(83,61,182,.10),inset 0 0 0 1px #ded6ff!important;transition:transform .18s ease,box-shadow .18s ease,background .18s ease,color .18s ease!important}
#adminSupportPanel .bws-v3-nav .bws-premium-semantic-icon svg{width:14px!important;height:14px!important;stroke-width:1.75!important}
#adminSupportPanel .bws-v3-nav button:hover .bws-premium-semantic-icon{transform:scale(1.06)!important;box-shadow:0 5px 12px rgba(83,61,182,.14),inset 0 0 0 1px #d8ceff!important}
#adminSupportPanel .bws-v3-nav button.active .bws-premium-semantic-icon{background:rgba(255,255,255,.16)!important;color:#fff!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.28),0 4px 10px rgba(41,24,120,.14)!important}
#adminSupportPanel .bws-v3-nav button::before{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;background:linear-gradient(120deg,transparent 15%,rgba(255,255,255,.38) 48%,transparent 75%);transform:translateX(-70%);transition:opacity .18s ease}
#adminSupportPanel .bws-v3-nav button:hover::before{opacity:.45;animation:bwsPremiumSweep .75s ease both}
@keyframes bwsPremiumSweep{from{transform:translateX(-70%)}to{transform:translateX(70%)}}
#adminSupportPanel .bws-v3-nav button>span:not(.bws-premium-semantic-icon){position:relative;z-index:1}
@media(max-width:1240px){#adminSupportPanel .bws-v3-nav{gap:5px!important;padding:7px!important}#adminSupportPanel .bws-v3-nav button{height:44px!important;padding:5px!important}#adminSupportPanel .bws-v3-nav .bws-premium-semantic-icon{width:23px!important;height:23px!important;flex-basis:23px!important}}
`;
  document.head.appendChild(s)
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
document.addEventListener('click',e=>{if(e.target.closest('#adminSupportNav,#adminSupportPanel'))setTimeout(install,40)},true);
})();
