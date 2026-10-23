import{getApps}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import{getAuth}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';
import{getFirestore,doc,getDoc,setDoc,collection,addDoc,getDocs,query,orderBy,onSnapshot,serverTimestamp}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';

const SERVICE='https://script.google.com/macros/s/AKfycbz4wg4sG9c8fluO1F5233W3OgS-Qce06Wtzq1c_C-K18I9EuWd_Hzo_AEBmlppQi1jm/exec';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const q=(s,p=document)=>p.querySelector(s);
const qa=(s,p=document)=>[...p.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isAdminPage=()=>!!document.getElementById('adminApp')||/^\/admin(?:\/|$)/i.test(location.pathname);
const ticketId=(uid,n)=>`BW-${String(uid||'USER').slice(-4).toUpperCase()}-${String(n).padStart(4,'0')}`;
const normalize=s=>s==='solved'?'closed':(s||'open');
let customerStop=null,customerUid='',historyBusy=false;

function activeServices(){
  for(const app of getApps()){
    try{
      const auth=getAuth(app),user=auth.currentUser;
      if(user)return{app,auth,user,db:getFirestore(app)};
    }catch{}
  }
  return null;
}

async function waitForServices(){
  for(let i=0;i<160;i++){
    const s=activeServices();
    if(s)return s;
    await sleep(75);
  }
  return null;
}

function addStyles(){
  if(q('#bwTicketLifecycleStyles'))return;
  const s=document.createElement('style');
  s.id='bwTicketLifecycleStyles';
  s.textContent=`
.bw-recovery-followup-actions{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important;margin-top:10px!important}
.bw-recovery-followup-actions button{min-height:42px!important;padding:9px 11px!important;border:1px solid #ddd7f6!important;border-radius:12px!important;background:#fff!important;color:#4f38c7!important;font-size:9px!important;font-weight:800!important;cursor:pointer!important;box-shadow:0 5px 13px rgba(69,52,145,.07)!important;transition:.16s ease!important}
.bw-recovery-followup-actions button:first-child{border:0!important;background:linear-gradient(135deg,#6f52f5,#5435dc)!important;color:#fff!important;box-shadow:0 7px 17px rgba(84,53,220,.21)!important}
.bw-recovery-followup-actions button:hover{transform:translateY(-1px)!important}.bw-recovery-followup-actions button:disabled{opacity:.58!important;cursor:wait!important;transform:none!important}
#bwCustomerHistoryBar{display:flex;align-items:center;justify-content:flex-end;padding:7px 11px;border-bottom:1px solid #efecf8;background:rgba(255,255,255,.78)}
#bwCustomerHistoryButton{border:1px solid #e1dcf7;border-radius:9px;background:#fff;color:#5a43d1;padding:6px 9px;font:800 9px inherit;cursor:pointer;box-shadow:0 3px 10px rgba(68,50,145,.06)}
#bwCustomerHistoryButton span{display:inline-grid;place-items:center;min-width:16px;height:16px;margin-left:5px;padding:0 4px;border-radius:99px;background:#f0edff;color:#573ed1;font-size:8px}
.bw-history-modal{position:fixed;inset:0;z-index:100000;background:rgba(24,20,45,.5);display:grid;place-items:center;padding:18px}.bw-history-card{width:min(560px,96vw);max-height:82vh;overflow:auto;background:#fff;border-radius:18px;padding:17px;box-shadow:0 26px 80px rgba(0,0,0,.22)}
.bw-history-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.bw-history-head strong{display:block;font-size:15px;color:#24203b}.bw-history-head small{display:block;margin-top:3px;color:#858096;font-size:9px}.bw-history-close{border:0;background:none;font-size:23px;cursor:pointer;color:#777089}.bw-history-list{display:grid;gap:8px;margin-top:13px}.bw-history-ticket{width:100%;text-align:left;border:1px solid #ebe7f8;border-radius:12px;background:#fff;padding:11px;cursor:pointer}.bw-history-ticket:hover{border-color:#cec5fb;background:#fcfbff}.bw-history-ticket b{display:block;color:#513ac9;font-size:9px}.bw-history-ticket strong{display:block;margin-top:3px;color:#28243d;font-size:11px}.bw-history-ticket small{display:block;margin-top:4px;color:#8b869b;font-size:9px}.bw-history-messages{margin-top:12px}.bw-history-back{border:0;background:none;color:#5c43d1;font:800 9px inherit;cursor:pointer;padding:4px 0 10px}.bw-history-msg{margin:7px 0;padding:9px 11px;border-radius:11px;background:#f7f6fb;font-size:10px;line-height:1.45}.bw-history-msg.admin{background:#f0edff}.bw-history-msg strong{display:block;font-size:8px;margin-bottom:3px}.bw-history-empty{padding:16px 4px;text-align:center;color:#8a8598;font-size:10px}
.bw-admin-account-actions{margin-top:12px;padding-top:12px;border-top:1px solid #ece8f7}.bw-admin-account-actions>strong{display:block;margin-bottom:6px}.bw-admin-action-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}.bw-admin-action-grid button{min-height:38px;padding:7px;border:1px solid #ddd7f6;border-radius:10px;background:#fff;color:#4e39bd;font-size:9px;font-weight:800;cursor:pointer}.bw-admin-action-status{display:block;min-height:14px;margin-top:7px;font-size:9px}.bw-admin-action-status.ok{color:#21845f}.bw-admin-action-status.error{color:#b73f4d}
@media(max-width:380px){.bw-recovery-followup-actions,.bw-admin-action-grid{grid-template-columns:1fr!important}}
`;
  document.head.appendChild(s);
}

async function messagesSnapshot(db,uid){
  const snap=await getDocs(query(collection(db,'supportThreads',uid,'messages'),orderBy('createdAt','asc')));
  return snap.docs.map(x=>{const m=x.data();return{sender:m.sender||'customer',text:m.text||'',imageData:m.imageData||'',system:!!m.system,createdAt:m.createdAt?.toMillis?.()||Date.now()}});
}

async function archiveClosed(db,uid,thread){
  if(!uid||!thread||normalize(thread.status)!=='closed'||thread.archivedCurrentTicket)return false;
  const number=Math.max(1,Number(thread.ticketNumber||1));
  const id=thread.currentTicketId||ticketId(uid,number);
  const messages=await messagesSnapshot(db,uid);
  const ref=doc(db,'supportThreads',uid,'ticketHistory',String(number).padStart(6,'0'));
  await setDoc(ref,{
    ticketNumber:number,
    ticketId:id,
    concernLabel:thread.concernLabel||'Support Concern',
    requestType:thread.requestType||'general',
    closedAt:thread.closedAt||thread.updatedAt||serverTimestamp(),
    messages,
    createdAt:thread.ticketStartedAt||thread.createdAt||null
  },{merge:true});
  await setDoc(doc(db,'supportThreads',uid),{archivedCurrentTicket:true,currentTicketId:id},{merge:true});
  return true;
}

async function closeAndArchive(s){
  const ref=doc(s.db,'supportThreads',s.user.uid);
  const snap=await getDoc(ref),thread=snap.exists()?snap.data():{};
  await setDoc(ref,{
    status:'closed',
    customerCanReply:false,
    customerUnread:false,
    adminUnread:false,
    resolutionPrompt:false,
    closedAt:serverTimestamp(),
    updatedAt:serverTimestamp()
  },{merge:true});
  const after=await getDoc(ref);
  await archiveClosed(s.db,s.user.uid,after.exists()?after.data():{...thread,status:'closed'});
}

async function startNextTicket(s){
  const ref=doc(s.db,'supportThreads',s.user.uid);
  let snap=await getDoc(ref),thread=snap.exists()?snap.data():{};
  if(normalize(thread.status)!=='closed'){
    await setDoc(ref,{status:'closed',customerCanReply:false,closedAt:serverTimestamp(),updatedAt:serverTimestamp()},{merge:true});
    snap=await getDoc(ref);thread=snap.exists()?snap.data():{...thread,status:'closed'};
  }
  await archiveClosed(s.db,s.user.uid,thread);
  const next=Math.max(1,Number(thread.ticketNumber||1)+1),id=ticketId(s.user.uid,next);
  await setDoc(ref,{
    ticketNumber:next,
    currentTicketId:id,
    archivedCurrentTicket:false,
    requestType:'new-conversation',
    concernLabel:'Choose a concern',
    rating:null,
    status:'open',
    customerCanReply:true,
    customerUnread:false,
    adminUnread:false,
    lastSender:'customer',
    resolutionPrompt:false,
    closedAt:null,
    ticketStartedAt:serverTimestamp(),
    updatedAt:serverTimestamp()
  },{merge:true});
  await addDoc(collection(s.db,'supportThreads',s.user.uid,'messages'),{sender:'customer',text:'A new support conversation has been started.',system:true,createdAt:serverTimestamp()});
  return{id,number:next};
}

function workflowPicker(){
  return `<div class="bw-support-message agent bw-workflow-picker"><div><p><strong class="bw-flow-title">What can we help you with?</strong><span class="bw-flow-sub">This is a new ticket. Please choose one concern for this conversation.</span></p><div class="bw-support-quick-actions"><button type="button" data-flow="activation">🔑 Activation key</button><button type="button" data-flow="account">👤 Account / login</button><button type="button" data-flow="budgeting">📊 Budgeting feature</button><button type="button" data-flow="general">💬 General question</button><button type="button" data-flow="error">⚠️ Report an error</button><button type="button" data-flow="suggestion">✨ Share a suggestion</button></div><time>Budgetingwise Support Bot</time></div></div>`;
}

function unlockComposer(){
  const input=q('#bwSupportInput'),send=q('#bwSupportSend')||q('#bwSupportForm button[type="submit"]');
  if(input){input.disabled=false;input.readOnly=false;input.placeholder='Type your message…';input.style.pointerEvents='auto'}
  if(send)send.disabled=false;
}

function replaceWithNewTicketPicker(){
  const messages=q('#bwSupportMessages');
  if(!messages)return;
  q('.bw-forgot-workflow',messages)?.remove();
  q('.bw-workflow-picker',messages)?.remove();
  messages.insertAdjacentHTML('beforeend',workflowPicker());
  messages.scrollTop=messages.scrollHeight;
  unlockComposer();
}

async function handleAutomationChoice(button,choice){
  const s=activeServices();
  if(!s)throw new Error('Support session is unavailable.');
  button.disabled=true;
  const original=button.textContent;
  button.textContent=choice==='yes'?'Opening new ticket…':'Closing ticket…';
  try{
    if(choice==='yes'){
      await startNextTicket(s);
      replaceWithNewTicketPicker();
      await refreshCustomerHistory(s);
    }else{
      await closeAndArchive(s);
      await refreshCustomerHistory(s);
      q('.bw-recovery-followup')?.remove();
    }
  }catch(error){
    button.disabled=false;
    button.textContent=original;
    const msg=q('[data-recovery-followup-msg]');
    if(msg){msg.textContent=error?.message||'Unable to update this ticket. Please try again.';msg.style.color='#b73f4d'}
    throw error;
  }
}

function installAutomationGuard(){
  if(document.documentElement.dataset.bwAutomationTicketGuard)return;
  document.documentElement.dataset.bwAutomationTicketGuard='1';
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-recovery-more]');
    if(!button)return;
    const choice=button.dataset.recoveryMore;
    if(choice!=='yes'&&choice!=='no')return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    handleAutomationChoice(button,choice).catch(error=>console.warn('Automation ticket choice failed:',error));
  },true);
}

