import{initializeApp,getApps}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import{firebaseConfig}from'./firebase-config.js';

// Customer/guest Chat Support must never run inside the Admin Portal.
if(document.getElementById('adminApp') || /^\/admin(?:\/|$)/i.test(location.pathname)){
  console.info('Customer Chat Support disabled on Admin Portal.');
}else{
  // The stable customer support module expects Firebase's [DEFAULT] app.
  // Guest-only pages can otherwise reach it before a default app exists.
  if(!getApps().some(app=>app.name==='[DEFAULT]')){
    try{initializeApp(firebaseConfig)}catch(err){
      if(!/already exists|duplicate-app/i.test(String(err?.message||err)))throw err;
    }
  }

  // Additive visual polish only. Existing Chat Support behavior stays untouched.
  const polishChatControls=()=>{
    if(!document.getElementById('bwChatControlPolish')){
      const style=document.createElement('style');
      style.id='bwChatControlPolish';
      style.textContent=`
#bwSupportSend{width:42px!important;min-width:42px!important;height:42px!important;padding:0!important;border:0!important;border-radius:13px!important;display:inline-grid!important;place-items:center!important;background:linear-gradient(135deg,#6f52f5,#5435dc)!important;color:#fff!important;box-shadow:0 7px 18px rgba(84,53,220,.24)!important;cursor:pointer!important;transition:transform .16s ease,box-shadow .16s ease,opacity .16s ease!important;font-size:0!important;line-height:0!important}
#bwSupportSend:hover{transform:translateY(-1px)!important;box-shadow:0 10px 22px rgba(84,53,220,.30)!important}
#bwSupportSend:active{transform:scale(.96)!important}
#bwSupportSend:disabled{opacity:.48!important;cursor:not-allowed!important;transform:none!important}
#bwSupportSend .bw-send-icon{width:18px;height:18px;display:block;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.bw-support-quick-actions{gap:9px!important}
.bw-support-quick-actions button,[data-send-otp],[data-verify],[data-change]{min-height:40px!important;border-radius:11px!important;font-weight:750!important;letter-spacing:.01em!important;transition:transform .15s ease,box-shadow .15s ease,border-color .15s ease!important}
.bw-support-quick-actions button{padding:10px 11px!important;border:1px solid #e4e0fb!important;background:#fff!important;color:#40366f!important;box-shadow:0 3px 10px rgba(54,43,112,.06)!important}
.bw-support-quick-actions button:hover{border-color:#c8bef9!important;background:#faf9ff!important;box-shadow:0 7px 16px rgba(54,43,112,.10)!important}
[data-send-otp],[data-verify],[data-change]{padding:10px 15px!important;border:0!important;background:linear-gradient(135deg,#6f52f5,#5435dc)!important;color:#fff!important;box-shadow:0 6px 15px rgba(84,53,220,.18)!important}
[data-resend],[data-back],[data-otp-back]{padding:7px 2px!important;border:0!important;background:transparent!important;font-weight:700!important;text-decoration:none!important}
.bw-flow-back{background:#f8f7fc!important;border-color:#ebe8f7!important;color:#716b88!important;text-align:center!important}
`;
      document.head.appendChild(style);
    }
    const send=document.getElementById('bwSupportSend');
    if(send && !send.querySelector('.bw-send-icon')){
      send.innerHTML='<svg class="bw-send-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 2 11 13"></path><path d="m22 2-7 20-4-9-9-4Z"></path></svg>';
      send.setAttribute('aria-label','Send message');
      send.setAttribute('title','Send message');
    }
  };

  polishChatControls();
  new MutationObserver(polishChatControls).observe(document.documentElement,{childList:true,subtree:true});

  import('./chat-support-customer-v2.js?v=customer-support-v6').then(()=>{
    polishChatControls();
    import('./chat-ticket-history-v3.js?v=ticket-history-v6').catch(err=>console.warn('Ticket history unavailable:',err));
    document.addEventListener('click',event=>{
      const star=event.target.closest('.bw-support-stars [data-rate]');
      if(!star)return;
      const rating=Number(star.dataset.rate||0);
      document.querySelectorAll('.bw-support-stars [data-rate]').forEach(button=>{
        button.classList.toggle('selected',Number(button.dataset.rate)<=rating);
        button.setAttribute('aria-pressed',Number(button.dataset.rate)===rating?'true':'false');
      });
    },true);
  }).catch(err=>console.warn('Customer support unavailable:',err));
}
