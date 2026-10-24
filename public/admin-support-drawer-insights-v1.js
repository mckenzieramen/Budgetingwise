import{getApps,getApp}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import{getFirestore,collection,getDocs,doc,getDoc}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';

const KEY='bwSupportSelectedUid';
const q=(s,p=document)=>p.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const millis=v=>{try{return v?.toMillis?.()||v?.toDate?.()?.getTime?.()||new Date(v).getTime()||0}catch{return 0}};
const fmt=v=>{try{const d=v?.toDate?.()||new Date(v);return Number.isNaN(d.getTime())?'—':d.toLocaleString([],{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})}catch{return'—'}};
let db=null,lastUid='',token=0;

function css(){
  if(q('#bwsDrawerInsightsCss'))return;
  const s=document.createElement('style');
  s.id='bwsDrawerInsightsCss';
  s.textContent=`
#adminSupportPanel .bws-insight-summary{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;padding:8px 9px;border:1px solid #edf0f5;border-radius:9px;background:#fbfcff}
#adminSupportPanel .bws-insight-summary strong{display:block;font-size:8px;color:#2b3148}#adminSupportPanel .bws-insight-summary small{display:block;margin-top:2px;font-size:6.2px;color:#858ea3;line-height:1.35}
#adminSupportPanel .bws-insight-count{min-width:28px;height:28px;padding:0 7px;display:grid;place-items:center;border-radius:9px;background:#f0edff;color:#5b3fe0;font-size:9px;font-weight:900}
#adminSupportPanel .bws-insight-link{margin-top:7px;width:100%;min-height:31px;border:1px solid #ded8fa;border-radius:8px;background:#fff;color:#553dd2;font-size:6.7px;font-weight:850;cursor:pointer}
#adminSupportPanel .bws-activity-list{display:grid;gap:0}.bws-activity-row{position:relative;padding:1px 0 10px 18px;min-height:27px}.bws-activity-row:last-child{padding-bottom:0}.bws-activity-row:before{content:'';position:absolute;left:4px;top:5px;width:7px;height:7px;border-radius:50%;background:#6847f4;box-shadow:0 0 0 3px #f0edff}.bws-activity-row:not(:last-child):after{content:'';position:absolute;left:7px;top:14px;bottom:0;width:1px;background:#e7e3f7}
#adminSupportPanel .bws-activity-row strong{display:block;font-size:7.2px;color:#30364d}.bws-activity-row small{display:block;margin-top:2px;font-size:6.1px;color:#8a92a4;line-height:1.35}
#adminSupportPanel .bws-account-alert{margin-bottom:8px;padding:8px 9px;border-radius:9px;background:#fff8eb;border:1px solid #f7dfad;color:#966112;font-size:6.6px;font-weight:800;line-height:1.4}
`;
  document.head.appendChild(s)
}

function selectedUid(){
  try{return sessionStorage.getItem(KEY)||q('#adminSupportPanel #aspThreads [data-thread].active')?.dataset?.thread||''}catch{return q('#adminSupportPanel #aspThreads [data-thread].active')?.dataset?.thread||''}
}

async function history(uid){
  try{
    const snap=await getDocs(collection(db,'supportThreads',uid,'ticketHistory'));
    return snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(Number(b.ticketNumber)||millis(b.closedAt))-(Number(a.ticketNumber)||millis(a.closedAt)))
  }catch{return[]}
}

function activity(thread,h){
  const rows=[];
  const push=(label,time,detail)=>{if(time)rows.push({label,time,detail})};
  push('Current ticket started',thread.ticketStartedAt||thread.createdAt,thread.concernLabel||'Support conversation');
  if(thread.updatedAt&&millis(thread.updatedAt)!==millis(thread.ticketStartedAt||thread.createdAt))push('Latest ticket activity',thread.updatedAt,thread.lastSender==='admin'?'Last update from support':'Last update from customer');
  if(String(thread.status||'').toLowerCase()==='closed')push('Ticket closed',thread.closedAt||thread.updatedAt,'Conversation is read-only');
  const latest=h[0];
  if(latest?.closedAt)push('Previous ticket closed',latest.closedAt,latest.concernLabel||latest.ticketId||'Previous support ticket');
  return rows.sort((a,b)=>millis(b.time)-millis(a.time)).slice(0,4)
}

