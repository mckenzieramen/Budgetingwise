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
toneStyle.href='./tone-colors-v20.css?v=tone-colors-v20';
document.head.appendChild(toneStyle);
const contrastStyle=document.createElement('style');
contrastStyle.textContent=`
#dashboardView .premium-sidebar,#dashboardView .premium-topbar,#dashboardView .premium-content{filter:contrast(var(--bw-contrast-filter,1));transition:filter .16s ease}
#bwPreview{filter:contrast(var(--bw-contrast-filter,1));transition:filter .16s ease}
`;
document.head.appendChild(contrastStyle);
import('./settings-v15.js?v=settings-v21')
  .then(()=>Promise.all([import('./tone-colors-v20.js?v=tone-colors-v20'),import('./contrast-control-v21.js?v=contrast-v21')]))
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
