const BW_ACCOUNT_SERVICES_URL =
'https://script.google.com/macros/s/AKfycbz4wg4sG9c8fluO1F5233W3OgS-Qce06Wtzq1c_C-K18I9EuWd_Hzo_AEBmlppQi1jm/exec';

async function bwRecoveryPost(payload){
  const res=await fetch(BW_ACCOUNT_SERVICES_URL,{
    method:'POST',
    headers:{'Content-Type':'text/plain;charset=utf-8'},
    body:JSON.stringify(payload)
  });

  const text=await res.text();
  let data={};
  try{data=JSON.parse(text)}
  catch{throw new Error('Invalid recovery service response.')}

  if(!res.ok||data.ok===false||data.success===false){
    throw new Error(data.message||data.error||'Recovery request failed.');
  }
  return data;
}

function bwLockComposer(locked){
  const input=q('#bwSupportInput');
  const send=q('#bwSupportSend');

  if(input){
    input.disabled=locked;
    input.placeholder=locked
      ?'Complete password recovery above…'
      :'Type your message…';
  }

  if(send)send.disabled=locked;
}

function bwPasswordError(password){
  if(password.length<8)return 'Password must be at least 8 characters.';
  if(!/[A-Z]/.test(password))return 'Add at least one uppercase letter.';
  if(!/[a-z]/.test(password))return 'Add at least one lowercase letter.';
  if(!/[0-9]/.test(password))return 'Add at least one number.';
  return '';
}

