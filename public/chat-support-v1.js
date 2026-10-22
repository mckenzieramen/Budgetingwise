// Customer/guest Chat Support must never run inside the Admin Portal.
// The admin has its own isolated support inbox (admin-support-v1.js).
if(document.getElementById('adminApp') || /^\/admin(?:\/|$)/i.test(location.pathname)){
  console.info('Customer Chat Support disabled on Admin Portal.');
}else{
  import('./chat-support-customer-v2.js?v=customer-support-v2').catch(err=>console.warn('Customer support unavailable:',err));
}
