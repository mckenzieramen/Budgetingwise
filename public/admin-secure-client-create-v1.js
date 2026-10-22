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
let syncRunning=false,syncQueued=false,syncTimer=0;

function secureActivationKey(){
  const bytes=new Uint8Array(8);crypto.getRandomValues(bytes);
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
  const res=await fetch(ACCOUNT_SERVICES_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});
  const text=await res.text();let data={};
  try{data=text?JSON.parse(text):{}}catch{throw new Error('Account service returned an invalid response.');}
  if(!res.ok||data.ok===false||data.success===false)throw new Error(data.message||data.error||'Account service request failed.');
  return data;
}
async function requestWelcomeEmail({firstName,lastName,email,budgetId,activationKey,activationExpiresAt}){
  return postAccountService({action:'welcome',firstName,lastName,email,budgetId,activationKey,activationExpiresAt,loginUrl:'https://budgetingwise.pages.dev/?activate=1'});
}
async function syncRecoveryIdentity({uid,email,budgetId,firstName,lastName,status,accountActivated,adminIdToken}){
  if(!uid||!email||!budgetId||!adminIdToken)return;
  return postAccountService({action:'syncRecoveryIdentity',uid,email:String(email).trim().toLowerCase(),budgetId:String(budgetId).trim().toUpperCase(),firstName:firstName||'Customer',lastName:lastName||'',status:status||'active',accountActivated:accountActivated===true,adminIdToken});
}
async function syncAllRecoveryIdentities(user){
  if(!user||syncRunning){syncQueued=true;return;}
  syncRunning=true;
  try{
    const token=await getIdTokenResult(user,true);
    if(token.claims.admin!==true)return;
    const snap=await getDocs(collection(adminDb,'users'));
    for(const d of snap.docs){
      const u=d.data()||{};
      const email=String(u.email||u.authEmail||'').trim().toLowerCase();
      const budgetId=String(u.budgetId||'').trim().toUpperCase();
      if(u.role==='admin'||!d.id||!email||!budgetId)continue;
      try{await syncRecoveryIdentity({uid:d.id,email,budgetId,firstName:u.firstName||'Customer',lastName:u.lastName||'',status:u.status||'active',accountActivated:u.accountActivated===true,adminIdToken:token.token});}
      catch(err){console.warn('Recovery identity sync failed:',d.id,err);}
    }
  }finally{
    syncRunning=false;
    if(syncQueued){syncQueued=false;scheduleRecoverySync(250);}
  }
}
function scheduleRecoverySync(delay=150){
  clearTimeout(syncTimer);
  syncTimer=setTimeout(()=>{const user=auth.currentUser;if(user)syncAllRecoveryIdentities(user).catch(err=>console.warn('Recovery identity sync skipped:',err));},delay);
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

onAuthStateChanged(auth,user=>{if(user)scheduleRecoverySync(50);});
$('adminRefresh')?.addEventListener('click',()=>scheduleRecoverySync(500));
const listMessage=$('listMessage');
if(listMessage){
  new MutationObserver(()=>{if(/client(?:s)? found/i.test(listMessage.textContent||''))scheduleRecoverySync(200);}).observe(listMessage,{childList:true,subtree:true,characterData:true});
}

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

    let syncOk=true,welcomeOk=true;
    try{await syncRecoveryIdentity({uid:cred.user.uid,email,budgetId,firstName,lastName,status:'active',accountActivated:false,adminIdToken:token.token});}catch(err){syncOk=false;console.warn('New client recovery sync failed:',err);}
    try{await requestWelcomeEmail({firstName,lastName,email,budgetId,activationKey,activationExpiresAt:new Date(activationExpiresAtMs).toISOString()});}catch(err){welcomeOk=false;console.warn('Activation email request failed:',err);}
    await signOut(clientAuth);

    message.textContent=syncOk&&welcomeOk?'Client account created successfully. Activation email requested and recovery identity synced.':syncOk?'Client account created and recovery identity synced, but the activation email could not be sent.':'Client account created, but recovery synchronization needs a retry after the account service is updated.';
    message.className=syncOk&&welcomeOk?'success':'error';
    const createdBox=$('createdPasswordBox'),createdText=$('createdAccountText');
    if(createdText)createdText.textContent='';
    if(createdBox){createdBox.classList.add('hidden');createdBox.style.display='none';}
    form.reset();setTimeout(()=>$('adminRefresh')?.click(),150);
  }catch(err){console.error('Secure client creation failed:',err);message.textContent=friendlyError(err);message.className='error';}
  finally{if(secondaryApp)try{await deleteApp(secondaryApp)}catch{}if(btn)btn.disabled=false;}
},true);
