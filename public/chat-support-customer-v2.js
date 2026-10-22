import 'https://cdn.jsdelivr.net/gh/mckenzieramen/Budgetingwise@ee7afdb702bdcb67e0796295090c3a412f859a80/public/chat-support-customer-v2.js';

// Additive customer workflow layer. Stable chat behavior remains in the pinned module above.
import{getApps,getApp}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import{getAuth}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';
import{getFirestore,doc,getDoc,setDoc,serverTimestamp}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';

const q=(s,p=document)=>p.querySelector(s),qa=(s,p=document)=>[...p.querySelectorAll(s)];
let selectedSurveyRating=0,surveySaving=false;

function activeServices(){
  for(const app of getApps()){
    try{
      const auth=getAuth(app),user=auth.currentUser;
      if(user)return{app,auth,user,db:getFirestore(app)}
    }catch{}
  }
  return null
}

function setDraft(text){
  const i=q('#bwSupportInput');
  if(!i)return;
  i.value=text;
  i.dispatchEvent(new Event('input',{bubbles:true}));
  i.focus()
}

function addStyle(){
  if(q('#bwWorkflowPolish'))return;
  const s=document.createElement('style');
  s.id='bwWorkflowPolish';
  s.textContent=`
.bw-support-quick-actions{display:grid!important;grid-template-columns:1fr 1fr;gap:8px!important;margin-top:10px!important}
.bw-support-quick-actions button{width:100%!important;min-height:42px!important;padding:9px 10px!important;border:1px solid #ddd7ff!important;border-radius:12px!important;background:linear-gradient(180deg,#fff,#f8f6ff)!important;color:#4f34d2!important;font-size:9px!important;font-weight:800!important;text-align:left!important;box-shadow:0 4px 11px rgba(73,52,170,.06);transition:transform .16s ease,box-shadow .16s ease,border-color .16s ease}
.bw-support-quick-actions button:hover{transform:translateY(-1px);border-color:#bfb3ff!important;box-shadow:0 8px 17px rgba(73,52,170,.12)}
.bw-support-quick-actions button:active{transform:scale(.98)}
.bw-workflow-picker>div,.bw-account-workflow>div,.bw-forgot-workflow>div{max-width:95%!important}
.bw-flow-title{display:block;font-size:11px;color:#202238;margin-bottom:3px}
.bw-flow-sub{display:block;font-size:8px;color:#858da3;font-weight:600;line-height:1.45}
.bw-flow-back{grid-column:1/-1!important;text-align:center!important;background:#fff!important;color:#777f94!important}
#bwSupportRating.bw-survey-card{padding:11px 14px 12px!important;background:linear-gradient(180deg,#fff,#fcfbff)!important}
.bw-survey-card .bw-support-stars{gap:3px!important;margin:4px 0 1px}
.bw-survey-card .bw-support-stars button{font-size:21px!important}
.bw-survey-submit{display:inline-flex!important;width:auto!important;min-width:92px!important;justify-content:center;align-items:center;margin:6px auto 0!important;padding:7px 12px!important;border:0!important;border-radius:9px!important;background:linear-gradient(135deg,#6847f5,#5638dc)!important;color:#fff!important;font:800 9px inherit!important;cursor:pointer!important;box-shadow:0 6px 14px rgba(86,56,220,.18)!important}
.bw-survey-submit:disabled{opacity:.65;cursor:wait!important}
.bw-survey-success{display:flex;flex-direction:column;align-items:center;gap:3px;padding:5px}
.bw-survey-success>span{width:27px;height:27px;display:grid;place-items:center;border-radius:50%;background:#eafaf3;color:#1f9d6a;font-weight:900}
.bw-survey-success strong{font-size:10px;color:#202238}
.bw-survey-success small{font-size:8px;color:#31a273}
#bwGuestStart{display:inline-flex!important;width:auto!important;min-width:132px!important;justify-content:center!important;align-items:center!important;margin:12px auto 0!important;padding:9px 14px!important;border:0!important;border-radius:10px!important;background:linear-gradient(135deg,#6847f5,#5638dc)!important;color:#fff!important;font:800 9px inherit!important;box-shadow:0 7px 16px rgba(86,56,220,.2)!important}
.bw-support-closed>button{width:auto!important;min-width:138px!important;padding:9px 14px!important;border-radius:10px!important;font-size:9px!important;box-shadow:0 6px 14px rgba(86,56,220,.17)}
@media(max-width:380px){.bw-support-quick-actions{grid-template-columns:1fr!important}.bw-flow-back{grid-column:auto!important}}
`;
  document.head.appendChild(s)
}

