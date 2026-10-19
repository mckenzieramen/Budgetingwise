// Keep guest access independent of Firebase initialization.
const guestKey = 'budgetingGuest';
const guestButton = document.getElementById('guestBtn');
async function enterGuest() {
  guestButton.disabled = true;
  try {
    sessionStorage.setItem(guestKey, '1');
    await import('./guest.js?v=guest-cloudflare-3');
  } catch (error) {
    sessionStorage.removeItem(guestKey);
    guestButton.disabled = false;
    console.error('Guest preview could not load:', error);
    alert('Guest preview could not load. Please try again.');
  }
}
if (sessionStorage.getItem(guestKey) === '1') {
  import('./guest.js?v=guest-cloudflare-3').catch(() => { sessionStorage.removeItem(guestKey); location.reload(); });
} else {
  guestButton.addEventListener('click', enterGuest);
  import('./app.js?v=guest-cloudflare-3').catch(error => {
    console.warn('Account login unavailable; guest access remains available.', error);
    const errorNode = document.getElementById('loginError');
    if (errorNode) errorNode.textContent = 'Account sign-in is temporarily unavailable. You can still continue as guest.';
  });
}
