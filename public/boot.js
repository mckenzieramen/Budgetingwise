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

// Art-directed visual hierarchy: line, shape, form, color, value, space and subtle texture.
const artStyle=document.createElement('style');
artStyle.textContent=`
#dashboardView{--bw-art-shadow:0 8px 24px rgb(20 28 60 / .09);--bw-art-highlight:rgba(255,255,255,.72);--bw-art-depth:.34}
#dashboardView :is(.premium-panel,.premium-metric,.bw-settings-card,.bw-ai-card,.bw-premium-box){border-color:var(--bw-user-border)!important;box-shadow:var(--bw-art-shadow);transition:background .22s ease,border-color .22s ease,box-shadow .22s ease,color .22s ease,transform .22s ease}
#dashboardView :is(.premium-panel,.premium-metric,.bw-settings-card,.bw-ai-card){background:linear-gradient(145deg,var(--bw-art-highlight),transparent 38%),var(--bw-user-surface)!important}
#dashboardView :is(.premium-panel,.premium-metric,.bw-settings-card,.bw-ai-card):hover{box-shadow:0 12px 34px rgb(20 28 60 / calc(.08 + var(--bw-art-depth)*.09));transform:translateY(-1px)}
#dashboardView :is(.section-heading,.bw-settings-title,.premium-panel-head){position:relative}
#dashboardView :is(.section-heading h2,.bw-settings-title h3,.premium-panel-head h3){color:var(--bw-user-text)!important}
#dashboardView :is(.muted,small,.bw-setting-copy small,.bw-settings-title p,.section-heading p){color:var(--bw-user-muted)!important}
#dashboardView .bw-setting-row{border-color:color-mix(in srgb,var(--bw-user-border) 74%,transparent)!important}
#dashboardView .bw-setting-row:before{content:"";position:absolute;left:0;top:14%;bottom:14%;width:2px;border-radius:99px;background:linear-gradient(var(--bw-user-accent),var(--bw-user-accent-2));opacity:calc(.08 + var(--bw-art-depth)*.24)}
#dashboardView .bw-setting-row{position:relative;padding-left:10px}
#dashboardView :is(input,select,.bw-theme-select,.bw-hex){border-color:var(--bw-user-border)!important;color:var(--bw-user-text)!important;background:var(--bw-user-surface-2)!important}
#dashboardView .bw-accent-dot{box-shadow:0 0 0 1px var(--bw-user-border),0 3px 10px color-mix(in srgb,var(--dot) 22%,transparent)}
#dashboardView .bw-accent-dot.active{box-shadow:0 0 0 2px var(--bw-user-surface),0 0 0 4px var(--dot),0 6px 18px color-mix(in srgb,var(--dot) 30%,transparent)}
#dashboardView[data-art-contrast="soft"] :is(.premium-panel,.premium-metric,.bw-settings-card,.bw-ai-card){box-shadow:0 4px 16px rgb(20 28 60 / .05)}
#dashboardView[data-art-contrast="bold"] :is(.premium-panel,.premium-metric,.bw-settings-card,.bw-ai-card){border-width:1.25px;box-shadow:var(--bw-art-shadow)}
#dashboardView[data-art-contrast="bold"] :is(h1,h2,h3,h4,strong,.bw-setting-copy strong){letter-spacing:-.012em}
#bwPreview{box-shadow:var(--bw-art-shadow);border-color:var(--bw-user-border)!important;background:var(--preview-bg)!important;color:var(--preview-text)!important}
`;
document.head.appendChild(artStyle);

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

import('./premium-icon-fix-v23.js?v=premium-icons-v23').catch(error=>console.warn('Premium icon cleanup unavailable:',error));
import('./settings-v15.js?v=settings-v21')
  .then(()=>Promise.all([import('./tone-colors-v20.js?v=tone-colors-v22'),import('./contrast-control-v21.js?v=contrast-art-v22')]))
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