function mainPicker(){
  return `<div class="bw-support-message agent bw-workflow-picker"><div><p><strong class="bw-flow-title">Hi! 👋 How can we help?</strong><span class="bw-flow-sub">Tap a concern below. Our support bot will guide you step by step.</span></p><div class="bw-support-quick-actions"><button type="button" data-flow="activation">🔑 Activation key</button><button type="button" data-flow="account">👤 Account / login</button><button type="button" data-flow="budgeting">📊 Budgeting feature</button><button type="button" data-flow="general">💬 General question</button><button type="button" data-flow="error">⚠️ Report an error</button><button type="button" data-flow="suggestion">✨ Share a suggestion</button></div><time>Budgetingwise Support Bot</time></div></div>`
}

function showFreshPicker(){
  const m=q('#bwSupportMessages');
  if(!m||q('#bwGuestName',m))return;
  m.innerHTML='<div class="bw-support-day">New support ticket</div>'+mainPicker();
  bindFlows(m)
}

function bindFlows(scope=document){
  qa('[data-flow]',scope).forEach(b=>{
    if(b.dataset.workflowBound)return;
    b.dataset.workflowBound='1';
    b.onclick=()=>route(b.dataset.flow)
  })
}

function route(type){
  if(type==='account')return showAccountMenu();
  const map={
    activation:'Activation Key Request — Please send or resend my Budgetingwise activation key.',
    budgeting:'Budgeting Feature Concern — I need help with a Budgetingwise budgeting feature.',
    general:'General Question — I have a general question about Budgetingwise.',
    error:'Report an Error — I would like to report an error. Here are the details: ',
    suggestion:'Suggestion — I have a suggestion for Budgetingwise: '
  };
  setDraft(map[type]||map.general)
}

function showAccountMenu(){
  const m=q('#bwSupportMessages');
  if(!m)return;
  q('.bw-account-workflow',m)?.remove();
  const box=document.createElement('div');
  box.className='bw-support-message agent bw-account-workflow';
  box.innerHTML=`<div><p><strong class="bw-flow-title">👤 Account & Login</strong><span class="bw-flow-sub">What would you like help with?</span></p><div class="bw-support-quick-actions"><button type="button" data-account-flow="forgot">🔐 Forgot password</button><button type="button" data-account-flow="signin">↪️ Can't sign in</button><button type="button" data-account-flow="activation">✅ Account activation</button><button type="button" data-account-flow="change">🛡️ Change password</button><button type="button" data-account-flow="other">💬 Other concern</button><button type="button" class="bw-flow-back" data-account-flow="back">← Back to concerns</button></div><time>Budgetingwise Support Bot</time></div>`;
  m.appendChild(box);
  m.scrollTop=m.scrollHeight;
  qa('[data-account-flow]',box).forEach(b=>b.onclick=()=>accountRoute(b.dataset.accountFlow))
}

function accountRoute(type){
  if(type==='forgot')return forgotFlow();
  if(type==='back')return showFreshPicker();
  const map={
    signin:"Account / Login Concern — I can't sign in to my Budgetingwise account.",
    activation:'Account Activation Concern — I need help activating my Budgetingwise account.',
    change:'Change Password Concern — I need help changing my Budgetingwise password.',
    other:'Account / Login Concern — I need help with my Budgetingwise account.'
  };
  setDraft(map[type]||map.other)
}

