(()=>{'use strict';
const q=(s,p=document)=>p.querySelector(s),qa=(s,p=document)=>[...p.querySelectorAll(s)];

function css(){
  if(q('#bwsDrawerReadabilityCss'))return;
  const s=document.createElement('style');
  s.id='bwsDrawerReadabilityCss';
  s.textContent=`
/* Readability layer only: do not change data ownership or ticket lifecycle. */
#adminSupportPanel .bws-stable-drawer-v3{font-size:10px!important;line-height:1.45!important}
#adminSupportPanel .bws-v3-head{height:58px!important;padding:0 14px!important;gap:11px!important}
#adminSupportPanel .bws-v3-logo{width:34px!important;height:34px!important;flex:0 0 34px!important}
#adminSupportPanel .bws-v3-head strong{font-size:12px!important;line-height:1.2!important;letter-spacing:-.1px!important}
#adminSupportPanel .bws-v3-head small{font-size:8px!important;line-height:1.3!important;margin-top:3px!important;color:#747d91!important}
#adminSupportPanel .bws-v3-nav{top:58px!important;padding:6px 8px!important;gap:4px!important;background:#fff!important;box-shadow:0 5px 13px rgba(34,39,64,.05)!important}
#adminSupportPanel .bws-v3-nav button{height:38px!important;padding:0 5px!important;border-radius:8px!important;font-size:8.6px!important;line-height:1.15!important;font-weight:850!important;color:#636c80!important;white-space:normal!important}
#adminSupportPanel .bws-v3-nav button:hover{background:#f7f5ff!important;color:#563ddd!important}
#adminSupportPanel .bws-v3-nav button.active{background:#f0ecff!important;color:#5135d8!important;box-shadow:inset 0 0 0 1px #ddd5ff!important}
#adminSupportPanel .bws-v3-nav button.active:after{left:10px!important;right:10px!important;height:3px!important;background:#6544ef!important}
#adminSupportPanel .bws-v3-body{padding:13px 12px 20px!important}
#adminSupportPanel .bws-v3-card{scroll-margin-top:112px!important;margin-bottom:11px!important;padding:13px!important;border-radius:12px!important;border-color:#e3e7ef!important;box-shadow:0 4px 15px rgba(31,37,61,.045)!important}
#adminSupportPanel .bws-v3-title{margin-bottom:11px!important;padding-bottom:9px!important;align-items:flex-start!important}
#adminSupportPanel .bws-v3-title strong{font-size:11px!important;line-height:1.25!important;color:#20263a!important}
#adminSupportPanel .bws-v3-title small{font-size:7.8px!important;line-height:1.3!important;color:#7d869a!important;max-width:48%!important}
#adminSupportPanel .bws-v3-linked{padding:10px 11px!important;margin-top:8px!important;border-radius:9px!important;gap:9px!important}
#adminSupportPanel .bws-v3-linked small{font-size:8px!important;line-height:1.25!important;color:#6f788c!important}
#adminSupportPanel .bws-v3-linked b{font-size:9.5px!important;line-height:1.35!important;margin-top:3px!important;color:#252c43!important}
#adminSupportPanel .bws-v3-badge{font-size:7.3px!important;padding:4px 7px!important}
#adminSupportPanel .bws-v3-grid{gap:8px!important}
#adminSupportPanel .bws-v3-cell{padding:9px 10px!important;border-radius:9px!important;background:#fafbfe!important}
#adminSupportPanel .bws-v3-cell span{font-size:7.8px!important;line-height:1.25!important;color:#6f788d!important;font-weight:800!important;text-transform:none!important}
#adminSupportPanel .bws-v3-cell b{font-size:9.4px!important;line-height:1.4!important;margin-top:4px!important;color:#242b42!important;font-weight:800!important}
#adminSupportPanel .bws-v3-copy{width:27px!important;height:27px!important;right:7px!important;font-size:12px!important}
#adminSupportPanel .bws-v3-cell.copyable{padding-right:39px!important}
#adminSupportPanel .bws-v3-actions{gap:8px!important}
#adminSupportPanel .bws-v3-actions button{min-height:38px!important;padding:8px!important;font-size:8.5px!important;line-height:1.25!important;border-radius:9px!important}
#adminSupportPanel .bws-v3-actions .primary{min-height:40px!important}
#adminSupportPanel .bws-v3-loading{font-size:9.5px!important;line-height:1.45!important}

/* Newly added support insights */
#adminSupportPanel .bws-insight-summary{padding:10px 11px!important;gap:10px!important}
#adminSupportPanel .bws-insight-summary strong{font-size:9.5px!important;line-height:1.3!important}
#adminSupportPanel .bws-insight-summary small{font-size:7.8px!important;line-height:1.45!important;margin-top:4px!important;color:#727c91!important}
#adminSupportPanel .bws-insight-count{min-width:32px!important;height:32px!important;font-size:10px!important}
#adminSupportPanel .bws-insight-link{min-height:37px!important;font-size:8.5px!important;margin-top:9px!important}
#adminSupportPanel .bws-activity-row{padding:2px 0 13px 21px!important;min-height:34px!important}
#adminSupportPanel .bws-activity-row:before{left:4px!important;top:6px!important;width:8px!important;height:8px!important}
#adminSupportPanel .bws-activity-row:not(:last-child):after{left:7.5px!important;top:16px!important}
#adminSupportPanel .bws-activity-row strong{font-size:9px!important;line-height:1.3!important}
#adminSupportPanel .bws-activity-row small{font-size:7.6px!important;line-height:1.45!important;margin-top:3px!important;color:#727c91!important}
#adminSupportPanel .bws-account-alert{font-size:8px!important;line-height:1.45!important;padding:10px 11px!important}

/* Better keyboard/focus visibility for support navigation. */
#adminSupportPanel .bws-v3-nav button:focus-visible,
#adminSupportPanel .bws-v3-actions button:focus-visible,
#adminSupportPanel .bws-insight-link:focus-visible,
#adminSupportPanel .bws-v3-copy:focus-visible{outline:2px solid #6747f4!important;outline-offset:2px!important}
`;
  document.head.appendChild(s)
}

function targetFor(name,drawer){
  if(name==='linked')return q('[data-section="customer"]',drawer)||q('[data-section="linked"]',drawer);
  return q(`[data-section="${name}"]`,drawer)
}

function scrollToSection(name,button){
  const drawer=button.closest('.bws-stable-drawer-v3');
  const profile=button.closest('.asp-profile');
  if(!drawer||!profile)return;
  const target=targetFor(name,drawer);
  if(!target)return;
  qa('.bws-v3-nav button',drawer).forEach(b=>b.classList.toggle('active',b===button));
  const profileBox=profile.getBoundingClientRect();
  const targetBox=target.getBoundingClientRect();
  const stickyOffset=104;
  const top=profile.scrollTop+(targetBox.top-profileBox.top)-stickyOffset;
  profile.scrollTo({top:Math.max(0,top),behavior:'smooth'});
}

function syncActiveNav(){
  const drawer=q('#adminSupportPanel .bws-stable-drawer-v3');
  const profile=q('#adminSupportPanel .asp-profile');
  if(!drawer||!profile)return;
  const nav=qa('.bws-v3-nav button[data-jump]',drawer);
  if(!nav.length)return;
  const profileTop=profile.getBoundingClientRect().top+112;
  let best=null,bestDistance=Infinity;
  nav.forEach(button=>{
    const target=targetFor(button.dataset.jump,drawer);
    if(!target)return;
    const distance=Math.abs(target.getBoundingClientRect().top-profileTop);
    if(distance<bestDistance){bestDistance=distance;best=button}
  });
  if(best)nav.forEach(b=>b.classList.toggle('active',b===best))
}

function install(){
  css();
  const panel=q('#adminSupportPanel');
  if(!panel||panel.dataset.drawerReadabilityBound==='1')return !!panel;
  panel.dataset.drawerReadabilityBound='1';
  panel.addEventListener('click',event=>{
    const button=event.target.closest('.bws-v3-nav button[data-jump]');
    if(!button)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    scrollToSection(button.dataset.jump,button)
  },true);
  const profile=q('.asp-profile',panel);
  if(profile)profile.addEventListener('scroll',()=>requestAnimationFrame(syncActiveNav),{passive:true});
  return true
}

if(!install()){
  let tries=0;
  const timer=setInterval(()=>{if(install()||++tries>100)clearInterval(timer)},80)
}
document.addEventListener('click',e=>{
  if(e.target.closest('#adminSupportNav,#adminSupportPanel #aspThreads [data-thread]'))setTimeout(()=>{install();syncActiveNav()},140)
},true);
})();
