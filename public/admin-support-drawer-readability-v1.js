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
#adminSupportPanel .bws-v3-nav button{height:38px!important;padding:0 7px!important;border-radius:8px!important;font-size:8.6px!important;line-height:1.15!important;font-weight:850!important;color:#636c80!important;white-space:normal!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:5px!important}
#adminSupportPanel .bws-v3-nav button:hover{background:#f7f5ff!important;color:#563ddd!important}
#adminSupportPanel .bws-v3-nav button.active{background:#f0ecff!important;color:#5135d8!important;box-shadow:inset 0 0 0 1px #ddd5ff!important}
#adminSupportPanel .bws-v3-nav button.active:after{left:10px!important;right:10px!important;height:3px!important;background:#6544ef!important}
#adminSupportPanel .bws-v3-body{padding:13px 12px 20px!important}
#adminSupportPanel .bws-v3-card{scroll-margin-top:112px!important;margin-bottom:11px!important;padding:13px!important;border-radius:12px!important;border-color:#e3e7ef!important;box-shadow:0 4px 15px rgba(31,37,61,.045)!important}
#adminSupportPanel .bws-v3-title{margin-bottom:11px!important;padding-bottom:9px!important;align-items:flex-start!important}
#adminSupportPanel .bws-v3-title strong{font-size:11px!important;line-height:1.25!important;color:#20263a!important;display:flex!important;align-items:center!important;gap:7px!important}
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
#adminSupportPanel .bws-v3-actions button{min-height:38px!important;padding:8px 9px!important;font-size:8.5px!important;line-height:1.25!important;border-radius:9px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:6px!important}
#adminSupportPanel .bws-v3-actions .primary{min-height:40px!important}
#adminSupportPanel .bws-v3-loading{font-size:9.5px!important;line-height:1.45!important}

/* Premium semantic icon system */
#adminSupportPanel .bws-premium-semantic-icon{width:15px;height:15px;flex:0 0 15px;display:inline-grid;place-items:center;border-radius:5px;color:#5d43dd;background:linear-gradient(145deg,#f2efff,#ebe6ff);box-shadow:inset 0 0 0 1px #dfd7ff,0 2px 5px rgba(83,60,190,.08)}
#adminSupportPanel .bws-premium-semantic-icon svg{width:10px;height:10px;display:block;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
#adminSupportPanel .bws-v3-title .bws-premium-semantic-icon{width:20px;height:20px;flex-basis:20px;border-radius:6px}
#adminSupportPanel .bws-v3-title .bws-premium-semantic-icon svg{width:12px;height:12px}
#adminSupportPanel .bws-v3-nav .bws-premium-semantic-icon{width:17px;height:17px;flex-basis:17px;background:transparent;box-shadow:none}
#adminSupportPanel .bws-v3-nav button.active .bws-premium-semantic-icon{background:#fff;box-shadow:inset 0 0 0 1px #ddd5ff}
#adminSupportPanel .bws-v3-actions .primary .bws-premium-semantic-icon{color:#fff;background:#ffffff1f;box-shadow:inset 0 0 0 1px #ffffff30}
#adminSupportPanel .bws-v3-actions .danger .bws-premium-semantic-icon{color:#c73b4a;background:#fff0f2;box-shadow:inset 0 0 0 1px #ffd5db}
#adminSupportPanel .bws-v3-actions .good .bws-premium-semantic-icon{color:#14805b;background:#eaf9f1;box-shadow:inset 0 0 0 1px #cceadb}
#adminSupportPanel .bws-insight-link{display:flex!important;align-items:center!important;justify-content:center!important;gap:6px!important}

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