function render(uid,thread,h){
  if(uid!==selectedUid())return;
  const body=q('#adminSupportPanel .bws-stable-drawer-v3 .bws-v3-body');
  if(!body)return;
  q('#bwsSupportInsights',body)?.remove();
  const wrap=document.createElement('div');
  wrap.id='bwsSupportInsights';
  const recent=activity(thread,h);
  const latest=h[0];
  const accountState=String(thread.accountStatus||'').toLowerCase();
  wrap.innerHTML=`
<section class="bws-v3-card" data-section="activity"><div class="bws-v3-title"><strong>Recent Activity</strong><small>Support timeline</small></div>${recent.length?`<div class="bws-activity-list">${recent.map(x=>`<div class="bws-activity-row"><strong>${esc(x.label)}</strong><small>${esc(fmt(x.time))}${x.detail?' · '+esc(x.detail):''}</small></div>`).join('')}</div>`:'<div class="bws-insight-summary"><div><strong>No recent activity yet</strong><small>New support events will appear here.</small></div></div>'}</section>
<section class="bws-v3-card" data-section="previous"><div class="bws-v3-title"><strong>Previous Tickets</strong><small>Closed history</small></div><div class="bws-insight-summary"><div><strong>${h.length?esc(latest?.concernLabel||'Previous support ticket'):'No previous closed tickets'}</strong><small>${h.length?`${esc(latest?.ticketId||('Ticket #'+(latest?.ticketNumber||'')))} · ${esc(fmt(latest?.closedAt))}`:'This customer has no archived ticket history yet.'}</small></div><span class="bws-insight-count">${h.length}</span></div><button class="bws-insight-link" type="button" data-open-ticket-history>Open full ticket history</button></section>`;
  const account=q('[data-section="account"]',body);
  if(account)body.insertBefore(wrap,account);else body.appendChild(wrap);
  q('[data-open-ticket-history]',wrap)?.addEventListener('click',()=>q('#bwsSupportTabs [data-tab="tickets"]')?.click());
}

async function sync(force=false){
  if(!db)return;
  const uid=selectedUid();
  if(!uid)return;
  if(!force&&uid===lastUid&&q('#bwsSupportInsights'))return;
  lastUid=uid;
  const mine=++token;
  const [ts,h]=await Promise.all([getDoc(doc(db,'supportThreads',uid)).catch(()=>null),history(uid)]);
  if(mine!==token||uid!==selectedUid())return;
  render(uid,ts?.exists()?ts.data():{},h)
}

function watch(){
  css();
  const target=q('#adminSupportPanel');
  if(!target)return false;
  const mo=new MutationObserver(()=>{if(q('.bws-stable-drawer-v3 .bws-v3-body',target))sync(false).catch(()=>{})});
  mo.observe(target,{childList:true,subtree:true});
  document.addEventListener('click',e=>{if(e.target.closest('#adminSupportPanel #aspThreads [data-thread],#adminSupportNav'))setTimeout(()=>sync(true).catch(()=>{}),120)},true);
  document.addEventListener('change',e=>{if(e.target.closest('#adminSupportPanel'))setTimeout(()=>sync(true).catch(()=>{}),120)},true);
  sync(true).catch(()=>{});
  return true
}

(async()=>{
  for(let i=0;i<100&&!getApps().length;i++)await new Promise(r=>setTimeout(r,50));
  if(!getApps().length)return;
  db=getFirestore(getApp());
  for(let i=0;i<100&&!q('#adminSupportPanel');i++)await new Promise(r=>setTimeout(r,50));
  watch()
})().catch(e=>console.warn('Support drawer insights unavailable:',e));
