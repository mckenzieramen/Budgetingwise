import{getApps}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import{getAuth,onAuthStateChanged}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';
import{getFirestore,doc,getDoc,setDoc,collection,addDoc,getDocs,query,orderBy,onSnapshot,serverTimestamp}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';

const MARK='A new support conversation has been started.';
const normalize=s=>s==='solved'?'closed':(s||'open');
const ticketId=(uid,n)=>`BW-${String(uid||'USER').slice(-4).toUpperCase()}-${String(n).padStart(4,'0')}`;
const q=(s,p=document)=>p.querySelector(s);
let stopThread=null,busy=false;

function app(){return getApps().find(a=>a.name==='[DEFAULT]')||getApps()[0]||null}
function services(){const a=app();if(!a)return null;const auth=getAuth(a),user=auth.currentUser;if(!user||user.isAnonymous)return null;return{auth,user,db:getFirestore(a)}}

async function currentMessages(db,uid){
  const snap=await getDocs(query(collection(db,'supportThreads',uid,'messages'),orderBy('createdAt','asc')));
  const rows=snap.docs.map(d=>{const m=d.data();return{sender:m.sender||'customer',text:m.text||'',imageData:m.imageData||'',system:!!m.system,createdAt:m.createdAt?.toMillis?.()||Date.now()}});
  let marker=-1;rows.forEach((m,i)=>{if(m.system&&String(m.text||'').trim()===MARK)marker=i});
  return rows.slice(marker+1)
}

async function ensureIdentity(db,uid,t){
  if(!t)return t;
  const number=Math.max(1,Number(t.ticketNumber||1));
  const id=t.currentTicketId||ticketId(uid,number);
  const patch={};
  if(!t.ticketNumber)patch.ticketNumber=number;
  if(!t.currentTicketId)patch.currentTicketId=id;
  if(typeof t.archivedCurrentTicket!=='boolean')patch.archivedCurrentTicket=false;
  if(!t.ticketStartedAt)patch.ticketStartedAt=t.createdAt||serverTimestamp();
  if(Object.keys(patch).length)await setDoc(doc(db,'supportThreads',uid),patch,{merge:true});
  return{...t,...patch,ticketNumber:number,currentTicketId:id}
}

async function archiveClosed(db,uid,t){
  t=await ensureIdentity(db,uid,t);
  if(!t||normalize(t.status)!=='closed'||t.archivedCurrentTicket)return t;
  const number=Math.max(1,Number(t.ticketNumber||1)),id=t.currentTicketId||ticketId(uid,number),messages=await currentMessages(db,uid);
  await setDoc(doc(db,'supportThreads',uid,'ticketHistory',String(number).padStart(6,'0')),{ticketNumber:number,ticketId:id,concernLabel:t.concernLabel||'Support Concern',requestType:t.requestType||'general',createdAt:t.ticketStartedAt||t.createdAt||null,closedAt:t.closedAt||t.updatedAt||serverTimestamp(),messages},{merge:true});
  await setDoc(doc(db,'supportThreads',uid),{archivedCurrentTicket:true,currentTicketId:id},{merge:true});
  return{...t,archivedCurrentTicket:true,currentTicketId:id}
}

function freshPicker(){return `<div class="bw-support-day">New support ticket</div><div class="bw-support-message agent bw-workflow-picker"><div><p><strong class="bw-flow-title">What can we help you with?</strong><span class="bw-flow-sub">This is a new ticket. Your previous closed conversation is saved in Chat history.</span></p><div class="bw-support-quick-actions"><button type="button" data-flow="activation">🔑 Activation key</button><button type="button" data-flow="account">👤 Account / login</button><button type="button" data-flow="budgeting">📊 Budgeting feature</button><button type="button" data-flow="general">💬 General question</button><button type="button" data-flow="error">⚠️ Report an error</button><button type="button" data-flow="suggestion">✨ Share a suggestion</button></div><time>Budgetingwise Support Bot</time></div></div>`}

