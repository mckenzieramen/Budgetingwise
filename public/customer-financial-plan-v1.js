/* Budgetingwise Financial Plan V1 — dedicated home for planning controls and commitments. */
(()=>{'use strict';
const root=document.getElementById('dashboardView');
const content=root?.querySelector('.premium-content');
const nav=root?.querySelector('.sidebar-nav');
if(!root||!content||!nav)return;

function ensurePage(){
 let page=document.getElementById('page-plan');
 if(!page){
  page=document.createElement('div');
  page.id='page-plan';
  page.className='page hidden';
  page.setAttribute('aria-hidden','true');
  page.innerHTML=`<div class="section-heading"><div><h2>Financial Plan</h2><p class="muted">Set your income reference, monthly budget, payday and recurring commitments in one place.</p></div></div><section class="bw-financial-plan-intro"><div><span>YOUR MONTHLY PLAN</span><h3>Plan before you spend</h3><p>Budgetingwise uses your recorded transactions together with the plan you set here to calculate safe-to-spend guidance. Expected salary remains a planning reference until you record it as actual income.</p></div><div class="bw-plan-principles"><span><b>1</b> Set your budget</span><span><b>2</b> Reserve bills</span><span><b>3</b> Track payday</span></div></section><div id="bwPlanOverviewMount"></div><div class="bw-plan-page-label"><span>INCOME & PAY SETTINGS</span><small>Maintain the salary reference used by planning and AI context.</small></div><div id="bwPlanIncomeMount"></div>`;
  content.appendChild(page);
 }
 return page;
}

function ensureNav(){
 let button=nav.querySelector('[data-page="plan"]');
 if(button)return button;
 button=document.createElement('button');
 button.className='nav-btn';
 button.type='button';
 button.dataset.page='plan';
 button.innerHTML='<span>◫</span> Financial Plan';
 const insights=nav.querySelector('[data-page="insights"]');
 if(insights)nav.insertBefore(button,insights);else nav.appendChild(button);
 return button;
}

function placeModules(){
 const page=ensurePage();ensureNav();
 const overview=document.getElementById('bwPlanOverviewMount'),incomeMount=document.getElementById('bwPlanIncomeMount');
 const planning=document.getElementById('bwPlanningAssistant'),income=document.getElementById('bwIncomeProfile');
 if(planning&&overview&&planning.parentNode!==overview)overview.appendChild(planning);
 if(income&&incomeMount&&income.parentNode!==incomeMount)incomeMount.appendChild(income);
 page.dataset.ready='true';
}

ensurePage();ensureNav();
window.addEventListener('budgetingwise:financial-data-rendered',()=>requestAnimationFrame(placeModules));
window.addEventListener('budgetingwise:salary-profile-changed',()=>requestAnimationFrame(placeModules));
window.addEventListener('budgetingwise:planning-profile-changed',()=>requestAnimationFrame(placeModules));
root.addEventListener('budgetingwise:page-change',e=>{if(e.detail?.page==='plan')requestAnimationFrame(placeModules)});
document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(placeModules),{once:true});
setTimeout(placeModules,0);

const style=document.createElement('style');style.textContent=`
#page-plan{max-width:1440px;margin:0 auto;color:var(--bw-ui-text)}
#page-plan>.section-heading{min-height:auto!important;margin:0 0 16px!important;padding:0 0 16px!important;border-bottom:1px solid var(--bw-ui-border)!important}
#page-plan>.section-heading h2{font-size:26px!important;font-weight:850!important;letter-spacing:-.045em!important}
#page-plan>.section-heading p{font-size:10px!important;margin-top:6px!important;max-width:650px}
#page-plan .bw-financial-plan-intro{display:flex;align-items:center;justify-content:space-between;gap:24px;margin:0 0 14px;padding:18px 20px;border:1px solid var(--bw-ui-border);border-radius:16px;background:linear-gradient(120deg,var(--bw-ui-surface),color-mix(in srgb,var(--bw-ui-accent) 5%,var(--bw-ui-surface)));box-shadow:var(--bw-ui-shadow)}
#page-plan .bw-financial-plan-intro>div:first-child{min-width:0;max-width:760px}.bw-financial-plan-intro span{font-size:7px;font-weight:900;letter-spacing:.11em;color:var(--bw-ui-accent)}.bw-financial-plan-intro h3{margin:5px 0 5px!important;font-size:17px!important;letter-spacing:-.035em!important}.bw-financial-plan-intro p{margin:0!important;font-size:8.5px!important;line-height:1.6!important;color:var(--bw-ui-muted)!important}
#page-plan .bw-plan-principles{display:flex;gap:7px;flex:none}.bw-plan-principles span{display:flex;align-items:center;gap:6px;padding:8px 10px;border:1px solid var(--bw-ui-border);border-radius:10px;background:var(--bw-ui-surface);color:var(--bw-ui-muted);font-size:7px;font-weight:800;letter-spacing:0}.bw-plan-principles b{display:grid;place-items:center;width:18px;height:18px;border-radius:6px;background:var(--bw-ui-soft);color:var(--bw-ui-accent);font-size:7px}
#page-plan #bwPlanOverviewMount:empty,#page-plan #bwPlanIncomeMount:empty{display:none}
#page-plan .bw-plan-page-label{margin:18px 1px 8px;padding-top:2px}.bw-plan-page-label span{display:block;font-size:7px;font-weight:900;letter-spacing:.12em;color:var(--bw-ui-accent)}.bw-plan-page-label small{display:block;margin-top:3px;font-size:7.5px!important;color:var(--bw-ui-muted)!important}

/* Planning Assistant lives here, not inside AI Insights. */
#page-plan .bw-planning-assistant{margin:0;padding:18px 19px;border:1px solid var(--bw-ui-border);border-radius:16px;background:var(--bw-ui-surface);box-shadow:var(--bw-ui-shadow)}
#page-plan .bw-plan-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:13px}
#page-plan .bw-plan-kpis{display:grid;grid-template-columns:1.15fr repeat(3,1fr);gap:10px;margin-bottom:11px}
#page-plan .bw-plan-kpis article{min-height:112px;padding:14px;border:1px solid var(--bw-ui-border);border-radius:13px;background:var(--bw-ui-surface-2);display:flex;flex-direction:column;justify-content:center}
#page-plan .bw-plan-kpis article.bw-safe-card{background:linear-gradient(135deg,color-mix(in srgb,var(--bw-ui-accent) 9%,var(--bw-ui-surface)),var(--bw-ui-surface));border-color:color-mix(in srgb,var(--bw-ui-accent) 18%,var(--bw-ui-border))}
#page-plan .bw-plan-layout{display:grid;grid-template-columns:minmax(300px,.8fr) minmax(0,1.2fr);gap:12px;align-items:stretch}
#page-plan .bw-plan-setup,#page-plan .bw-plan-bills{padding:15px;border:1px solid var(--bw-ui-border);border-radius:14px;background:var(--bw-ui-surface-2)}
#page-plan .bw-plan-form{display:grid;gap:9px}
#page-plan .bw-bill-form{display:grid;grid-template-columns:minmax(150px,1fr) 105px 76px auto;gap:7px;margin-bottom:9px}
#page-plan .bw-bill-list{display:grid;gap:7px;max-height:310px;overflow:auto;padding-right:2px}
#page-plan .bw-bill-row{min-height:58px}

/* Income profile is setup, so it stays below the decision-first plan summary. */
#page-plan .bw-income-profile{margin:0;padding:18px 19px;border:1px solid var(--bw-ui-border);border-radius:16px;background:linear-gradient(120deg,var(--bw-ui-surface),color-mix(in srgb,var(--bw-ui-accent) 3%,var(--bw-ui-surface)));box-shadow:var(--bw-ui-shadow)}
#page-plan .bw-income-profile-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:14px}
#page-plan .bw-income-profile-head h3{margin:4px 0!important;font-size:15px!important}
#page-plan .bw-income-profile-head p{margin:0!important;max-width:680px;font-size:8.5px!important;line-height:1.55!important}
#page-plan .bw-salary-form{display:grid;grid-template-columns:minmax(220px,1fr) minmax(180px,.7fr) auto;gap:10px;align-items:end;padding:13px;border:1px solid var(--bw-ui-border);border-radius:13px;background:var(--bw-ui-surface-2)}
#page-plan .bw-salary-form :is(input,select,button){min-height:42px!important}
#page-plan .bw-income-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin-top:10px}
#page-plan .bw-income-summary>div{min-height:74px;padding:11px 12px;border:1px solid var(--bw-ui-border);border-radius:11px;background:var(--bw-ui-surface)}
#page-plan .bw-income-context{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:9px;padding:11px 12px;border-radius:11px;background:var(--bw-ui-soft-2);border:1px solid color-mix(in srgb,var(--bw-ui-accent) 8%,var(--bw-ui-border))}
#page-plan :is(button,input,select):focus-visible{outline:3px solid color-mix(in srgb,var(--bw-ui-accent) 20%,transparent)!important;outline-offset:2px!important}

@media(max-width:1050px){#page-plan .bw-plan-kpis{grid-template-columns:1fr 1fr}#page-plan .bw-plan-layout{grid-template-columns:1fr}#page-plan .bw-salary-form{grid-template-columns:1fr 1fr}#page-plan .bw-salary-form button{grid-column:1/-1}#page-plan .bw-income-summary{grid-template-columns:1fr 1fr}}
@media(max-width:980px){#page-plan .bw-financial-plan-intro{align-items:flex-start;flex-direction:column}.bw-plan-principles{flex-wrap:wrap!important}}
@media(max-width:700px){#page-plan .bw-plan-kpis{grid-template-columns:1fr}#page-plan .bw-bill-form{grid-template-columns:1fr 1fr}#page-plan .bw-bill-form button{grid-column:1/-1}#page-plan .bw-salary-form,#page-plan .bw-income-summary{grid-template-columns:1fr}#page-plan .bw-salary-form button{grid-column:auto}#page-plan .bw-income-context{align-items:flex-start;flex-direction:column}}
@media(max-width:620px){#page-plan>.section-heading h2{font-size:22px!important}#page-plan .bw-financial-plan-intro{padding:15px!important}.bw-plan-principles{display:grid!important;width:100%}.bw-plan-principles span{width:100%}}
`;document.head.appendChild(style);
})();