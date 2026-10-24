import{getApps,getApp}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import{getFirestore,doc,getDoc,setDoc,serverTimestamp}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';

const $=(s,p=document)=>p.querySelector(s);
const root=()=>$('#adminSupportPanel');
const clean=v=>String(v||'').trim();
const STORE='bwSupportAccountMatchesV1';
let db=null,busy=false;

function remember(threadId,uid){
  try{const m=JSON.parse(sessionStorage.getItem(STORE)||'{}');if(uid)m[threadId]=uid;else delete m[threadId];sessionStorage.setItem(STORE,JSON.stringify(m))}catch{}
}
function customerName(u,email){return clean([u.firstName,u.lastName].filter(Boolean).join(' ')||u.displayName||u.name||email||'Customer')}
function concernText(){return clean($('#aspThreads [data-thread].active .asp-thread-copy small',root())?.textContent)||'Customer support'}
function paint(threadId,u){
  const r=root();if(!r)return;
  const email=clean(u.authEmail||u.email),bid=clean(u.budgetId),name=customerName(u,email);
  const row=$(`#aspThreads [data-thread="${CSS.escape(threadId)}"]`,r);
  if(row){const avatar=$('.asp-avatar',row),title=$('.asp-thread-copy strong',row);if(avatar)avatar.textContent=(name||email||'C')[0].toUpperCase();if(title)title.textContent=name||email||'Customer'}
  const head=$('#aspCustomer',r);if(head){const strong=$('strong',head),small=$('small',head);if(strong)strong.textContent=name||email||'Customer';if(small){const concern=concernText();small.textContent=bid?`${concern} · ${bid}`:concern}}
}
async function persist(threadId,uid){
  if(!db||!threadId||!uid||busy)return;
  busy=true;
  try{
    const userSnap=await getDoc(doc(db,'users',uid));if(!userSnap.exists())return;
    const u=userSnap.data()||{},email=clean(u.authEmail||u.email),name=customerName(u,email);
    await setDoc(doc(db,'supportThreads',threadId),{
      linkedAccountUid:uid,
      customerName:name,
      customerEmail:email,
      guest:false,
      linkedAccountUpdatedAt:serverTimestamp()
    },{merge:true});
    remember(threadId,uid);
    paint(threadId,u);
    setTimeout(()=>paint(threadId,u),180);
    setTimeout(()=>paint(threadId,u),500);
  }catch(e){console.warn('Support account link sync:',e)}finally{busy=false}
}
async function restore(threadId){
  if(!db||!threadId)return;
  try{
    const t=await getDoc(doc(db,'supportThreads',threadId));if(!t.exists())return;
    const uid=clean(t.data()?.linkedAccountUid);if(!uid)return;
    const u=await getDoc(doc(db,'users',uid));if(!u.exists())return;
    remember(threadId,uid);paint(threadId,u.data()||{});
  }catch(e){console.warn('Support linked account restore:',e)}
}
async function afterPullup(){
  const r=root(),drawer=$('.bws-stable-drawer-v3',r),threadId=drawer?.dataset.uid||$('#aspThreads [data-thread].active',r)?.dataset.thread||'';
  if(!threadId)return;
  for(let i=0;i<12;i++){
    await new Promise(res=>setTimeout(res,i?120:80));
    const uid=clean($('.bws-stable-drawer-v3',r)?.dataset.accountUid);
    if(uid){await persist(threadId,uid);return}
  }
}
(async()=>{
  for(let i=0;i<100&&!getApps().length;i++)await new Promise(r=>setTimeout(r,50));
  if(!getApps().length)return;db=getFirestore(getApp());
  document.addEventListener('click',e=>{
    if(e.target.closest('#adminSupportPanel [data-pullup-btn]'))setTimeout(afterPullup,0);
    const row=e.target.closest('#adminSupportPanel #aspThreads [data-thread]');if(row)setTimeout(()=>restore(row.dataset.thread),180);
  },true);
  const active=$('#adminSupportPanel #aspThreads [data-thread].active');if(active)restore(active.dataset.thread);
})();
