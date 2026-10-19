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
dash.style.setProperty('--theme-gradient',theme.style==='solid'?'linear-gradient(160deg,'+accent+','+dark+')':'linear-gradient(155deg,'+colors.join(',')+')');
const toRgb=hex=>{const h=hex.replace('#','');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16))};
const mix=(a,b,t)=>{const x=toRgb(a),y=toRgb(b);return '#'+x.map((n,i)=>Math.round(n*(1-t)+y[i]*t).toString(16).padStart(2,'0')).join('')};
/* Harmonized palette: dark neutral surfaces, selected hue as restrained accent. */
const luminance=hex=>{const rgb=toRgb(hex).map(v=>{const n=v/255;return n<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4)});return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]};
const vibrant=colors[0],secondary=colors[1]||mix(vibrant,'#ffffff',.32),third=colors[2]||secondary;
const deep=mix(vibrant,'#20232c',.91),mid=mix(vibrant,'#333640',.89);
const glow=mix(third,'#e8e6e2',.70),border=mix(vibrant,'#c8c6c5',.80);
/* Each 1-, 2- or 3-tone preset now owns a matching layered background. */
const base=mix(vibrant,'#f5f3f0',.87),base2=mix(secondary,'#f7f5f2',.89),base3=mix(third,'#f8f7f4',.91);
const backdrop=base,soft=mix(vibrant,'#ece8e4',.79);
const textOnAccent=luminance(vibrant)>.34?'#171827':'#ffffff';
const background=theme.style==='solid'
?'radial-gradient(ellipse 70% 65% at 90% 2%,'+mix(vibrant,'#ffffff',.76)+' 0%,transparent 76%),linear-gradient(135deg,'+base+','+mix(vibrant,'#ffffff',.94)+')'
:theme.style==='dual'
?'radial-gradient(ellipse 65% 72% at 90% 0%,'+mix(secondary,'#ffffff',.72)+' 0%,transparent 75%),radial-gradient(ellipse 65% 80% at 4% 94%,'+mix(vibrant,'#ffffff',.82)+' 0%,transparent 77%),linear-gradient(140deg,'+base+','+base2+')'
:'radial-gradient(ellipse 62% 67% at 90% 0%,'+mix(third,'#ffffff',.77)+' 0%,transparent 78%),radial-gradient(ellipse 68% 72% at 3% 90%,'+mix(secondary,'#ffffff',.82)+' 0%,transparent 76%),linear-gradient(135deg,'+base+','+base2+','+base3+')';
const bgDark='radial-gradient(ellipse at 85% 0%,'+mix(third,'#161a28',.87)+' 0%,transparent 60%),linear-gradient(145deg,'+mix(vibrant,'#131722',.92)+','+mix(secondary,'#161925',.92)+')';
/* Adaptive theme tokens: preserve the user's exact accent; derive accessible UI shades. */
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const readableAccent=(()=>{let c=vibrant;for(let i=0;i<16&&contrast(c,'#ffffff')<4.5;i++)c=mix(c,'#10152a',.16);return c})();
const accentForeground=contrast(vibrant,'#ffffff')>=4.5?'#ffffff':contrast(vibrant,'#17203b')>=4.5?'#17203b':'#10152a';
const pageLight=mix(vibrant,'#f7f9ff',.83),pageLight2=mix(secondary,'#f2f5ff',.82);
const pageDark=mix(vibrant,'#12182e',.78),pageDark2=mix(secondary,'#1d2440',.76);
const surfaceLight='#ffffff',surfaceDark=mix(vibrant,'#242a47',.91);
const softLight=mix(vibrant,'#ffffff',.75),softDark=mix(vibrant,'#303651',.68);
const activeDark=mix(vibrant,'#303353',.55);
const rgb=toRgb(vibrant).join(',');
dash.style.setProperty('--bw-adaptive-accent',vibrant);
dash.style.setProperty('--bw-adaptive-action',readableAccent);
dash.style.setProperty('--bw-adaptive-on-accent',accentForeground);
dash.style.setProperty('--bw-adaptive-page-light','linear-gradient(125deg,'+pageLight+','+pageLight2+')');
dash.style.setProperty('--bw-adaptive-page-dark','linear-gradient(125deg,'+pageDark+','+pageDark2+')');
dash.style.setProperty('--bw-adaptive-card-light',surfaceLight);
dash.style.setProperty('--bw-adaptive-card-dark',surfaceDark);
dash.style.setProperty('--bw-adaptive-soft-light',softLight);
dash.style.setProperty('--bw-adaptive-soft-dark',softDark);
dash.style.setProperty('--bw-adaptive-active-dark',activeDark);
dash.style.setProperty('--bw-adaptive-rgb',rgb);
dash.style.setProperty('--bw-adaptive-secondary',secondary);
dash.style.setProperty('--bw-adaptive-third',third);
dash.style.setProperty('--bw-adaptive-gradient',theme.style==='solid'?'linear-gradient(115deg,'+vibrant+','+mix(vibrant,'#ffffff',.28)+')':theme.style==='dual'?'linear-gradient(115deg,'+vibrant+','+secondary+')':'linear-gradient(115deg,'+vibrant+','+secondary+','+third+')');
dash.style.setProperty('--bw-adaptive-hero-light',theme.style==='solid'?'linear-gradient(112deg,#ffffff 3%,'+mix(vibrant,'#ffffff',.68)+' 100%)':theme.style==='dual'?'linear-gradient(112deg,'+mix(vibrant,'#ffffff',.78)+','+mix(secondary,'#ffffff',.64)+')':'linear-gradient(112deg,'+mix(vibrant,'#ffffff',.77)+','+mix(secondary,'#ffffff',.73)+','+mix(third,'#ffffff',.66)+')');
dash.style.setProperty('--bw-adaptive-hero-dark',theme.style==='solid'?'linear-gradient(112deg,'+mix(vibrant,'#171b31',.74)+','+mix(vibrant,'#262541',.65)+')':'linear-gradient(112deg,'+mix(vibrant,'#171b31',.74)+','+mix(secondary,'#262541',.67)+','+mix(third,'#27253f',.70)+')');

