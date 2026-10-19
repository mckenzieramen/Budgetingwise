/* Budgetingwise Studio: read-only presentation, transaction filters and local theme preferences. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP',maximumFractionDigits:2}).format(Number(n)||0);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&#39;'}[c]));
const palettes={
violet:['Royal Violet','#6536f5','#4122ba','#eeeaff'],
ocean:['Ocean Blue','#1686e9','#0750a9','#e8f3ff'],
emerald:['Emerald Green','#08a68a','#076755','#e7faf3'],
rose:['Rose Pink','#e84b97','#a82b6b','#fff0f7'],
sunset:['Sunset Orange','#f57c34','#bb421c','#fff2e8'],
midnight:['Midnight Navy','#34477f','#14214a','#e9edfb'],
crimson:['Red Crimson','#e64263','#9d1738','#fff0f3'],
teal:['Teal Cyan','#00a8b6','#036276','#e8fbfd']};
const presets={
dual:[['Purple Dream','#6536f5','#c69cf8'],['Blue Ocean','#1376e8','#5cdaee'],['Green Mint','#069b83','#84e5bf'],['Pink Rose','#e44e9e','#ffadc9'],['Orange Sunset','#f57534','#ffd06b'],['Navy Twilight','#26376f','#847fe5'],['Red Sunset','#e33958','#ff9a68'],['Teal Wave','#058eaa','#6ddacb']],
triple:[['Aurora','#5339ee','#e05ac3','#69bff2'],['Tropical','#0872b1','#0db69c','#a9dd79'],['Sunrise','#ee4d77','#ff9848','#ffdc73'],['Galaxy','#202267','#7634df','#c16bd5'],['Pastel','#a398f9','#f1a9cb','#a7e5d2'],['Royal','#3048ae','#7040ee','#e6a75b'],['Candy','#f04c93','#9b63f6','#59c3ef'],['Forest','#086a61','#21aa78','#b8d76a']]};
let txs=[],goals=[],page=1,activeType='all',goalFilter='all',theme={palette:'violet',style:'solid',preset:0,mode:'light'};
const safeStore=(key,val)=>{try{localStorage.setItem(key,val)}catch(e){}};
const safeRead=key=>{try{return localStorage.getItem(key)}catch(e){return null}};
function setText(id,v){const el=$(id);if(el)el.textContent=v}
function renderTransactions(){
const income=txs.filter(t=>t.type==='income').reduce((n,t)=>n+(Number(t.amount)||0),0),expense=txs.filter(t=>t.type==='expense').reduce((n,t)=>n+(Number(t.amount)||0),0),savings=txs.filter(t=>t.type==='savings').reduce((n,t)=>n+(Number(t.amount)||0),0);
setText('txIncome',money(income));setText('txExpense',money(expense));setText('txNet',money(income-expense-savings));setText('txCount',String(txs.length));
const cats=$('txCategoryFilter');if(cats){const selected=cats.value;const categories=[...new Set(txs.map(t=>String(t.category||'Other')))].sort();cats.innerHTML='<option value="all">All categories</option>'+categories.map(cat=>'<option value="'+esc(cat)+'">'+esc(cat)+'</option>').join('');cats.value=categories.includes(selected)?selected:'all'}
applyTxFilter();
}
function applyTxFilter(){
const q=($('txSearch')?.value||'').toLowerCase().trim(),category=$('txCategoryFilter')?.value||'all';
const filtered=txs.filter(t=>(activeType==='all'||t.type===activeType)&&(category==='all'||String(t.category||'Other')===category)&&(!q||[t.date,t.type,t.category,t.description,t.amount].some(v=>String(v??'').toLowerCase().includes(q))));
const pages=Math.max(1,Math.ceil(filtered.length/8));page=Math.min(page,pages);const start=(page-1)*8,items=filtered.slice(start,start+8);
const body=items.map(t=>{const type=String(t.type||'expense'),amount=Number(t.amount)||0;return '<tr><td>'+esc(t.date||'—')+'</td><td><span class="tx-category-icon">'+(type==='income'?'↗':type==='savings'?'✧':'▤')+'</span> '+esc(t.category||'Other')+'</td><td>'+esc(t.description||'—')+'</td><td class="'+(type==='income'?'positive':'negative')+'">'+(type==='income'?'+':'−')+money(amount)+'</td><td><span class="tx-type-badge '+esc(type)+'">'+esc(type)+'</span></td><td><span class="tx-status-badge">✓ Recorded</span></td></tr>'}).join('');
const list=$('transactionList');if(list)list.innerHTML=items.length?'<table class="table premium-tx-table"><thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Amount</th><th>Type</th><th>Status</th></tr></thead><tbody>'+body+'</tbody></table>':'<div class="tx-empty">◈<h3>No transactions found</h3><p>Transactions will appear here when your account has records matching these filters.</p></div>';
setText('txShowing','Showing '+filtered.length+' records');setText('txPaginationLabel',filtered.length?'Showing '+(start+1)+'–'+Math.min(start+8,filtered.length)+' of '+filtered.length:'0 transactions');setText('txPageLabel',page+' / '+pages);
if($('txPrev'))$('txPrev').disabled=page<=1;if($('txNext'))$('txNext').disabled=page>=pages;
document.querySelectorAll('.tx-tab').forEach(b=>b.classList.toggle('active',b.dataset.txTab===activeType));
if($('txTypeFilter'))$('txTypeFilter').value=activeType;
}
function applyGoalFilter(){
const cards=[...document.querySelectorAll('#goalGrid .goal-card')];let shown=0;
cards.forEach((card,i)=>{const g=goals[i];const pct=g?(Number(g.saved)||0)/Math.max(1,Number(g.target)||0):0;const visible=goalFilter==='all'||(goalFilter==='completed'?pct>=1:pct<1);card.hidden=!visible;if(visible)shown++});
setText('goalsCount',goals.length?shown+' of '+goals.length+' goals':'No goals yet');
document.querySelectorAll('.goal-tab').forEach(b=>b.classList.toggle('active',b.dataset.goalFilter===goalFilter));
}
function renderAnalyticsYear(){
const el=$('analyticsYear');if(!el)return;const current=new Date().getFullYear(),selected=el.value||String(current);
el.innerHTML=[current,current-1,current-2,current-3].map(y=>'<option value="'+y+'">'+y+'</option>').join('');el.value=selected;el.onchange=()=>{const main=$('earningsYear');if(main){main.value=el.value;main.dispatchEvent(new Event('change'))}};
}
function setAppearanceTab(which){
document.querySelectorAll('.appearance-tab').forEach(b=>b.classList.toggle('active',b.dataset.settingsTab===which));
const section=document.querySelector('.appearance-section'),account=document.querySelector('.account-panel');
if(section)section.hidden=which==='account';if(account)account.hidden=which==='appearance';
}
function getColors(){if(theme.style==='solid')return [palettes[theme.palette][1],palettes[theme.palette][2]];return presets[theme.style][theme.preset].slice(1)}
function applyTheme(){
const dash=$('dashboardView');if(!dash)return;
const colors=getColors(),accent=colors[0],dark=colors[1]||colors[0],light=palettes[theme.palette][3];
dash.dataset.theme='studio';dash.style.setProperty('--theme-accent',accent);dash.style.setProperty('--theme-dark',dark);dash.style.setProperty('--theme-light',light);
dash.style.setProperty('--theme-gradient',theme.style==='solid'?accent:'linear-gradient(155deg,'+colors.join(',')+')');
dash.dataset.displayMode=theme.mode==='system'?(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):theme.mode;
document.querySelectorAll('.theme-choice').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.theme===theme.palette)));
document.querySelectorAll('.gradient-style').forEach(b=>b.classList.toggle('active',b.dataset.gradientStyle===theme.style));
document.querySelectorAll('.mode-option').forEach(b=>b.classList.toggle('active',b.dataset.displayMode===theme.mode));
document.querySelectorAll('.preset-choice').forEach((b,i)=>b.classList.toggle('active',i===theme.preset));
setText('themeFeedback',(theme.style==='solid'?palettes[theme.palette][0]:presets[theme.style][theme.preset][0])+' · '+(theme.style==='solid'?'1 Tone':theme.style==='dual'?'2 Tone':'3 Tone')+' · '+theme.mode+' mode');
safeStore('budgetingwise-studio-theme',JSON.stringify(theme));
}
function renderPresets(){
const root=$('gradientPresets');if(!root)return;
if(theme.style==='solid'){root.innerHTML='<p class="muted">Solid color uses your selected primary theme above.</p>';applyTheme();return}
root.innerHTML=presets[theme.style].map((p,i)=>'<button type="button" class="preset-choice '+(i===theme.preset?'active':'')+'" data-preset="'+i+'"><span class="preset-color" style="background:linear-gradient(110deg,'+p.slice(1).join(',')+')"></span><small>'+esc(p[0])+'</small></button>').join('');
root.querySelectorAll('.preset-choice').forEach(b=>b.addEventListener('click',()=>{theme.preset=Number(b.dataset.preset);applyTheme()}));applyTheme();
}
window.renderBudgetingStudio=function(nextTxs,nextGoals){txs=Array.isArray(nextTxs)?nextTxs:[];goals=Array.isArray(nextGoals)?nextGoals:[];renderTransactions();applyGoalFilter();renderAnalyticsYear()};
document.addEventListener('DOMContentLoaded',()=>{
const stored=safeRead('budgetingwise-studio-theme');if(stored){try{const v=JSON.parse(stored);if(v&&palettes[v.palette]&&['solid','dual','triple'].includes(v.style)&&['light','dark','system'].includes(v.mode)){theme={...theme,...v};theme.preset=Math.min(Math.max(0,Number(theme.preset)||0),7)}}catch(e){}}
const grid=document.querySelector('.theme-grid');if(grid){[['crimson','Red Crimson','#e64263','#fff0f3'],['teal','Teal Cyan','#00a8b6','#e8fbfd']].forEach(([id,name,color,light])=>{if(grid.querySelector('[data-theme="'+id+'"]'))return;const b=document.createElement('button');b.className='theme-choice';b.dataset.theme=id;b.setAttribute('aria-pressed','false');b.innerHTML='<span class="theme-swatch" style="--swatch:'+color+';--swatch-light:'+light+'"></span><strong>'+name+'</strong><small>Signature color</small>';grid.append(b)})}
document.querySelectorAll('.theme-choice').forEach(b=>b.addEventListener('click',()=>{theme.palette=b.dataset.theme;theme.style='solid';theme.preset=0;renderPresets()}));
document.querySelectorAll('.gradient-style').forEach(b=>b.addEventListener('click',()=>{theme.style=b.dataset.gradientStyle;theme.preset=0;renderPresets()}));
document.querySelectorAll('.mode-option').forEach(b=>b.addEventListener('click',()=>{theme.mode=b.dataset.displayMode;applyTheme()}));
document.querySelectorAll('.appearance-tab').forEach(b=>b.addEventListener('click',()=>setAppearanceTab(b.dataset.settingsTab)));
setAppearanceTab('appearance');renderPresets();
document.querySelectorAll('.tx-tab').forEach(b=>b.addEventListener('click',()=>{activeType=b.dataset.txTab;page=1;applyTxFilter()}));
$('txSearch')?.addEventListener('input',()=>{page=1;applyTxFilter()});
$('txCategoryFilter')?.addEventListener('change',()=>{page=1;applyTxFilter()});
$('txTypeFilter')?.addEventListener('change',e=>{activeType=e.target.value;page=1;applyTxFilter()});
$('txResetFilters')?.addEventListener('click',()=>{if($('txSearch'))$('txSearch').value='';if($('txCategoryFilter'))$('txCategoryFilter').value='all';activeType='all';page=1;applyTxFilter()});
$('txPrev')?.addEventListener('click',()=>{page=Math.max(1,page-1);applyTxFilter()});
$('txNext')?.addEventListener('click',()=>{page++;applyTxFilter()});
document.querySelectorAll('.goal-tab').forEach(b=>b.addEventListener('click',()=>{goalFilter=b.dataset.goalFilter;applyGoalFilter()}));
window.renderBudgetingStudio([],[]);
});
})();
