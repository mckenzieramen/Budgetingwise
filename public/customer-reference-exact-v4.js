/* Budgetingwise Reference Exact V4 — final DOM composition for the approved customer mockup. */
(()=>{'use strict';
const root=document.getElementById('dashboardView');if(!root)return;
const $=id=>document.getElementById(id);

function sidebar(){
 const nav=root.querySelector('.sidebar-nav');if(!nav)return;
 const order=['dashboard','transactions','analytics','plan','savings','insights','settings'];
 const labels={dashboard:'Dashboard',transactions:'Transactions',analytics:'Analytics',plan:'Financial Plan',savings:'Goals',insights:'AI Insights',settings:'Settings'};
 const icons={dashboard:'▦',transactions:'▤',analytics:'▥',plan:'◫',savings:'◎',insights:'✧',settings:'⚙'};
 for(const key of order){const btn=nav.querySelector(`[data-page="${key}"]`);if(!btn)continue;btn.innerHTML=`<span aria-hidden="true">${icons[key]}</span> ${labels[key]}`;nav.appendChild(btn)}
 const workspace=root.querySelector('.bw-sidebar-workspace');if(workspace)workspace.hidden=true;
 const promo=root.querySelector('.bw-premium-box');if(promo)promo.hidden=true;
}

function cleanGuides(){root.querySelectorAll('.bw-page-guide').forEach(n=>n.remove())}

function plan(){
 const page=$('page-plan'),planning=$('bwPlanningAssistant'),income=$('bwIncomeProfile');if(!page||!planning)return;
 const mount=$('bwPlanOverviewMount')||page;
 if(planning.parentNode!==mount)mount.appendChild(planning);
 const kpis=planning.querySelector('.bw-plan-kpis'),layout=planning.querySelector('.bw-plan-layout');
 if(income&&kpis&&income.previousElementSibling!==kpis)kpis.insertAdjacentElement('afterend',income);
 if(income&&layout&&income.nextElementSibling!==layout)income.insertAdjacentElement('afterend',layout);
 const title=page.querySelector(':scope>.section-heading h2');if(title)title.textContent='Financial Plan';
 const sub=page.querySelector(':scope>.section-heading p');if(sub)sub.textContent='Set your salary, budget, payday, and recurring bills to plan your finances.';
}

function insights(){
 const page=$('page-insights');if(!page)return;
 const heading=page.querySelector(':scope>.section-heading');
 const snapshot=$('bwFinancialSnapshot');
 const feed=page.querySelector('.bw-insight-feed');
 const grid=page.querySelector('.bw-intelligence-grid');
 const health=page.querySelector('.bw-health-card');
 const forecast=$('bwForecastValue')?.closest('.bw-intelligence-card')||page.querySelector('.bw-forecast-card');
 const rec=page.querySelector('.bw-reference-recommendations');
 let middle=$('bwInsightsMiddleV4');if(!middle){middle=document.createElement('div');middle.id='bwInsightsMiddleV4';middle.className='bw-insights-middle-v4'}
 let bottom=$('bwInsightsBottomV4');if(!bottom){bottom=document.createElement('div');bottom.id='bwInsightsBottomV4';bottom.className='bw-insights-bottom-v4'}
 const anchor=snapshot||heading;if(anchor&&middle.parentNode!==page)anchor.insertAdjacentElement('afterend',middle);
 if(middle.nextElementSibling!==bottom)middle.insertAdjacentElement('afterend',bottom);
 if(feed&&feed.parentNode!==middle)middle.appendChild(feed);
 if(health&&health.parentNode!==middle)middle.appendChild(health);
 if(forecast&&forecast.parentNode!==bottom)bottom.appendChild(forecast);
 if(rec&&rec.parentNode!==bottom)bottom.appendChild(rec);
 if(grid)grid.hidden=true;
 const title=page.querySelector(':scope>.section-heading h2');if(title)title.textContent='AI Insights';
 const sub=page.querySelector(':scope>.section-heading p');if(sub)sub.textContent='Personalized insights and recommendations based on your recorded financial activity.';
}

function labels(){
 const map={
  transactions:['Transactions','Add, view, and manage all your income, expenses, and savings.'],
  analytics:['Analytics','Visualize your spending patterns and financial trends.'],
  savings:['Savings Goals','Set and track your financial goals.'],
  settings:['Settings','Manage your account, appearance, and Budgetingwise preferences.']
 };
 for(const [key,[title,sub]] of Object.entries(map)){const page=$('page-'+key);if(!page)continue;const h=page.querySelector(':scope>.section-heading h2'),p=page.querySelector(':scope>.section-heading p');if(h)h.textContent=title;if(p)p.textContent=sub}
}

function compose(){sidebar();cleanGuides();plan();insights();labels();root.dataset.referenceExact='v4'}
for(const ev of ['budgetingwise:financial-data-rendered','budgetingwise:salary-profile-changed','budgetingwise:planning-profile-changed'])window.addEventListener(ev,()=>requestAnimationFrame(compose));
root.addEventListener('budgetingwise:page-change',()=>requestAnimationFrame(compose));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(compose),{once:true});else requestAnimationFrame(compose);
window.addEventListener('load',()=>requestAnimationFrame(compose),{once:true});
})();