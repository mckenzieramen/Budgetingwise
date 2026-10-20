// Keep guest access independent of Firebase initialization.
const guestKey = 'budgetingGuest';
const guestButton = document.getElementById('guestBtn');

// Visual settings studio is intentionally independent of Firebase/auth.
const settingsStyle=document.createElement('link');
settingsStyle.rel='stylesheet';
settingsStyle.href='./settings-v15.css?v=settings-v21';
document.head.appendChild(settingsStyle);
const toneStyle=document.createElement('link');
toneStyle.rel='stylesheet';
toneStyle.href='./tone-colors-v20.css?v=tone-colors-v22';
document.head.appendChild(toneStyle);
const contrastStyle=document.createElement('style');
contrastStyle.textContent=`
#dashboardView .premium-sidebar,#dashboardView .premium-topbar,#dashboardView .premium-content{filter:contrast(var(--bw-contrast-filter,1));transition:filter .16s ease}
#bwPreview{filter:contrast(var(--bw-contrast-filter,1));transition:filter .16s ease}
`;
document.head.appendChild(contrastStyle);

// Premium navigation motion. This is visual-only and does not change page/data logic.
const navigationStyle=document.createElement('style');
navigationStyle.textContent=`
#dashboardView .premium-content{position:relative;isolation:isolate}
#dashboardView .page:not(.hidden){animation:bwPageEnter .34s cubic-bezier(.22,.8,.28,1) both;transform-origin:50% 0;will-change:opacity,transform,filter}
#dashboardView .page:not(.hidden)>*{animation:bwPageContentEnter .42s cubic-bezier(.22,.8,.28,1) both}
#dashboardView .sidebar-nav .nav-btn{position:relative;overflow:hidden;transition:transform .2s ease,background .25s ease,color .25s ease,box-shadow .25s ease,border-color .25s ease}
#dashboardView .sidebar-nav .nav-btn:before{content:"";position:absolute;inset:0;background:linear-gradient(100deg,transparent,color-mix(in srgb,var(--bw-user-accent,#6536f5) 13%,transparent),transparent);transform:translateX(-120%);transition:transform .42s ease;pointer-events:none}
#dashboardView .sidebar-nav .nav-btn:hover:before{transform:translateX(120%)}
#dashboardView .sidebar-nav .nav-btn:hover{transform:translateX(3px)}
#dashboardView .sidebar-nav .nav-btn.active{transform:translateX(2px)}
#dashboardView [data-page]:active{transform:scale(.985)}
@keyframes bwPageEnter{0%{opacity:0;transform:translateY(10px) scale(.995);filter:blur(3px)}55%{opacity:1}100%{opacity:1;transform:none;filter:none}}
@keyframes bwPageContentEnter{0%{opacity:.55;transform:translateY(5px)}100%{opacity:1;transform:none}}
#dashboardView[data-reduce-motion="on"] .page:not(.hidden),#dashboardView[data-reduce-motion="on"] .page:not(.hidden)>*,#dashboardView[data-reduce-motion="on"] .sidebar-nav .nav-btn{animation:none!important;transition:none!important}
@media(prefers-reduced-motion:reduce){#dashboardView[data-reduce-motion="system"] .page:not(.hidden),#dashboardView[data-reduce-motion="system"] .page:not(.hidden)>*,#dashboardView[data-reduce-motion="system"] .sidebar-nav .nav-btn{animation:none!important;transition:none!important}}
`;
document.head.appendChild(navigationStyle);

import('./settings-v15.js?v=settings-v21')
  .then(()=>Promise.all([import('./tone-colors-v20.js?v=tone-colors-v22'),import('./contrast-control-v21.js?v=contrast-v21')]))
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