// Secure password-recovery workflow.
const BW_ACCOUNT_SERVICES_URL='https://script.google.com/macros/s/AKfycbz4wg4sG9c8fluO1F5233W3OgS-Qce06Wtzq1c_C-K18I9EuWd_Hzo_AEBmlppQi1jm/exec';

async function bwRecoveryPost(payload){
  const res=await fetch(BW_ACCOUNT_SERVICES_URL,{
    method:'POST',
    headers:{'Content-Type':'text/plain;charset=utf-8'},
    body:JSON.stringify(payload)
  });
  const text=await res.text();
  let data={};
  try{data=JSON.parse(text)}catch{throw new Error('Invalid recovery service response.')}
  if(!res.ok||data.ok===false||data.success===false){
    throw new Error(data.message||data.error||'Recovery request failed.')
  }
  return data
}

function bwLockComposer(locked){
  const input=q('#bwSupportInput'),send=q('#bwSupportSend');
  if(input){
    input.disabled=locked;
    input.placeholder=locked?'Complete password recovery above…':'Type your message…'
  }
  if(send)send.disabled=locked
}

function bwPasswordError(password){
  if(password.length<8)return 'Password must be at least 8 characters.';
  if(!/[A-Z]/.test(password))return 'Add at least one uppercase letter.';
  if(!/[a-z]/.test(password))return 'Add at least one lowercase letter.';
  if(!/[0-9]/.test(password))return 'Add at least one number.';
  return ''
}

