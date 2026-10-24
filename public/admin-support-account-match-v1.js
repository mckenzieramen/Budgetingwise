import{getApps,getApp}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import{getFirestore,doc,getDoc,collection,query,where,limit,getDocs}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';

const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];
let db=null,seq=0,last='';
const root=()=>$('#adminSupportPanel');
const clean=v=>String(v||'').trim();
const fmt=v=>{try{const d=v?.toDate?v.toDate():new Date(v);return Number.isNaN(d.getTime())?'—':d.toLocaleString([],{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'})}catch{return'—'}};
const status=v=>{const s=clean(v||'active').toLowerCase();return s?s.charAt(0).toUpperCase()+s.slice(1):'Active'};

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

function setValue(drawer,label,value,copyValue=''){
  const cell=$$('.bws-v3-cell',drawer).find(el=>clean($('span',el)?.textContent).toLowerCase()===label.toLowerCase());
  if(!cell)return;
  const out=$('b',cell);if(out)out.textContent=value||'—';
  const copy=$('[data-copy-value],.bws-v3-copy',cell);if(copy&&copyValue!==undefined){copy.dataset.copyValue=copyValue||value||'';copy.dataset.value=copyValue||value||''}
}

function setPrimaryEmail(drawer,email){
  const row=$$('.bws-v3-linked',drawer).find(el=>/primary email/i.test($('small',el)?.textContent||''));
  const out=row&&$('b',row);if(out)out.textContent=email||'—'
}

function setLoading(drawer,on,text='Loading account…'){
  if(!drawer)return;
  drawer.classList.toggle('bws-account-loading',!!on);
  let bar=$('.bws-account-loading-state',drawer);
  if(on){
    if(!bar){bar=document.createElement('div');bar.className='bws-account-loading-state';$('.bws-v3-body',drawer)?.prepend(bar)}
    bar.innerHTML=`<span class="bws-loading-spinner" aria-hidden="true"></span><div><strong>${text}</strong><small>Retrieving the registered customer record…</small></div>`
  }else bar?.remove()
}

function apply(threadId,thread,match){
  const drawer=$('.bws-stable-drawer-v3',root());
  if(!drawer||drawer.dataset.uid!==threadId)return;
  const u=match.data||{};
  const email=clean(u.authEmail||u.email||thread.customerEmail);
  const bid=clean(u.budgetId||thread.budgetId);
  const name=clean([u.firstName,u.lastName].filter(Boolean).join(' ')||thread.customerName||email||'Customer');

  drawer.dataset.accountUid=match.uid;
  drawer.dataset.accountLoaded='1';
  setValue(drawer,'Customer Name',name);
  setValue(drawer,'Email',email,email);
  setValue(drawer,'Budget ID (BID)',bid,bid);
  setValue(drawer,'Customer Type','Registered account');
  setValue(drawer,'Account Status',status(u.status));
  setValue(drawer,'Created',fmt(u.createdAt));
  setValue(drawer,'Last Login',fmt(u.lastLoginAt));
  setPrimaryEmail(drawer,email);

  let badge=$('.bws-account-match',drawer);
  if(!badge){badge=document.createElement('div');badge.className='bws-account-match';$('.bws-v3-body',drawer)?.prepend(badge)}
  badge.innerHTML=`<span class="bws-match-check">✓</span><div class="bws-match-copy"><strong>Existing account loaded</strong><small>${name}${bid?' · '+bid:''} · Matched by ${match.via}</small></div><button type="button" class="bws-match-change" data-change-match>Change account</button>`;

  const box=$('.bws-account-pullup',drawer);
  if(box)box.classList.add('matched-hidden');
  setLoading(drawer,false);
  $('[data-change-match]',badge)?.addEventListener('click',()=>{
    const current=$('.bws-account-pullup',drawer);
    if(!current)return;
    current.classList.remove('matched-hidden');
    const input=$('[data-pullup-input]',current);
    if(input){input.value='';setTimeout(()=>input.focus(),30)}
    const msg=$('[data-pullup-msg]',current);if(msg){msg.textContent='';msg.className='bws-pullup-msg'}
  });
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
  if(drawer.dataset.accountUid)box.classList.add('matched-hidden');
  const input=$('[data-pullup-input]',box),button=$('[data-pullup-btn]',box),msg=$('[data-pullup-msg]',box);
  const run=async()=>{
    const value=clean(input.value);
    if(!value){msg.textContent='Enter the registered email or Budget ID.';msg.className='bws-pullup-msg error';input.focus();return}
    const threadId=drawer.dataset.uid||$('#aspThreads [data-thread].active',root())?.dataset.thread||'';
    button.disabled=true;button.classList.add('loading');button.querySelector('span').textContent='Loading…';msg.textContent='Finding registered account…';msg.className='bws-pullup-msg';setLoading(drawer,true,'Loading customer account…');
    try{
      const match=await lookupExact(value);
      if(!match){setLoading(drawer,false);msg.textContent='No exact registered account found.';msg.className='bws-pullup-msg error';return}
      const ts=threadId?await getDoc(doc(db,'supportThreads',threadId)).catch(()=>null):null;
      if(!threadId||drawer.dataset.uid!==threadId){setLoading(drawer,false);return}
      apply(threadId,ts?.exists()?ts.data():{},match)
    }catch(e){console.warn('Manual support account lookup:',e);setLoading(drawer,false);msg.textContent='Unable to pull up this account right now.';msg.className='bws-pullup-msg error'}
    finally{button.disabled=false;button.classList.remove('loading');button.querySelector('span').textContent='Pull up account'}
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
#adminSupportPanel .bws-account-loading-state{display:flex;align-items:center;gap:10px;margin:0 0 10px;padding:11px 12px;border:1px solid #ded8ff;border-radius:11px;background:linear-gradient(135deg,#fbfaff,#f4f1ff);box-shadow:0 8px 20px rgba(83,61,182,.06)}
#adminSupportPanel .bws-account-loading-state strong{display:block;font-size:9px;color:#4030b8}#adminSupportPanel .bws-account-loading-state small{display:block;margin-top:3px;font-size:7px;color:#7d8497}
#adminSupportPanel .bws-loading-spinner{width:22px;height:22px;flex:0 0 22px;border:2px solid #ddd5ff;border-top-color:#6244e8;border-radius:50%;animation:bwsAccountSpin .72s linear infinite}@keyframes bwsAccountSpin{to{transform:rotate(360deg)}}
#adminSupportPanel .bws-account-match{display:flex;align-items:center;gap:9px;margin:0 0 10px;padding:10px 12px;border:1px solid #ddd6ff;border-radius:11px;background:linear-gradient(135deg,#fbfaff,#f3f0ff)}
#adminSupportPanel .bws-account-match .bws-match-check{width:24px;height:24px;display:grid;place-items:center;flex:0 0 24px;border-radius:8px;background:#e9e4ff;color:#5639dc;font-size:11px;font-weight:950}
#adminSupportPanel .bws-account-match .bws-match-copy{min-width:0;flex:1}
#adminSupportPanel .bws-account-match strong{display:block;font-size:9.5px;color:#3c2bb3}#adminSupportPanel .bws-account-match small{display:block;margin-top:3px;font-size:7.8px;color:#727b90;overflow-wrap:anywhere}
#adminSupportPanel .bws-match-change{flex:0 0 auto;border:1px solid #d9d1ff;border-radius:8px;background:#fff;color:#5a3ed7;padding:7px 8px;font-size:7px;font-weight:850;cursor:pointer}
#adminSupportPanel .bws-match-change:hover{background:#f5f2ff;border-color:#c9bdff}
#adminSupportPanel .bws-account-pullup{margin:0 0 10px;padding:10px;border:1px solid #e3e0f3;border-radius:10px;background:linear-gradient(180deg,#fdfcff,#faf9ff)}
#adminSupportPanel .bws-account-pullup.matched-hidden{display:none!important}
#adminSupportPanel .bws-pullup-copy strong{display:block;font-size:9px;font-weight:900;color:#292e45}#adminSupportPanel .bws-pullup-copy small{display:block;margin-top:2px;font-size:7px;line-height:1.45;color:#858da0}
#adminSupportPanel .bws-pullup-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px;margin-top:8px}
#adminSupportPanel .bws-pullup-row input{min-width:0;height:34px;box-sizing:border-box;padding:0 9px;border:1px solid #dddfea;border-radius:8px;background:#fff;color:#2a3047;font-size:8px;outline:none}
#adminSupportPanel .bws-pullup-row input:focus{border-color:#b9adff;box-shadow:0 0 0 3px rgba(96,68,230,.08)}
#adminSupportPanel .bws-pullup-row button{height:34px;padding:0 10px;border:0;border-radius:8px;background:linear-gradient(135deg,#6848f2,#5635dc);color:#fff;display:inline-flex;align-items:center;justify-content:center;gap:5px;font-size:7.3px;font-weight:900;white-space:nowrap;cursor:pointer;box-shadow:0 6px 14px rgba(86,53,220,.16)}
#adminSupportPanel .bws-pullup-row button svg{width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}#adminSupportPanel .bws-pullup-row button:disabled{opacity:.7;cursor:wait}
#adminSupportPanel .bws-pullup-msg{display:block;min-height:11px;margin-top:5px;font-size:7px;color:#7b8396}.bws-pullup-msg.success{color:#16845f!important}.bws-pullup-msg.error{color:#c74655!important}
`;document.head.appendChild(s)}

(async()=>{style();for(let i=0;i<100&&!getApps().length;i++)await new Promise(r=>setTimeout(r,50));if(!getApps().length)return;db=getFirestore(getApp());for(let i=0;i<100&&!root();i++)await new Promise(r=>setTimeout(r,50));if(!root())return;document.addEventListener('click',e=>{if(e.target.closest('#adminSupportPanel #aspThreads [data-thread]'))setTimeout(()=>sync(true),160)},true);new MutationObserver(()=>setTimeout(()=>sync(false),60)).observe(root(),{childList:true,subtree:true});sync(true)})();
