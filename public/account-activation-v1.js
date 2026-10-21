import{initializeApp,getApps,getApp}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import{getAuth,signInWithEmailAndPassword,updatePassword,signOut}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';
import{getFirestore,doc,getDoc,updateDoc,serverTimestamp}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';
import{firebaseConfig}from'./firebase-config.js';

const app=getApps().length?getApp():initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);
const params=new URLSearchParams(location.search);
if(params.get('activate')==='1')mountActivation();

function mountActivation(){
  const login=document.getElementById('loginView');
  const dashboard=document.getElementById('dashboardView');
  if(dashboard)dashboard.classList.add('hidden');
  if(!login)return;
  login.classList.remove('hidden');
  login.innerHTML=`<div class="auth-card"><div class="login-logo-wrap"><img class="login-logo" src="icons/budgetingwise-b-logo.svg" alt="Budgetingwise logo" width="112" height="112"></div><p class="eyebrow">ACCOUNT ACTIVATION</p><h1>Activate your account</h1><p class="muted">Enter the details from your Budgetingwise welcome email. Your activation key is valid for 7 days.</p><form id="activationForm"><label>Registered email<input id="activationEmail" type="email" autocomplete="email" required></label><label>Budget ID<input id="activationBudgetId" type="text" autocomplete="off" required></label><label>Activation key<input id="activationKey" type="text" maxlength="8" autocomplete="one-time-code" required></label><button class="primary" type="submit">Verify activation key</button><p id="activationError" class="error"></p></form><form id="activationPasswordForm" class="hidden"><h2>Create your password</h2><p class="muted">Activation verified. Create the password you will use for future sign-ins.</p><label>New password<input id="activationNewPassword" type="password" minlength="6" autocomplete="new-password" required></label><label>Confirm password<input id="activationConfirmPassword" type="password" minlength="6" autocomplete="new-password" required></label><button class="primary" type="submit">Activate account</button><p id="activationPasswordError" class="error"></p></form><p class="guest-hint"><a href="./">Back to sign in</a></p></div>`;
  document.getElementById('activationForm').addEventListener('submit',verify);
  document.getElementById('activationPasswordForm').addEventListener('submit',finish);
}

async function verify(e){
  e.preventDefault();
  const error=document.getElementById('activationError'),button=e.currentTarget.querySelector('button');
  error.textContent='';button.disabled=true;
  const email=document.getElementById('activationEmail').value.trim().toLowerCase();
  const budgetId=document.getElementById('activationBudgetId').value.trim().toUpperCase();
  const key=document.getElementById('activationKey').value.trim().toUpperCase();
  try{
    const cred=await signInWithEmailAndPassword(auth,email,key);
    const ref=doc(db,'users',cred.user.uid),snap=await getDoc(ref);
    if(!snap.exists())throw new Error('Account record not found.');
    const data=snap.data();
    if(data.accountActivated===true){await signOut(auth);throw new Error('This account is already activated. Sign in using your password.');}
    if(String(data.budgetId||'').toUpperCase()!==budgetId){await signOut(auth);throw new Error('The Budget ID does not match this account.');}
    const expires=data.activationExpiresAt?.toMillis?.()||0;
    if(!expires||Date.now()>expires){await signOut(auth);throw new Error('This activation key has expired. Please request a new activation key from your administrator.');}
    e.currentTarget.classList.add('hidden');
    document.getElementById('activationPasswordForm').classList.remove('hidden');
  }catch(err){error.textContent=err?.message?.includes('Firebase')?'Invalid email, Budget ID, or activation key.':(err?.message||'Unable to verify activation key.');}
  finally{button.disabled=false;}
}

async function finish(e){
  e.preventDefault();
  const error=document.getElementById('activationPasswordError'),button=e.currentTarget.querySelector('button');
  error.textContent='';
  const password=document.getElementById('activationNewPassword').value;
  const confirm=document.getElementById('activationConfirmPassword').value;
  if(password.length<6){error.textContent='Password must be at least 6 characters.';return;}
  if(password!==confirm){error.textContent='Passwords do not match.';return;}
  if(!auth.currentUser){error.textContent='Activation session expired. Please verify your activation key again.';return;}
  button.disabled=true;
  try{
    await updatePassword(auth.currentUser,password);
    await updateDoc(doc(db,'users',auth.currentUser.uid),{accountActivated:true,mustChangePassword:false,activatedAt:serverTimestamp(),passwordChangedAt:serverTimestamp()});
    await signOut(auth);
    location.href='./?activated=1';
  }catch(err){error.textContent=err?.message||'Unable to activate account.';button.disabled=false;}
}
