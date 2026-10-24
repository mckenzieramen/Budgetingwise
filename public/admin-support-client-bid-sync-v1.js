import{getApps,getApp}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import{getFirestore,doc,getDoc}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';

const root=()=>document.getElementById('adminSupportPanel');
let db=null,lastUid='',seq=0;

const syncBid=async()=>{
  const r=root();
  const drawer=r?.querySelector('.bws-persistent-drawer');
  const uid=drawer?.dataset.uid||r?.querySelector('#aspProfile')?.dataset.customerUid||'';
  if(!uid||!db)return;
  const run=++seq;
  try{
    const snap=await getDoc(doc(db,'users',uid));
    if(run!==seq||!snap.exists())return;
    const bid=String(snap.data()?.budgetId||'').trim()||'—';
    const current=root()?.querySelector('.bws-persistent-drawer');
    if(!current||current.dataset.uid!==uid)return;
    const cell=[...current.querySelectorAll('.bws-info-cell')].find(x=>/budget id/i.test(x.querySelector('span')?.textContent||''));
    if(!cell)return;
    const value=cell.querySelector('b');
    const copy=cell.querySelector('[data-copy]');
    if(value)value.textContent=bid;
    if(copy)copy.dataset.value=bid==='—'?'':bid;
    current.dataset.clientBid=bid;
    lastUid=uid;
  }catch(e){console.warn('Client BID sync unavailable:',e)}
};

const boot=async()=>{
  for(let i=0;i<80&&!getApps().length;i++)await new Promise(r=>setTimeout(r,50));
  if(!getApps().length)return;
  db=getFirestore(getApp());
  for(let i=0;i<80&&!root();i++)await new Promise(r=>setTimeout(r,50));
  const r=root();if(!r)return;
  let timer=0;
  const schedule=(delay=30)=>{clearTimeout(timer);timer=setTimeout(syncBid,delay)};
  new MutationObserver(()=>{
    const uid=r.querySelector('.bws-persistent-drawer')?.dataset.uid||'';
    if(uid&&uid!==lastUid)schedule(20);
    else if(uid&&!r.querySelector('.bws-persistent-drawer')?.dataset.clientBid)schedule(40);
  }).observe(r,{childList:true,subtree:true,attributes:true,attributeFilter:['data-uid','data-customer-uid']});
  document.addEventListener('click',e=>{if(e.target.closest('#adminSupportPanel #aspThreads [data-thread]'))schedule(80)},true);
  document.addEventListener('change',e=>{if(e.target.closest('#adminSupportPanel'))schedule(120)},true);
  schedule(100);
};
boot().catch(e=>console.warn('Client BID sync unavailable:',e));
