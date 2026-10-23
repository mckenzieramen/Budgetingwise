import{initializeApp,getApps}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import{getAuth,onAuthStateChanged}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';
import{getFirestore,doc,getDoc,setDoc}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';
import{firebaseConfig}from'./firebase-config.js';

// Customer/guest Chat Support must never run inside the Admin Portal.
if(document.getElementById('adminApp') || /^\/admin(?:\/|$)/i.test(location.pathname)){
  console.info('Customer Chat Support disabled on Admin Portal.');
}else{
  if(!getApps().some(app=>app.name==='[DEFAULT]')){
    try{initializeApp(firebaseConfig)}catch(err){
      if(!/already exists|duplicate-app/i.test(String(err?.message||err)))throw err;
    }
  }

  const defaultApp=()=>getApps().find(app=>app.name==='[DEFAULT]')||null;
  const escapeSupportHtml=value=>String(value||'')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
  let supportIdentitySyncing=false;
  let lastSupportIdentityUid='';

  const syncAuthenticatedSupportIdentity=async()=>{
    const app=defaultApp();
    if(!app||supportIdentitySyncing)return false;

    let auth,user,db;
    try{
      auth=getAuth(app);
      user=auth.currentUser;
      if(!user||user.isAnonymous)return false;
      db=getFirestore(app);
    }catch{return false}

    const messages=document.getElementById('bwSupportMessages');
    const guestGate=messages?.querySelector('#bwGuestName');
    if(!guestGate&&lastSupportIdentityUid===user.uid)return true;

    supportIdentitySyncing=true;
    try{
      let profile={};
      try{
        const snap=await getDoc(doc(db,'users',user.uid));
        if(snap.exists())profile=snap.data()||{};
      }catch(err){
        console.warn('Logged-in support profile lookup unavailable:',err);
      }

      const firstName=String(profile.firstName||'').trim();
      const lastName=String(profile.lastName||'').trim();
      const customerName=([firstName,lastName].filter(Boolean).join(' ')||user.displayName||user.email||'Customer').trim();
      const customerEmail=String(profile.authEmail||profile.email||user.email||'').trim().toLowerCase();
      const budgetId=String(profile.budgetId||'').trim().toUpperCase();

      try{
        const identity={
          uid:user.uid,
          customerName,
          customerEmail,
          guest:false
        };
        if(budgetId)identity.budgetId=budgetId;
        await setDoc(doc(db,'supportThreads',user.uid),identity,{merge:true});
      }catch(err){
        console.warn('Logged-in support identity sync unavailable:',err);
      }

      lastSupportIdentityUid=user.uid;

      // The stable chat module can briefly render the guest gate while Firebase restores
      // an existing authenticated session. Logged-in customers must never be asked for
      // their name again; replace that gate with the normal customer workflow immediately.
      if(messages?.querySelector('#bwGuestName')){
        const greeting=escapeSupportHtml(firstName||customerName.split(/\s+/)[0]||'there');
        messages.innerHTML=`<div class="bw-support-day">New support ticket</div><div class="bw-support-message agent bw-workflow-picker"><div><p><strong class="bw-flow-title">Hi ${greeting}! 👋 How can we help?</strong><span class="bw-flow-sub">Your signed-in Budgetingwise account is connected automatically. Tap a concern below.</span></p><div class="bw-support-quick-actions"><button type="button" data-flow="activation">🔑 Activation key</button><button type="button" data-flow="account">👤 Account / login</button><button type="button" data-flow="budgeting">📊 Budgeting feature</button><button type="button" data-flow="general">💬 General question</button><button type="button" data-flow="error">⚠️ Report an error</button><button type="button" data-flow="suggestion">✨ Share a suggestion</button></div><time>Budgetingwise Support Bot</time></div></div>`;
      }

      return true;
    }finally{
      supportIdentitySyncing=false;
    }
  };

  const installAuthenticatedSupportGuard=()=>{
    const app=defaultApp();
    if(!app)return;
    const auth=getAuth(app);
    if(!auth.__bwSupportIdentityGuard){
      auth.__bwSupportIdentityGuard=true;
      onAuthStateChanged(auth,user=>{
        if(user&&!user.isAnonymous){
          lastSupportIdentityUid='';
          setTimeout(()=>syncAuthenticatedSupportIdentity().catch(err=>console.warn('Support identity guard skipped:',err)),0);
        }else{
          lastSupportIdentityUid='';
        }
      });
    }

    const launcher=document.getElementById('bwSupportLauncher');
    if(launcher&&!launcher.dataset.authIdentityGuard){
      launcher.dataset.authIdentityGuard='1';
      launcher.addEventListener('click',()=>{
        setTimeout(()=>syncAuthenticatedSupportIdentity().catch(err=>console.warn('Support identity guard skipped:',err)),0);
      },true);
    }
  };

  const polishChatControls=()=>{
    if(!document.getElementById('bwChatControlPolish')){
      const style=document.createElement('style');
      style.id='bwChatControlPolish';
      style.textContent=`
#bwSupportPanel{--bw-chat-accent:#6246e5;--bw-chat-ink:#28233f;--bw-chat-muted:#77718e;--bw-chat-line:#ebe8f6}
.bw-support-compose{min-width:0!important;box-sizing:border-box!important;gap:8px!important}
.bw-support-compose:not(.hidden){display:flex!important;align-items:flex-end!important}
#bwSupportInput{flex:1 1 auto!important;min-width:0!important;width:auto!important;max-width:100%!important;box-sizing:border-box!important;pointer-events:auto!important;position:relative!important;z-index:1!important}
#bwSupportSend{width:42px!important;min-width:42px!important;max-width:42px!important;height:42px!important;min-height:42px!important;padding:0!important;border:0!important;border-radius:13px!important;display:inline-grid!important;place-items:center!important;flex:0 0 42px!important;position:relative!important;inset:auto!important;background:linear-gradient(135deg,#6f52f5,#5435dc)!important;color:#fff!important;box-shadow:0 7px 18px rgba(84,53,220,.24)!important;cursor:pointer!important;transition:transform .16s ease,box-shadow .16s ease,opacity .16s ease!important;font-size:0!important;line-height:0!important;overflow:hidden!important}
#bwSupportSend:hover{transform:translateY(-1px)!important;box-shadow:0 10px 22px rgba(84,53,220,.30)!important}
#bwSupportSend:active{transform:scale(.96)!important}
#bwSupportSend:disabled{opacity:.48!important;cursor:not-allowed!important;transform:none!important}
#bwSupportSend .bw-send-icon{width:18px;height:18px;display:block;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.bw-support-quick-actions{gap:10px!important}
.bw-support-quick-actions button,[data-send-otp],[data-verify],[data-change]{min-height:44px!important;border-radius:13px!important;font-weight:750!important;letter-spacing:.01em!important;transition:transform .15s ease,box-shadow .15s ease,border-color .15s ease,background .15s ease!important}
.bw-support-quick-actions button{padding:9px 11px!important;border:1px solid #e7e3f5!important;background:linear-gradient(180deg,#fff 0%,#fbfaff 100%)!important;color:#40366f!important;box-shadow:0 4px 12px rgba(54,43,112,.055)!important;display:flex!important;align-items:center!important;gap:9px!important;text-align:left!important}
.bw-support-quick-actions button:hover{transform:translateY(-1px)!important;border-color:#cfc5fb!important;background:#fff!important;box-shadow:0 9px 20px rgba(54,43,112,.11)!important}
.bw-support-quick-actions button:active{transform:scale(.985)!important}
.bw-premium-nav-icon{width:28px;height:28px;min-width:28px;border-radius:9px;display:inline-grid;place-items:center;background:linear-gradient(145deg,#f0edff,#e8e3ff);color:#6047dc;box-shadow:inset 0 0 0 1px rgba(100,73,221,.08)}
.bw-premium-nav-icon svg{width:14px;height:14px;display:block;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.bw-premium-nav-label{display:block;min-width:0;line-height:1.25}
[data-send-otp],[data-verify],[data-change]{padding:10px 15px!important;border:0!important;background:linear-gradient(135deg,#6f52f5,#5435dc)!important;color:#fff!important;box-shadow:0 6px 15px rgba(84,53,220,.18)!important}
[data-resend],[data-back],[data-otp-back]{padding:7px 2px!important;border:0!important;background:transparent!important;font-weight:700!important;text-decoration:none!important;color:#6755bd!important}
.bw-flow-back{background:#f8f7fc!important;border-color:#ebe8f7!important;color:#716b88!important;text-align:center!important;justify-content:center!important}
.bw-flow-back .bw-premium-nav-icon{background:#fff;color:#7b748f}
#bwSupportPanel button[aria-label],#bwSupportPanel button[title]{transition:transform .15s ease,box-shadow .15s ease,background .15s ease}
#bwSupportPanel button[aria-label]:hover,#bwSupportPanel button[title]:hover{transform:translateY(-1px)}
.bw-support-day{font-weight:800!important;letter-spacing:.02em!important;color:#8b84a1!important}
.bw-flow-title{letter-spacing:-.01em!important;color:var(--bw-chat-ink)!important}
.bw-flow-sub{color:var(--bw-chat-muted)!important}
@media(max-width:380px){.bw-support-quick-actions button{min-height:42px!important}.bw-premium-nav-icon{width:26px;height:26px;min-width:26px}.bw-support-compose{gap:7px!important}#bwSupportSend{width:40px!important;min-width:40px!important;max-width:40px!important;height:40px!important;min-height:40px!important;flex-basis:40px!important}}
`;
      document.head.appendChild(style);
    }

    // Stable module creates a plain submit button without an ID. Normalize it every render.
    const send=document.getElementById('bwSupportSend')||document.querySelector('#bwSupportForm button[type="submit"],.bw-support-compose button[type="submit"]');
    if(send){
      if(send.id!=='bwSupportSend')send.id='bwSupportSend';
      const hasOnlyIcon=send.children.length===1&&send.firstElementChild?.classList.contains('bw-send-icon')&&!(send.textContent||'').trim();
      if(!hasOnlyIcon)send.innerHTML='<svg class="bw-send-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 2 11 13"></path><path d="m22 2-7 20-4-9-9-4Z"></path></svg>';
      send.setAttribute('aria-label','Send message');
      send.setAttribute('title','Send message');
    }

    const input=document.getElementById('bwSupportInput');
    if(input&&!input.disabled){input.readOnly=false;input.style.pointerEvents='auto'}

    const icons={
      activation:'<svg viewBox="0 0 24 24"><circle cx="8" cy="15" r="4"></circle><path d="m11 12 9-9M17 6l2 2M14 9l2 2"></path></svg>',
      account:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"></circle><path d="M4.5 21a7.5 7.5 0 0 1 15 0"></path></svg>',
      budgeting:'<svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"></path></svg>',
      general:'<svg viewBox="0 0 24 24"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3v-7a4 4 0 0 1-1-2.7V7a4 4 0 0 1 4-4h11a4 4 0 0 1 4 4Z"></path></svg>',
      error:'<svg viewBox="0 0 24 24"><path d="M12 3 2.5 20h19L12 3Z"></path><path d="M12 9v5M12 17.5h.01"></path></svg>',
      suggestion:'<svg viewBox="0 0 24 24"><path d="M9 18h6M10 22h4M8.5 14.5A7 7 0 1 1 15.5 14.5c-1 .8-1.5 1.6-1.5 2.5h-4c0-.9-.5-1.7-1.5-2.5Z"></path></svg>',
      forgot:'<svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="3"></rect><path d="M8 10V7a4 4 0 0 1 7.5-2M12 14v3"></path></svg>',
      signin:'<svg viewBox="0 0 24 24"><path d="M14 8l4 4-4 4M18 12H7M10 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"></path></svg>',
      change:'<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"></path><path d="M9 12l2 2 4-4"></path></svg>',
      other:'<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle></svg>',
      back:'<svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"></path></svg>'
    };
    document.querySelectorAll('.bw-support-quick-actions button').forEach(button=>{
      if(button.dataset.premiumIcon)return;
      const key=button.dataset.flow||button.dataset.accountFlow||'';
      const svg=icons[key];if(!svg)return;
      const label=(button.textContent||'').replace(/^[^A-Za-z0-9]+\s*/,'').trim();
      button.innerHTML='<span class="bw-premium-nav-icon" aria-hidden="true">'+svg+'</span><span class="bw-premium-nav-label"></span>';
      const labelNode=button.querySelector('.bw-premium-nav-label');if(labelNode)labelNode.textContent=label;
      button.dataset.premiumIcon='1';
    });
  };

  polishChatControls();
  new MutationObserver(()=>{
    polishChatControls();
    installAuthenticatedSupportGuard();
    if(document.getElementById('bwGuestName')){
      syncAuthenticatedSupportIdentity().catch(err=>console.warn('Support identity guard skipped:',err));
    }
  }).observe(document.documentElement,{childList:true,subtree:true});

  import('./chat-support-customer-v2.js?v=customer-support-v7').then(()=>{
    polishChatControls();
    installAuthenticatedSupportGuard();
    syncAuthenticatedSupportIdentity().catch(err=>console.warn('Support identity guard skipped:',err));
    import('./chat-ticket-history-v3.js?v=ticket-history-v6').catch(err=>console.warn('Ticket history unavailable:',err));
    document.addEventListener('click',event=>{
      const star=event.target.closest('.bw-support-stars [data-rate]');if(!star)return;
      const rating=Number(star.dataset.rate||0);
      document.querySelectorAll('.bw-support-stars [data-rate]').forEach(button=>{button.classList.toggle('selected',Number(button.dataset.rate)<=rating);button.setAttribute('aria-pressed',Number(button.dataset.rate)===rating?'true':'false')});
    },true);
  }).catch(err=>console.warn('Customer support unavailable:',err));
}