// Ticket history v7: one concern per ticket, current-ticket admin sync, and readable history summaries.
import{getApps}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import{getAuth}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';
import{getFirestore,doc,getDoc,setDoc,collection,getDocs,query,orderBy,serverTimestamp}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';

const wait=(fn,n=200)=>new Promise(r=>{let i=0,t=setInterval(()=>{let v=null;try{v=fn()}catch{}if(v||++i>=n){clearInterval(t);r(v||null)}},100)});
const activeFirebaseApp=()=>{const apps=getApps();if(!apps.length)return null;for(const app of apps){try{if(getAuth(app).currentUser)return app}catch{}}return apps.find(app=>app.name==='[DEFAULT]')||apps[0]||null};
const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
const ticketId=(uid,n)=>`BW-${String(uid||'USER').slice(-4).toUpperCase()}-${String(n).padStart(4,'0')}`;
const normalized=s=>s==='solved'?'closed':(s||'open');
const statusLabel=s=>({open:'Open',pending:'Pending','on-hold':'On hold',closed:'Closed'}[normalized(s)]||'Open');
const closedWhen=v=>{try{const d=v?.toDate?.()||new Date(v);return d.toLocaleString([],{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'})}catch{return'—'}};
const NEW_TICKET_MARKER='A new support conversation has been started.';

async function services(){const app=await wait(activeFirebaseApp);if(!app)throw new Error('Firebase app is not ready.');const auth=getAuth(app);await wait(()=>auth.currentUser,100);return{app,auth,db:getFirestore(app)}}

async function snapshotCurrentMessages(db,uid){
  const s=await getDocs(query(collection(db,'supportThreads',uid,'messages'),orderBy('createdAt','asc')));
  const rows=s.docs.map(x=>{const m=x.data();return{sender:m.sender||'customer',text:m.text||'',imageData:m.imageData||'',system:!!m.system,createdAt:m.createdAt?.toMillis?.()||Date.now()}});
  let marker=-1;rows.forEach((m,i)=>{if(m.system&&String(m.text||'').trim()===NEW_TICKET_MARKER)marker=i});
  return rows.slice(marker+1)
}

async function archiveClosed(db,uid,t){
  if(!uid||!t||normalized(t.status)!=='closed'||t.archivedCurrentTicket)return;
  const messages=await snapshotCurrentMessages(db,uid),number=Math.max(1,Number(t.ticketNumber||1)),id=t.currentTicketId||ticketId(uid,number),ref=doc(db,'supportThreads',uid,'ticketHistory',String(number).padStart(6,'0'));
  await setDoc(ref,{ticketNumber:number,ticketId:id,concernLabel:t.concernLabel||'Support Concern',requestType:t.requestType||'general',closedAt:t.closedAt||t.updatedAt||serverTimestamp(),messages,createdAt:t.ticketStartedAt||t.createdAt||null},{merge:true});
  await setDoc(doc(db,'supportThreads',uid),{archivedCurrentTicket:true,currentTicketId:id},{merge:true})
}

async function customer(){
  const b=await wait(()=>document.getElementById('bwNewTicket'));if(!b||b.dataset.v7)return;b.dataset.v7='1';
  b.addEventListener('click',async()=>{try{const{auth,db}=await services(),u=auth.currentUser;if(!u)return;const ref=doc(db,'supportThreads',u.uid),s=await getDoc(ref),t=s.exists()?s.data():{};await archiveClosed(db,u.uid,t);const next=Math.max(1,Number(t.ticketNumber||1)+1),id=ticketId(u.uid,next);await setDoc(ref,{ticketNumber:next,currentTicketId:id,archivedCurrentTicket:false,status:'open',customerCanReply:true,concernLabel:'Choose a concern',requestType:'new-conversation',rating:null,closedAt:null,ticketStartedAt:serverTimestamp(),updatedAt:serverTimestamp()},{merge:true})}catch(e){console.warn('Ticket archive unavailable:',e)}},true)
}

function trimAdminTranscript(){
  const box=document.getElementById('aspMessages');if(!box)return;
  const rows=[...box.querySelectorAll('.asp-msg')];let marker=-1;
  rows.forEach((row,i)=>{if((row.querySelector('p')?.textContent||'').trim()===NEW_TICKET_MARKER)marker=i});
  if(marker<0)return;
  rows.slice(0,marker+1).forEach(row=>row.remove())
}

function syncAdminState(profile,t){
  const state=normalized(t.status),closed=state==='closed',label=statusLabel(state),concern=t.concernLabel||'Support Concern';
  const badge=document.getElementById('aspCurrentStatus');if(badge){badge.className=`asp-status ${state}`;badge.textContent=label}
  document.getElementById('aspSolvedNotice')?.classList.toggle('hidden',!closed);
  document.getElementById('aspForm')?.classList.toggle('hidden',closed);
  const stateLabel=document.getElementById('aspStateLabel');if(stateLabel)stateLabel.textContent=label;

  const profileBadge=profile.querySelector('.asp-profile-card > .asp-status');if(profileBadge){profileBadge.className=`asp-status ${state}`;profileBadge.textContent=label}
  profile.querySelectorAll('.asp-profile-info label').forEach(labelEl=>{const title=(labelEl.childNodes[0]?.textContent||'').trim();if(title==='Concern'){const strong=labelEl.querySelector('strong');if(strong)strong.textContent=concern}});

  const headerSmall=document.querySelector('#aspCustomer small');
  if(headerSmall){const old=headerSmall.textContent||'',suffix=old.includes(' · ')?' · '+old.split(' · ').slice(1).join(' · '):'';headerSmall.textContent=concern+suffix}
  trimAdminTranscript()
}

async function admin(){
  const profile=await wait(()=>document.getElementById('aspProfile')),list=document.getElementById('aspThreads');if(!profile||!list)return;const{db}=await services();
  let rendering=false,lastKey='';

  async function render(){
    if(rendering)return;rendering=true;
    try{
      const active=list.querySelector('[data-thread].active');if(!active)return;
      const uid=active.dataset.thread,s=await getDoc(doc(db,'supportThreads',uid));if(!s.exists())return;const t=s.data();
      syncAdminState(profile,t);
      if(normalized(t.status)==='closed')await archiveClosed(db,uid,t);
      const h=await getDocs(query(collection(db,'supportThreads',uid,'ticketHistory'),orderBy('ticketNumber','desc'))),tickets=h.docs.map(d=>({id:d.id,...d.data()}));
      const card=profile.querySelector('.asp-profile-card');if(!card)return;
      const key=`${uid}:${t.ticketNumber||1}:${normalized(t.status)}:${t.concernLabel||''}:${tickets.length}:${tickets[0]?.ticketNumber||0}`;
      if(lastKey===key&&card.querySelector('[data-ticket-v7]'))return;lastKey=key;
      card.querySelector('[data-ticket-v7]')?.remove();card.querySelector('[data-ticket-v6]')?.remove();card.querySelector('[data-ticket-v5]')?.remove();

      const box=document.createElement('div');box.dataset.ticketV7='1';box.className='asp-ticket-history-v7';
      box.innerHTML=`<div class="asp-ticket-history-head"><div><small>CHAT HISTORY</small><strong>${tickets.length} closed ticket${tickets.length===1?'':'s'}</strong></div></div><div data-ticket-list></div>`;
      const ticketList=box.querySelector('[data-ticket-list]');
      if(!tickets.length){ticketList.innerHTML='<div class="asp-ticket-empty">No closed tickets yet.</div>'}
      else tickets.forEach((x,i)=>{
        x.ticketNumber=Math.max(1,Number(x.ticketNumber||i+1));x.ticketId=x.ticketId||ticketId(uid,x.ticketNumber);
        const item=document.createElement('button');item.type='button';item.className='asp-ticket-summary';item.innerHTML=`<span class="asp-ticket-chevron">›</span><div class="asp-ticket-grid"><span><small>Ticket Number</small><strong>#${esc(x.ticketNumber)} <em>${esc(x.ticketId)}</em></strong></span><span><small>Closed</small><strong>${esc(closedWhen(x.closedAt))}</strong></span><span class="asp-ticket-concern"><small>Concern</small><strong>${esc(x.concernLabel||'Support Concern')}</strong></span></div>`;item.onclick=()=>modal(x);ticketList.appendChild(item)
      });
      card.appendChild(box)
    }catch(e){console.warn('Ticket history unavailable:',e)}finally{rendering=false}
  }

  function modal(t){
    document.querySelector('[data-ticket-modal]')?.remove();const m=document.createElement('div');m.dataset.ticketModal='1';m.className='asp-ticket-modal-v7';
    m.innerHTML=`<section><div class="asp-ticket-modal-head"><div><span>${esc(t.ticketId||'Support Ticket')}</span><strong>${esc(t.concernLabel||'Support Ticket')}</strong><small>Closed ${esc(closedWhen(t.closedAt))}</small></div><button type="button" data-close>×</button></div><div data-msgs></div></section>`;
    const msgs=m.querySelector('[data-msgs]');(t.messages||[]).forEach(x=>{if(x.system)return;const p=document.createElement('div');p.className=`asp-ticket-modal-msg ${x.sender==='admin'?'admin':'customer'}`;p.innerHTML=`<strong>${x.sender==='admin'?'Budgetingwise Support':'Customer'}</strong><div>${esc(x.text||'[Attachment]')}</div>`;msgs.appendChild(p)});if(!(t.messages||[]).some(x=>!x.system))msgs.innerHTML='<div class="asp-ticket-empty">No conversation transcript available.</div>';
    m.querySelector('[data-close]').onclick=()=>m.remove();m.onclick=e=>{if(e.target===m)m.remove()};document.body.appendChild(m)
  }

  if(!document.getElementById('aspTicketHistoryV7Style')){const style=document.createElement('style');style.id='aspTicketHistoryV7Style';style.textContent=`
.asp-ticket-history-v7{margin-top:15px;padding-top:14px;border-top:1px solid #ece9f8}.asp-ticket-history-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:9px}.asp-ticket-history-head small{display:block;color:#877fac;font-size:8px;font-weight:900;letter-spacing:.12em}.asp-ticket-history-head strong{display:block;margin-top:3px;color:#2f2945;font-size:10px}.asp-ticket-summary{position:relative;width:100%;margin:7px 0;padding:12px 30px 12px 12px;border:1px solid #e6e1f8;border-radius:12px;background:linear-gradient(180deg,#fff,#fbfaff);text-align:left;cursor:pointer;box-shadow:0 5px 15px rgba(61,45,126,.05);transition:.15s ease}.asp-ticket-summary:hover{transform:translateY(-1px);border-color:#cfc5fb;box-shadow:0 9px 20px rgba(61,45,126,.09)}.asp-ticket-grid{display:grid;gap:9px}.asp-ticket-grid span{display:block}.asp-ticket-grid small{display:block;color:#8b85a0;font-size:8px;font-weight:700}.asp-ticket-grid strong{display:block;margin-top:2px;color:#29243d;font-size:10px;line-height:1.35}.asp-ticket-grid em{margin-left:4px;color:#6a55d7;font-size:8px;font-style:normal;font-weight:800}.asp-ticket-concern strong{color:#4b36bf}.asp-ticket-chevron{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:#765fe3;font-size:20px;font-weight:400}.asp-ticket-empty{padding:12px;border:1px dashed #e1ddef;border-radius:10px;color:#8e889d;font-size:9px;text-align:center}.asp-ticket-modal-v7{position:fixed;inset:0;z-index:99999;background:rgba(20,18,38,.5);display:grid;place-items:center;padding:20px}.asp-ticket-modal-v7>section{width:min(580px,96vw);max-height:82vh;overflow:auto;background:#fff;border-radius:18px;padding:18px;box-shadow:0 26px 80px rgba(0,0,0,.22)}.asp-ticket-modal-head{display:flex;justify-content:space-between;gap:12px;padding-bottom:13px;border-bottom:1px solid #efecf8}.asp-ticket-modal-head span{display:block;color:#6048d9;font-size:9px;font-weight:900}.asp-ticket-modal-head strong{display:block;margin-top:4px;color:#27223d;font-size:14px}.asp-ticket-modal-head small{display:block;margin-top:4px;color:#868097;font-size:9px}.asp-ticket-modal-head button{border:0;background:#f4f1ff;color:#6048d9;width:30px;height:30px;border-radius:9px;font-size:19px;cursor:pointer}.asp-ticket-modal-msg{margin:9px 0;padding:10px 12px;border-radius:11px;background:#f7f7fa;color:#2b273d;font-size:10px;line-height:1.45}.asp-ticket-modal-msg.admin{background:#f0edff}.asp-ticket-modal-msg>strong{display:block;margin-bottom:4px;color:#6a58c8;font-size:8px}
`;document.head.appendChild(style)}

  new MutationObserver(()=>setTimeout(()=>{trimAdminTranscript();render()},90)).observe(profile,{childList:true,subtree:true});
  const msgBox=document.getElementById('aspMessages');if(msgBox)new MutationObserver(()=>trimAdminTranscript()).observe(msgBox,{childList:true,subtree:true});
  list.addEventListener('click',()=>setTimeout(render,180));
  setInterval(()=>{if(list.querySelector('[data-thread].active'))render()},900);
  render()
}

(async()=>{try{await services();if(document.getElementById('adminApp')||/^\/admin(?:\/|$)/i.test(location.pathname))await admin();else await customer()}catch(e){console.warn('Ticket history initialization unavailable:',e)}})();