async function historyTickets(s){
  const snap=await getDocs(query(collection(s.db,'supportThreads',s.user.uid,'ticketHistory'),orderBy('ticketNumber','desc')));
  return snap.docs.map(d=>({id:d.id,...d.data()}));
}

function age(value){
  try{
    const d=value?.toDate?.()||new Date(value),days=Math.max(0,Math.floor((Date.now()-d.getTime())/86400000));
    return days===0?'Closed today':days===1?'Closed 1 day ago':`Closed ${days} days ago`;
  }catch{return'Closed'}
}

function openHistoryModal(tickets){
  q('.bw-history-modal')?.remove();
  const modal=document.createElement('div');
  modal.className='bw-history-modal';
  modal.innerHTML=`<section class="bw-history-card"><div class="bw-history-head"><div><strong>Chat history</strong><small>Your previous closed Budgetingwise support tickets.</small></div><button type="button" class="bw-history-close">×</button></div><div class="bw-history-list"></div></section>`;
  const list=q('.bw-history-list',modal);
  const renderList=()=>{
    list.innerHTML=tickets.length?tickets.map(t=>`<button type="button" class="bw-history-ticket" data-history-ticket="${esc(t.id)}"><b>${esc(t.ticketId||ticketId('USER',t.ticketNumber||1))}</b><strong>${esc(t.concernLabel||'Support Concern')}</strong><small>${esc(age(t.closedAt))} · Closed</small></button>`).join(''):'<div class="bw-history-empty">No closed tickets yet.</div>';
    qa('[data-history-ticket]',list).forEach(b=>b.onclick=()=>{
      const t=tickets.find(x=>x.id===b.dataset.historyTicket);if(!t)return;
      list.innerHTML=`<button class="bw-history-back" type="button">← Back to ticket history</button><div><b style="color:#513ac9;font-size:9px">${esc(t.ticketId||'Support Ticket')}</b><strong style="display:block;margin-top:4px;color:#28243d">${esc(t.concernLabel||'Support Concern')}</strong><small style="display:block;margin-top:3px;color:#8b869b">${esc(age(t.closedAt))} · Closed</small></div><div class="bw-history-messages"></div>`;
      const messages=q('.bw-history-messages',list);
      (t.messages||[]).filter(m=>!m.system).forEach(m=>{
        const row=document.createElement('div');row.className=`bw-history-msg ${m.sender==='admin'?'admin':'customer'}`;
        row.innerHTML=`<strong>${m.sender==='admin'?'Budgetingwise Support':'You'}</strong><div>${esc(m.text||'[Attachment]')}</div>`;
        messages.appendChild(row);
      });
      if(!(t.messages||[]).some(m=>!m.system))messages.innerHTML='<div class="bw-history-empty">No message transcript available.</div>';
      q('.bw-history-back',list).onclick=renderList;
    });
  };
  renderList();
  q('.bw-history-close',modal).onclick=()=>modal.remove();
  modal.onclick=e=>{if(e.target===modal)modal.remove()};
  document.body.appendChild(modal);
}

