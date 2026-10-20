/* V31 dashboard reconstruction: match the approved premium dashboard while preserving existing data IDs. */
(()=>{'use strict';
const page=document.getElementById('page-dashboard');if(!page)return;
page.className='page bw-ref-dashboard';
page.innerHTML=`
<section class="bw-ref-welcome"><div><h1>Good afternoon, <span id="welcomeName">Guest</span></h1><p>Here’s your financial overview.</p></div><div class="bw-ref-date"><span>▣</span><div><small>Today</small><strong id="bwRefToday"></strong></div></div></section>
<div class="bw-ref-metrics">
 <article><span class="bw-ref-metric-icon wallet">▣</span><div><small>Total Balance</small><strong id="remainingTotal">₱0.00</strong><em>↑ 12% from last month</em></div></article>
 <article><span class="bw-ref-metric-icon income">↓</span><div><small>Total Income</small><strong id="incomeTotal">₱0.00</strong><em>↑ 8% from last month</em></div></article>
 <article><span class="bw-ref-metric-icon expense">↑</span><div><small>Total Expenses</small><strong id="expenseTotal">₱0.00</strong><em class="negative">↓ 5% from last month</em></div></article>
 <article><span class="bw-ref-metric-icon savings">♟</span><div><small>Total Savings</small><strong id="savingsTotal">₱0.00</strong><em>↑ 15% from last month</em></div></article>
</div>
<div class="bw-ref-chart-grid">
 <section class="bw-ref-card"><header><div><h3><span>▥</span> Income vs Expenses</h3><p>Your financial flow for this month</p></div><select id="earningsYear" aria-label="Chart year"></select></header><div id="earningsChart" class="earnings-chart"></div><div class="bw-ref-chart-key"><span>● Income</span><span>● Expenses</span></div></section>
 <section class="bw-ref-card"><header><div><h3><span>◕</span> Expense Breakdown</h3><p>Where your money goes this month</p></div><span class="bw-ref-period">This Month</span></header><div class="bw-ref-breakdown"><div id="expenseDonut" class="expense-donut"><div class="donut-inner"><strong id="donutTotal">₱0</strong><small>Total</small></div></div><div id="categoryLegend" class="category-legend"></div></div></section>
</div>
<div class="bw-ref-bottom-grid">
 <section class="bw-ref-card bw-ref-list"><header><h3><span>☷</span> Recent Transactions</h3><button data-page="transactions">View all</button></header><div id="recentList"><p class="muted">No transactions yet.</p></div></section>
 <section class="bw-ref-card bw-ref-goals"><header><h3><span>◎</span> Goals Progress</h3><button data-page="savings">View all</button></header><div id="bwRefGoals"><div class="bw-ref-empty">Add goals to track your progress.</div></div></section>
 <section class="bw-ref-card bw-ref-ai"><header><h3><span>✦</span> AI Insights</h3><button data-page="insights">View all</button></header><div class="bw-ref-insight good"><span>↗</span><p id="bwInsightDashboard">Add transactions to unlock insights.</p></div><div class="bw-ref-insight"><span>✦</span><p id="bwSavingDashboard">Record income to see your cash flow.</p></div><div class="bw-ref-insight blue"><span>▥</span><p>Your goals and spending trends appear here.</p></div></section>
</div>`;
const d=document.getElementById('bwRefToday');if(d)d.textContent=new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric'}).format(new Date());
})();