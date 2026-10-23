import './admin-support-core-v1.js?v=local-core-v2';

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
    const firestore=await import('https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js');
    const firebaseApp=await import('https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js');
    await firestore.setDoc(firestore.doc(firestore.getFirestore(firebaseApp.getApp()),'supportThreads',active.dataset.thread),{status:'open',customerCanReply:true,updatedAt:firestore.serverTimestamp()},{merge:true});
  });
};
setTimeout(addOpenStatus,0);
document.addEventListener('click',()=>setTimeout(addOpenStatus,0));

import('./chat-ticket-history-v3.js?v=ticket-history-v3').catch(err=>console.warn('Support ticket history unavailable:',err));
import('./admin-ticket-history-sort-v1.js?v=history-sort-v1').catch(err=>console.warn('Ticket history sort unavailable:',err));
import('./admin-support-suite-v1.js?v=suite-v2-safe').catch(err=>console.warn('Enhanced Admin Support unavailable:',err));
