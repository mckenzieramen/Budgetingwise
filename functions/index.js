const {onCall,HttpsError}=require('firebase-functions/v2/https');
const {initializeApp}=require('firebase-admin/app');
const {getAuth}=require('firebase-admin/auth');
const {getFirestore,FieldValue}=require('firebase-admin/firestore');
initializeApp();
const db=getFirestore();
const callableOptions={region:'us-central1',cors:['https://budgetingwise.pages.dev','http://localhost:8788','http://localhost:5000','http://127.0.0.1:8788','http://127.0.0.1:5000']};
function adminOnly(request){if(!request.auth||request.auth.token.admin!==true)throw new HttpsError('permission-denied','Admin authorization required.');}
function cleanBudgetId(v){return String(v||'').trim().toUpperCase();}
function cleanEmail(v){return String(v||'').trim().toLowerCase();}
function firebaseError(e,fallback){const code=String(e?.code||'');if(code.includes('email-already-exists'))return new HttpsError('already-exists','That email address already has an account.');if(code.includes('invalid-email'))return new HttpsError('invalid-argument','Please enter a valid email address.');if(code.includes('invalid-password'))return new HttpsError('invalid-argument','Temporary password must be at least 6 characters.');return new HttpsError('internal',e?.message||fallback);}
exports.createBudgetUser=onCall(callableOptions,async request=>{
  adminOnly(request);
  const {firstName,lastName,email,budgetId,tempPassword}=request.data||{};
  const bid=cleanBudgetId(budgetId),loginEmail=cleanEmail(email),first=String(firstName||'').trim(),last=String(lastName||'').trim();
  if(!first||!loginEmail||!bid||!tempPassword)throw new HttpsError('invalid-argument','First name, email, Budget ID and temporary password are required.');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail))throw new HttpsError('invalid-argument','Please enter a valid email address.');
  if(!/^BID[0-9A-Z_-]+$/.test(bid))throw new HttpsError('invalid-argument','Budget ID must start with BID and contain only letters, numbers, hyphens or underscores.');
  if(String(tempPassword).length<6)throw new HttpsError('invalid-argument','Temporary password must be at least 6 characters.');
  const existing=await db.collection('users').where('budgetId','==',bid).limit(1).get();
  if(!existing.empty)throw new HttpsError('already-exists','Budget ID already exists.');
  let createdUser=null;
  try{
    try{await getAuth().getUserByEmail(loginEmail);throw new HttpsError('already-exists','That email address already has an account.');}catch(e){if(e instanceof HttpsError)throw e;if(e?.code!=='auth/user-not-found')throw e;}
    createdUser=await getAuth().createUser({email:loginEmail,password:String(tempPassword),displayName:`${first} ${last}`.trim(),emailVerified:false,disabled:false});
    await db.collection('users').doc(createdUser.uid).set({budgetId:bid,firstName:first,lastName:last,email:loginEmail,authEmail:loginEmail,status:'active',mustChangePassword:true,createdAt:FieldValue.serverTimestamp(),createdBy:request.auth.uid});
    return {uid:createdUser.uid,budgetId:bid,email:loginEmail};
  }catch(e){
    if(createdUser){try{await getAuth().deleteUser(createdUser.uid);}catch(cleanupError){console.error('Failed to roll back partially created user',createdUser.uid,cleanupError);}}
    if(e instanceof HttpsError)throw e;
    console.error('createBudgetUser failed',{code:e?.code,message:e?.message});
    throw firebaseError(e,'Unable to create client account.');
  }
});
exports.setUserStatus=onCall(callableOptions,async request=>{adminOnly(request);const {uid,status}=request.data||{};if(!uid||!['active','suspended'].includes(status))throw new HttpsError('invalid-argument','Invalid user status.');await db.collection('users').doc(uid).update({status});await getAuth().updateUser(uid,{disabled:status==='suspended'});return {ok:true};});