async function refreshCustomerHistory(s=activeServices()){
  if(isAdminPage()||!s||s.user.isAnonymous||historyBusy)return;
  const panel=q('#bwSupportPanel'),messages=q('#bwSupportMessages');
  if(!panel||!messages)return;
  historyBusy=true;
  try{
    const tickets=await historyTickets(s);
    let bar=q('#bwCustomerHistoryBar');
    if(!bar){
      bar=document.createElement('div');bar.id='bwCustomerHistoryBar';
      bar.innerHTML='<button id="bwCustomerHistoryButton" type="button">Chat history <span>0</span></button>';
      panel.insertBefore(bar,messages);
    }
    const button=q('#bwCustomerHistoryButton',bar),count=q('span',button);
    count.textContent=String(tickets.length);
    bar.style.display=tickets.length?'flex':'none';
    button.onclick=()=>openHistoryModal(tickets);
  }finally{historyBusy=false}
}

function watchCustomerThread(){
  if(isAdminPage())return;
  const s=activeServices();
  if(!s||s.user.isAnonymous)return;
  if(customerUid===s.user.uid&&customerStop)return;
  customerStop?.();customerUid=s.user.uid;
  customerStop=onSnapshot(doc(s.db,'supportThreads',s.user.uid),async snap=>{
    if(!snap.exists())return;
    const t=snap.data();
    if(normalize(t.status)==='closed'&&!t.archivedCurrentTicket){
      try{await archiveClosed(s.db,s.user.uid,t)}catch(e){console.warn('Automatic ticket archive failed:',e)}
    }
    refreshCustomerHistory(s).catch(()=>{});
  });
}

