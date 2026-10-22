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

  import('./chat-support-customer-v2.js?v=customer-support-v5').then(()=>{
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