function forgotFlow(){
  const m=q('#bwSupportMessages');
  if(!m)return;
  q('.bw-forgot-workflow',m)?.remove();
  bwLockComposer(true);

  const box=document.createElement('div');
  box.className='bw-support-message agent bw-forgot-workflow';
  box.innerHTML=`<div>
    <p><strong class="bw-flow-title">🔐 Forgot Password</strong><span class="bw-flow-sub">Enter your registered email and BID#. We'll send an OTP to your registered email. Never send your password in chat.</span></p>
    <div data-step="identity" style="display:grid;gap:8px;margin-top:10px">
      <input data-email type="email" autocomplete="email" placeholder="Registered email" style="padding:11px;border:1px solid #ddd8ff;border-radius:10px;outline:none">
      <input data-bid autocomplete="off" placeholder="Budget ID (BID#)" style="padding:11px;border:1px solid #ddd8ff;border-radius:10px;outline:none">
      <button type="button" data-send-otp style="width:auto;justify-self:start;padding:9px 14px;border:0;border-radius:10px;background:linear-gradient(135deg,#6847f5,#5638dc);color:#fff;font-weight:800;cursor:pointer">Send OTP →</button>
      <button type="button" data-back style="width:auto;justify-self:start;padding:5px 0;border:0;background:none;color:#6d64a0;font-size:9px;cursor:pointer">← Back</button>
      <small data-identity-msg></small>
    </div>
    <div data-step="otp" style="display:none;gap:8px;margin-top:10px">
      <span class="bw-flow-sub">OTP sent to your registered email. Enter the code below.</span>
      <input data-otp inputmode="numeric" autocomplete="one-time-code" maxlength="8" placeholder="Enter OTP" style="padding:11px;border:1px solid #ddd8ff;border-radius:10px;outline:none;letter-spacing:3px">
      <button type="button" data-verify style="width:auto;justify-self:start;padding:9px 14px;border:0;border-radius:10px;background:linear-gradient(135deg,#6847f5,#5638dc);color:#fff;font-weight:800;cursor:pointer">Verify OTP →</button>
      <button type="button" data-resend style="width:auto;justify-self:start;padding:5px 0;border:0;background:none;color:#6847f5;font-size:9px;font-weight:800;cursor:pointer">Resend OTP</button>
      <button type="button" data-otp-back style="width:auto;justify-self:start;padding:5px 0;border:0;background:none;color:#6d64a0;font-size:9px;cursor:pointer">← Change email / BID#</button>
      <small data-otp-msg></small>
    </div>
    <div data-step="password" style="display:none;gap:8px;margin-top:10px">
      <div style="padding:9px 10px;border-radius:10px;background:#eefbf5;color:#18845a;font-size:9px;font-weight:800">✓ OTP verified successfully</div>
      <input data-password type="password" autocomplete="new-password" placeholder="Enter new password" style="padding:11px;border:1px solid #ddd8ff;border-radius:10px;outline:none">
      <input data-confirm type="password" autocomplete="new-password" placeholder="Re-enter new password" style="padding:11px;border:1px solid #ddd8ff;border-radius:10px;outline:none">
      <button type="button" data-change style="width:auto;justify-self:start;padding:9px 14px;border:0;border-radius:10px;background:linear-gradient(135deg,#6847f5,#5638dc);color:#fff;font-weight:800;cursor:pointer">Change password</button>
      <small data-password-msg></small>
    </div>
    <time>Budgetingwise Support Bot</time>
  </div>`;

  m.appendChild(box);
  m.scrollTop=m.scrollHeight;

  const identity=q('[data-step="identity"]',box);
  const otpStep=q('[data-step="otp"]',box);
  const passwordStep=q('[data-step="password"]',box);
  let email='',bid='',recoveryToken='';

  function show(step){
    identity.style.display=step==='identity'?'grid':'none';
    otpStep.style.display=step==='otp'?'grid':'none';
    passwordStep.style.display=step==='password'?'grid':'none';
    m.scrollTop=m.scrollHeight
  }

  q('[data-back]',box).onclick=()=>{
    bwLockComposer(false);
    showAccountMenu()
  };

  q('[data-otp-back]',box).onclick=()=>{
    recoveryToken='';
    q('[data-otp]',box).value='';
    show('identity')
  };

  q('[data-send-otp]',box).onclick=async()=>{
    const button=q('[data-send-otp]',box),msg=q('[data-identity-msg]',box);
    email=q('[data-email]',box).value.trim().toLowerCase();
    bid=q('[data-bid]',box).value.trim().toUpperCase();

    if(!email||!bid){
      msg.textContent='Please enter your registered email and Budget ID.';
      msg.style.color='#c04444';
      return
    }

    button.disabled=true;
    button.textContent='Sending OTP…';
    msg.textContent='';

    try{
      await bwRecoveryPost({action:'requestPasswordOtp',email,budgetId:bid,bid});
      show('otp');
      q('[data-otp]',box).focus()
    }catch(e){
      msg.textContent=e.message||'Unable to send OTP.';
      msg.style.color='#c04444'
    }finally{
      button.disabled=false;
      button.textContent='Send OTP →'
    }
  };

  q('[data-resend]',box).onclick=async()=>{
    const button=q('[data-resend]',box),msg=q('[data-otp-msg]',box);
    button.disabled=true;
    button.textContent='Sending…';
    msg.textContent='';

    try{
      await bwRecoveryPost({action:'requestPasswordOtp',email,budgetId:bid,bid});
      msg.textContent='A new OTP was sent to your registered email.';
      msg.style.color='#31a273'
    }catch(e){
      msg.textContent=e.message||'Unable to resend OTP.';
      msg.style.color='#c04444'
    }finally{
      button.disabled=false;
      button.textContent='Resend OTP'
    }
  };

  q('[data-verify]',box).onclick=async()=>{
    const otp=q('[data-otp]',box).value.trim();
    const button=q('[data-verify]',box),msg=q('[data-otp-msg]',box);

    if(!otp){
      msg.textContent='Enter the OTP from your email.';
      msg.style.color='#c04444';
      return
    }

    button.disabled=true;
    button.textContent='Verifying…';
    msg.textContent='';

    try{
      const result=await bwRecoveryPost({
        action:'verifyPasswordOtp',
        email,
        budgetId:bid,
        bid,
        otp
      });

      recoveryToken=result.recoveryToken||result.token||result.resetToken||'';
      if(!recoveryToken)throw new Error('Recovery token was not returned.');

      q('[data-otp]',box).value='';
      show('password');
      q('[data-password]',box).focus()
    }catch(e){
      msg.textContent=e.message||'Invalid or expired OTP.';
      msg.style.color='#c04444'
    }finally{
      button.disabled=false;
      button.textContent='Verify OTP →'
    }
  };

  q('[data-change]',box).onclick=async()=>{
    const password=q('[data-password]',box).value;
    const confirm=q('[data-confirm]',box).value;
    const button=q('[data-change]',box),msg=q('[data-password-msg]',box);
    const error=bwPasswordError(password);

    if(error){
      msg.textContent=error;
      msg.style.color='#c04444';
      return
    }

    if(password!==confirm){
      msg.textContent='Passwords do not match.';
      msg.style.color='#c04444';
      return
    }

    if(!recoveryToken){
      msg.textContent='Verification expired. Please verify your OTP again.';
      msg.style.color='#c04444';
      show('otp');
      return
    }

    button.disabled=true;
    button.textContent='Changing password…';
    msg.textContent='';

    try{
      await bwRecoveryPost({
        action:'changePasswordWithRecoveryToken',
        email,
        budgetId:bid,
        bid,
        recoveryToken,
        newPassword:password
      });

      q('[data-password]',box).value='';
      q('[data-confirm]',box).value='';
      recoveryToken='';

      box.innerHTML=`<div><div style="padding:14px;border-radius:14px;background:#eefbf5;text-align:center"><div style="width:34px;height:34px;margin:0 auto 7px;border-radius:50%;display:grid;place-items:center;background:#d9f6e9;color:#16865b;font-size:18px;font-weight:900">✓</div><strong class="bw-flow-title">Password successfully changed</strong><span class="bw-flow-sub">Your Budgetingwise password has been updated successfully. This support conversation will now close automatically.</span></div><time>Budgetingwise Support Bot</time></div>`;

      bwLockComposer(false);
      m.scrollTop=m.scrollHeight;

      setTimeout(()=>{
        const close=q('#bwCloseTicket')||
          q('[data-close-ticket]')||
          qa('button').find(b=>/close\s*(ticket|conversation)/i.test(b.textContent||''));
        if(close)close.click()
      },1200)
    }catch(e){
      msg.textContent=e.message||'Password could not be changed.';
      msg.style.color='#c04444'
    }finally{
      button.disabled=false;
      button.textContent='Change password'
    }
  }
}

