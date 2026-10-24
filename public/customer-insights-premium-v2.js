/* Budgetingwise customer insights V2 — premium, connected, transparent financial intelligence. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const page=$('page-insights');
if(!page)return;
const money=n=>new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP',maximumFractionDigits:0}).format(Number(n)||0);
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const txDate=t=>{const raw=String(t?.date||'');if(!raw)return null;const d=new Date(raw.includes('T')?raw:raw+'T12:00:00');return Number.isFinite(d.getTime())?d:null};
const sum=(rows,type)=>rows.filter(t=>t.type===type).reduce((n,t)=>n+Math.max(0,Number(t.amount)||0),0);
let lastTxs=[],lastGoals=[];

page.innerHTML=`
  <div class="section-heading bw-insights-heading">
    <div><span class="bw-insights-kicker">FINANCIAL INTELLIGENCE</span><h2>AI Insights</h2><p class="muted">Clear, data-driven guidance based on your recorded financial activity.</p></div>
    <button id="bwInsightsRefresh" class="primary bw-insights-refresh" type="button"><span>↻</span> Refresh insights</button>
  </div>

  <section class="bw-insights-hero" aria-label="Financial insights overview">
    <div><span class="bw-insights-live"><i></i> Connected to your financial data</span><h3>Your money, explained clearly.</h3><p>Every insight below is calculated from the same transactions and goals shown across your Budgetingwise workspace.</p></div>
    <div class="bw-insights-period"><small>ANALYSIS WINDOW</small><strong>Last 30 days</strong><span id="bwInsightsActivity">Waiting for activity</span></div>
  </section>

  <div class="bw-insight-feed">
    <article class="bw-insight-card" data-tone="flow"><span class="bw-insight-icon">↗</span><div><small>CASH FLOW PULSE</small><strong>Spending & cash flow</strong><p id="bwInsightText">Add transactions to unlock personalized insights.</p></div></article>
    <article class="bw-insight-card" data-tone="expense"><span class="bw-insight-icon">◎</span><div><small>TOP EXPENSE</small><strong>Biggest expense</strong><p id="bwInsightBiggest">Your largest expense category will appear here.</p></div></article>
    <article class="bw-insight-card" data-tone="saving"><span class="bw-insight-icon">◇</span><div><small>SAVINGS MOMENTUM</small><strong>Savings progress</strong><p id="bwInsightSavings">Record income to see your savings rate.</p></div></article>
    <article class="bw-insight-card" data-tone="watch"><span class="bw-insight-icon">△</span><div><small>SPENDING WATCH</small><strong>30-day comparison</strong><p id="bwInsightWarning">More history is needed for a spending comparison.</p></div></article>
  </div>

  <div class="bw-intelligence-grid">
    <article class="premium-panel bw-intelligence-card bw-health-card">
      <div class="bw-intelligence-card-head"><div><span class="bw-insights-kicker">FINANCIAL HEALTH</span><h3>Your financial health score</h3></div><span class="bw-card-status">Live calculation</span></div>
      <div class="bw-health-layout">
        <div class="bw-score-ring" id="bwHealthRing" style="--bw-score:0"><div><strong id="bwHealthScore">—</strong><small>/100</small></div></div>
        <div class="bw-health-copy"><h4 id="bwHealthLabel">Not enough data yet</h4><p id="bwHealthDetail" class="muted">Add recent income and transactions to calculate your score.</p><div class="bw-health-stats"><div><small>Cash-flow margin</small><strong id="bwCashFlowRate">—</strong></div><div><small>Goal progress</small><strong id="bwGoalProgressRate">—</strong></div></div></div>
      </div>
      <div class="bw-score-scale" aria-hidden="true"><span>Needs attention</span><i></i><span>Strong</span></div>
    </article>

    <article class="premium-panel bw-intelligence-card bw-forecast-card">
      <div class="bw-intelligence-card-head"><div><span class="bw-insights-kicker">30-DAY OUTLOOK</span><h3>Projected balance</h3></div><span class="bw-card-status">Scenario</span></div>
      <div class="bw-forecast-value"><strong id="bwForecastValue">—</strong><span id="bwForecastDelta">No projection yet</span></div>
      <p id="bwForecastDetail" class="muted">A projection appears after enough recent activity is recorded.</p>
      <div id="bwForecastTrend" class="bw-forecast-trend" aria-label="Projected balance trend"></div>
      <div class="bw-forecast-meta"><div><small>Current balance</small><strong id="bwForecastCurrent">—</strong></div><div><small>Recent 30-day net</small><strong id="bwForecastChange">—</strong></div></div>
    </article>
  </div>

  <section class="bw-insights-method">
    <span>i</span><div><strong>How these insights work</strong><p>Budgetingwise uses your recorded transactions and goals for these calculations. The health score is an illustrative budgeting indicator, not a credit score. Forecasts assume recent cash-flow behavior repeats and are not guarantees.</p></div>
  </section>`;

function renderTrend(current,projected,ready){
  const host=$('bwForecastTrend');if(!host)return;
  if(!ready){host.innerHTML='<div class="bw-forecast-empty"><span>Not enough recent activity yet</span></div>';return}
  const values=Array.from({length:7},(_,i)=>current+(projected-current)*(i/6));
  const min=Math.min(...values),max=Math.max(...values),range=Math.max(1,max-min),W=620,H=148,pad=10;
  const pts=values.map((v,i)=>({x:pad+i*((W-pad*2)/(values.length-1)),y:H-pad-((v-min)/range)*(H-pad*2),v}));
  let path=`M ${pts[0].x} ${pts[0].y}`;
  for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],cx=(a.x+b.x)/2;path+=` C ${cx} ${a.y}, ${cx} ${b.y}, ${b.x} ${b.y}`}
  const area=`${path} L ${pts.at(-1).x} ${H-pad} L ${pts[0].x} ${H-pad} Z`;
  host.innerHTML=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Balance projection from ${money(current)} to ${money(projected)}"><defs><linearGradient id="bwForecastAreaV2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--bw-ui-accent,#6947ef)" stop-opacity=".20"/><stop offset="1" stop-color="var(--bw-ui-accent,#6947ef)" stop-opacity="0"/></linearGradient></defs>${[.25,.5,.75].map(r=>`<line x1="${pad}" y1="${pad+(H-pad*2)*r}" x2="${W-pad}" y2="${pad+(H-pad*2)*r}" class="bw-forecast-grid"/>`).join('')}<path d="${area}" fill="url(#bwForecastAreaV2)"/><path d="${path}" class="bw-forecast-line"/>${pts.map((p,i)=>`<circle cx="${p.x}" cy="${p.y}" r="${i===pts.length-1?5:3}" class="bw-forecast-point"><title>${i===0?'Current':`Week ${i}`}: ${money(p.v)}</title></circle>`).join('')}</svg><div class="bw-forecast-labels"><span>Now</span><span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span></div>`;
}

function render(txs,goals){
  lastTxs=Array.isArray(txs)?txs:[];lastGoals=Array.isArray(goals)?goals:[];
  const now=new Date(),recentCut=new Date(now.getTime()-30*86400000),prevCut=new Date(now.getTime()-60*86400000);
  const recent=lastTxs.filter(t=>{const d=txDate(t);return d&&d>=recentCut&&d<=now});
  const previous=lastTxs.filter(t=>{const d=txDate(t);return d&&d>=prevCut&&d<recentCut});
  const income=sum(recent,'income'),expense=sum(recent,'expense'),saved=sum(recent,'savings');
  const prevExpense=sum(previous,'expense');
  const allIncome=sum(lastTxs,'income'),allExpense=sum(lastTxs,'expense'),allSaved=sum(lastTxs,'savings'),balance=allIncome-allExpense-allSaved;
  const recentNet=income-expense-saved;
  const savingsRate=income>0?saved/income:0;
  const cashMargin=income>0?recentNet/income:0;
  const goalProgress=lastGoals.length?lastGoals.reduce((n,g)=>n+clamp((Number(g.saved)||0)/Math.max(1,Number(g.target)||0),0,1),0)/lastGoals.length:null;
  const enoughScore=recent.length>=3&&income>0;
  const score=enoughScore?Math.round(clamp(50+clamp(cashMargin,-.5,.5)*40+clamp(savingsRate,0,.3)*50+(expense<=income?8:-8)+(goalProgress===null?0:goalProgress*7),0,100)):null;
  const enoughForecast=recent.length>=3;
  const projected=enoughForecast?balance+recentNet:null;
  const categories=new Map();recent.filter(t=>t.type==='expense').forEach(t=>{const key=String(t.category||'Other');categories.set(key,(categories.get(key)||0)+Math.max(0,Number(t.amount)||0))});
  const largest=[...categories].sort((a,b)=>b[1]-a[1])[0]||null;

  if($('bwInsightsActivity'))$('bwInsightsActivity').textContent=recent.length?`${recent.length} transaction${recent.length===1?'':'s'} analyzed`:'No recent transactions';
  if($('bwInsightText'))$('bwInsightText').textContent=recent.length?`You recorded ${money(income)} income and ${money(expense)} expenses in the last 30 days, with ${money(Math.max(0,recentNet))} left after recorded savings.`:'Add transactions to unlock personalized insights.';
  if($('bwInsightBiggest'))$('bwInsightBiggest').textContent=largest?`${largest[0]} is your largest recent expense at ${money(largest[1])}${expense?` (${Math.round(largest[1]/expense*100)}% of spending)`:''}.`:'No expense category has enough recent activity yet.';
  if($('bwInsightSavings'))$('bwInsightSavings').textContent=income>0?`You moved ${money(saved)} to savings, equal to ${Math.round(savingsRate*100)}% of recent income.`:'Record income to calculate your savings rate.';
  if($('bwInsightWarning')){let msg='A previous 30-day period is needed for comparison.';if(prevExpense>0){const diff=(expense-prevExpense)/prevExpense*100;msg=Math.abs(diff)<3?'Spending is essentially unchanged versus the previous 30 days.':diff>0?`Spending is ${Math.round(diff)}% higher than the previous 30 days.`:`Spending is ${Math.abs(Math.round(diff))}% lower than the previous 30 days.`}else if(expense===0&&recent.length)msg='No expenses were recorded in the current 30-day window.';$('bwInsightWarning').textContent=msg}

  if($('bwHealthScore'))$('bwHealthScore').textContent=score===null?'—':String(score);
  if($('bwHealthRing'))$('bwHealthRing').style.setProperty('--bw-score',String(score||0));
  if($('bwHealthLabel'))$('bwHealthLabel').textContent=score===null?'Not enough data yet':score>=80?'Strong financial position':score>=65?'Healthy with room to grow':score>=50?'Stable, but watch your margins':'Needs attention';
  if($('bwHealthDetail'))$('bwHealthDetail').textContent=score===null?'At least 3 recent transactions and recorded income are needed.':'Built from recent cash-flow margin, savings behavior, expense coverage and goal progress.';
  if($('bwCashFlowRate'))$('bwCashFlowRate').textContent=income>0?`${Math.round(cashMargin*100)}%`:'—';
  if($('bwGoalProgressRate'))$('bwGoalProgressRate').textContent=goalProgress===null?'No goals':`${Math.round(goalProgress*100)}%`;

  if($('bwForecastValue'))$('bwForecastValue').textContent=projected===null?'—':money(projected);
  if($('bwForecastCurrent'))$('bwForecastCurrent').textContent=money(balance);
  if($('bwForecastChange'))$('bwForecastChange').textContent=enoughForecast?`${recentNet>=0?'+':'−'}${money(Math.abs(recentNet))}`:'—';
  if($('bwForecastDelta'))$('bwForecastDelta').textContent=enoughForecast?`${recentNet>=0?'▲':'▼'} ${money(Math.abs(recentNet))} modeled change`:'No projection yet';
  if($('bwForecastDetail'))$('bwForecastDetail').textContent=enoughForecast?'Scenario assumes your most recent 30-day net cash flow repeats once more.':'Record at least 3 recent transactions to calculate a 30-day scenario.';
  renderTrend(balance,projected,enoughForecast);
}

window.renderWealthCrownInsights=render;
const refresh=$('bwInsightsRefresh');
refresh?.addEventListener('click',()=>{refresh.classList.add('is-refreshing');render(lastTxs,lastGoals);setTimeout(()=>refresh.classList.remove('is-refreshing'),420)});
render([],[]);
})();
