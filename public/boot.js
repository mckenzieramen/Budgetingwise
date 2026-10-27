// Budgetingwise boot — fixed-light customer experience; guest/auth entry must remain available even if an optional module fails.
const guestKey='budgetingGuest';
const guestButton=document.getElementById('guestBtn');
const activationMode=new URLSearchParams(location.search).get('activate')==='1';

async function safeImport(path,label=path){
  try{return await import(path)}catch(error){console.warn(`${label} unavailable:`,error);return null}
}

let customerBootstrapPromise;
async function enterGuest(){
  if(!guestButton||guestButton.dataset.loading==='true')return;
  guestButton.dataset.loading='true';
  guestButton.disabled=true;
  const original=guestButton.textContent;
  guestButton.textContent='Opening Trial Account…';
  try{
    sessionStorage.setItem(guestKey,'1');
    if(customerBootstrapPromise)await customerBootstrapPromise;
    await import('./guest.js?v=guest-v33');
  }catch(error){
    console.error('Guest preview could not load:',error);
    sessionStorage.removeItem(guestKey);
    guestButton.disabled=false;
    guestButton.dataset.loading='false';
    guestButton.textContent=original||'Continue as Guest';
    const errorNode=document.getElementById('loginError');
    if(errorNode)errorNode.textContent='Trial Account could not open. Please refresh and try again.';
  }
}
if(guestButton){
  guestButton.disabled=false;
  guestButton.dataset.loading='false';
  guestButton.addEventListener('click',enterGuest);
}

customerBootstrapPromise=(async()=>{
  const ordered=[
    ['./page-recovery-v28.js?v=page-recovery-v33','Page recovery'],
    ['./budgetingwise-icons-v35.js?v=icons-v46','Icons'],
    ['./dashboard-reference-v31.js?v=dashboard-reference-v50','Picture dashboard'],
    ['./dashboard-financial-chart-v1.js?v=dashboard-chart-v4','Dashboard chart'],
    ['./financial-data-authority-v1.js?v=financial-authority-v1','Financial data authority'],
    ['./customer-insights-intelligence-v1.js?v=insights-intelligence-v1','Insights intelligence'],
    ['./customer-financial-plan-v1.js?v=financial-plan-v10','Financial Plan'],
    ['./customer-salary-profile-v1.js?v=salary-profile-v1','Salary profile'],
    ['./customer-financial-snapshot-v1.js?v=financial-snapshot-v1','Financial snapshot'],
    ['./customer-planning-assistant-v1.js?v=planning-assistant-v1','Planning assistant'],
    ['./customer-insights-layout-v1.js?v=insights-layout-v2','Insights layout'],
    ['./password-gate-v1.js?v=password-gate-v1','Password gate']
  ];
  for(const [path,label] of ordered)await safeImport(path,label);
})();

await customerBootstrapPromise;

if(activationMode){
  await safeImport('./account-activation-v1.js?v=activation-v2','Account activation');
}else{
  if(sessionStorage.getItem(guestKey)==='1'){
    safeImport('./guest.js?v=guest-v33','Guest preview').then(mod=>{
      if(!mod){sessionStorage.removeItem(guestKey);if(guestButton){guestButton.disabled=false;guestButton.dataset.loading='false'}}
    });
  }else{
    safeImport('./app.js?v=activation-login-v2','Account login').then(mod=>{
      if(!mod){const errorNode=document.getElementById('loginError');if(errorNode)errorNode.textContent='Account sign-in is temporarily unavailable. You can still continue as guest.'}
    });
  }

  safeImport('./navigation-v10.js?v=navigation-v33','Navigation controller');
  safeImport('./customer-transaction-category-v1.js?v=category-v1','Premium transaction categories');

  try{
    const addStyle=(href)=>{const l=document.createElement('link');l.rel='stylesheet';l.href=href;document.head.appendChild(l);return l};
    addStyle('./chat-support-v1.css?v=chat-support-v8');
    addStyle('./premium-simple-v27.css?v=premium-simple-v31');
    addStyle('./premium-tabs-v29.css?v=premium-tabs-v38');
    addStyle('./dashboard-reference-v31.css?v=dashboard-reference-v48');

    const readabilityStyle=document.createElement('style');
    readabilityStyle.textContent=`#dashboardView{--bw-safe-text:#15213c;--bw-safe-muted:#6f7b93}#dashboardView :is(.premium-content,.page,.premium-panel,.premium-metric,.bw-settings-card,.bw-ai-card){color:var(--bw-safe-text)}#dashboardView :is(h1,h2,h3,h4,h5,strong,.metric-value,.amount,.balance-value,.goal-title,.premium-panel-head){color:var(--bw-safe-text)!important;opacity:1!important}#dashboardView :is(p,small,.muted,.subtitle,.helper-text){color:var(--bw-safe-muted)!important;opacity:1!important}#dashboardView :is(input,textarea)::placeholder{color:#98a3b5!important;opacity:.85!important}`;
    document.head.appendChild(readabilityStyle);

    const navigationStyle=document.createElement('style');
    navigationStyle.textContent=`#dashboardView .page:not(.hidden){animation:bwPageEnter .18s ease-out both}#dashboardView .sidebar-nav .nav-btn{transition:background .15s ease,color .15s ease}@keyframes bwPageEnter{from{opacity:.55;transform:translateY(2px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){#dashboardView .page:not(.hidden){animation:none!important}}`;
    document.head.appendChild(navigationStyle);

    addStyle('./customer-professional-ui-v1.css?v=customer-ui-v1');
    addStyle('./customer-tab-polish-v1.css?v=customer-tabs-v1');
    addStyle('./customer-insights-professional-v2.css?v=insights-professional-v2');
    addStyle('./customer-insights-ux-v1.css?v=insights-ux-v1');
    addStyle('./customer-global-ux-v1.css?v=customer-global-ux-v1');

    safeImport('./premium-tabs-v29.js?v=premium-tabs-v39','Premium tab enhancements');
    safeImport('./premium-icon-fix-v23.js?v=premium-icons-v46','Premium icons');
  }catch(error){console.warn('Optional visual setup skipped:',error)}
}
