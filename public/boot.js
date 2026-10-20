// Keep guest access independent of Firebase initialization.
const guestKey = 'budgetingGuest';
const guestButton = document.getElementById('guestBtn');

// Visual settings studio is intentionally independent of Firebase/auth.
const settingsStyle=document.createElement('link');
settingsStyle.rel='stylesheet';
settingsStyle.href='./settings-v15.css?v=settings-v20';
document.head.appendChild(settingsStyle);
const toneStyle=document.createElement('link');
toneStyle.rel='stylesheet';
toneStyle.href='./tone-colors-v20.css?v=tone-colors-v20';
document.head.appendChild(toneStyle);
import('./settings-v15.js?v=settings-v20')
  .then(()=>import('./tone-colors-v20.js?v=tone-colors-v20'))
  .catch(error=>console.warn('Visual settings unavailable:',error));

// Dashboard customization is presentation-only and must initialize AFTER the
// dashboard app/guest renderer so it never captures or moves incomplete markup.
function loadDashboardCustomizer(){
  if(document.querySelector('link[data-bw-dashboard-customizer]'))return Promise.resolve();
  const style=document.createElement('link');
  style.rel='stylesheet';
  style.dataset.bwDashboardCustomizer='v24';
  style.href='./dashboard-customize-v21.css?v=dashboard-customize-v24';
  document.head.appendChild(style);
  return import('./dashboard-customize-v21.js?v=dashboard-customize-v24')
    .catch(error=>console.warn('Dashboard customization unavailable:',error));
}

async function enterGuest() {
  guestButton.disabled = true;
  try {
    sessionStorage.setItem(guestKey, '1');
    await import('./guest.js?v=workspaces-v4');
    await loadDashboardCustomizer();
  } catch (error) {
    sessionStorage.removeItem(guestKey);
    guestButton.disabled = false;
    console.error('Guest preview could not load:', error);
  }
}
if (sessionStorage.getItem(guestKey) === '1') {
  import('./guest.js?v=workspaces-v4')
    .then(()=>loadDashboardCustomizer())
    .catch(() => { sessionStorage.removeItem(guestKey); location.reload(); });
} else {
  guestButton.addEventListener('click', enterGuest);
  import('./app.js?v=functionality-v14')
    .then(()=>loadDashboardCustomizer())
    .catch(error => {
      console.warn('Account login unavailable; guest access remains available.', error);
      const errorNode = document.getElementById('loginError');
      if (errorNode) errorNode.textContent = 'Account sign-in is temporarily unavailable. You can still continue as guest.';
    });
}
