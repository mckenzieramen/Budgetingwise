// Restore the complete page structure before auth, guest mode, or navigation initializes.
await import('./page-recovery-v28.js?v=page-recovery-v28');

const guestKey='budgetingGuest';
const guestButton=document.getElementById('guestBtn');

async function enterGuest(){
  if(!guestButton)return;
  guestButton.disabled=true;
  try{
    sessionStorage.setItem(guestKey,'1');
    await import('./guest.js?v=guest-v28');
  }catch(error){
    sessionStorage.removeItem(guestKey);
    guestButton.disabled=false;
    console.error('Guest preview could not load:',error);
  }
}

if(sessionStorage.getItem(guestKey)==='1'){
  import('./guest.js?v=guest-v28').catch(error=>{console.error('Guest preview restore failed:',error);sessionStorage.removeItem(guestKey);location.reload()});
}else if(guestButton){
  guestButton.addEventListener('click',enterGuest);
}

if(sessionStorage.getItem(guestKey)!=='1'){
  import('./app.js?v=functionality-v28').catch(error=>{
    console.warn('Account login unavailable; guest access remains available.',error);
    const errorNode=document.getElementById('loginError');
    if(errorNode)errorNode.textContent='Account sign-in is temporarily unavailable. You can still continue as guest.';
  });
}

// Shared navigation is loaded after all page targets exist.
import('./navigation-v10.js?v=navigation-v28').catch(error=>console.warn('Navigation controller unavailable:',error));

try{
  const settingsStyle=document.createElement('link');settingsStyle.rel='stylesheet';settingsStyle.href='./settings-v15.css?v=settings-v28';document.head.appendChild(settingsStyle);
  const toneStyle=document.createElement('link');toneStyle.rel='stylesheet';toneStyle.href='./tone-colors-v20.css?v=tone-colors-v28';document.head.appendChild(toneStyle);
  const premiumStyle=document.createElement('link');premiumStyle.rel='stylesheet';premiumStyle.href='./premium-simple-v27.css?v=premium-simple-v28';document.head.appendChild(premiumStyle);

  const readabilityStyle=document.createElement('style');
  readabilityStyle.textContent=`#dashboardView{--bw-safe-text:var(--bw-premium-text,#111936);--bw-safe-muted:var(--bw-premium-muted,#68718d)}#dashboardView :is(.premium-content,.page,.premium-panel,.premium-metric,.bw-settings-card,.bw-ai-card){color:var(--bw-safe-text)}#dashboardView :is(h1,h2,h3,h4,h5,strong,.metric-value,.amount,.balance-value,.goal-title,.premium-panel-head){color:var(--bw-safe-text)!important;opacity:1!important}#dashboardView :is(p,small,.muted,.subtitle,.helper-text,.bw-setting-copy small,.bw-settings-title p,.section-heading p){color:var(--bw-safe-muted)!important;opacity:1!important}#dashboardView :is(input,textarea)::placeholder{color:var(--bw-safe-muted)!important;opacity:.78!important}#dashboardView .sidebar-logo strong{color:var(--bw-safe-text)!important;opacity:1!important}#dashboardView .sidebar-logo small{color:var(--bw-safe-muted)!important;opacity:1!important}#page-settings .bw-settings-tab.active,#dashboardView .sidebar-nav .nav-btn.active{color:#fff!important}`;
  document.head.appendChild(readabilityStyle);

  const navigationStyle=document.createElement('style');navigationStyle.textContent=`#dashboardView .page:not(.hidden){animation:bwPageEnter .22s ease-out both}#dashboardView .sidebar-nav .nav-btn{transition:background .18s ease,color .18s ease,transform .18s ease}#dashboardView .sidebar-nav .nav-btn:hover{transform:translateX(2px)}@keyframes bwPageEnter{from{opacity:.4;transform:translateY(4px)}to{opacity:1;transform:none}}#dashboardView[data-reduce-motion="on"] .page:not(.hidden){animation:none!important}@media(prefers-reduced-motion:reduce){#dashboardView[data-reduce-motion="system"] .page:not(.hidden){animation:none!important}}`;document.head.appendChild(navigationStyle);

  import('./premium-icon-fix-v23.js?v=premium-icons-v28').catch(error=>console.warn('Premium icons unavailable:',error));
  import('./settings-v15.js?v=settings-v28').then(()=>Promise.all([import('./tone-colors-v20.js?v=tone-colors-v28'),import('./contrast-control-v21.js?v=contrast-v28')])).catch(error=>console.warn('Visual settings unavailable:',error));
}catch(error){
  console.warn('Optional visual setup skipped:',error);
}
