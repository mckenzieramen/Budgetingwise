import 'https://cdn.jsdelivr.net/gh/mckenzieramen/Budgetingwise@ec1c19c5a87dc239619152546f9b56f506fa6525/public/admin-support-v1.js';

// Small UI patch: include Open in the compose status menu without touching the
// stable support implementation above.
const addOpenStatus=()=>{
  const menu=document.getElementById('aspStateMenu');
  if(!menu||menu.querySelector('[data-compose-status="open"]'))return;
  const open=document.createElement('button');
  open.type='button';
  open.dataset.composeStatus='open';
  open.innerHTML='<span class="asp-state-dot open"></span>Open';
  menu.prepend(open);
  open.addEventListener('click',async()=>{
    // Reuse the support UI by updating the selected label, then persist through
    // the same Firestore document used by the active ticket.
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