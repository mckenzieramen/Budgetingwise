/* Wealth Crown V2: transparent, local calculations from existing transaction data; no AI API or external data sharing. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const fmt=n=>new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP',maximumFractionDigits:0}).format(n||0);
const date=t=>{const d=new Date(String(t.date||'')+'T12:00:00');return Number.isFinite(d.getTime())?d:null};
function analyze(txs,goals){
txs=Array.isArray(txs)?txs:[];goals=Array.isArray(goals)?goals:[];
const now=new Date(),days=30,cutoff=new Date(now.getTime()-days*86400000),recent=txs.filter(t=>date(t)&&date(t)>=cutoff&&date(t)<=now);
const sum=(list,type)=>list.filter(t=>t.type===type).reduce((a,t)=>a+Math.max(0,Number(t.amount)||0),0);
const income=sum(recent,'income'),expense=sum(recent,'expense'),saved=sum(recent,'savings');
const allIncome=sum(txs,'income'),allExpense=sum(txs,'expense'),allSaved=sum(txs,'savings'),balance=allIncome-allExpense-allSaved;
const rate=income>0?Math.max(0,(income-expense)/income):0;
const goalProgress=goals.length?goals.reduce((a,g)=>a+Math.min(1,(Number(g.saved)||0)/Math.max(1,Number(g.target)||0)),0)/goals.length:null;
const enough=recent.length>=3&&income>0;
const score=enough?Math.round(Math.max(0,Math.min(100,35+rate*40+(expense<=income?15:0)+(goalProgress===null?0:goalProgress*10)))):null;
const projected=enough?balance+(income-expense-saved):null;
const categories=new Map();recent.filter(t=>t.type==='expense').forEach(t=>{const k=String(t.category||'Other');categories.set(k,(categories.get(k)||0)+Math.max(0,Number(t.amount)||0))});
const largest=[...categories].sort((a,b)=>b[1]-a[1])[0];
const insight=recent.length===0?'Add transactions to unlock personalized insights.':largest?'Your largest expense category in the past 30 days is '+largest[0]+' ('+fmt(largest[1])+').':'You have no recorded expenses in the past 30 days.';
if($('bwHealthScore'))$('bwHealthScore').textContent=score===null?'—':score+'/100';
if($('bwHealthLabel'))$('bwHealthLabel').textContent=score===null?'Not enough data yet':score>=80?'Strong financial habits':score>=60?'Building good habits':'Room to improve';
if($('bwHealthFill'))$('bwHealthFill').style.width=(score||0)+'%';
if($('bwHealthDetail'))$('bwHealthDetail').textContent=score===null?'Needs at least 3 recent transactions and income.': 'Illustrative score based on recent cash flow and goal progress, not a credit score.';
if($('bwForecastValue'))$('bwForecastValue').textContent=projected===null?'—':fmt(projected);
if($('bwForecastDetail'))$('bwForecastDetail').textContent=projected===null?'Add at least 3 recent transactions and income to calculate.':'30-day estimate assuming the past 30 days repeat; not guaranteed.';
if($('bwInsightText'))$('bwInsightText').textContent=insight;
if($('bwInsightSavings'))$('bwInsightSavings').textContent=income>0?'Your recent cash-flow surplus is '+Math.round(rate*100)+'% of income.':'Record income to see your cash-flow surplus.';
}
window.renderWealthCrownInsights=analyze;
document.addEventListener('DOMContentLoaded',()=>{
const btn=$('bwInsightsRefresh');btn?.addEventListener('click',()=>{const a=$('bwInsightText');if(a){a.classList.remove('bw-flash');void a.offsetWidth;a.classList.add('bw-flash')}});
analyze([],[]);
});
})();
