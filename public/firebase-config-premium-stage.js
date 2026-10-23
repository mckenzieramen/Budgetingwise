// Firebase Web App configuration for Budgetingwise (client-side identifiers, not admin secrets).
// Project: budgetingwise-78b3a
export const firebaseConfig = {
  apiKey: "AIzaSyD9FNrKoUoooJDHufn_acRAKFchUq_Xb6I",
  authDomain: "budgetingwise-78b3a.firebaseapp.com",
  projectId: "budgetingwise-78b3a",
  storageBucket: "budgetingwise-78b3a.firebasestorage.app",
  messagingSenderId: "113871749594",
  appId: "1:113871749594:web:3206ded3c56abaafe3c0e3"
};

if(!document.getElementById('bwSupportPremiumCss')){
  const premium=document.createElement('link');
  premium.id='bwSupportPremiumCss';
  premium.rel='stylesheet';
  premium.href='/support-ticket-premium-v1.css?v=support-premium-v1';
  document.head.appendChild(premium);
}

if(document.getElementById('adminApp') || /^\/admin(?:\/|$)/i.test(location.pathname)){
  if(!document.getElementById('newTempPassword')){
    const compat=document.createElement('div');
    compat.hidden=true;
    compat.setAttribute('aria-hidden','true');
    compat.innerHTML='<input id="newTempPassword" type="password" value=""><button id="generatePassword" type="button" tabindex="-1"></button><button id="toggleTempPassword" type="button" tabindex="-1"></button>';
    document.body.appendChild(compat);
  }
  setTimeout(()=>{
    import('./admin-secure-client-create-v1.js?v=recovery-registry-v3').catch(error=>console.warn('Secure admin recovery sync unavailable:',error));
    import('./support-ticket-lifecycle-v1.js?v=admin-actions-only-v1').catch(error=>console.warn('Admin account actions unavailable:',error));
  },0);
}else{
  setTimeout(()=>{
    import('./support-ticket-customer-v1.js?v=one-concern-history-v1').catch(error=>console.warn('Customer ticket lifecycle unavailable:',error));
    import('./support-ticket-newticket-fix-v1.js?v=new-ticket-handoff-v1').catch(error=>console.warn('New ticket handoff unavailable:',error));
  },0);
}
