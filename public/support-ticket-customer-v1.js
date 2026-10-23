import{getApps}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import{getAuth,onAuthStateChanged}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';
import{getFirestore,doc,getDoc,setDoc,collection,addDoc,getDocs,query,orderBy,onSnapshot,serverTimestamp}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';

const q=(s,p=document)=>p.querySelector(s);
const qa=(s,p=document)=>[...p.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isAdmin=()=>!!document.getElementById('adminApp')||/^\/admin(?:\/|$)/i.test(location.pathname);
const ticketId=(uid,n)=>`BW-${String(uid||'USER').slice(-4).toUpperCase()}-${String(n).padStart(4,'0')}`;
const normalize=s=>s==='solved'?'closed':(s||'open');
let stopThread=null,currentUid='',historyState='';

function defaultApp(){return getApps().find(a=>a.name==='[DEFAULT]')||null}
function services(){const app=defaultApp();if(!app)return null;const auth=getAuth(app),user=auth.currentUser;if(!user||user.isAnonymous)return null;return{app,auth,user,db:getFirestore(app)}}

function addStyles(){
  if(q('#bwCustomerTicketStyles'))return;
  const style=document.createElement('style');style.id='bwCustomerTicketStyles';style.textContent=`
.bw-recovery-followup-actions{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important;margin-top:10px!important}.bw-recovery-followup-actions button{min-height:42px!important;padding:9px 11px!important;border:1px solid #ddd7f6!important;border-radius:12px!important;background:#fff!important;color:#4f38c7!important;font-size:9px!important;font-weight:800!important;cursor:pointer!important;box-shadow:0 5px 13px rgba(69,52,145,.07)!important;transition:.16s ease!important}.bw-recovery-followup-actions button:first-child{border:0!important;background:linear-gradient(135deg,#6f52f5,#5435dc)!important;color:#fff!important;box-shadow:0 7px 17px rgba(84,53,220,.21)!important}.bw-recovery-followup-actions button:hover{transform:translateY(-1px)!important}.bw-recovery-followup-actions button:disabled{opacity:.58!important;cursor:wait!important;transform:none!important}
#bwCustomerHistoryBar{display:flex;align-items:center;justify-content:flex-end;padding:7px 11px;border-bottom:1px solid #efecf8;background:rgba(255,255,255,.78)}#bwCustomerHistoryButton{border:1px solid #e1dcf7;border-radius:9px;background:#fff;color:#5a43d1;padding:6px 9px;font:800 9px inherit;cursor:pointer;box-shadow:0 3px 10px rgba(68,50,145,.06)}#bwCustomerHistoryButton span{display:inline-grid;place-items:center;min-width:16px;height:16px;margin-left:5px;padding:0 4px;border-radius:99px;background:#f0edff;color:#573ed1;font-size:8px}
.bw-history-modal{position:fixed;inset:0;z-index:100000;background:rgba(24,20,45,.5);display:grid;place-items:center;padding:18px}.bw-history-card{width:min(560px,96vw);max-height:82vh;overflow:auto;background:#fff;border-radius:18px;padding:17px;box-shadow:0 26px 80px rgba(0,0,0,.22)}.bw-history-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.bw-history-head strong{display:block;font-size:15px;color:#24203b}.bw-history-head small{display:block;margin-top:3px;color:#858096;font-size:9px}.bw-history-close{border:0;background:none;font-size:23px;cursor:pointer;color:#777089}.bw-history-list{display:grid;gap:8px;margin-top:13px}.bw-history-ticket{width:100%;text-align:left;border:1px solid #ebe7f8;border-radius:12px;background:#fff;padding:11px;cursor:pointer}.bw-history-ticket:hover{border-color:#cec5fb;background:#fcfbff}.bw-history-ticket b{display:block;color:#513ac9;font-size:9px}.bw-history-ticket strong{display:block;margin-top:3px;color:#28243d;font-size:11px}.bw-history-ticket small{display:block;margin-top:4px;color:#8b869b;font-size:9px}.bw-history-messages{margin-top:12px}.bw-history-back{border:0;background:none;color:#5c43d1;font:800 9px inherit;cursor:pointer;padding:4px 0 10px}.bw-history-msg{margin:7px 0;padding:9px 11px;border-radius:11px;background:#f7f6fb;font-size:10px;line-height:1.45}.bw-history-msg.admin{background:#f0edff}.bw-history-msg strong{display:block;font-size:8px;margin-bottom:3px}.bw-history-empty{padding:16px 4px;text-align:center;color:#8a8598;font-size:10px}@media(max-width:380px){.bw-recovery-followup-actions{grid-template-columns:1fr!important}}
`;
  document.head.appendChild(style)
}

async function currentTicketMessages(db,uid){
  const snap=await getDocs(query(collection(db,'supportThreads',uid,'messages'),orderBy('createdAt','asc')));
  const rows=snap.docs.map(x=>{const m=x.data();return{sender:m.sender||'customer',text:m.text||'',imageData:m.imageData||'',system:!!m.system,createdAt:m.createdAt?.toMillis?.()||Date.now()}});
  let marker=-1;rows.forEach((m,i)=>{if(m.system&&/A new support conversation has been started\./i.test(m.text||''))marker=i});
  return rows.slice(marker+1)
}

async function archiveCurrent(db,uid,thread){
  if(!thread||normalize(thread.status)!=='closed'||thread.archivedCurrentTicket)return false;
  const number=Math.max(1,Number(thread.ticketNumber||1)),id=thread.currentTicketId||ticketId(uid,number),messages=await currentTicketMessages(db,uid);
  await setDoc(doc(db,'supportThreads',uid,'ticketHistory',String(number).padStart(6,'0')),{ticketNumber:number,ticketId:id,concernLabel:thread.concernLabel||'Support Concern',requestType:thread.requestType||'general',closedAt:thread.closedAt||thread.updatedAt||serverTimestamp(),messages,createdAt:thread.ticketStartedAt||thread.createdAt||null},{merge:true});
  await setDoc(doc(db,'supportThreads',uid),{archivedCurrentTicket:true,currentTicketId:id},{merge:true});
  return true
}

async function closeTicket(s){
  const ref=doc(s.db,'supportThreads',s.user.uid);
  await setDoc(ref,{status:'closed',customerCanReply:false,customerUnread:false,adminUnread:false,closedAt:serverTimestamp(),updatedAt:serverTimestamp()},{merge:true});
  const snap=await getDoc(ref);if(snap.exists())await archiveCurrent(s.db,s.user.uid,snap.data())
}

async function startNewTicket(s){
  const ref=doc(s.db,'supportThreads',s.user.uid);let snap=await getDoc(ref),t=snap.exists()?snap.data():{};
  if(normalize(t.status)!=='closed'){await setDoc(ref,{status:'closed',customerCanReply:false,closedAt:serverTimestamp(),updatedAt:serverTimestamp()},{merge:true});snap=await getDoc(ref);t=snap.exists()?snap.data():{...t,status:'closed'}}
  await archiveCurrent(s.db,s.user.uid,t);
  const next=Math.max(1,Number(t.ticketNumber||1)+1),id=ticketId(s.user.uid,next);
  await setDoc(ref,{ticketNumber:next,currentTicketId:id,archivedCurrentTicket:false,requestType:'new-conversation',concernLabel:'Choose a concern',rating:null,status:'open',customerCanReply:true,customerUnread:false,adminUnread:false,lastSender:'customer',closedAt:null,ticketStartedAt:serverTimestamp(),updatedAt:serverTimestamp()},{merge:true});
  await addDoc(collection(s.db,'supportThreads',s.user.uid,'messages'),{sender:'customer',text:'A new support conversation has been started.',system:true,createdAt:serverTimestamp()});
  return{id,number:next}
}

function picker(){return `<div class="bw-support-message agent bw-workflow-picker"><div><p><strong class="bw-flow-title">What can we help you with?</strong><span class="bw-flow-sub">This is a new ticket. Please choose one concern for this conversation.</span></p><div class="bw-support-quick-actions"><button type="button" data-flow="activation">🔑 Activation key</button><button type="button" data-flow="account">👤 Account / login</button><button type="button" data-flow="budgeting">📊 Budgeting feature</button><button type="button" data-flow="general">💬 General question</button><button type="button" data-flow="error">⚠️ Report an error</button><button type="button" data-flow="suggestion">✨ Share a suggestion</button></div><time>Budgetingwise Support Bot</time></div></div>`}
function unlock(){const i=q('#bwSupportInput'),b=q('#bwSupportSend')||q('#bwSupportForm button[type="submit"]');if(i){i.disabled=false;i.readOnly=false;i.placeholder='Type your message…';i.style.pointerEvents='auto'}if(b)b.disabled=false}
function showNewTicket(){const m=q('#bwSupportMessages');if(!m)return;q('.bw-forgot-workflow',m)?.remove();q('.bw-workflow-picker',m)?.remove();m.insertAdjacentHTML('beforeend',picker());m.scrollTop=m.scrollHeight;unlock()}

function installAutomationChoiceGuard(){
  if(document.documentElement.dataset.bwAutomationChoiceGuard)return;document.documentElement.dataset.bwAutomationChoiceGuard='1';
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-recovery-more]');if(!button)return;
    const choice=button.dataset.recoveryMore;if(choice!=='yes'&&choice!=='no')return;
    event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
    const s=services();if(!s)return;
    const original=button.textContent;button.disabled=true;button.textContent=choice==='yes'?'Opening new ticket…':'Closing ticket…';
    (choice==='yes'?startNewTicket(s):closeTicket(s)).then(async()=>{await refreshHistory(s);if(choice==='yes')showNewTicket();else q('.bw-recovery-followup')?.remove()}).catch(error=>{button.disabled=false;button.textContent=original;const msg=q('[data-recovery-followup-msg]');if(msg){msg.textContent=error?.message||'Unable to update this ticket.';msg.style.color='#b73f4d'}})
  },true)
}

