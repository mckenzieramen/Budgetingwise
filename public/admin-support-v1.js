// Local Admin Support wrapper. The core inbox is stored in this repository so navigation never depends on an external CDN.
import './admin-support-core-v1.js?v=local-core-v1';

const addOpenStatus=()=>{
  const menu=document.getElementById('aspStateMenu');
  if(!menu||menu.querySelector('[data-compose-status="open"]'))return;
  const open=document.createElement('button');
  open.type='button';
  open.dataset.composeStatus='open';
  open.innerHTML='<span class="asp-state-dot open"></span>Open';
  menu.prepend(open);
  open.addEventListener('click',async()=>{
    const label=document.getElementById('aspStateLabel');
    if(label)label.textContent='Open';
    menu.classList.add('hidden');
    const active=document.querySelector('#aspThreads [data-thread].active');
    if(!active)return;
    const {getFirestore,doc,setDoc,serverTimestamp}=await import('https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js');
    const {getApp}=await import('https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js');
    await setDoc(doc(getFirestore(getApp()),'supportThreads',active.dataset.thread),{status:'open',customerCanReply:true,updatedAt:serverTimestamp()},{merge:true});
  });
};
setTimeout(addOpenStatus,0);
document.addEventListener('click',()=>setTimeout(addOpenStatus,0));

import('./chat-ticket-history-v3.js?v=ticket-history-v3').catch(err=>console.warn('Support ticket history unavailable:',err));
import('./admin-ticket-history-sort-v1.js?v=history-sort-v1').catch(err=>console.warn('Ticket history sort unavailable:',err));
import('./admin-support-suite-v1.js?v=support-suite-v1').catch(err=>console.warn('Enhanced Admin Support unavailable:',err));
