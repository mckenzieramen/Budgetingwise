// Keep guest access independent of Firebase initialization.
const guestKey = 'budgetingGuest';
const guestButton = document.getElementById('guestBtn');

// V15 visual settings studio is intentionally independent of Firebase/auth.
// Load its stylesheet and behavior for both account and guest experiences.
const settingsStyle=document.createElement('link');
settingsStyle.rel='stylesheet';
settingsStyle.href='./settings-v15.css?v=settings-v15';
document.head.appendChild(settingsStyle);
import('./settings-v15.js?v=settings-v15').catch(error=>console.warn('Visual settings unavailable:',error));

async function enterGuest() {
  guestButton.disabled = true;
  try {
    sessionStorage.setItem(guestKey, '1');
    await import('./guest.js?v=workspaces-v4');
  } catch (error) {
    sessionStorage.removeItem(guestKey);
    guestButton.disabled = false;
    console.error('Guest preview could not load:', error);
    alert('Guest preview could not load. Please try again.');
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