function polishAutomationButtons(){const f=q('.bw-recovery-followup');if(!f)return;const y=q('[data-recovery-more="yes"]',f),n=q('[data-recovery-more="no"]',f);if(y)y.textContent='Yes, another concern';if(n)n.textContent='No, close ticket'}

async function tickets(s){const snap=await getDocs(query(collection(s.db,'supportThreads',s.user.uid,'ticketHistory'),orderBy('ticketNumber','desc')));return snap.docs.map(d=>({id:d.id,...d.data()}))}
function age(v){try{const d=v?.toDate?.()||new Date(v),days=Math.max(0,Math.floor((Date.now()-d.getTime())/86400000));return days===0?'Closed today':days===1?'Closed 1 day ago':`Closed ${days} days ago`}catch{return'Closed'}}

function historyModal(items){
  q('.bw-history-modal')?.remove();const modal=document.createElement('div');modal.className='bw-history-modal';modal.innerHTML=`<section class="bw-history-card"><div class="bw-history-head"><div><strong>Chat history</strong><small>Your previous closed Budgetingwise support tickets.</small></div><button type="button" class="bw-history-close">×</button></div><div class="bw-history-list"></div></section>`;const list=q('.bw-history-list',modal);
  const render=()=>{list.innerHTML=items.length?items.map(t=>`<button type="button" class="bw-history-ticket" data-ticket="${esc(t.id)}"><b>${esc(t.ticketId||'Support Ticket')}</b><strong>${esc(t.concernLabel||'Support Concern')}</strong><small>${esc(age(t.closedAt))} · Closed</small></button>`).join(''):'<div class="bw-history-empty">No closed tickets yet.</div>';qa('[data-ticket]',list).forEach(b=>b.onclick=()=>{const t=items.find(x=>x.id===b.dataset.ticket);if(!t)return;list.innerHTML=`<button class="bw-history-back" type="button">← Back to ticket history</button><div><b style="color:#513ac9;font-size:9px">${esc(t.ticketId||'Support Ticket')}</b><strong style="display:block;margin-top:4px;color:#28243d">${esc(t.concernLabel||'Support Concern')}</strong><small style="display:block;margin-top:3px;color:#8b869b">${esc(age(t.closedAt))} · Closed</small></div><div class="bw-history-messages"></div>`;const box=q('.bw-history-messages',list);(t.messages||[]).filter(m=>!m.system).forEach(m=>{const row=document.createElement('div');row.className=`bw-history-msg ${m.sender==='admin'?'admin':'customer'}`;row.innerHTML=`<strong>${m.sender==='admin'?'Budgetingwise Support':'You'}</strong><div>${esc(m.text||'[Attachment]')}</div>`;box.appendChild(row)});if(!(t.messages||[]).some(m=>!m.system))box.innerHTML='<div class="bw-history-empty">No message transcript available.</div>';q('.bw-history-back',list).onclick=render})};render();q('.bw-history-close',modal).onclick=()=>modal.remove();modal.onclick=e=>{if(e.target===modal)modal.remove()};document.body.appendChild(modal)
}

