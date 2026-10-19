// Guest mode is a local, read-only preview. It never authenticates or accesses Firebase.
const $ = id => document.getElementById(id);
const pages = document.querySelectorAll('.page');
function showPage(name){const next=document.getElementById('page-'+name);if(!next)return;const current=document.querySelector('#dashboardView .page:not(.hidden)');if(current!==next){document.querySelectorAll('#dashboardView .page').forEach(x=>x.classList.toggle('hidden',x!==next));}document.querySelectorAll('.nav-btn').forEach(x=>{const active=x.dataset.page===name;x.classList.toggle('active',active);if(active)x.setAttribute('aria-current','page');else x.removeAttribute('aria-current')});document.querySelectorAll('#dashboardView [data-page]').forEach(x=>{if(x.classList.contains('nav-btn'))return;x.setAttribute('aria-label',x.getAttribute('aria-label')||'Open '+(x.dataset.page||'')+' page')});const main=document.querySelector('.premium-main');if(main&&window.scrollY>130)window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});try{sessionStorage.setItem('budgetingwise-last-page',name)}catch(e){}}
$('loginView').classList.add('hidden');
$('dashboardView').classList.remove('hidden');
$('userLabel').textContent = 'Guest Preview';
if($('topbarUserName'))$('topbarUserName').textContent='Guest User';
if($('topbarUserMode'))$('topbarUserMode').textContent='Preview Mode';
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
window.renderPremiumOverview?.([],[]);window.renderBudgetingStudio?.([],[]);window.renderWealthCrownInsights?.([],[]);
showPage((()=>{try{return sessionStorage.getItem('budgetingwise-last-page')||'dashboard'}catch(e){return 'dashboard'}})());
