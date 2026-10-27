/* V50 — customer dashboard rebuilt to match the approved finance reference composition. */
(()=>{'use strict';
const page=document.getElementById('page-dashboard');if(!page)return;
const I=window.BudgetingwiseIcons;
const svg=(name,fallback='')=>I?.svg?.(name,'bw-ref-svg-icon')||fallback;
const greeting=()=>{const h=new Date().getHours();return h<12?'Good morning':h<18?'Good afternoon':'Good evening'};
page.className='page bw-picture-dashboard';
page.innerHTML=`
<div class="bw-picture-topbar">
  <label class="bw-picture-search"><span>⌕</span><input id="bwDashboardSearch" type="search" placeholder="Search transactions, goals, bills, or anything..." aria-label="Search Budgetingwise"></label>
  <div class="bw-picture-userbar"><button class="bw-picture-bell" type="button" aria-label="Notifications">♧<i></i></button><span class="bw-picture-avatar">BW</span><div><strong id="bwDashboardProfileName">Customer</strong><small id="bwDashboardProfileMode">Personal Account</small></div></div>
</div>

<div class="bw-picture-shell">
  <main class="bw-picture-main">
    <section class="bw-picture-welcome">
      <div><h1>${greeting()}, <span id="welcomeName">Customer</span>! <span aria-hidden="true">👋</span></h1><p id="bwDashboardSubtitle">Here’s a quick overview of your finances today.</p></div>
      <div class="bw-picture-date"><span>${svg('calendar','▣')}</span><div><strong id="bwDashToday"></strong><small id="bwDashPaydayMeta">Add your next payday in Financial Plan</small></div></div>
    </section>

    <section class="bw-picture-kpis">
      <article class="balance"><span class="bw-picture-kpi-icon">${svg('wallet','▣')}</span><div><small>Available Balance</small><strong id="remainingTotal">₱0.00</strong><em id="bwBalanceTrend">From recorded activity</em></div></article>
      <article class="income"><span class="bw-picture-kpi-icon">${svg('income','↑')}</span><div><small>Total Income</small><strong id="incomeTotal">₱0.00</strong><em id="bwIncomeTrend">No prior-month baseline</em></div></article>
      <article class="expense"><span class="bw-picture-kpi-icon">${svg('expense','↓')}</span><div><small>Total Expenses</small><strong id="expenseTotal">₱0.00</strong><em id="bwExpenseTrend">No prior-month baseline</em></div></article>
      <article class="savings"><span class="bw-picture-kpi-icon">${svg('savings','★')}</span><div><small>Total Savings</small><strong id="savingsTotal">₱0.00</strong><em id="bwSavingsTrend">No prior-month baseline</em></div></article>
    </section>

    <section class="bw-picture-chart-row">
      <article class="bw-picture-card bw-picture-balance-card">
        <header><div><h3>Available Balance Trend</h3><p>Balance movement from your recorded transactions</p></div><div class="bw-ref-range" aria-label="Balance chart range"><button type="button" class="active">7D</button><button type="button">30D</button><button type="button">3M</button><button type="button">1Y</button></div></header>
        <div id="balanceTrendChart" class="bw-balance-trend" role="img" aria-label="Available balance trend"><div class="bw-chart-empty">Add transactions to build your balance trend.</div></div>
      </article>
      <article class="bw-picture-card bw-picture-spending-card">
        <header><div><h3>Spending by Category</h3><p>This month</p></div><span class="bw-picture-filter">This Month⌄</span></header>
        <div class="bw-picture-breakdown"><div id="expenseDonut" class="expense-donut"><div class="donut-inner"><strong id="donutTotal">₱0</strong><small>Total Expenses</small></div></div><div id="categoryLegend" class="category-legend"></div></div>
      </article>
    </section>

    <section class="bw-picture-lower-grid">
      <article class="bw-picture-card bw-picture-transactions-card">
        <header><div><h3>Recent Transactions</h3><p>Latest activity from your records</p></div><button type="button" data-page="transactions">View All</button></header>
        <div id="recentList"><p class="muted">No transactions yet.</p></div>
      </article>
      <article class="bw-picture-card bw-picture-budget-card">
        <header><div><h3>Budget Progress</h3><p>Category spending against your limits</p></div><button type="button" data-page="plan">View All</button></header>
        <div id="bwDashBudgetProgress" class="bw-dash-budget-progress"><p class="muted">Set category budgets in Financial Plan.</p></div>
      </article>
      <article class="bw-picture-card bw-picture-health-card">
        <header><div><h3>Financial Health</h3><p>Cash flow and savings estimate</p></div></header>
        <div class="bw-dash-health-ring"><strong id="bwDashHealthScore">—</strong><small>/100</small></div>
        <strong id="bwDashHealthLabel" class="bw-dash-health-label">Building your score</strong><p id="bwDashHealthDetail">Add more financial activity to improve this estimate.</p>
      </article>
    </section>

    <section class="bw-picture-card bw-picture-ai-card">
      <header><div><h3>AI Insights & Recommendations</h3><p>Actionable observations from your recorded finances</p></div><button type="button" data-page="insights">View All</button></header>
      <div id="bwDashRecommendations" class="bw-dash-recommendations"><p class="muted">Insights will appear as your financial history grows.</p></div>
    </section>
  </main>

  <aside class="bw-picture-rail">
    <section class="bw-picture-card bw-picture-bills-card">
      <header><div><h3>Upcoming Bills & Payments</h3><p>Your next planned commitments</p></div><button type="button" data-page="plan">View All</button></header>
      <div id="bwDashUpcomingBills" class="bw-dash-upcoming"><p class="muted">Add recurring bills in Financial Plan.</p></div>
    </section>

    <section class="bw-picture-card bw-picture-afford-card">
      <header><div><h3>💡 Can I Afford This?</h3><p>Check a purchase against your plan</p></div></header>
      <form id="bwDashAffordForm" class="bw-dash-afford-form"><label><span>Enter amount</span><div><b>₱</b><input id="bwDashAffordAmount" type="number" min="1" step="1" placeholder="8,000"></div></label><label><span>Category</span><select id="bwDashAffordCategory"><option>Food & Dining</option><option>Transportation</option><option>Shopping</option><option>Bills</option><option>Entertainment</option><option>Health</option><option>Education</option><option>Others</option></select></label><button class="primary" type="submit">Check Affordability</button></form>
      <div id="bwDashAffordResult" class="bw-dash-afford-result"><strong>Enter an amount to check affordability.</strong><p>Budgetingwise will compare it with your Safe to Spend.</p></div>
    </section>

    <section class="bw-picture-card bw-picture-goals-card">
      <header><div><h3>Active Goals</h3><p>Your current savings targets</p></div><button type="button" data-page="savings">View All</button></header>
      <div id="bwDashActiveGoals" class="bw-dash-active-goals"><p class="muted">Create a savings goal to track progress.</p></div>
    </section>
  </aside>
</div>

<div class="bw-reference-legacy-targets" aria-hidden="true"><span id="bwRefPeriod"></span><select id="earningsYear"></select><div id="earningsChart"></div><div id="bwRefGoals"></div><p id="bwInsightDashboard"></p><p id="bwSavingDashboard"></p></div>`;
const today=document.getElementById('bwDashToday');if(today)today.textContent=new Intl.DateTimeFormat('en-PH',{month:'short',day:'numeric',year:'numeric'}).format(new Date());
})();