async function refreshHistory(s=services()){
  if(!s)return;const panel=q('#bwSupportPanel'),messages=q('#bwSupportMessages');if(!panel||!messages)return;const items=await tickets(s);let bar=q('#bwCustomerHistoryBar');if(!bar){bar=document.createElement('div');bar.id='bwCustomerHistoryBar';bar.innerHTML='<button id="bwCustomerHistoryButton" type="button">Chat history <span>0</span></button>';panel.insertBefore(bar,messages)}const button=q('#bwCustomerHistoryButton',bar);q('span',button).textContent=String(items.length);bar.style.display=items.length?'flex':'none';button.onclick=()=>historyModal(items)
}

async function prefill(){const f=q('.bw-forgot-workflow'),s=services();if(!f||!s||f.dataset.profilePrefill===s.user.uid)return;try{const snap=await getDoc(doc(s.db,'users',s.user.uid)),p=snap.exists()?snap.data():{},email=String(p.authEmail||p.email||s.user.email||'').trim().toLowerCase(),bid=String(p.budgetId||'').trim().toUpperCase(),e=q('[data-email]',f),b=q('[data-bid]',f);if(e&&!e.value&&email)e.value=email;if(b&&!b.value&&bid)b.value=bid;f.dataset.profilePrefill=s.user.uid}catch{}}