function polishGuestGate(){
  const start=q('#bwGuestStart'),name=q('#bwGuestName');
  if(!start||start.dataset.polished)return;
  start.dataset.polished='1';
  const wrap=start.parentElement;
  if(wrap)wrap.style.cssText+=';max-width:290px;margin:0 auto;padding:22px 20px;text-align:center;background:linear-gradient(180deg,#fff,#faf9ff);border:1px solid #ebe7ff;border-radius:18px;box-shadow:0 12px 30px rgba(76,53,190,.09)';
  if(name)name.style.cssText='width:100%;box-sizing:border-box;margin-top:12px;padding:11px 13px;border:1px solid #ddd8ff;border-radius:11px;background:#fff;outline:none;font:600 11px inherit;color:#202238;box-shadow:0 3px 10px rgba(45,35,100,.04)';
  start.textContent='Start conversation →';
  start.addEventListener('click',()=>{
    const entered=(name?.value||'').trim();
    if(entered.length<2)return;
    let tries=0;
    const wait=setInterval(()=>{
      tries++;
      const svc=activeServices(),gate=q('#bwGuestName');
      if(svc&&!gate){
        clearInterval(wait);
        showFreshPicker()
      }else if(tries>=30)clearInterval(wait)
    },150)
  })
}

async function saveSurvey(){
  if(surveySaving)return;
  const thanks=q('#bwSupportThanks'),rating=q('#bwSupportRating'),button=q('[data-survey-submit]',rating||document);

  if(!selectedSurveyRating){
    if(thanks){
      thanks.textContent='Please choose a star rating first.';
      thanks.style.color='#8a6b12'
    }
    return
  }

  const svc=activeServices();
  if(!svc){
    if(thanks){
      thanks.textContent='Unable to identify this support session. Please reopen the chat and try again.';
      thanks.style.color='#c04444'
    }
    return
  }

  surveySaving=true;
  if(button){
    button.disabled=true;
    button.textContent='Sending…'
  }

  try{
    const ref=doc(svc.db,'supportThreads',svc.user.uid);
    await setDoc(ref,{rating:selectedSurveyRating,updatedAt:serverTimestamp()},{merge:true});
    const check=await getDoc(ref);
    if(!check.exists()||Number(check.data().rating)!==selectedSurveyRating)throw new Error('Survey confirmation failed');
    rating.innerHTML=`<div class="bw-survey-success"><span>✓</span><strong>Thank you for your feedback!</strong><small>Your ${selectedSurveyRating}-star rating was saved successfully.</small></div>`
  }catch(e){
    console.warn('Survey submission failed:',e);
    if(thanks){
      thanks.textContent='Survey was not sent. Please try again.';
      thanks.style.color='#c04444'
    }
    if(button){
      button.disabled=false;
      button.textContent='Send survey'
    }
  }finally{
    surveySaving=false
  }
}

