import{initializeApp,deleteApp,getApp}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import{getAuth,createUserWithEmailAndPassword,sendPasswordResetEmail,signOut,getIdTokenResult,setPersistence,inMemoryPersistence}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';
import{getFirestore,doc,setDoc,serverTimestamp}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';
import{firebaseConfig}from'./firebase-config.js';

const $=id=>document.getElementById(id);
const mainApp=getApp();
const auth=getAuth(mainApp);

function secureRandomPassword(){
  const bytes=new Uint8Array(18);
  crypto.getRandomValues(bytes);
  const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  return Array.from(bytes,b=>alphabet[b%alphabet.length]).join('');
}

function friendlyError(e){
  const code=String(e?.code||'');
  if(code.includes('email-already-in-use'))return'This customer email already has a login account.';
  if(code.includes('invalid-email'))return'Enter a valid customer email address.';
  if(code.includes('permission-denied'))return'Firestore denied this action. Check the deployed security rules.';
  return String(e?.message||'Unable to create this client account.').replace(/^Firebase:\s*/,'');
}

function prepareSecureCreateUi(){
  const passwordInput=$('newTempPassword');
  const passwordLabel=passwordInput?.closest('label');
  if(passwordLabel)passwordLabel.style.display='none';
  if(passwordInput){passwordInput.required=false;passwordInput.value='';}
  const panel=$('createClientPanel');
  const hint=panel?.querySelector(':scope > .hint');
  if(hint)hint.textContent='A Budget ID is assigned automatically. The customer receives a secure password setup email after the account is created.';
  const info=panel?.querySelector('.info-box');
  if(info)info.textContent='ⓘ No password is emailed or displayed. The customer sets a private password using the secure link sent to their registered email, then completes the first-login security step.';
  const created=$('createdPasswordBox');
  if(created)created.classList.add('hidden');
}

prepareSecureCreateUi();

$('createUserForm')?.addEventListener('submit',async e=>{
  e.preventDefault();
  e.stopImmediatePropagation();
  const form=e.currentTarget;
  const btn=e.submitter||form.querySelector('button[type="submit"]');
  if(btn)btn.disabled=true;
  const message=$('createMessage');
  message.textContent='Creating client account and sending secure setup email…';
  message.className='hint';
  let secondaryApp;
  try{
    const adminUser=auth.currentUser;
    if(!adminUser||!(await getIdTokenResult(adminUser,true)).claims.admin)throw new Error('Admin session expired. Please sign in again.');
    const firstName=$('newFirstName').value.trim();
    const lastName=$('newLastName').value.trim();
    const email=$('newEmail').value.trim().toLowerCase();
    const budgetId=$('newBudgetId').value.trim();
    if(!firstName||!email||!budgetId)throw new Error('Complete all required customer details.');

    const oneTimeBootstrap=secureRandomPassword();
    secondaryApp=initializeApp(firebaseConfig,`secure-client-${Date.now()}`);
    const clientAuth=getAuth(secondaryApp);
    const clientDb=getFirestore(secondaryApp);
    await setPersistence(clientAuth,inMemoryPersistence);
    const cred=await createUserWithEmailAndPassword(clientAuth,email,oneTimeBootstrap);

    await setDoc(doc(clientDb,'users',cred.user.uid),{
      budgetId,firstName,lastName,email,authEmail:email,status:'active',mustChangePassword:true,
      createdAt:serverTimestamp(),lastLoginAt:null,createdBy:adminUser.uid
    });

    await sendPasswordResetEmail(clientAuth,email);
    await signOut(clientAuth);

    message.textContent='Client account created. A secure password setup email was sent to the customer.';
    message.className='success';
    $('createdPasswordBox')?.classList.add('hidden');
    form.reset();
    setTimeout(()=>$('adminRefresh')?.click(),150);
  }catch(err){
    console.error('Secure client creation failed:',err);
    message.textContent=friendlyError(err);
    message.className='error';
  }finally{
    if(secondaryApp)try{await deleteApp(secondaryApp)}catch{}
    if(btn)btn.disabled=false;
  }
},true);
