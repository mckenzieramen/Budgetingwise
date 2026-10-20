// Guest mode is a local, read-only preview. It never authenticates or accesses Firebase.
const $ = id => document.getElementById(id);
const validPages = new Set(['dashboard','transactions','analytics','savings','insights','settings']);

function showPage(name,{history=true}={}){
  if(!validPages.has(name)) name='dashboard';
  const next=document.getElementById('page-'+name);
  if(!next)return;
  document.querySelectorAll('#dashboardView .page').forEach(page=>page.classList.toggle('hidden',page!==next));
  document.querySelectorAll('#dashboardView .nav-btn').forEach(btn=>{
    const active=btn.dataset.page===name;
    btn.classList.toggle('active',active);
    if(active)btn.setAttribute('aria-current','page');else btn.removeAttribute('aria-current');
  });
  try{sessionStorage.setItem('budgetingwise-last-page',name)}catch(e){}
  if(history){
    const url=new URL(location.href);
    url.hash=name==='dashboard'?'dashboard':name;
    if(location.hash!==url.hash) historyApi('pushState',{page:name},'',url);
  }
  const main=document.querySelector('.premium-main');
  if(main&&window.scrollY>130)window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  document.body.classList.remove('mobile-nav-open');
  document.querySelector('.premium-sidebar')?.classList.remove('open');
}
function historyApi(method,state,title,url){try{window.history[method](state,title,url)}catch(e){}}
function pageFromLocation(){const hash=(location.hash||'').replace(/^#\/?/,'');return validPages.has(hash)?hash:null}

$('loginView')?.classList.add('hidden');
$('dashboardView')?.classList.remove('hidden');
if($('userLabel'))$('userLabel').textContent='Guest Preview';
if($('topbarUserName'))$('topbarUserName').textContent='Guest User';
if($('topbarUserMode'))$('topbarUserMode').textContent='Preview Mode';
if($('welcomeName'))$('welcomeName').textContent='Welcome, Guest';
if($('settingsBid'))$('settingsBid').textContent='Guest (no account)';
if($('settingsName'))$('settingsName').textContent='Guest';
if($('settingsEmail'))$('settingsEmail').textContent='Not required';
const settingsStatus=document.querySelector('#page-settings .status');if(settingsStatus)settingsStatus.textContent='Guest preview';
if($('recentList'))$('recentList').innerHTML='<p class="muted">No transactions yet. Guest mode does not access account data.</p>';
if($('transactionList'))$('transactionList').innerHTML='<p class="muted">No transactions yet. Sign in with an account to access your data.</p>';
if($('goalGrid'))$('goalGrid').innerHTML='<div class="panel"><p class="muted">No savings goals yet.</p></div>';
if($('savingsHistory'))$('savingsHistory').innerHTML='<p class="muted">No savings history yet.</p>';

// One delegated navigation handler covers sidebar, shortcuts, settings/theme links and mobile links.
document.getElementById('dashboardView')?.addEventListener('click',event=>{
  const link=event.target.closest('[data-page]');
  if(!link||!validPages.has(link.dataset.page))return;
  event.preventDefault();
  showPage(link.dataset.page);
});
window.addEventListener('popstate',()=>showPage(pageFromLocation()||'dashboard',{history:false}));

for(const id of ['addExpenseBtn','addExpenseBtn2','addGoalBtn']){
  const button=$(id);if(button)button.addEventListener('click',()=>alert('Guest mode is a read-only preview. Sign in to access account features.'));
}
if($('logoutBtn')){
  $('logoutBtn').textContent='Exit guest';
  $('logoutBtn').addEventListener('click',()=>{sessionStorage.removeItem('budgetingGuest');sessionStorage.removeItem('budgetingwise-last-page');location.hash='';location.reload();});
}
window.bwWorkspaces?.setAccount('guest');
window.renderPremiumOverview?.([],[]);
window.renderBudgetingStudio?.([],[]);
window.renderWealthCrownInsights?.([],[]);
window.renderReferenceDashboard?.([],[]);
let initial='dashboard';try{initial=pageFromLocation()||sessionStorage.getItem('budgetingwise-last-page')||'dashboard'}catch(e){}
showPage(initial,{history:false});
