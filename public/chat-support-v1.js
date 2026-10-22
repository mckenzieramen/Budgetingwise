// Customer/guest Chat Support must never run inside the Admin Portal.
if(document.getElementById('adminApp') || /^\/admin(?:\/|$)/i.test(location.pathname)){
  console.info('Customer Chat Support disabled on Admin Portal.');
}else{
  import('./chat-support-customer-v2.js?v=customer-support-v3').then(()=>{
    // Premium star-rating interaction: selected rating stays gold and all stars
    // up to the selected value are highlighted immediately.
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
