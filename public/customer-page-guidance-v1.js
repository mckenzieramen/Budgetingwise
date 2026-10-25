/* Budgetingwise Customer Page Guidance V1 — contextual guidance across every customer tab. */
(()=>{'use strict';
const root=document.getElementById('dashboardView');if(!root)return;
let lastFinancial=null;
const config={
 dashboard:{title:'Understand your money first',copy:'Use the dashboard for a quick financial check before deciding what to do next.',steps:['Check balance, income, expenses and savings','Review the monthly cash-flow chart','Open the next area that needs attention']},
 transactions:{title:'Keep your records accurate',copy:'This is the source of truth for the rest of Budgetingwise. Record money when it actually comes in, goes out, or moves to savings.',steps:['Choose the correct transaction type','Use a clear category and description','Review totals and filters for mistakes']},
 analytics:{title:'Turn records into patterns',copy:'Analytics helps you understand how your income, spending and savings change over time.',steps:['Check the monthly income vs expense trend','Review your highest spending categories','Use savings rate to judge progress']},
 savings:{title:'Give every goal a clear target',copy:'Use Goals for specific outcomes such as an emergency fund, travel, equipment or a major purchase.',steps:['Create a target amount and date','Track how much is already saved','Review progress regularly and adjust']},
 plan:{title:'Plan before the money is spent',copy:'Financial Plan is where salary, monthly budget, payday and recurring bills belong. These settings power your safe-to-spend guidance.',steps:['Set your regular income reference','Set your budget and next payday','Reserve recurring bills before spending']},
 insights:{title:'Use insights to decide what to change',copy:'AI Insights should explain your financial patterns—not collect setup information. Start with the strongest signal, then take action in the correct tab.',steps:['Read month-over-month changes','Review the health estimate and why it changed','Act on the insight through Transactions, Goals or Plan']},
 settings:{title:'Make Budgetingwise fit your account',copy:'Settings is for appearance, preferences and account information—not financial planning.',steps:['Choose your preferred theme and display','Review account information','Keep interface preferences comfortable and readable']}
};
function rows(){return Array.isArray(lastFinancial?.transactions)?lastFinancial.transactions:[]}
function uniqueMonths(){const set=new Set();for(const t of rows()){const d=new Date(String(t?.date||'')+'T12:00:00');if(Number.isFinite(d.getTime()))set.add(`${d.getFullYear()}-${d.getMonth()}`)}return set.size}
function goalCount(){return document.querySelectorAll('#goalGrid .goal-card').length}
function recommendation(page){const tx=rows(),salary=Math.max(0,Number(window.bwSalaryProfile?.monthlyEquivalent)||0),plan=window.bwPlanningProfile||{};
 if(page==='dashboard'){
  if(!tx.length)return{title:'Record your first transaction',detail:'The dashboard becomes meaningful after you record real income, expenses or savings.',label:'Go to Transactions',action:'nav',target:'transactions'};
  if(!salary)return{title:'Complete your income plan',detail:'Add your salary and payday so Budgetingwise can compare actual cash flow with your regular income.',label:'Open Financial Plan',action:'nav',target:'plan'};
  return{title:'Review what changed',detail:'Your core data is in place. Use AI Insights to see trends and areas that need attention.',label:'Open AI Insights',action:'nav',target:'insights'};
 }
 if(page==='transactions')return{title:tx.length?'Keep this month current':'Start your financial history',detail:tx.length?'Add transactions as they happen so every chart and insight stays accurate.':'Begin with your latest income, expense or savings transaction.',label:'Add Transaction',action:'click',target:'addExpenseBtn2'};
 if(page==='analytics'){
  if(uniqueMonths()<2)return{title:'Build more history first',detail:'Month-over-month comparisons need dated transactions from at least two different months.',label:'Add Transactions',action:'nav',target:'transactions'};
  return{title:'Investigate the biggest change',detail:'Use the trend and category breakdown here, then check AI Insights for an explanation of the strongest movement.',label:'Review AI Insights',action:'nav',target:'insights'};
 }
 if(page==='savings')return goalCount()?{title:'Keep your goals connected to reality',detail:'Compare goal progress with your current savings rate and available balance before increasing contributions.',label:'Review Analytics',action:'nav',target:'analytics'}:{title:'Create your first financial goal',detail:'Start with one clear target such as an emergency fund or planned purchase.',label:'Add Goal',action:'click',target:'addGoalBtn'};
 if(page==='plan'){
  if(!salary)return{title:'Start with your salary',detail:'Set your regular pay amount and frequency first. It stays a planning reference until actual income is recorded.',label:'Set Salary',action:'focus',target:'bwSalaryAmount'};
  if(!(Number(plan.monthlyBudget)>0))return{title:'Set a monthly spending limit',detail:'A budget gives Safe to Spend a clear ceiling instead of relying only on current balance.',label:'Set Monthly Budget',action:'focus',target:'bwMonthlyBudget'};
  if(!Array.isArray(plan.bills)||!plan.bills.length)return{title:'Reserve your regular bills',detail:'Add rent, utilities, subscriptions and other recurring commitments before discretionary spending.',label:'Add Recurring Bill',action:'focus',target:'bwBillName'};
  return{title:'Use Safe to Spend as your checkpoint',detail:'Your core plan is set. Check Safe to Spend before non-essential purchases and keep bills marked paid.',label:'Review Safe to Spend',action:'scroll',target:'bwPlanningAssistant'};
 }
 if(page==='insights'){
  if(uniqueMonths()<2)return{title:'Give the analysis more history',detail:'Add another month of dated transactions so trend comparisons are based on real history.',label:'Build Transaction History',action:'nav',target:'transactions'};
  return{title:'Turn the strongest insight into an action',detail:'If spending is rising, adjust the plan. If savings is improving, consider increasing a goal contribution.',label:'Open Financial Plan',action:'nav',target:'plan'};
 }
 return{title:'Personalize the experience',detail:'Adjust appearance and account preferences here. Financial inputs should stay in Financial Plan.',label:'Review Account',action:'scroll',target:'bwSettingsMount'};
}
function anchorFor(page,node){if(page==='dashboard')return node.querySelector('.bw-ref-welcome')||node.firstElementChild;return node.querySelector(':scope > .section-heading')||node.firstElementChild}
function ensure(page){const node=document.getElementById('page-'+page);if(!node)return null;let guide=node.querySelector(':scope > .bw-page-guide');if(guide)return guide;guide=document.createElement('section');guide.className='bw-page-guide';guide.dataset.pageGuide=page;const anchor=anchorFor(page,node);if(anchor)anchor.insertAdjacentElement('afterend',guide);else node.prepend(guide);return guide}
function render(page){const guide=ensure(page),c=config[page];if(!guide||!c)return;const r=recommendation(page);guide.innerHTML=`<div class="bw-guide-copy"><span>PAGE GUIDE</span><h3>${c.title}</h3><p>${c.copy}</p></div><div class="bw-guide-steps">${c.steps.map((s,i)=>`<div><b>${i+1}</b><span>${s}</span></div>`).join('')}</div><div class="bw-guide-next"><small>RECOMMENDED NEXT STEP</small><strong>${r.title}</strong><p>${r.detail}</p><button type="button" data-guide-action="${r.action}" data-guide-target="${r.target}">${r.label}<i>→</i></button></div>`}
function renderAll(){for(const page of Object.keys(config))render(page)}
function act(button){const action=button.dataset.guideAction,target=button.dataset.guideTarget;if(action==='nav'){window.bwNavigate?.(target);return}if(action==='click'){const el=document.getElementById(target);if(el){el.click();return}}if(action==='focus'){const el=document.getElementById(target);if(el){el.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>el.focus(),260);return}}if(action==='scroll'){document.getElementById(target)?.scrollIntoView({behavior:'smooth',block:'start'})}}
root.addEventListener('click',e=>{const button=e.target.closest('[data-guide-action]');if(button&&root.contains(button))act(button)});
root.addEventListener('budgetingwise:page-change',e=>{const page=e.detail?.page;if(config[page])requestAnimationFrame(()=>render(page))});
window.addEventListener('budgetingwise:financial-data-rendered',e=>{lastFinancial=e.detail;requestAnimationFrame(renderAll)});
window.addEventListener('budgetingwise:salary-profile-changed',()=>requestAnimationFrame(renderAll));
window.addEventListener('budgetingwise:planning-profile-changed',()=>requestAnimationFrame(renderAll));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(renderAll,0),{once:true});else setTimeout(renderAll,0);
const style=document.createElement('style');style.textContent=`
#dashboardView .bw-page-guide{display:grid;grid-template-columns:minmax(220px,.9fr) minmax(320px,1.35fr) minmax(250px,.95fr);gap:14px;align-items:stretch;margin:0 0 16px;padding:14px;border:1px solid var(--bw-ui-border);border-radius:16px;background:linear-gradient(120deg,var(--bw-ui-surface),color-mix(in srgb,var(--bw-ui-accent) 3%,var(--bw-ui-surface)));box-shadow:0 7px 22px rgba(28,31,50,.035)}
#dashboardView .bw-guide-copy{padding:3px 6px}.bw-guide-copy>span{display:block;font-size:7px;font-weight:900;letter-spacing:.12em;color:var(--bw-ui-accent)}.bw-guide-copy h3{margin:5px 0 5px!important;font-size:14px!important;letter-spacing:-.03em!important}.bw-guide-copy p{margin:0!important;font-size:8px!important;line-height:1.55!important;color:var(--bw-ui-muted)!important}
#dashboardView .bw-guide-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.bw-guide-steps>div{display:flex;align-items:flex-start;gap:7px;min-width:0;padding:10px;border:1px solid var(--bw-ui-border);border-radius:11px;background:var(--bw-ui-surface-2)}.bw-guide-steps b{display:grid;place-items:center;flex:0 0 20px;width:20px;height:20px;border-radius:7px;background:var(--bw-ui-soft);color:var(--bw-ui-accent)!important;font-size:7px!important}.bw-guide-steps span{font-size:7.5px;line-height:1.45;color:var(--bw-ui-text);font-weight:750}
#dashboardView .bw-guide-next{display:flex;flex-direction:column;justify-content:center;padding:10px 12px;border:1px solid color-mix(in srgb,var(--bw-ui-accent) 15%,var(--bw-ui-border));border-radius:12px;background:var(--bw-ui-soft-2)}.bw-guide-next small{font-size:6px!important;font-weight:900!important;letter-spacing:.09em;color:var(--bw-ui-accent)!important}.bw-guide-next strong{display:block;margin-top:4px;font-size:9.5px!important;line-height:1.35}.bw-guide-next p{margin:3px 0 8px!important;font-size:7px!important;line-height:1.45!important;color:var(--bw-ui-muted)!important}.bw-guide-next button{align-self:flex-start;display:inline-flex!important;align-items:center;gap:7px;min-height:31px!important;padding:0 10px!important;border:1px solid color-mix(in srgb,var(--bw-ui-accent) 22%,var(--bw-ui-border))!important;border-radius:9px!important;background:var(--bw-ui-surface)!important;color:var(--bw-ui-accent)!important;font-size:7.5px!important;font-weight:850!important;box-shadow:none!important}.bw-guide-next button:hover{background:var(--bw-ui-soft)!important}.bw-guide-next button i{font-style:normal;font-size:10px}
#page-dashboard .bw-page-guide{margin-top:-2px;margin-bottom:16px}
@media(max-width:1180px){#dashboardView .bw-page-guide{grid-template-columns:1fr 1fr}.bw-guide-next{grid-column:1/-1}.bw-guide-steps{grid-template-columns:repeat(3,1fr)!important}}
@media(max-width:760px){#dashboardView .bw-page-guide{grid-template-columns:1fr;padding:12px}.bw-guide-next{grid-column:auto}.bw-guide-steps{grid-template-columns:1fr!important}.bw-guide-copy{padding:2px!important}}
@media(prefers-reduced-motion:reduce){#dashboardView .bw-guide-next button,#dashboardView .bw-page-guide *{scroll-behavior:auto!important}}
`;document.head.appendChild(style);
})();
