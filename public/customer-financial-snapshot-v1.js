/* Budgetingwise Customer Financial Snapshot V1 — top-of-page monthly executive summary. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP',maximumFractionDigits:0}).format(Number(n)||0);
let lastDetail=null;

const validDate=t=>{const d=new Date(String(t?.date||'')+'T12:00:00');return Number.isFinite(d.getTime())?d:null};
function currentMonthRows(rows){const now=new Date();return rows.filter(t=>{const d=validDate(t);return d&&d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth()})}
function summarize(rows){const s={income:0,expense:0,savings:0,balance:0};for(const t of rows){const a=Math.max(0,Number(t.amount)||0);if(t.type==='income')s.income+=a;else if(t.type==='expense')s.expense+=a;else if(t.type==='savings')s.savings+=a}s.balance=s.income-s.expense-s.savings;return s}
function expectedMonthly(){return Math.max(0,Number(window.bwSalaryProfile?.monthlyEquivalent)||0)}
function monthLabel(){return new Intl.DateTimeFormat('en-PH',{month:'long',year:'numeric'}).format(new Date())}

function ensureSnapshot(){
 const page=$('page-insights'),heading=page?.querySelector(':scope > .section-heading');if(!page||!heading)return null;
 let panel=$('bwFinancialSnapshot');if(panel)return panel;
 panel=document.createElement('section');panel.id='bwFinancialSnapshot';panel.className='bw-financial-snapshot';
 panel.innerHTML=`<div class="bw-snapshot-head"><div><span>FINANCIAL SNAPSHOT</span><h3>Your money at a glance</h3><p>Actual recorded activity for this month, with salary shown separately as a planning reference.</p></div><div class="bw-snapshot-period"><small>THIS MONTH</small><strong id="bwSnapshotPeriod"></strong></div></div><div class="bw-snapshot-grid"><article class="bw-snapshot-card expected"><small>Expected monthly income</small><strong id="bwSnapshotExpected">—</strong><span>Salary reference</span></article><article class="bw-snapshot-card income"><small>Income recorded</small><strong id="bwSnapshotIncome">₱0</strong><span id="bwSnapshotCoverage">Actual received</span></article><article class="bw-snapshot-card expense"><small>Total expenses</small><strong id="bwSnapshotExpense">₱0</strong><span>Recorded spending</span></article><article class="bw-snapshot-card savings"><small>Total savings</small><strong id="bwSnapshotSavings">₱0</strong><span>Recorded allocations</span></article><article class="bw-snapshot-card balance"><small>Available balance</small><strong id="bwSnapshotBalance">₱0</strong><span>Income − expenses − savings</span></article></div><div class="bw-snapshot-foot"><div><i></i><span id="bwSnapshotMessage">Add your salary profile to compare expected and actual income.</span></div><button type="button" id="bwSnapshotSalaryAction">Set salary</button></div>`;
 heading.insertAdjacentElement('afterend',panel);
 $('bwSnapshotSalaryAction')?.addEventListener('click',()=>{const target=$('bwIncomeProfile');if(target){target.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>$('bwSalaryAmount')?.focus(),350)}});
 return panel;
}

function render(detail){
 lastDetail=detail||lastDetail;const panel=ensureSnapshot();if(!panel||!lastDetail)return;
 const rows=Array.isArray(lastDetail.transactions)?lastDetail.transactions:[],month=currentMonthRows(rows),s=summarize(month),expected=expectedMonthly(),coverage=expected>0?s.income/expected*100:null;
 if($('bwSnapshotPeriod'))$('bwSnapshotPeriod').textContent=monthLabel();
 if($('bwSnapshotExpected'))$('bwSnapshotExpected').textContent=expected>0?money(expected):'—';
 if($('bwSnapshotIncome'))$('bwSnapshotIncome').textContent=money(s.income);
 if($('bwSnapshotExpense'))$('bwSnapshotExpense').textContent=money(s.expense);
 if($('bwSnapshotSavings'))$('bwSnapshotSavings').textContent=money(s.savings);
 if($('bwSnapshotBalance')){$('bwSnapshotBalance').textContent=money(s.balance);$('bwSnapshotBalance').classList.toggle('negative',s.balance<0)}
 if($('bwSnapshotCoverage'))$('bwSnapshotCoverage').textContent=coverage==null?'Actual received':`${Math.round(coverage)}% of expected income recorded`;
 const message=$('bwSnapshotMessage'),action=$('bwSnapshotSalaryAction');
 if(expected<=0){if(message)message.textContent='Add your salary profile to compare expected monthly income with what you actually record.';if(action)action.textContent='Set salary'}
 else{const gap=expected-s.income;if(message)message.textContent=gap>0?`${money(gap)} of expected monthly income is not recorded yet. Expected salary is not added to your balance until recorded as income.`:`Recorded income has reached ${Math.round(coverage)}% of your salary reference. Extra income may include bonuses, freelance work, or other sources.`;if(action)action.textContent='Edit salary'}
}

window.addEventListener('budgetingwise:financial-data-rendered',e=>render(e.detail));
window.addEventListener('budgetingwise:salary-profile-changed',()=>{if(lastDetail)render(lastDetail)});

const style=document.createElement('style');style.textContent=`
#page-insights .bw-financial-snapshot{margin:0 0 14px;padding:18px;border:1px solid var(--bw-ui-border);border-radius:17px;background:var(--bw-ui-surface);box-shadow:0 10px 30px rgba(28,31,50,.045)}
#page-insights .bw-snapshot-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:14px}.bw-snapshot-head>div:first-child{min-width:0}.bw-snapshot-head span{font-size:7px;font-weight:850;letter-spacing:.12em;color:var(--bw-ui-accent)}.bw-snapshot-head h3{margin:4px 0 4px!important;font-size:16px!important;letter-spacing:-.035em!important}.bw-snapshot-head p{margin:0!important;max-width:620px;font-size:8px!important;line-height:1.5!important;color:var(--bw-ui-muted)!important}.bw-snapshot-period{flex:none;text-align:right;padding:8px 10px;border:1px solid var(--bw-ui-border);border-radius:10px;background:var(--bw-ui-surface-2)}.bw-snapshot-period small{display:block;font-size:6px!important;letter-spacing:.08em;color:var(--bw-ui-muted)!important}.bw-snapshot-period strong{display:block;margin-top:2px;font-size:8px!important}
#page-insights .bw-snapshot-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}.bw-snapshot-card{position:relative;min-width:0;padding:12px 12px 11px;border:1px solid var(--bw-ui-border);border-radius:12px;background:var(--bw-ui-surface-2);overflow:hidden}.bw-snapshot-card:before{content:"";position:absolute;left:0;top:10px;bottom:10px;width:2px;border-radius:999px;background:var(--bw-ui-border)}.bw-snapshot-card.expected:before{background:var(--bw-ui-accent)}.bw-snapshot-card.income:before{background:#26a477}.bw-snapshot-card.expense:before{background:#db667d}.bw-snapshot-card.savings:before{background:#6487dc}.bw-snapshot-card.balance:before{background:#9a71e8}.bw-snapshot-card small{display:block;font-size:6.5px!important;text-transform:uppercase;letter-spacing:.055em;color:var(--bw-ui-muted)!important}.bw-snapshot-card strong{display:block;margin:5px 0 3px;font-size:15px!important;line-height:1.15!important;font-weight:850!important;letter-spacing:-.035em!important;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.bw-snapshot-card strong.negative{color:#c34e68!important}.bw-snapshot-card span{display:block;font-size:6.5px!important;line-height:1.35;color:var(--bw-ui-muted)}
#page-insights .bw-snapshot-foot{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:10px;padding:9px 10px;border:1px solid color-mix(in srgb,var(--bw-ui-accent) 8%,var(--bw-ui-border));border-radius:11px;background:var(--bw-ui-soft-2)}.bw-snapshot-foot>div{display:flex;align-items:flex-start;gap:7px;min-width:0}.bw-snapshot-foot i{width:6px;height:6px;margin-top:3px;flex:none;border-radius:50%;background:var(--bw-ui-accent)}.bw-snapshot-foot span{font-size:7px;line-height:1.45;color:var(--bw-ui-muted)}.bw-snapshot-foot button{flex:none;padding:7px 10px!important;border:1px solid var(--bw-ui-border)!important;border-radius:9px!important;background:var(--bw-ui-surface)!important;color:var(--bw-ui-accent)!important;box-shadow:none!important;font-size:7px!important;font-weight:850!important}
@media(max-width:1150px){#page-insights .bw-snapshot-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.bw-snapshot-card.balance{grid-column:span 2}}
@media(max-width:760px){#page-insights .bw-snapshot-grid{grid-template-columns:1fr 1fr}.bw-snapshot-card.balance{grid-column:1/-1}.bw-snapshot-head{align-items:flex-start;flex-direction:column}.bw-snapshot-period{text-align:left}.bw-snapshot-foot{align-items:flex-start;flex-direction:column}}
@media(max-width:480px){#page-insights .bw-snapshot-grid{grid-template-columns:1fr}.bw-snapshot-card.balance{grid-column:auto}}
`;document.head.appendChild(style);
})();