const paths={
  user:'<circle cx="12" cy="8" r="3"/><path d="M5.5 19c.8-3.2 3-5 6.5-5s5.7 1.8 6.5 5"/>',
  ticket:'<path d="M5 5h14v14H5z"/><path d="M8 9h8M8 12h6M8 15h4"/>',
  mail:'<rect x="4" y="6" width="16" height="12" rx="2"/><path d="m5 8 7 5 7-5"/>',
  shield:'<path d="M12 3.5 19 6v5.2c0 4.3-2.7 7.4-7 9.3-4.3-1.9-7-5-7-9.3V6z"/><path d="m9.3 12 1.8 1.8 3.8-4"/>',
  link:'<path d="M9.5 14.5 7 17a3 3 0 0 1-4.2-4.2l3-3A3 3 0 0 1 10 9"/><path d="m14.5 9.5 2.5-2.5a3 3 0 1 1 4.2 4.2l-3 3A3 3 0 0 1 14 15"/><path d="m8.5 12 7-0"/>',
  bolt:'<path d="m13 2-7 11h6l-1 9 7-12h-6z"/>',
  tools:'<path d="M14.5 5.5a4 4 0 0 0 4.8 4.8l-7.5 7.5a2.1 2.1 0 0 1-3-3l7.5-7.5a4 4 0 0 0-1.8-1.8z"/><path d="m5 4 3 3"/>',
  clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
  history:'<path d="M4 9V4h5"/><path d="M5.2 7.2A8 8 0 1 1 4.5 14"/><path d="M12 8v4l3 2"/>',
  key:'<circle cx="8" cy="12" r="3"/><path d="M11 12h9M17 12v3M14 12v2"/>',
  edit:'<path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  copy:'<rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  id:'<rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M6 16c.6-1.7 1.5-2.5 2.5-2.5S10.4 14.3 11 16M13 10h4M13 13h4"/>',
  unlock:'<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M9 10V7a3 3 0 0 1 5.5-1.7"/>',
  note:'<path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  activity:'<path d="M4 12h4l2-5 4 10 2-5h4"/>',
  signout:'<path d="M10 5H5v14h5"/><path d="M13 8l4 4-4 4M8 12h9"/>',
  alert:'<path d="M12 4 3.5 19h17z"/><path d="M12 9v4M12 16h.01"/>'
};
const svg=name=>`<span class="bws-premium-semantic-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${paths[name]||paths.bolt}</svg></span>`;

function addIcon(el,name){
  if(!el||el.dataset.semanticIcon==='1')return;
  if(el.querySelector(':scope > .bws-premium-semantic-icon')){el.dataset.semanticIcon='1';return}
  el.insertAdjacentHTML('afterbegin',svg(name));
  el.dataset.semanticIcon='1'
}

function decorate(drawer=q('#adminSupportPanel .bws-stable-drawer-v3')){
  if(!drawer)return;
  const navIcons={linked:'user',ticket:'ticket',email:'mail',account:'shield'};
  qa('.bws-v3-nav button[data-jump]',drawer).forEach(b=>addIcon(b,navIcons[b.dataset.jump]||'bolt'));

  const titleMap=[
    ['Linked Accounts / Email','link'],['Customer Information','user'],['Ticket Details','ticket'],['Quick Actions','bolt'],
    ['Additional Support Actions','tools'],['Email History','mail'],['Account Actions','shield'],['Recent Activity','clock'],['Previous Tickets','history']
  ];
  qa('.bws-v3-title strong',drawer).forEach(el=>{
    const item=titleMap.find(([label])=>el.textContent.trim()===label);
    if(item)addIcon(el,item[1])
  });

  const actionIcons={
    'email-customer':'mail',recovery:'key',key:'key',profile:'edit',copy:'copy',info:'id',bid:'id',unlock:'unlock',email:'mail',tickets:'history',notes:'note',history:'history',activity:'activity',suspend:'shield',signout:'signout'
  };
  qa('.bws-v3-actions button[data-act]',drawer).forEach(b=>addIcon(b,actionIcons[b.dataset.act]||'bolt'));
  addIcon(q('[data-open-ticket-history]',drawer),'history');
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
  if(!panel)return false;
  decorate();
  if(panel.dataset.drawerReadabilityBound==='1')return true;
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
  const mo=new MutationObserver(()=>requestAnimationFrame(()=>decorate()));
  mo.observe(panel,{childList:true,subtree:true});
  return true
}

if(!install()){
  let tries=0;
  const timer=setInterval(()=>{if(install()||++tries>100)clearInterval(timer)},80)
}
document.addEventListener('click',e=>{
  if(e.target.closest('#adminSupportNav,#adminSupportPanel #aspThreads [data-thread]'))setTimeout(()=>{install();decorate();syncActiveNav()},140)
},true);
})();
