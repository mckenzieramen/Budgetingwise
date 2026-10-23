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

const suite=import('./admin-support-suite-v1.js?v=suite-v3-navigation');
suite.then(()=>{
  const cleanSavedReplyButton=()=>document.getElementById('bwsSavedReplies')?.remove();
  cleanSavedReplyButton();
  setTimeout(cleanSavedReplyButton,250);

  setTimeout(()=>{
    const active=document.querySelector('#aspThreads [data-thread].active');
    if(active)active.click();
  },320);

  const syncPriority=()=>{
    const select=document.querySelector('#bwsTicketControls [data-priority]');
    if(!select)return;
    const value=(select.value||'Normal').toLowerCase();
    select.dataset.priority=value;
    const controls=document.getElementById('bwsTicketControls');
    if(controls)controls.dataset.priority=value;
  };
  document.addEventListener('change',e=>{
    if(e.target.matches('#bwsTicketControls [data-priority]'))syncPriority();
  });
  setTimeout(syncPriority,360);

  document.addEventListener('pointerdown',e=>{
    const tab=e.target.closest('#bwsSupportTabs [data-tab]');
    if(!tab)return;
    document.querySelectorAll('#bwsSupportTabs [data-tab]').forEach(b=>b.classList.toggle('active',b===tab));
  },true);

  // Foldable support rails. Collapsed rails preview on hover and can be pinned open.
  const setupRails=()=>{
    const layout=document.querySelector('#adminSupportPanel .asp-layout');
    const left=document.querySelector('#adminSupportPanel .asp-inbox');
    const right=document.querySelector('#adminSupportPanel .asp-profile');
    if(!layout||!left||!right||layout.dataset.foldReady)return;
    layout.dataset.foldReady='1';
    const make=(panel,side)=>{
      panel.classList.add('bws-fold-panel',`bws-fold-${side}`);
      const btn=document.createElement('button');
      btn.type='button';btn.className='bws-fold-toggle';btn.dataset.side=side;
      btn.setAttribute('aria-label',`Toggle ${side} support panel`);
      btn.title=`Fold / pin ${side} panel`;
      btn.innerHTML=side==='left'?'‹':'›';
      panel.prepend(btn);
      let pinned=true;
      const apply=()=>{
        layout.classList.toggle(`bws-${side}-collapsed`,!pinned);
        panel.classList.toggle('bws-collapsed',!pinned);
        btn.classList.toggle('is-collapsed',!pinned);
        btn.innerHTML=side==='left'?(pinned?'‹':'›'):(pinned?'›':'‹');
        btn.setAttribute('aria-expanded',String(pinned));
      };
      btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();pinned=!pinned;apply()});
      panel.addEventListener('mouseenter',()=>{if(!pinned)layout.classList.add(`bws-${side}-peek`)});
      panel.addEventListener('mouseleave',()=>layout.classList.remove(`bws-${side}-peek`));
      apply();
    };
    make(left,'left');make(right,'right');
  };
  setupRails();
  setTimeout(setupRails,450);
}).catch(err=>console.warn('Enhanced Admin Support unavailable:',err));

