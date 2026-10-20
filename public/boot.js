// Keep guest access independent of Firebase initialization.
const guestKey = 'budgetingGuest';
const guestButton = document.getElementById('guestBtn');

// Visual settings remain independent of Firebase/auth.
const settingsStyle=document.createElement('link');
settingsStyle.rel='stylesheet';
settingsStyle.href='./settings-v15.css?v=settings-v24';
document.head.appendChild(settingsStyle);
const toneStyle=document.createElement('link');
toneStyle.rel='stylesheet';
toneStyle.href='./tone-colors-v20.css?v=tone-colors-v24';
document.head.appendChild(toneStyle);

// Readability guard: keep useful text visible across every user-selected theme.
const readabilityStyle=document.createElement('style');
readabilityStyle.textContent=`
#dashboardView{--bw-safe-text:var(--bw-user-text,#17224a);--bw-safe-muted:color-mix(in srgb,var(--bw-user-text,#17224a) 68%,var(--bw-user-bg,#fff))}
#dashboardView :is(.premium-content,.page,.premium-panel,.premium-metric,.bw-settings-card,.bw-ai-card){color:var(--bw-safe-text)}
#dashboardView :is(h1,h2,h3,h4,h5,strong,.metric-value,.amount,.balance-value,.goal-title,.premium-panel-head){color:var(--bw-safe-text)!important;opacity:1!important}
#dashboardView :is(p,small,.muted,.subtitle,.helper-text,.bw-setting-copy small,.bw-settings-title p,.section-heading p){color:var(--bw-safe-muted)!important;opacity:1!important}
#dashboardView :is(.premium-panel,.premium-metric,.bw-settings-card,.bw-ai-card){border-color:var(--bw-user-border)!important;background:var(--bw-user-surface)!important}
#dashboardView :is(input:not([type=color]),select,textarea,.bw-theme-select,.bw-hex){color:var(--bw-safe-text)!important;background:var(--bw-user-surface-2)!important;border-color:var(--bw-user-border)!important}
#dashboardView :is(input,textarea)::placeholder{color:var(--bw-safe-muted)!important;opacity:.8!important}
#dashboardView .sidebar-nav .nav-btn:not(.active),#dashboardView .sidebar-profile :is(strong,small){color:var(--bw-safe-text)!important;opacity:1!important}
#dashboardView .sidebar-logo strong{color:var(--bw-safe-text)!important;opacity:1!important}
#dashboardView .sidebar-logo small{color:var(--bw-safe-muted)!important;opacity:1!important}
#page-settings .bw-settings-tab:not(.active){color:var(--bw-safe-text)!important;opacity:1!important}
#page-settings .bw-settings-tab.active,#dashboardView .sidebar-nav .nav-btn.active{color:#fff!important}
#dashboardView .bw-setting-row{border-color:var(--bw-user-border)!important}
#bwPreview{color:var(--preview-text,var(--bw-safe-text))!important}
`;
document.head.appendChild(readabilityStyle);

// Keep navigation motion light so it never competes with content.
const navigationStyle=document.createElement('style');
navigationStyle.textContent=`
#dashboardView .page:not(.hidden){animation:bwPageEnter .24s ease-out both}
#dashboardView .sidebar-nav .nav-btn{transition:background .2s ease,color .2s ease,transform .18s ease}
#dashboardView .sidebar-nav .nav-btn:hover{transform:translateX(2px)}
@keyframes bwPageEnter{from{opacity:.35;transform:translateY(5px)}to{opacity:1;transform:none}}
#dashboardView[data-reduce-motion="on"] .page:not(.hidden),#dashboardView[data-reduce-motion="on"] .sidebar-nav .nav-btn{animation:none!important;transition:none!important}
@media(prefers-reduced-motion:reduce){#dashboardView[data-reduce-motion="system"] .page:not(.hidden),#dashboardView[data-reduce-motion="system"] .sidebar-nav .nav-btn{animation:none!important;transition:none!important}}
`;
document.head.appendChild(navigationStyle);

import('./premium-icon-fix-v23.js?v=premium-icons-v24').catch(error=>console.warn('Premium icon cleanup unavailable:',error));
import('./settings-v15.js?v=settings-v24')
  .then(()=>Promise.all([import('./tone-colors-v20.js?v=tone-colors-v24'),import('./contrast-control-v21.js?v=contrast-art-v22')]))
  .catch(error=>console.warn('Visual settings unavailable:',error));

async function enterGuest() {
  guestButton.disabled = true;
  try {
    sessionStorage.setItem(guestKey, '1');
    await import('./guest.js?v=workspaces-v4');
  } catch (error) {
    sessionStorage.removeItem(guestKey);
    guestButton.disabled = false;
    console.error('Guest preview could not load:', error);
  }
}
if (sessionStorage.getItem(guestKey) === '1') {
  import('./guest.js?v=workspaces-v4').catch(() => { sessionStorage.removeItem(guestKey); location.reload(); });
} else {
  guestButton.addEventListener('click', enterGuest);
  import('./app.js?v=functionality-v14').catch(error => {
    console.warn('Account login unavailable; guest access remains available.', error);
    const errorNode = document.getElementById('loginError');
    if (errorNode) errorNode.textContent = 'Account sign-in is temporarily unavailable. You can still continue as guest.';
  });
}