function forgotFlow(){
  const m=q('#bwSupportMessages');
  if(!m)return;

  q('.bw-forgot-workflow',m)?.remove();
  bwLockComposer(true);

  const box=document.createElement('div');
  box.className='bw-support-message agent bw-forgot-workflow';

  box.innerHTML=`
  <div>
    <p>
      <strong class="bw-flow-title">🔐 Forgot Password</strong>
      <span class="bw-flow-sub">
        Enter your registered email and BID#. We'll send an OTP
        to your registered email.
      </span>
    </p>

    <div data-step="identity"
      style="display:grid;gap:8px;margin-top:10px">

      <input data-email type="email"
        placeholder="Registered email"
        style="padding:11px;border:1px solid #ddd8ff;border-radius:10px;outline:none">

      <input data-bid
        placeholder="Budget ID (BID#)"
        style="padding:11px;border:1px solid #ddd8ff;border-radius:10px;outline:none">

      <button type="button" data-send-otp
        style="width:auto;justify-self:start;padding:9px 14px;border:0;border-radius:10px;background:linear-gradient(135deg,#6847f5,#5638dc);color:#fff;font-weight:800;cursor:pointer">
        Send OTP →
      </button>

      <button type="button" data-back
        style="width:auto;justify-self:start;padding:5px 0;border:0;background:none;color:#6d64a0;font-size:9px;cursor:pointer">
        ← Back
      </button>

      <small data-identity-msg></small>
    </div>

    <div data-step="otp"
      style="display:none;gap:8px;margin-top:10px">

      <span class="bw-flow-sub">
        OTP sent to your registered email. Enter the code below.
      </span>

      <input data-otp inputmode="numeric"
        autocomplete="one-time-code"
        maxlength="8"
        placeholder="Enter OTP"
        style="padding:11px;border:1px solid #ddd8ff;border-radius:10px;outline:none;letter-spacing:3px">

      <button type="button" data-verify
        style="width:auto;justify-self:start;padding:9px 14px;border:0;border-radius:10px;background:linear-gradient(135deg,#6847f5,#5638dc);color:#fff;font-weight:800;cursor:pointer">
        Verify OTP →
      </button>

      <button type="button" data-resend
        style="width:auto;justify-self:start;padding:5px 0;border:0;background:none;color:#6847f5;font-size:9px;font-weight:800;cursor:pointer">
        Resend OTP
      </button>

      <small data-otp-msg></small>
    </div>

    <div data-step="password"
      style="display:none;gap:8px;margin-top:10px">

      <div style="padding:9px 10px;border-radius:10px;background:#eefbf5;color:#18845a;font-size:9px;font-weight:800">
        ✓ OTP verified successfully
      </div>

      <input data-password type="password"
        autocomplete="new-password"
        placeholder="Enter new password"
        style="padding:11px;border:1px solid #ddd8ff;border-radius:10px;outline:none">

      <input data-confirm type="password"
        autocomplete="new-password"
        placeholder="Re-enter new password"
        style="padding:11px;border:1px solid #ddd8ff;border-radius:10px;outline:none">

      <button type="button" data-change
        style="width:auto;justify-self:start;padding:9px 14px;border:0;border-radius:10px;background:linear-gradient(135deg,#6847f5,#5638dc);color:#fff;font-weight:800;cursor:pointer">
        Change password
      </button>

      <small data-password-msg></small>
    </div>

    <time>Budgetingwise Support Bot</time>
  </div>`;

  m.appendChild(box);
  m.scrollTop=m.scrollHeight;

  const identity=q('[data-step="identity"]',box);
  const otpStep=q('[data-step="otp"]',box);
  const passwordStep=q('[data-step="password"]',box);

  let email='';
  let bid='';
  let recoveryToken='';

  function show(step){
    identity.style.display=step==='identity'?'grid':'none';
    otpStep.style.display=step==='otp'?'grid':'none';
    passwordStep.style.display=step==='password'?'grid':'none';
    m.scrollTop=m.scrollHeight;
  }

  q('[data-back]',box).onclick=()=>{
    bwLockComposer(false);
    showAccountMenu();
  };

  q('[data-send-otp]',box).onclick=async()=>{
    const button=q('[data-send-otp]',box);
    const msg=q('[data-identity-msg]',box);

    email=q('[data-email]',box).value.trim().toLowerCase();
    bid=q('[data-bid]',box).value.trim().toUpperCase();

    if(!email||!bid){
      msg.textContent='Please enter your registered email and Budget ID.';
      msg.style.color='#c04444';
      return;
    }

    button.disabled=true;
    button.textContent='Sending OTP…';
    msg.textContent='';

    try{
      await bwRecoveryPost({
        action:'requestPasswordOtp',
        email,
        budgetId:bid,
        bid
      });

      show('otp');
      q('[data-otp]',box).focus();

    }catch(e){
      msg.textContent=e.message||'Unable to send OTP.';
      msg.style.color='#c04444';
    }finally{
      button.disabled=false;
      button.textContent='Send OTP →';
    }
  };

  q('[data-resend]',box).onclick=async()=>{
    const button=q('[data-resend]',box);
    const msg=q('[data-otp-msg]',box);

    button.disabled=true;
    button.textContent='Sending…';

    try{
      await bwRecoveryPost({
        action:'requestPasswordOtp',
        email,
        budgetId:bid,
        bid
      });

      msg.textContent='A new OTP was sent.';
      msg.style.color='#31a273';

    }catch(e){
      msg.textContent=e.message||'Unable to resend OTP.';
      msg.style.color='#c04444';
    }finally{
      button.disabled=false;
      button.textContent='Resend OTP';
    }
  };

  q('[data-verify]',box).onclick=async()=>{
    const otp=q('[data-otp]',box).value.trim();
    const button=q('[data-verify]',box);
    const msg=q('[data-otp-msg]',box);

    if(!otp){
      msg.textContent='Enter the OTP from your email.';
      msg.style.color='#c04444';
      return;
    }

    button.disabled=true;
    button.textContent='Verifying…';

    try{
      const result=await bwRecoveryPost({
        action:'verifyPasswordOtp',
        email,
        budgetId:bid,
        bid,
        otp
      });

      recoveryToken=
        result.recoveryToken||
        result.token||
        result.resetToken||
        '';

      if(!recoveryToken)
        throw new Error('Recovery token was not returned.');

      q('[data-otp]',box).value='';

      show('password');
      q('[data-password]',box).focus();

    }catch(e){
      msg.textContent=e.message||'Invalid or expired OTP.';
      msg.style.color='#c04444';
    }finally{
      button.disabled=false;
      button.textContent='Verify OTP →';
    }
  };

  q('[data-change]',box).onclick=async()=>{
    const password=q('[data-password]',box).value;
    const confirm=q('[data-confirm]',box).value;
    const button=q('[data-change]',box);
    const msg=q('[data-password-msg]',box);

    const error=bwPasswordError(password);

    if(error){
      msg.textContent=error;
      msg.style.color='#c04444';
      return;
    }

    if(password!==confirm){
      msg.textContent='Passwords do not match.';
      msg.style.color='#c04444';
      return;
    }

    if(!recoveryToken){
      msg.textContent='Verification expired. Please verify your OTP again.';
      msg.style.color='#c04444';
      show('otp');
      return;
    }

    button.disabled=true;
    button.textContent='Changing password…';

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

      box.innerHTML=`
      <div>
        <div style="padding:14px;border-radius:14px;background:#eefbf5;text-align:center">

          <div style="width:34px;height:34px;margin:0 auto 7px;border-radius:50%;display:grid;place-items:center;background:#d9f6e9;color:#16865b;font-size:18px;font-weight:900">
            ✓
          </div>

          <strong class="bw-flow-title">
            Password successfully changed
          </strong>

          <span class="bw-flow-sub">
            Your Budgetingwise password has been updated successfully.
            This conversation will close automatically.
          </span>

        </div>

        <time>Budgetingwise Support Bot</time>
      </div>`;

      bwLockComposer(false);
      m.scrollTop=m.scrollHeight;

      setTimeout(()=>{
        const close=
          q('#bwCloseTicket')||
          q('[data-close-ticket]')||
          qa('button').find(b=>
            /close\s*(ticket|conversation)/i.test(b.textContent||'')
          );

        if(close)close.click();

      },1200);

    }catch(e){
      msg.textContent=e.message||'Password could not be changed.';
      msg.style.color='#c04444';
    }finally{
      button.disabled=false;
      button.textContent='Change password';
    }
  };
}