function enhanceClosed(){
  const rating=q('#bwSupportRating');

  if(rating){
    rating.classList.add('bw-survey-card');
    const stars=qa('.bw-support-stars [data-rate]',rating);

    stars.forEach(star=>{
      if(!star.dataset.surveySelect){
        star.dataset.surveySelect='1';
        star.addEventListener('click',e=>{
          e.stopImmediatePropagation();
          selectedSurveyRating=Number(star.dataset.rate||0);
          stars.forEach(x=>x.classList.toggle('selected',Number(x.dataset.rate)<=selectedSurveyRating));
          const t=q('#bwSupportThanks');
          if(t){
            t.textContent=selectedSurveyRating===5
              ?'Excellent! Tap Send survey to submit.'
              :`You selected ${selectedSurveyRating} star${selectedSurveyRating===1?'':'s'}. Tap Send survey to submit.`;
            t.style.color='#31a273'
          }
        },true)
      }
    });

    if(!q('[data-survey-submit]',rating)&&!q('.bw-survey-success',rating)){
      const b=document.createElement('button');
      b.type='button';
      b.dataset.surveySubmit='1';
      b.className='bw-survey-submit';
      b.textContent='Send survey';
      b.onclick=saveSurvey;
      rating.appendChild(b)
    }
  }

  const n=q('#bwNewTicket');
  if(n&&!n.dataset.freshWorkflow){
    n.dataset.freshWorkflow='1';
    n.addEventListener('click',()=>setTimeout(showFreshPicker,350))
  }

  polishGuestGate()
}

function isolateTicket(){
  const m=q('#bwSupportMessages');
  if(!m||q('#bwGuestName',m))return;

  const rows=qa('.bw-support-message',m);
  let marker=-1;

  rows.forEach((r,i)=>{
    if((r.textContent||'').includes('A new support conversation has been started.'))marker=i
  });

  if(marker>=0){
    rows.forEach((r,i)=>r.style.display=i<=marker?'none':'');
    if(!rows.slice(marker+1).some(r=>r.style.display!=='none')&&!q('.bw-workflow-picker',m)){
      m.insertAdjacentHTML('beforeend',mainPicker());
      bindFlows(m)
    }
  }else{
    bindFlows(m)
  }
}

const enhance=()=>{
  addStyle();
  enhanceClosed();
  isolateTicket();
  bindFlows()
};

new MutationObserver(()=>enhance()).observe(document.documentElement,{childList:true,subtree:true});
setInterval(enhance,700);
enhance();