if(!document.getElementById('bwsSupportStatePatch')){
  const style=document.createElement('style');
  style.id='bwsSupportStatePatch';
  style.textContent=`
    #bwsSavedReplies{display:none!important}
    #bwsSupportTabs{position:relative;z-index:8;pointer-events:auto!important}
    #bwsSupportTabs [data-tab]{position:relative;z-index:9;pointer-events:auto!important;user-select:none}
    #bwsTicketControls [data-priority]{font-weight:900!important;transition:.16s ease;border-width:1px!important}
    #bwsTicketControls [data-priority="low"]{color:#2563eb!important;background:#eff6ff!important;border-color:#bfdbfe!important}
    #bwsTicketControls [data-priority="normal"]{color:#15803d!important;background:#f0fdf4!important;border-color:#bbf7d0!important}
    #bwsTicketControls [data-priority="high"]{color:#c2410c!important;background:#fff7ed!important;border-color:#fed7aa!important}
    #bwsTicketControls [data-priority="urgent"]{color:#b91c1c!important;background:#fef2f2!important;border-color:#fecaca!important}
    #bwsSupportTabs [data-tab]:hover{background:#f7f5ff!important;color:#5e46e6!important}
    #bwsSupportTabs [data-tab].active{background:#faf9ff!important;color:#5e46e6!important}

    #adminSupportPanel .asp-layout{transition:grid-template-columns .28s cubic-bezier(.2,.8,.2,1)!important}
    #adminSupportPanel .bws-fold-panel{position:relative;transition:width .28s ease,min-width .28s ease,padding .28s ease,box-shadow .2s ease;overflow:hidden}
    #adminSupportPanel .bws-fold-toggle{position:absolute;top:10px;z-index:40;width:26px;height:26px;border:1px solid #ddd7f8;border-radius:8px;background:#fff;color:#5e46e6;font-size:18px;font-weight:900;line-height:22px;cursor:pointer;box-shadow:0 4px 12px #33287b1c;transition:transform .18s ease,background .18s ease}
    #adminSupportPanel .bws-fold-toggle:hover{background:#f3f0ff;transform:scale(1.06)}
    #adminSupportPanel .bws-fold-left .bws-fold-toggle{right:8px}
    #adminSupportPanel .bws-fold-right .bws-fold-toggle{left:8px}
    #adminSupportPanel .asp-chat,#adminSupportPanel .asp-messages,#bwsSupportTabs,#bwsTabPanel{transition:width .28s ease,padding .28s ease}

    #adminSupportPanel .asp-layout.bws-left-collapsed{grid-template-columns:48px minmax(620px,1fr) minmax(300px,22%)!important}
    #adminSupportPanel .asp-layout.bws-right-collapsed{grid-template-columns:minmax(250px,20%) minmax(620px,1fr) 48px!important}
    #adminSupportPanel .asp-layout.bws-left-collapsed.bws-right-collapsed{grid-template-columns:48px minmax(620px,1fr) 48px!important}
    #adminSupportPanel .bws-fold-panel.bws-collapsed{min-width:48px!important;width:48px!important;padding-left:0!important;padding-right:0!important}
    #adminSupportPanel .bws-fold-panel.bws-collapsed>*:not(.bws-fold-toggle){opacity:0;pointer-events:none;transition:opacity .12s ease}

    #adminSupportPanel .asp-layout.bws-left-collapsed.bws-left-peek{grid-template-columns:minmax(250px,20%) minmax(620px,1fr) minmax(300px,22%)!important}
    #adminSupportPanel .asp-layout.bws-right-collapsed.bws-right-peek{grid-template-columns:minmax(250px,20%) minmax(620px,1fr) minmax(300px,22%)!important}
    #adminSupportPanel .asp-layout.bws-left-collapsed.bws-right-collapsed.bws-left-peek{grid-template-columns:minmax(250px,20%) minmax(620px,1fr) 48px!important}
    #adminSupportPanel .asp-layout.bws-left-collapsed.bws-right-collapsed.bws-right-peek{grid-template-columns:48px minmax(620px,1fr) minmax(300px,22%)!important}
    #adminSupportPanel .bws-fold-left.bws-collapsed:hover,#adminSupportPanel .bws-fold-right.bws-collapsed:hover{width:auto!important;min-width:0!important}
    #adminSupportPanel .bws-fold-panel.bws-collapsed:hover>*:not(.bws-fold-toggle){opacity:1;pointer-events:auto;transition:opacity .18s ease .08s}

    @media(max-width:1250px){
      #adminSupportPanel .asp-layout.bws-left-collapsed{grid-template-columns:48px minmax(500px,1fr) 260px!important}
      #adminSupportPanel .asp-layout.bws-right-collapsed{grid-template-columns:230px minmax(500px,1fr) 48px!important}
      #adminSupportPanel .asp-layout.bws-left-collapsed.bws-right-collapsed{grid-template-columns:48px minmax(500px,1fr) 48px!important}
    }
    @media(max-width:980px){#adminSupportPanel .bws-fold-right .bws-fold-toggle{display:none}}
  `;
  document.head.appendChild(style);
}
