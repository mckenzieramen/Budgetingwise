import{getApps}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import{getAuth}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';
import{getFirestore,doc,getDoc,setDoc,collection,addDoc,getDocs,query,orderBy,serverTimestamp}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';

const q=(s,p=document)=>p.querySelector(s);
const normalize=s=>s==='solved'?'closed':(s||'open');
const ticketId=(uid,n)=>`BW-${String(uid||'USER').slice(-4).toUpperCase()}-${String(n).padStart(4,'0')}`;

function services(){
  const app=getApps().find(a=>a.name==='[DEFAULT]');
  if(!app)return null;
  const user=getAuth(app).currentUser;
  if(!user||user.isAnonymous)return null;
  return{user,db:getFirestore(app)}
}

async function currentTicketMessages(db,uid){
  const snap=await getDocs(query(collection(db,'supportThreads',uid,'messages'),orderBy('createdAt','asc')));
  const rows=snap.docs.map(x=>{const m=x.data();return{sender:m.sender||'customer',text:m.text||'',imageData:m.imageData||'',system:!!m.system,createdAt:m.createdAt?.toMillis?.()||Date.now()}});
  let marker=-1;
  rows.forEach((m,i)=>{if(m.system&&/A new support conversation has been started\./i.test(m.text||''))marker=i});
  return rows.slice(marker+1)
}

async function archiveCurrent(db,uid,thread){
  if(!thread||normalize(thread.status)!=='closed'||thread.archivedCurrentTicket)return false;
  const number=Math.max(1,Number(thread.ticketNumber||1));
  const id=thread.currentTicketId||ticketId(uid,number);
  const messages=await currentTicketMessages(db,uid);
  await setDoc(doc(db,'supportThreads',uid,'ticketHistory',String(number).padStart(6,'0')),{ticketNumber:number,ticketId:id,concernLabel:thread.concernLabel||'Support Concern',requestType:thread.requestType||'general',closedAt:thread.closedAt||thread.updatedAt||serverTimestamp(),messages,createdAt:thread.ticketStartedAt||thread.createdAt||null},{merge:true});
  await setDoc(doc(db,'supportThreads',uid),{archivedCurrentTicket:true,currentTicketId:id},{merge:true});
  return true
}

async function startNextTicket(s){
  const ref=doc(s.db,'supportThreads',s.user.uid);
  let snap=await getDoc(ref),thread=snap.exists()?snap.data():{};
  if(normalize(thread.status)!=='closed'){
    await setDoc(ref,{status:'closed',customerCanReply:false,closedAt:serverTimestamp(),updatedAt:serverTimestamp()},{merge:true});
    snap=await getDoc(ref);
    thread=snap.exists()?snap.data():{...thread,status:'closed'}
  }
  await archiveCurrent(s.db,s.user.uid,thread);
  const next=Math.max(1,Number(thread.ticketNumber||1)+1),id=ticketId(s.user.uid,next);
  await setDoc(ref,{ticketNumber:next,currentTicketId:id,archivedCurrentTicket:false,requestType:'new-conversation',concernLabel:'Choose a concern',rating:null,status:'open',customerCanReply:true,customerUnread:false,adminUnread:false,lastSender:'customer',closedAt:null,ticketStartedAt:serverTimestamp(),updatedAt:serverTimestamp()},{merge:true});
  await addDoc(collection(s.db,'supportThreads',s.user.uid,'messages'),{sender:'customer',text:'A new support conversation has been started.',system:true,createdAt:serverTimestamp()});
  return{id,number:next}
}

function freshPicker(){
  return `<div class="bw-support-day">New support ticket</div><div class="bw-support-message agent bw-workflow-picker"><div><p><strong class="bw-flow-title">What can we help you with?</strong><span class="bw-flow-sub">Choose one concern for this ticket. Your previous conversation is safely stored in Chat history.</span></p><div class="bw-support-quick-actions"><button type="button" data-flow="activation">🔑 Activation key</button><button type="button" data-flow="account">👤 Account / login</button><button type="button" data-flow="budgeting">📊 Budgeting feature</button><button type="button" data-flow="general">💬 General question</button><button type="button" data-flow="error">⚠️ Report an error</button><button type="button" data-flow="suggestion">✨ Share a suggestion</button></div><time>Budgetingwise Support Bot</time></div></div>`
}

function openFreshTicketUi(){
  q('#bwSolvedBox')?.classList.add('hidden');
  q('#bwSupportRating')?.classList.add('hidden');
  q('#bwSupportForm')?.classList.remove('hidden');
  const status=q('#bwSupportStatus');if(status)status.textContent='Active conversation';
  const messages=q('#bwSupportMessages');if(messages){messages.innerHTML=freshPicker();messages.scrollTop=messages.scrollHeight}
  const input=q('#bwSupportInput');if(input){input.disabled=false;input.readOnly=false;input.placeholder='Type your message…'}
  const send=q('#bwSupportSend')||q('#bwSupportForm button[type="submit"]');if(send)send.disabled=false
}

function install(){
  if(document.documentElement.dataset.bwNewTicketLifecycleFix)return;
  document.documentElement.dataset.bwNewTicketLifecycleFix='1';
  document.addEventListener('click',event=>{
    const button=event.target.closest('#bwNewTicket');
    if(!button)return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    const s=services();if(!s)return;
    const original=button.textContent;
    button.disabled=true;
    button.textContent='Opening new ticket…';
    startNextTicket(s).then(()=>{
      openFreshTicketUi();
      button.disabled=false;
      button.textContent=original
    }).catch(error=>{
      console.warn('New support ticket failed:',error);
      button.disabled=false;
      button.textContent=original
    })
  },true)
}

install();