dash.style.setProperty('--bw-brand-deep',deep);
dash.style.setProperty('--bw-brand-mid',mid);
dash.style.setProperty('--bw-brand-glow',glow);
dash.style.setProperty('--bw-brand-border',border);
dash.style.setProperty('--bw-brand-bg',backdrop);
dash.style.setProperty('--bw-brand-soft',soft);
dash.style.setProperty('--bw-brand-rgb',toRgb(vibrant).join(','));
dash.style.setProperty('--bw-brand-gradient','linear-gradient(145deg,'+deep+','+mid+' 64%,'+mix(third,'#15172a',.83)+')');
dash.style.setProperty('--bw-brand-chart',vibrant);
dash.style.setProperty('--bw-brand-chart-alt',theme.style==='solid'?mix(vibrant,'#e6d4ff',.44):secondary);
dash.style.setProperty('--bw-brand-chart-third',third);
dash.style.setProperty('--bw-text-on-accent',textOnAccent);
dash.style.setProperty('--bw-brand-accent-gradient','linear-gradient(105deg,'+mix(vibrant,'#4d4d59',.42)+','+mix(third,'#8b8993',.62)+')');
dash.style.setProperty('--bw-brand-card','linear-gradient(145deg,'+mix(vibrant,'#ffffff',.975)+','+mix(vibrant,'#f8f7f5',.96)+')');
dash.style.setProperty('--bw-brand-surface',mix(vibrant,'#ffffff',.98));
dash.style.setProperty('--bw-brand-surface-alt',mix(vibrant,'#f5f4f1',.96));
dash.style.setProperty('--bw-brand-page-gradient',background);
dash.style.setProperty('--bw-brand-page-gradient-dark',bgDark);
dash.style.setProperty('--bw-brand-ink','#242631');
dash.style.setProperty('--bw-brand-ink-muted','#747785');
dash.style.setProperty('--bw-brand-divider','#e8e6e6');
dash.style.setProperty('--bw-brand-muted',mix(vibrant,'#ffffff',.68));
dash.dataset.displayMode=theme.mode==='system'?(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):theme.mode;
document.querySelectorAll('.theme-choice').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.theme===theme.palette)));
document.querySelectorAll('.gradient-style').forEach(b=>b.classList.toggle('active',b.dataset.gradientStyle===theme.style));
document.querySelectorAll('.mode-option').forEach(b=>b.classList.toggle('active',b.dataset.displayMode===theme.mode));
document.querySelectorAll('.preset-choice').forEach((b,i)=>b.classList.toggle('active',i===theme.preset));
document.querySelectorAll('#dashboardView .page').forEach(el=>el.style.setProperty('color-scheme',dash.dataset.displayMode));
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
$('bwResetTheme')?.addEventListener('click',()=>{theme={palette:'violet',style:'solid',preset:0,mode:'light'};renderPresets();applyTheme();});
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