async function prefillRecovery(){
  if(isAdminPage())return;
  const flow=q('.bw-forgot-workflow'),s=activeServices();
  if(!flow||!s||s.user.isAnonymous||flow.dataset.profilePrefill===s.user.uid)return;
  try{
    const snap=await getDoc(doc(s.db,'users',s.user.uid)),p=snap.exists()?snap.data():{};
    const email=String(p.authEmail||p.email||s.user.email||'').trim().toLowerCase(),bid=String(p.budgetId||'').trim().toUpperCase();
    const e=q('[data-email]',flow),b=q('[data-bid]',flow);
    if(e&&!e.value&&email)e.value=email;
    if(b&&!b.value&&bid)b.value=bid;
    flow.dataset.profilePrefill=s.user.uid;
  }catch{}
}

async function service(action,payload={}){
  const s=activeServices();
  if(!s)throw new Error('Admin session expired.');
  const adminIdToken=await s.user.getIdToken(true);
  const response=await fetch(SERVICE,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action,adminIdToken,...payload})});
  const text=await response.text();let data={};
  try{data=text?JSON.parse(text):{}}catch{throw new Error('Invalid account-service response.')}
  if(!response.ok||data.ok===false)throw new Error(data.message||'Account action failed.');
  return data;
}

async function adminSystemMessage(db,uid,text){
  await addDoc(collection(db,'supportThreads',uid,'messages'),{sender:'admin',text,system:true,createdAt:serverTimestamp()});
  await setDoc(doc(db,'supportThreads',uid),{lastSender:'admin',customerUnread:true,adminUnread:false,updatedAt:serverTimestamp()},{merge:true});
}

