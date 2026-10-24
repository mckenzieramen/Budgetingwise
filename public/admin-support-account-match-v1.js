import{getApps,getApp}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import{getFirestore,doc,getDoc,collection,query,where,limit,getDocs}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';

const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];
let db=null,seq=0,last='';
const root=()=>$('#adminSupportPanel');
const clean=v=>String(v||'').trim();

async function lookup(threadId,thread){
  const direct=await getDoc(doc(db,'users',threadId)).catch(()=>null);
  if(direct?.exists())return{uid:threadId,data:direct.data(),via:'UID'};

  const email=clean(thread.customerEmail||thread.email).toLowerCase();
  if(email){
    for(const field of ['email','authEmail']){
      const snap=await getDocs(query(collection(db,'users'),where(field,'==',email),limit(1))).catch(()=>null);
      if(snap&&!snap.empty){const d=snap.docs[0];return{uid:d.id,data:d.data(),via:'Email'}}
    }
  }

  const budgetId=clean(thread.budgetId||thread.bid).toUpperCase();
  if(budgetId){
    const snap=await getDocs(query(collection(db,'users'),where('budgetId','==',budgetId),limit(1))).catch(()=>null);
    if(snap&&!snap.empty){const d=snap.docs[0];return{uid:d.id,data:d.data(),via:'BID'}}
  }
  return null
}

function setValue(drawer,label,value){
  const cell=$$('.bws-v3-cell',drawer).find(el=>clean($('span',el)?.textContent).toLowerCase()===label.toLowerCase());
  const out=cell&&$('b',cell);if(out&&value)out.textContent=value
}

function apply(threadId,thread,match){
  const drawer=$('.bws-stable-drawer-v3',root());
  if(!drawer||drawer.dataset.uid!==threadId)return;
  const u=match.data||{};
  const email=clean(u.authEmail||u.email||thread.customerEmail);
  const bid=clean(u.budgetId||thread.budgetId);
  const name=clean([u.firstName,u.lastName].filter(Boolean).join(' ')||thread.customerName||email||'Customer');

  drawer.dataset.accountUid=match.uid;
  setValue(drawer,'Customer Name',name);
  setValue(drawer,'Email',email);
  setValue(drawer,'Budget ID (BID)',bid);
  setValue(drawer,'Customer Type','Registered account');
  setValue(drawer,'Account Status',clean(u.status)||'Active');

  let badge=$('.bws-account-match',drawer);
  if(!badge){badge=document.createElement('div');badge.className='bws-account-match';$('.bws-v3-body',drawer)?.prepend(badge)}
  badge.innerHTML=`<strong>✓ Existing account found</strong><small>Matched by ${match.via}${bid?' · '+bid:''}</small>`;
}

async function sync(force=false){
  if(!db)return;
  const active=$('#aspThreads [data-thread].active',root());
  const threadId=active?.dataset.thread||'';
  if(!threadId||(!force&&threadId===last))return;
  last=threadId;const mine=++seq;
  const snap=await getDoc(doc(db,'supportThreads',threadId)).catch(()=>null);
  if(mine!==seq||!snap?.exists())return;
  const match=await lookup(threadId,snap.data()||{});
  if(mine!==seq||!match)return;
  apply(threadId,snap.data()||{},match)
}

function style(){if($('#bwsAccountMatchCss'))return;const s=document.createElement('style');s.id='bwsAccountMatchCss';s.textContent=`#adminSupportPanel .bws-account-match{margin:0 0 10px;padding:10px 12px;border:1px solid #ddd6ff;border-radius:11px;background:linear-gradient(135deg,#fbfaff,#f3f0ff)}#adminSupportPanel .bws-account-match strong{display:block;font-size:9.5px;color:#3c2bb3}#adminSupportPanel .bws-account-match small{display:block;margin-top:3px;font-size:7.8px;color:#727b90}`;document.head.appendChild(s)}

(async()=>{style();for(let i=0;i<100&&!getApps().length;i++)await new Promise(r=>setTimeout(r,50));if(!getApps().length)return;db=getFirestore(getApp());for(let i=0;i<100&&!root();i++)await new Promise(r=>setTimeout(r,50));if(!root())return;document.addEventListener('click',e=>{if(e.target.closest('#adminSupportPanel #aspThreads [data-thread]'))setTimeout(()=>sync(true),160)},true);new MutationObserver(()=>setTimeout(()=>sync(false),60)).observe(root(),{childList:true,subtree:true});sync(true)})();