function watch(s){
  if(currentUid===s.user.uid&&stopThread)return;stopThread?.();currentUid=s.user.uid;historyState='';
  stopThread=onSnapshot(doc(s.db,'supportThreads',s.user.uid),async snap=>{if(!snap.exists())return;const t=snap.data();if(normalize(t.status)==='closed'&&!t.archivedCurrentTicket){try{await archiveCurrent(s.db,s.user.uid,t)}catch(error){console.warn('Ticket archive failed:',error)}}const state=`${t.ticketNumber||1}:${!!t.archivedCurrentTicket}:${normalize(t.status)}`;if(state!==historyState){historyState=state;refreshHistory(s).catch(()=>{})}})
}

function enhance(){addStyles();installAutomationChoiceGuard();polishAutomationButtons();prefill().catch(()=>{});const s=services();if(s)watch(s)}

(async()=>{if(isAdmin())return;for(let i=0;i<120&&!defaultApp();i++)await new Promise(r=>setTimeout(r,50));const app=defaultApp();if(!app)return;onAuthStateChanged(getAuth(app),user=>{if(user&&!user.isAnonymous){currentUid='';stopThread?.();stopThread=null;setTimeout(enhance,0)}else{currentUid='';stopThread?.();stopThread=null;q('#bwCustomerHistoryBar')?.remove()}});new MutationObserver(enhance).observe(document.documentElement,{childList:true,subtree:true});enhance()})();
