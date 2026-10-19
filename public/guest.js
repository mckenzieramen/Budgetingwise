// Guest mode is a local, read-only preview. It never authenticates or accesses Firebase.
const $ = id => document.getElementById(id);
const pages = document.querySelectorAll('.page');
function showPage(name) {
  pages.forEach(el => el.classList.toggle('hidden', el.id !== 'page-' + name));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.toggle('active', el.dataset.page === name));
}
$('loginView').classList.add('hidden');
$('dashboardView').classList.remove('hidden');
$('userLabel').textContent = 'Guest Preview';
$('welcomeName').textContent = 'Welcome, Guest';
$('settingsBid').textContent = 'Guest (no account)';
$('settingsName').textContent = 'Guest';
$('settingsEmail').textContent = 'Not required';
document.querySelector('#page-settings .status').textContent = 'Guest preview';
$('recentList').innerHTML = '<p class="muted">No transactions yet. Guest mode does not access account data.</p>';
$('transactionList').innerHTML = '<p class="muted">No transactions yet. Sign in with an account to access your data.</p>';
$('goalGrid').innerHTML = '<div class="panel"><p class="muted">No savings goals yet.</p></div>';
$('savingsHistory').innerHTML = '<p class="muted">No savings history yet.</p>';
document.querySelectorAll('[data-page]').forEach(btn => btn.addEventListener('click', () => showPage(btn.dataset.page)));
for (const id of ['addExpenseBtn', 'addExpenseBtn2', 'addGoalBtn']) {
  $(id).addEventListener('click', () => alert('Guest mode is a read-only preview. Sign in to access account features.'));
}
$('logoutBtn').textContent = 'Exit guest';
$('logoutBtn').addEventListener('click', () => { sessionStorage.removeItem('budgetingGuest'); location.reload(); });
showPage('dashboard');