function resetCustomerUi(id){
  q('#bwSolvedBox')?.classList.add('hidden');
  q('#bwSupportRating')?.classList.add('hidden');
  q('#bwSupportForm')?.classList.remove('hidden');
  const status=q('#bwSupportStatus');if(status)status.textContent=`Active conversation · ${id}`;
  const box=q('#bwSupportMessages');if(box){box.innerHTML=freshPicker();box.scrollTop=box.scrollHeight}
  const input=q('#bwSupportInput');if(input){input.disabled=false;input.readOnly=false;input.value='';input.placeholder='Type your message…';input.style.pointerEvents='auto'}
  const send=q('#bwSupportSend')||q('#bwSupportForm button[type="submit"]');if(send)send.disabled=false
}

async function startNextTicket(trigger){
  if(busy)return;
  const s=services();if(!s)return;
  busy=true;
  const button=trigger||q('#bwNewTicket'),old=button?.textContent;
  if(button){button.disabled=true;button.textContent='Opening new ticket…'}
  try{
    const ref=doc(s.db,'supportThreads',s.user.uid),snap=await getDoc(ref),raw=snap.exists()?snap.data():{};
    let t=await ensureIdentity(s.db,s.user.uid,raw);
    if(normalize(t.status)!=='closed'){
      // A new concern must never reuse an active/resolved ticket. Close it first,
      // then archive it before allocating the next ticket number.
      await setDoc(ref,{status:'closed',customerCanReply:false,closedAt:serverTimestamp(),updatedAt:serverTimestamp()},{merge:true});
      const closedSnap=await getDoc(ref);t=closedSnap.exists()?closedSnap.data():{...t,status:'closed'}
    }
    t=await archiveClosed(s.db,s.user.uid,t);
    // Re-read after archive so a second path cannot increment from stale state.
    const latestSnap=await getDoc(ref),latest=latestSnap.exists()?latestSnap.data():t;
    if(normalize(latest.status)!=='closed'&&!latest.archivedCurrentTicket){resetCustomerUi(latest.currentTicketId||ticketId(s.user.uid,Math.max(1,Number(latest.ticketNumber||1))));return}
    const next=Math.max(1,Number(latest.ticketNumber||1)+1),id=ticketId(s.user.uid,next);
    await setDoc(ref,{ticketNumber:next,currentTicketId:id,archivedCurrentTicket:false,requestType:'new-conversation',concernLabel:'Choose a concern',rating:null,status:'open',customerCanReply:true,customerUnread:false,adminUnread:false,lastSender:'customer',resolutionPrompt:false,closedAt:null,ticketStartedAt:serverTimestamp(),updatedAt:serverTimestamp()},{merge:true});
    await addDoc(collection(s.db,'supportThreads',s.user.uid,'messages'),{sender:'customer',text:MARK,system:true,ticketNumber:next,ticketId:id,createdAt:serverTimestamp()});
    resetCustomerUi(id)
  }catch(e){console.warn('Unable to open a fresh support ticket:',e)}finally{busy=false;if(button?.isConnected){button.disabled=false;button.textContent=old||'Start new ticket'}}
}

function installNewTicketGuard(){
  if(document.documentElement.dataset.bwTicketBoundaryV2)return;
  document.documentElement.dataset.bwTicketBoundaryV2='1';
  document.addEventListener('click',e=>{
    const newTicket=e.target.closest('#bwNewTicket');
    const recoveryMore=e.target.closest('[data-recovery-more="yes"]');
    const trigger=newTicket||recoveryMore;
    if(!trigger)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    startNextTicket(trigger)
  },true)
}

function watchUser(user){
  stopThread?.();stopThread=null;
  const s=services();if(!s||!user||user.isAnonymous)return;
  stopThread=onSnapshot(doc(s.db,'supportThreads',user.uid),async snap=>{
    if(!snap.exists())return;
    try{
      let t=await ensureIdentity(s.db,user.uid,snap.data());
      if(normalize(t.status)==='closed'&&!t.archivedCurrentTicket)await archiveClosed(s.db,user.uid,t)
    }catch(e){console.warn('Ticket lifecycle sync unavailable:',e)}
  })
}

installNewTicketGuard();
const boot=()=>{const a=app();if(!a)return false;onAuthStateChanged(getAuth(a),watchUser);const u=getAuth(a).currentUser;if(u)watchUser(u);return true};
if(!boot()){let n=0;const t=setInterval(()=>{if(boot()||++n>100)clearInterval(t)},60)}
