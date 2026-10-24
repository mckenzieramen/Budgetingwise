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

async function lookupExact(value){
  const v=clean(value);if(!v)return null;
  if(v.includes('@')){
    const email=v.toLowerCase();
    for(const field of ['email','authEmail']){
      const snap=await getDocs(query(collection(db,'users'),where(field,'==',email),limit(1))).catch(()=>null);
      if(snap&&!snap.empty){const d=snap.docs[0];return{uid:d.id,data:d.data(),via:'Email'}}
    }
    return null
  }
  const bid=v.toUpperCase();
  const snap=await getDocs(query(collection(db,'users'),where('budgetId','==',bid),limit(1))).catch(()=>null);
  if(snap&&!snap.empty){const d=snap.docs[0];return{uid:d.id,data:d.data(),via:'BID'}}
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
  setValue(drawer,'Created',u.createdAt?'Synced from account':'—');

  let badge=$('.bws-account-match',drawer);
  if(!badge){badge=document.createElement('div');badge.className='bws-account-match';$('.bws-v3-body',drawer)?.prepend(badge)}
  badge.innerHTML=`<span class="bws-match-check">✓</span><div><strong>Existing account found</strong><small>Matched by ${match.via}${bid?' · '+bid:''}</small></div>`;
  const box=$('.bws-account-pullup',drawer),msg=box&&$('[data-pullup-msg]',box);
  if(msg){msg.textContent=`Account loaded${bid?' · '+bid:''}`;msg.className='bws-pullup-msg success'}
}

function mountPullup(){
  const drawer=$('.bws-stable-drawer-v3',root());
  if(!drawer)return;
  const customer=$('[data-section="customer"]',drawer);
  if(!customer||$('.bws-account-pullup',customer))return;
  const title=$('.bws-v3-title',customer);
  const box=document.createElement('div');
  box.className='bws-account-pullup';
  box.innerHTML=`<div class="bws-pullup-copy"><strong>Pull up existing account</strong><small>Search the registered customer using an exact email address or Budget ID.</small></div><div class="bws-pullup-row"><input type="text" data-pullup-input autocomplete="off" spellcheck="false" placeholder="Email or BID"><button type="button" data-pullup-btn><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg><span>Pull up account</span></button></div><small class="bws-pullup-msg" data-pullup-msg></small>`;
  title?.insertAdjacentElement('afterend',box);
  const input=$('[data-pullup-input]',box),button=$('[data-pullup-btn]',box),msg=$('[data-pullup-msg]',box);
  const run=async()=>{
    const value=clean(input.value);
    if(!value){msg.textContent='Enter the registered email or Budget ID.';msg.className='bws-pullup-msg error';input.focus();return}
    button.disabled=true;button.classList.add('loading');msg.textContent='Searching account…';msg.className='bws-pullup-msg';
    try{
      const match=await lookupExact(value);
      if(!match){msg.textContent='No exact registered account found.';msg.className='bws-pullup-msg error';return}
      const threadId=drawer.dataset.uid||$('#aspThreads [data-thread].active',root())?.dataset.thread||'';
      const ts=threadId?await getDoc(doc(db,'supportThreads',threadId)).catch(()=>null):null;
      apply(threadId,ts?.exists()?ts.data():{},match)
    }catch(e){console.warn('Manual support account lookup:',e);msg.textContent='Unable to pull up this account right now.';msg.className='bws-pullup-msg error'}
    finally{button.disabled=false;button.classList.remove('loading')}
  };
  button.onclick=run;
  input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();run()}})
}

async function sync(force=false){
  if(!db)return;
  const active=$('#aspThreads [data-thread].active',root());
  const threadId=active?.dataset.thread||'';
  if(!threadId||(!force&&threadId===last)){mountPullup();return}
  last=threadId;const mine=++seq;
  const snap=await getDoc(doc(db,'supportThreads',threadId)).catch(()=>null);
  if(mine!==seq||!snap?.exists()){mountPullup();return}
  const match=await lookup(threadId,snap.data()||{});
  if(mine!==seq)return;
  if(match)apply(threadId,snap.data()||{},match);
  mountPullup()
}

function style(){if($('#bwsAccountMatchCss'))return;const s=document.createElement('style');s.id='bwsAccountMatchCss';s.textContent=`
#adminSupportPanel .bws-account-match{display:flex;align-items:center;gap:9px;margin:0 0 10px;padding:10px 12px;border:1px solid #ddd6ff;border-radius:11px;background:linear-gradient(135deg,#fbfaff,#f3f0ff)}
#adminSupportPanel .bws-account-match .bws-match-check{width:24px;height:24px;display:grid;place-items:center;flex:0 0 24px;border-radius:8px;background:#e9e4ff;color:#5639dc;font-size:11px;font-weight:950}
#adminSupportPanel .bws-account-match strong{display:block;font-size:9.5px;color:#3c2bb3}#adminSupportPanel .bws-account-match small{display:block;margin-top:3px;font-size:7.8px;color:#727b90}
#adminSupportPanel .bws-account-pullup{margin:0 0 10px;padding:10px;border:1px solid #e3e0f3;border-radius:10px;background:linear-gradient(180deg,#fdfcff,#faf9ff)}
#adminSupportPanel .bws-pullup-copy strong{display:block;font-size:9px;font-weight:900;color:#292e45}#adminSupportPanel .bws-pullup-copy small{display:block;margin-top:2px;font-size:7px;line-height:1.45;color:#858da0}
#adminSupportPanel .bws-pullup-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px;margin-top:8px}
#adminSupportPanel .bws-pullup-row input{min-width:0;height:34px;box-sizing:border-box;padding:0 9px;border:1px solid #dddfea;border-radius:8px;background:#fff;color:#2a3047;font-size:8px;outline:none}
#adminSupportPanel .bws-pullup-row input:focus{border-color:#b9adff;box-shadow:0 0 0 3px rgba(96,68,230,.08)}
#adminSupportPanel .bws-pullup-row button{height:34px;padding:0 10px;border:0;border-radius:8px;background:linear-gradient(135deg,#6848f2,#5635dc);color:#fff;display:inline-flex;align-items:center;justify-content:center;gap:5px;font-size:7.3px;font-weight:900;white-space:nowrap;cursor:pointer;box-shadow:0 6px 14px rgba(86,53,220,.16)}
#adminSupportPanel .bws-pullup-row button svg{width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}#adminSupportPanel .bws-pullup-row button:disabled{opacity:.6;cursor:wait}
#adminSupportPanel .bws-pullup-msg{display:block;min-height:11px;margin-top:5px;font-size:7px;color:#7b8396}.bws-pullup-msg.success{color:#16845f!important}.bws-pullup-msg.error{color:#c74655!important}
`;document.head.appendChild(s)}

(async()=>{style();for(let i=0;i<100&&!getApps().length;i++)await new Promise(r=>setTimeout(r,50));if(!getApps().length)return;db=getFirestore(getApp());for(let i=0;i<100&&!root();i++)await new Promise(r=>setTimeout(r,50));if(!root())return;document.addEventListener('click',e=>{if(e.target.closest('#adminSupportPanel #aspThreads [data-thread]'))setTimeout(()=>sync(true),160)},true);new MutationObserver(()=>setTimeout(()=>sync(false),60)).observe(root(),{childList:true,subtree:true});sync(true)})();
