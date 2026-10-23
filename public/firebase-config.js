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

// Admin compatibility/recovery bootstrap. The current Admin DOM no longer includes
// the legacy password controls that admin.js still probes during startup. Provide
// inert hidden placeholders so the existing admin module can finish loading, then
// load the secure activation + recovery-registry layer after the default app exists.
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
  },0);
}

// Ticket lifecycle and secure support actions. Kept separate from the base Firebase
// config so support tickets stay one-concern-per-ticket and archived history remains
// stable across customer and Admin views.
setTimeout(()=>{
  import('./support-ticket-lifecycle-v1.js?v=one-concern-ticket-v1')
    .catch(error=>console.warn('Support ticket lifecycle unavailable:',error));
},0);
