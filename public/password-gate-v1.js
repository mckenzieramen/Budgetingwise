// Required first-login password screen. Injected before app.js initializes so the auth flow can route new clients here safely.
if(!document.getElementById('passwordModal')){
  const gate=document.createElement('section');
  gate.id='passwordModal';
  gate.className='bw-password-gate hidden';
  gate.setAttribute('role','dialog');
  gate.setAttribute('aria-modal','true');
  gate.setAttribute('aria-labelledby','passwordGateTitle');
  gate.innerHTML=`<div class="bw-password-gate-card">
    <div class="bw-password-gate-logo"><img src="icons/budgetingwise-b-logo.svg" alt="" width="58" height="58"></div>
    <p class="bw-password-gate-kicker">FIRST LOGIN</p>
    <h1 id="passwordGateTitle">Create your new password</h1>
    <p class="bw-password-gate-copy">For your security, replace the temporary password before continuing to your Budgetingwise account.</p>
    <form id="passwordForm">
      <label>New password<input id="newPassword" type="password" minlength="6" autocomplete="new-password" required placeholder="Enter new password"></label>
      <label>Confirm new password<input id="confirmPassword" type="password" minlength="6" autocomplete="new-password" required placeholder="Confirm new password"></label>
      <button class="primary" type="submit">Save password & continue</button>
      <p id="passwordError" class="error" aria-live="polite"></p>
    </form>
    <p class="bw-password-gate-note">🔒 You must complete this step before opening your dashboard.</p>
  </div>`;
  document.body.appendChild(gate);
  const style=document.createElement('style');
  style.textContent=`.bw-password-gate{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:22px;background:radial-gradient(circle at 20% 15%,#eee9ff 0,transparent 32%),radial-gradient(circle at 82% 80%,#eaf0ff 0,transparent 30%),#f7f8fc}.bw-password-gate.hidden{display:none!important}.bw-password-gate-card{width:min(420px,100%);box-sizing:border-box;background:#fff;border:1px solid #e3e6ef;border-radius:24px;padding:34px;box-shadow:0 28px 80px #27204f1c;text-align:center}.bw-password-gate-logo img{border-radius:16px;box-shadow:0 10px 28px #5b38f52b}.bw-password-gate-kicker{margin:17px 0 7px;color:#5b38f5;font-size:10px;font-weight:800;letter-spacing:.14em}.bw-password-gate-card h1{margin:0;color:#111936;font-size:27px;letter-spacing:-.7px}.bw-password-gate-copy{margin:9px auto 22px;color:#68718d;font-size:12px;line-height:1.55;max-width:330px}.bw-password-gate-card form{text-align:left}.bw-password-gate-card label{display:block;margin:12px 0;color:#111936;font-size:11px;font-weight:800}.bw-password-gate-card input{width:100%;height:44px;box-sizing:border-box;margin-top:6px;padding:0 13px;border:1px solid #dfe3ed;border-radius:10px;background:#fbfcff;color:#111936;outline:none}.bw-password-gate-card input:focus{border-color:#7258f6;box-shadow:0 0 0 3px #7258f617}.bw-password-gate-card .primary{width:100%;height:45px;margin-top:8px;border:0;border-radius:10px;background:linear-gradient(90deg,#5b38f5,#7250f7);color:#fff;font-weight:800;cursor:pointer}.bw-password-gate-card .error{min-height:16px;margin:9px 0 0;color:#d62f3a;font-size:10px}.bw-password-gate-note{margin:15px 0 0;color:#7b849b;font-size:9px}`;
  document.head.appendChild(style);
}
