import{initializeApp,deleteApp,getApp}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import{getAuth,createUserWithEmailAndPassword,signOut,getIdTokenResult,setPersistence,inMemoryPersistence,onAuthStateChanged}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';
import{getFirestore,doc,setDoc,serverTimestamp,Timestamp,collection,getDocs}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';
import{firebaseConfig}from'./firebase-config.js';

const $=id=>document.getElementById(id);
const mainApp=getApp();
const auth=getAuth(mainApp);
const adminDb=getFirestore(mainApp);
const ACCOUNT_SERVICES_URL='https://script.google.com/macros/s/AKfycbz4wg4sG9c8fluO1F5233W3OgS-Qce06Wtzq1c_C-K18I9EuWd_Hzo_AEBmlppQi1jm/exec';
const ACTIVATION_VALID_MS=7*24*60*60*1000;

function secureActivationKey(){
  const bytes=new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from(bytes,b=>alphabet[b%alphabet.length]).join('');
}
function friendlyError(e){
  const code=String(e?.code||'');
  if(code.includes('email-already-in-use'))return'This customer email already has a login account.';
  if(code.includes('invalid-email'))return'Enter a valid customer email address.';
  if(code.includes('permission-denied'))return'Your admin session does not currently have permission to save this customer profile. Please sign out and sign in again.';
  return String(e?.message||'Unable to create this client account.').replace(/^Firebase:\s*/,'');
}
async function postAccountService(payload){
  await fetch(ACCOUNT_SERVICES_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});
}
async function requestWelcomeEmail({firstName,lastName,email,budgetId,activationKey,activationExpiresAt}){
  await postAccountService({action:'welcome',firstName,lastName,email,budgetId,activationKey,activationExpiresAt,loginUrl:'https://budgetingwise.pages.dev/?activate=1'});
}
async function syncRecoveryIdentity({uid,email,budgetId,firstName,adminIdToken}){
  if(!uid||!email||!budgetId||!adminIdToken)return;
  await postAccountService({action:'syncRecoveryIdentity',uid,email:String(email).trim().toLowerCase(),budgetId:String(budgetId).trim().toUpperCase(),firstName:firstName||'Customer',adminIdToken});
}
async function syncAllRecoveryIdentities(user){
  if(!user)return;
  const token=await getIdTokenResult(user,true);
  if(token.claims.admin!==true)return;
  const snap=await getDocs(collection(adminDb,'users'));
  const jobs=[];
  snap.forEach(d=>{
    const u=d.data()||{};
    if(u.role==='admin'||!u.email||!u.budgetId)return;
    jobs.push(syncRecoveryIdentity({uid:d.id,email:u.email,budgetId:u.budgetId,firstName:u.firstName||'Customer',adminIdToken:token.token}));
  });
  await Promise.allSettled(jobs);
}
function prepareSecureCreateUi(){
  const passwordInput=$('newTempPassword');
  const passwordLabel=passwordInput?.closest('label');
  if(passwordLabel)passwordLabel.style.display='none';
  if(passwordInput){passwordInput.required=false;passwordInput.value='';}
  const panel=$('createClientPanel');
  const hint=panel?.querySelector(':scope > .hint');
  if(hint)hint.textContent='A Budget ID and 8-character activation key are generated automatically. The activation key expires after 7 days.';
  const info=panel?.querySelector('.info-box');
  if(info)info.textContent='ⓘ The customer must activate the account first. After the activation key is verified, Budgetingwise requires the customer to create a new password.';
  const createdBox=$('createdPasswordBox');
  if(createdBox){createdBox.classList.add('hidden');createdBox.style.display='none';}
}
prepareSecureCreateUi();

onAuthStateChanged(auth,user=>{
  if(!user)return;
  syncAllRecoveryIdentities(user).catch(err=>console.warn('Recovery identity sync skipped:',err));
});

$('createUserForm')?.addEventListener('submit',async e=>{
  e.preventDefault();e.stopImmediatePropagation();
  const form=e.currentTarget,btn=e.submitter||form.querySelector('button[type="submit"]');
  if(btn)btn.disabled=true;
  const message=$('createMessage');message.textContent='Creating client account and requesting the activation email…';message.className='hint';
  let secondaryApp;
  try{
    const adminUser=auth.currentUser;
    if(!adminUser)throw new Error('Admin session expired. Please sign in again.');
    const token=await getIdTokenResult(adminUser,true);
    if(token.claims.admin!==true)throw new Error('This session is not authorized as an administrator. Please sign out and sign in again.');
    const firstName=$('newFirstName').value.trim(),lastName=$('newLastName').value.trim(),email=$('newEmail').value.trim().toLowerCase(),budgetId=$('newBudgetId').value.trim();
    if(!firstName||!email||!budgetId)throw new Error('Complete all required customer details.');

    const activationKey=secureActivationKey();
    const activationExpiresAtMs=Date.now()+ACTIVATION_VALID_MS;
    secondaryApp=initializeApp(firebaseConfig,`secure-client-${Date.now()}`);
    const clientAuth=getAuth(secondaryApp);
    await setPersistence(clientAuth,inMemoryPersistence);
    const cred=await createUserWithEmailAndPassword(clientAuth,email,activationKey);

    await setDoc(doc(adminDb,'users',cred.user.uid),{
      budgetId,firstName,lastName,email,authEmail:email,status:'active',accountActivated:false,mustChangePassword:true,
      activationExpiresAt:Timestamp.fromMillis(activationExpiresAtMs),createdAt:serverTimestamp(),lastLoginAt:null,createdBy:adminUser.uid
    });

    await syncRecoveryIdentity({uid:cred.user.uid,email,budgetId,firstName,adminIdToken:token.token});

    let welcomeRequested=true;
    try{await requestWelcomeEmail({firstName,lastName,email,budgetId,activationKey,activationExpiresAt:new Date(activationExpiresAtMs).toISOString()})}catch(welcomeErr){welcomeRequested=false;console.warn('Activation email request failed:',welcomeErr);}
    await signOut(clientAuth);
    message.textContent=welcomeRequested?'Client account created successfully. Activation email requested. The activation key is valid for 7 days.':'Client account created, but the activation email request could not be sent.';
    message.className=welcomeRequested?'success':'error';
    const createdBox=$('createdPasswordBox'),createdText=$('createdAccountText');
    if(createdText)createdText.textContent='';
    if(createdBox){createdBox.classList.add('hidden');createdBox.style.display='none';}
    form.reset();setTimeout(()=>$('adminRefresh')?.click(),150);
  }catch(err){console.error('Secure client creation failed:',err);message.textContent=friendlyError(err);message.className='error';}
  finally{if(secondaryApp)try{await deleteApp(secondaryApp)}catch{}if(btn)btn.disabled=false;}
},true);
