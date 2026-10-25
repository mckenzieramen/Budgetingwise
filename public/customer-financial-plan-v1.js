/* Budgetingwise Financial Plan V2 — authoritative home for salary, budget, payday and recurring bills. */
import './customer-reference-ui-v2.js?v=reference-ui-v3-loader';
(()=>{'use strict';
const root=document.getElementById('dashboardView');
const content=root?.querySelector('.premium-content');
const nav=root?.querySelector('.sidebar-nav');
if(!root||!content||!nav)return;

function ensurePage(){let page=document.getElementById('page-plan');if(page)return page;page=document.createElement('div');page.id='page-plan';page.className='page hidden';page.setAttribute('aria-hidden','true');page.innerHTML=`<div class="section-heading"><div><h2>Financial Plan</h2><p class="muted">Set your salary, budget, payday, and recurring bills to plan your finances.</p></div></div><div id="bwPlanOverviewMount"></div>`;content.appendChild(page);return page}
function ensureNav(){let button=nav.querySelector('[data-page="plan"]');if(!button){button=document.createElement('button');button.className='nav-btn';button.type='button';button.dataset.page='plan';button.innerHTML='<span>◫</span> Financial Plan'}const goals=nav.querySelector('[data-page="savings"]');if(goals&&button.nextElementSibling!==goals)nav.insertBefore(button,goals);else if(!goals&&!button.parentNode)nav.appendChild(button);return button}
function placeModules(){const page=ensurePage(),overview=document.getElementById('bwPlanOverviewMount'),planning=document.getElementById('bwPlanningAssistant'),income=document.getElementById('bwIncomeProfile');ensureNav();if(planning&&overview&&planning.parentNode!==overview)overview.appendChild(planning);if(planning&&income){const kpis=planning.querySelector('.bw-plan-kpis'),layout=planning.querySelector('.bw-plan-layout');if(kpis&&income.previousElementSibling!==kpis)kpis.insertAdjacentElement('afterend',income);if(layout&&income.nextElementSibling!==layout)income.insertAdjacentElement('afterend',layout)}page.dataset.ready='true'}

ensurePage();ensureNav();
for(const ev of ['budgetingwise:financial-data-rendered','budgetingwise:salary-profile-changed','budgetingwise:planning-profile-changed'])window.addEventListener(ev,()=>requestAnimationFrame(placeModules));
root.addEventListener('budgetingwise:page-change',e=>{if(e.detail?.page==='plan')requestAnimationFrame(placeModules)});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(placeModules),{once:true});else requestAnimationFrame(placeModules);
})();