function activeAdminUid(){return q('#aspThreads [data-thread].active')?.dataset.thread||''}

async function renderAdminActions(){
  if(!isAdminPage())return;
  const profile=q('#aspProfile'),uid=activeAdminUid(),s=activeServices();
  if(!profile||!uid||!s)return;
  if(profile.dataset.actionsUid===uid&&q('.bw-admin-account-actions',profile))return;
  const [threadSnap,userSnap]=await Promise.all([getDoc(doc(s.db,'supportThreads',uid)).catch(()=>null),getDoc(doc(s.db,'users',uid)).catch(()=>null)]);
  const thread=threadSnap?.exists()?threadSnap.data():{},user=userSnap?.exists()?userSnap.data():null;
  q('.bw-admin-account-actions',profile)?.remove();profile.dataset.actionsUid=uid;
  if(!user||thread.guest)return;
  const status=String(user.status||'active').toLowerCase(),suspended=/^(suspended|frozen|disabled|inactive)$/.test(status),email=String(user.authEmail||user.email||thread.customerEmail||'').trim(),activated=user.accountActivated===true;
  const box=document.createElement('div');box.className='bw-admin-account-actions';
  box.innerHTML=`<strong>Account actions</strong><div class="bw-admin-action-grid"><button data-aa="info">Resend account info</button><button data-aa="key">Resend activation key</button><button data-aa="email">Edit login email</button><button data-aa="suspend">${suspended?'Unsuspend account':'Suspend account'}</button></div><small class="bw-admin-action-status"></small>`;
  profile.appendChild(box);const note=q('.bw-admin-action-status',box);
  box.onclick=async event=>{
    const button=event.target.closest('[data-aa]');if(!button)return;
    const action=button.dataset.aa,original=button.textContent;note.textContent='';note.className='bw-admin-action-status';
    try{
      if(action==='info'){
        button.disabled=true;button.textContent='Sending…';
        await service('adminSendAccountInfo',{uid});
        await adminSystemMessage(s.db,uid,'I resent your Budgetingwise account information to your registered email.');
        note.textContent='Account information sent.';
      }else if(action==='key'){
        if(activated&&!confirm('This account is already activated. Resending a key will return it to activation mode. Continue?'))return;
        button.disabled=true;button.textContent='Sending…';
        await service('adminResendActivationKey',{uid,force:activated});
        await setDoc(doc(s.db,'supportThreads',uid),{requestType:'account-activation',concernLabel:'Account Activation / Resend Key',updatedAt:serverTimestamp()},{merge:true});
        await adminSystemMessage(s.db,uid,'I sent a new activation key to your registered email. It expires in 7 days.');
        note.textContent='New activation key sent.';
      }else if(action==='email'){
        const value=prompt('Enter the customer’s new login email:',email);if(value===null)return;
        const newEmail=String(value).trim().toLowerCase();if(!/^\S+@\S+\.\S+$/.test(newEmail))throw new Error('Enter a valid email address.');
        button.disabled=true;button.textContent='Updating…';
        await service('adminUpdateCustomerEmail',{uid,newEmail});
        await setDoc(doc(s.db,'supportThreads',uid),{customerEmail:newEmail,requestType:'account-email-update',concernLabel:'Account Email Update',updatedAt:serverTimestamp()},{merge:true});
        await adminSystemMessage(s.db,uid,`Your Budgetingwise login email has been updated to ${newEmail}.`);
        note.textContent='Login email updated.';profile.dataset.actionsUid='';
      }else if(action==='suspend'){
        const next=!suspended,verb=next?'suspend':'unsuspend';if(!confirm(`Are you sure you want to ${verb} this customer account?`))return;
        button.disabled=true;button.textContent=next?'Suspending…':'Restoring…';
        await service('adminSetCustomerSuspended',{uid,suspended:next});
        await setDoc(doc(s.db,'supportThreads',uid),{status:next?'on-hold':'open',customerCanReply:!next,requestType:'account-access',concernLabel:next?'Account Suspended':'Account Access Restored',updatedAt:serverTimestamp()},{merge:true});
        await adminSystemMessage(s.db,uid,next?'Your Budgetingwise account has been suspended.':'Your Budgetingwise account has been restored and is active again.');
        note.textContent=next?'Account suspended.':'Account unsuspended.';profile.dataset.actionsUid='';
      }
      note.classList.add('ok');
    }catch(error){note.textContent=error?.message||'Account action failed.';note.classList.add('error')}
    finally{button.disabled=false;button.textContent=original;setTimeout(()=>renderAdminActions().catch(()=>{}),300)}
  };
}

function polishAutomationButtons(){
  const flow=q('.bw-recovery-followup');if(!flow)return;
  const yes=q('[data-recovery-more="yes"]',flow),no=q('[data-recovery-more="no"]',flow);
  if(yes)yes.textContent='Yes, another concern';
  if(no)no.textContent='No, close ticket';
}

async function tick(){
  addStyles();
  if(isAdminPage())await renderAdminActions().catch(()=>{});
  else{
    installAutomationGuard();
    watchCustomerThread();
    await prefillRecovery().catch(()=>{});
    polishAutomationButtons();
    await refreshCustomerHistory().catch(()=>{});
  }
}

new MutationObserver(()=>tick()).observe(document.documentElement,{childList:true,subtree:true});
setInterval(()=>tick(),900);
tick();
