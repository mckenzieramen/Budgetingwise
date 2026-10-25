/* Budgetingwise Customer Reference Pages V3 — composition only, preserving existing data IDs and actions. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const page=id=>$('page-'+id);

function transactions(){const n=page('transactions');if(!n)return;n.innerHTML=`
<div class="section-heading"><div><h2>Transactions</h2><p class="muted">Add, view, and manage all your income, expenses, and savings.</p></div><button id="addExpenseBtn2" class="primary">＋ Add Transaction</button></div>
<div class="bw-data-only" aria-hidden="true"><span id="txIncome">₱0</span><span id="txExpense">₱0</span><span id="txNet">₱0</span><span id="txCount">0</span></div>
<div class="bw-reference-filterbar">
  <div class="tx-tabs"><button class="tx-tab active" data-tx-tab="all">All</button><button class="tx-tab" data-tx-tab="income">Income</button><button class="tx-tab" data-tx-tab="expense">Expenses</button><button class="tx-tab" data-tx-tab="savings">Savings</button></div>
  <div class="transaction-toolbar"><select id="txTypeFilter"><option value="all">All Types</option><option value="income">Income</option><option value="expense">Expenses</option><option value="savings">Savings</option></select><select id="txCategoryFilter"><option value="all">All Categories</option></select><label class="tx-search"><span>⌕</span><input id="txSearch" placeholder="Search transactions..." aria-label="Search transactions"></label><button id="txResetFilters" class="soft-button" type="button" aria-label="Reset filters">⌁</button></div>
</div>
<section class="premium-panel tx-panel"><div id="transactionList" class="table-wrap"></div><div class="tx-footer"><span id="txShowing">Showing 0 records</span><span id="txPaginationLabel">0 transactions</span><div><button id="txPrev" class="soft-button">‹</button><span id="txPageLabel">1 / 1</span><button id="txNext" class="soft-button">›</button></div></div></section>`}

function analytics(){const n=page('analytics');if(!n)return;n.innerHTML=`
<div class="section-heading"><div><h2>Analytics</h2><p class="muted">Visualize your spending patterns and financial trends.</p></div><select id="analyticsYear" aria-label="Analytics year"></select></div>
<div class="insight-cards bw-reference-analytics-kpis"><article><span>Total Income</span><strong id="analyticsIncome">₱0</strong><small>Selected period</small></article><article><span>Total Expenses</span><strong id="analyticsExpense">₱0</strong><small>Selected period</small></article><article><span>Savings Rate</span><strong id="analyticsSavingsRate">0%</strong><small>Of recorded income</small></article><article id="analyticsAvgDailyCard"><span>Avg. Daily Spend</span><strong id="analyticsAvgDailySpend">—</strong><small>Current month</small></article></div>
<div class="bw-reference-analytics-grid bw-reference-analytics-top">
  <section class="premium-panel bw-analytics-trend"><div class="premium-panel-head"><div><h3>Income vs Expenses</h3><small>Monthly financial flow</small></div></div><div id="analyticsChart" class="earnings-chart"></div><div class="bw-ref-chart-key"><span><i class="income-dot"></i>Income</span><span><i class="expense-dot"></i>Expenses</span></div></section>
  <section class="premium-panel"><div class="premium-panel-head"><div><h3>Expenses by Category</h3><small>Current spending distribution</small></div></div><div class="bw-reference-analytics-donut"><div id="analyticsExpenseDonut" class="expense-donut"><div class="donut-inner"><strong id="analyticsDonutTotal">₱0</strong><small>Total</small></div></div><div id="analyticsDonutLegend" class="category-legend"></div></div></section>
</div>
<div class="bw-reference-analytics-grid bw-reference-analytics-bottom">
  <section class="premium-panel"><div class="premium-panel-head"><div><h3>Monthly Trend</h3><small>Expense movement over recent months</small></div></div><div id="analyticsMonthlyTrend" class="bw-reference-monthly-trend"><p class="muted">Add transaction history to see a monthly trend.</p></div></section>
  <section class="premium-panel"><div class="premium-panel-head"><div><h3>Top Spending Categories</h3><small>Largest expense categories</small></div></div><div id="analyticsCategories" class="analytics-category-list"><p class="muted">No expenses recorded yet.</p></div></section>
</div>`}

function goals(){const n=page('savings');if(!n)return;n.innerHTML=`
<div class="section-heading"><div><h2>Savings Goals</h2><p class="muted">Set and track your financial goals.</p></div><button id="addGoalBtn" class="primary">＋ Add Goal</button></div>
<div class="goal-tabs"><button class="goal-tab active" data-goal-filter="all">All Goals</button><button class="goal-tab" data-goal-filter="active">Active</button><button class="goal-tab" data-goal-filter="completed">Completed</button></div>
<div id="goalGrid" class="goal-grid premium-goals"></div>
<div class="bw-data-only" aria-hidden="true"><span id="goalsCount"></span><span id="bwGoalTotalSaved">₱0</span><span id="bwGoalTotalCount">0</span><span id="bwGoalCompleted">0</span><span id="bwGoalProgress">0</span><div id="savingsHistory"></div></div>`}

function insights(){const n=page('insights');if(!n)return;n.innerHTML=`
<div class="section-heading"><div><h2>AI Insights</h2><p class="muted">Personalized insights and recommendations based on your recorded financial activity.</p></div><button id="bwInsightsRefresh" class="soft-button">AI context</button></div>
<div class="bw-insight-feed"><article class="bw-insight-good"><span>●</span><div><strong>Month-over-Month</strong><p id="bwInsightText">Add transactions to unlock personalized insights.</p></div></article><article><span>●</span><div><strong>Top Spending Category</strong><p id="bwInsightBiggestExpense">Your largest expense category will appear here.</p></div></article><article class="bw-insight-blue"><span>●</span><div><strong>Savings Progress</strong><p id="bwInsightSavings">Record income and savings to calculate progress.</p></div></article><article class="bw-insight-warn"><span>●</span><div><strong>Spending Watch</strong><p id="bwInsightSpendingTrend">Add another month of data to compare spending.</p></div></article></div>
<div class="bw-intelligence-grid"><article class="premium-panel bw-intelligence-card bw-health-card"><p class="eyebrow">BUDGETINGWISE HEALTH ESTIMATE</p><div class="bw-score-ring"><strong id="bwHealthScore">—</strong><small>/100</small></div><div class="bw-health-copy"><h3 id="bwHealthLabel">Not enough data yet</h3><p id="bwHealthDetail" class="muted">Requires recent transaction data.</p><button type="button" id="bwHealthExplainToggle" class="soft-button">Why this score?</button><div id="bwHealthExplain" hidden></div></div></article><article class="premium-panel bw-intelligence-card bw-forecast-card"><p class="eyebrow">30-DAY CASH FLOW PROJECTION</p><strong id="bwForecastValue">—</strong><h3>Estimated balance</h3><p id="bwForecastDetail" class="muted">Based on recent recorded cash flow; estimates are not guarantees.</p><div class="bw-forecast-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></article></div>
<section class="premium-panel bw-reference-recommendations"><div class="premium-panel-head"><div><h3>Recommendations</h3><small>Actions supported by your recorded data</small></div></div><div id="bwRecommendations"><p class="muted">Recommendations will appear as your financial history grows.</p></div></section>`}

function settings(){const n=page('settings');if(!n)return;n.innerHTML=`
<div class="section-heading"><div><h2>Settings</h2><p class="muted">Manage your account, appearance, and Budgetingwise preferences.</p></div></div>
<div id="bwSettingsMount"></div>
<section class="premium-panel account-panel"><div class="premium-panel-head"><div><h3>Account Information</h3><small>Registered customer details</small></div><span class="panel-filter">Read only</span></div><div class="settings"><div><span>Budget ID</span><strong id="settingsBid">—</strong></div><div><span>Name</span><strong id="settingsName">—</strong></div><div><span>Email</span><strong id="settingsEmail">—</strong></div><div><span>Status</span><strong class="status">Authorized</strong></div></div></section>`}

transactions();analytics();goals();insights();settings();
})();