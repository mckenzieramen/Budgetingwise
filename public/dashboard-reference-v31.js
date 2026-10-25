/* V42 — customer dashboard rebuilt to the approved seven-tab reference. */
(()=>{'use strict';
const page=document.getElementById('page-dashboard');if(!page)return;
const I=window.BudgetingwiseIcons;
const svg=(name)=>I?I.svg(name,'bw-ref-svg-icon'):'';
const greeting=()=>{const h=new Date().getHours();return h<12?'Good morning':h<18?'Good afternoon':'Good evening'};
page.className='page bw-ref-dashboard';
page.innerHTML=`
<section class="bw-ref-welcome">
  <div class="bw-ref-welcome-copy"><h1>${greeting()}, <span id="welcomeName">Guest</span>! <span aria-hidden="true">👋</span></h1><p id="bwDashboardSubtitle">Here’s your financial overview.</p></div>
  <div class="bw-ref-period-pill"><span>${svg('calendar')}</span><strong id="bwRefPeriod"></strong><b>⌄</b></div>
</section>

<div class="bw-ref-metrics bw-ref-metrics-three">
  <article class="income"><span class="bw-ref-metric-icon income">${svg('income')}</span><div><small>Total Income</small><strong id="incomeTotal">₱0.00</strong><em id="bwIncomeTrend">No prior-month baseline</em></div></article>
  <article class="expense"><span class="bw-ref-metric-icon expense">${svg('expense')}</span><div><small>Total Expenses</small><strong id="expenseTotal">₱0.00</strong><em id="bwExpenseTrend">No prior-month baseline</em></div></article>
  <article class="savings"><span class="bw-ref-metric-icon savings">${svg('savings')}</span><div><small>Total Savings</small><strong id="savingsTotal">₱0.00</strong><em id="bwSavingsTrend">No prior-month baseline</em></div></article>
</div>

<section class="bw-ref-card bw-ref-balance-card">
  <header><div><small>Available Balance</small><strong id="remainingTotal">₱0.00</strong><em id="bwBalanceTrend">From recorded income, expenses and savings</em></div><div class="bw-ref-range" aria-label="Balance chart range"><button type="button" class="active">7D</button><button type="button">30D</button><button type="button">3M</button><button type="button">1Y</button></div></header>
  <div id="balanceTrendChart" class="bw-balance-trend" role="img" aria-label="Available balance trend"><div class="bw-chart-empty">Add transactions to build your balance trend.</div></div>
</section>

<div class="bw-ref-dashboard-bottom">
  <section class="bw-ref-card bw-ref-list">
    <header><div><h3>Recent Transactions</h3><p>Latest activity from your records</p></div><button type="button" data-page="transactions">View all</button></header>
    <div id="recentList"><p class="muted">No transactions yet.</p></div>
  </section>
  <section class="bw-ref-card bw-ref-spending-card">
    <header><div><h3>Spending by Category</h3><p>Where your money goes this month</p></div></header>
    <div class="bw-ref-breakdown"><div id="expenseDonut" class="expense-donut"><div class="donut-inner"><strong id="donutTotal">₱0</strong><small>Total Expenses</small></div></div><div id="categoryLegend" class="category-legend"></div></div>
  </section>
</div>

<!-- Legacy targets retained for existing chart/data modules without affecting the approved visual layout. -->
<div class="bw-reference-legacy-targets" aria-hidden="true"><select id="earningsYear"></select><div id="earningsChart"></div><div id="bwRefGoals"></div><p id="bwInsightDashboard"></p><p id="bwSavingDashboard"></p></div>`;
const p=document.getElementById('bwRefPeriod');if(p)p.textContent=new Intl.DateTimeFormat('en-PH',{month:'long',year:'numeric'}).format(new Date());
})();