/* Budgetingwise Reference UI V2 — real-data presentation helpers for the approved seven-tab mockup. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP',maximumFractionDigits:0}).format(Number(n)||0);
const validDate=t=>{const d=new Date(String(t?.date||'')+'T12:00:00');return Number.isFinite(d.getTime())?d:null};
const summarize=rows=>{const s={income:0,expense:0,savings:0,balance:0};for(const t of rows){const a=Math.max(0,Number(t?.amount)||0);if(t.type==='income')s.income+=a;else if(t.type==='expense')s.expense+=a;else if(t.type==='savings')s.savings+=a}s.balance=s.income-s.expense-s.savings;return s};
const monthRows=(rows,d)=>rows.filter(t=>{const x=validDate(t);return x&&x.getFullYear()===d.getFullYear()&&x.getMonth()===d.getMonth()});
const pctChange=(current,previous)=>previous>0?(current-previous)/previous*100:null;
const monthLabel=d=>new Intl.DateTimeFormat('en-PH',{month:'long',year:'numeric'}).format(d);

function trendText(current,previous,{lowerIsBetter=false}={}){
 const change=pctChange(current,previous);
 if(change==null)return{ text:'No prior-month baseline',state:'neutral' };
 if(Math.abs(change)<.5)return{ text:'About the same as last month',state:'neutral' };
 const up=change>0,arrow=up?'↑':'↓',good=lowerIsBetter?!up:up;
 return{ text:`${arrow} ${Math.abs(change).toFixed(Math.abs(change)>=10?0:1)}% vs last month`,state:good?'positive':'negative' };
}
function applyTrend(node,result){if(!node)return;node.textContent=result.text;node.classList.toggle('negative',result.state==='negative');node.classList.toggle('positive',result.state==='positive');node.dataset.status=result.state}

function updateDashboard(rows){
 const now=new Date(),prev=new Date(now.getFullYear(),now.getMonth()-1,1),current=summarize(monthRows(rows,now)),previous=summarize(monthRows(rows,prev));
 const cards=[...document.querySelectorAll('#page-dashboard .bw-ref-metrics article')];
 // Card order owned by dashboard-reference-v31.js: balance, income, expense, savings.
 if(cards[0])applyTrend(cards[0].querySelector('em'),{text:'From recorded income, expenses and savings',state:current.balance>=0?'positive':'negative'});
 if(cards[1])applyTrend(cards[1].querySelector('em'),trendText(current.income,previous.income));
 if(cards[2])applyTrend(cards[2].querySelector('em'),trendText(current.expense,previous.expense,{lowerIsBetter:true}));
 if(cards[3])applyTrend(cards[3].querySelector('em'),trendText(current.savings,previous.savings));
 const subtitle=document.querySelector('#page-dashboard .bw-ref-welcome p');if(subtitle)subtitle.textContent=`Here’s your financial overview for ${monthLabel(now)}.`;
}

function ensureAverageDailyCard(rows){
 const cards=document.querySelector('#page-analytics .insight-cards');if(!cards)return;
 let card=$('analyticsAvgDailyCard');if(!card){card=document.createElement('article');card.id='analyticsAvgDailyCard';card.innerHTML='<span>Average Daily Spend</span><strong id="analyticsAvgDailySpend">—</strong><small>Current month</small>';cards.appendChild(card)}
 const now=new Date(),month=summarize(monthRows(rows,now)),elapsed=Math.max(1,now.getDate());
 const value=$('analyticsAvgDailySpend');if(value)value.textContent=month.expense>0?money(month.expense/elapsed):'—';
}

function syncAnalyticsYear(){
 const chart=document.querySelector('#page-analytics .bw-authority-month-chart');if(chart)chart.style.setProperty('--months',String(Math.max(1,chart.children.length)));
}

function cleanGuidance(){
 // The detailed three-step content remains available in markup for future onboarding,
 // but the reference UI intentionally presents only concise context + next action.
 document.querySelectorAll('#dashboardView .bw-page-guide').forEach(g=>g.setAttribute('aria-label','Page guidance and recommended next step'));
}

function updatePlanLabels(){
 const head=document.querySelector('#page-plan .bw-plan-head h3');if(head)head.textContent='Planning overview';
 const copy=document.querySelector('#page-plan .bw-plan-head p');if(copy)copy.textContent='See what is safe to spend after your budget and planned bills are considered.';
 const incomeHead=document.querySelector('#page-plan .bw-income-profile-head h3');if(incomeHead)incomeHead.textContent='Salary & Income Settings';
 const incomeCopy=document.querySelector('#page-plan .bw-income-profile-head p');if(incomeCopy)incomeCopy.textContent='Set your regular pay reference. Expected salary never increases your actual balance until it is recorded as income.';
}

function apply(detail){
 const rows=Array.isArray(detail?.transactions)?detail.transactions:[];
 updateDashboard(rows);ensureAverageDailyCard(rows);syncAnalyticsYear();cleanGuidance();updatePlanLabels();
}

window.addEventListener('budgetingwise:financial-data-rendered',e=>requestAnimationFrame(()=>apply(e.detail)));
window.addEventListener('budgetingwise:salary-profile-changed',()=>requestAnimationFrame(updatePlanLabels));
window.addEventListener('budgetingwise:planning-profile-changed',()=>requestAnimationFrame(updatePlanLabels));
document.getElementById('dashboardView')?.addEventListener('budgetingwise:page-change',()=>requestAnimationFrame(()=>{syncAnalyticsYear();cleanGuidance();updatePlanLabels()}));

const link=document.createElement('link');link.rel='stylesheet';link.href='./customer-reference-ui-v2.css?v=reference-ui-v2';document.head.appendChild(link);
// Re-append after full load so this remains the final customer visual authority even when legacy styles are injected later.
window.addEventListener('load',()=>document.head.appendChild(link),{once:true});
})();
