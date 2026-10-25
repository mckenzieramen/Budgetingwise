/* Budgetingwise AI Insights Layout V1 — information architecture only; no financial calculations. */
(()=>{'use strict';
function label(node,text,sub){if(!node)return;let head=node.querySelector(':scope > .bw-layout-label');if(!head){head=document.createElement('div');head.className='bw-layout-label';node.insertBefore(head,node.firstChild)}head.innerHTML=`<div><span>${text}</span>${sub?`<small>${sub}</small>`:''}</div>`}
function organize(){const page=document.getElementById('page-insights');if(!page)return;const heading=page.querySelector(':scope > .section-heading'),snapshot=document.getElementById('bwFinancialSnapshot'),planning=document.getElementById('bwPlanningAssistant'),feed=page.querySelector(':scope > .bw-insight-feed'),intelligence=page.querySelector(':scope > .bw-intelligence-grid'),income=document.getElementById('bwIncomeProfile');if(!heading)return;
 // Keep the page in a decision-first order: facts -> plan -> analysis -> setup.
 let anchor=heading;
 for(const node of [snapshot,planning,feed,intelligence,income]){if(node){anchor.insertAdjacentElement('afterend',node);anchor=node}}
 label(feed,'SMART INSIGHTS','What changed and what deserves your attention');
 label(intelligence,'FINANCIAL OUTLOOK','Health estimate and forward-looking cash-flow view');
 if(income){income.classList.add('bw-profile-setup');const h=income.querySelector('.bw-income-profile-head h3');if(h)h.textContent='Salary & income settings';const p=income.querySelector('.bw-income-profile-head p');if(p)p.textContent='Update your regular pay reference. This setup does not add money to your actual balance.'}
}
window.addEventListener('budgetingwise:financial-data-rendered',()=>requestAnimationFrame(organize));
window.addEventListener('budgetingwise:salary-profile-changed',()=>requestAnimationFrame(organize));
window.addEventListener('budgetingwise:planning-profile-changed',()=>requestAnimationFrame(organize));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(organize,0),{once:true});else setTimeout(organize,0);
const style=document.createElement('style');style.textContent=`
#page-insights .bw-layout-label{grid-column:1/-1;display:flex;align-items:flex-end;justify-content:space-between;margin:4px 0 0;padding:2px 1px 0}.bw-layout-label span{display:block;font-size:7px;font-weight:900;letter-spacing:.12em;color:var(--bw-ui-accent)}.bw-layout-label small{display:block;margin-top:3px;font-size:7px!important;color:var(--bw-ui-muted)!important;letter-spacing:0!important}
#page-insights>.bw-insight-feed{margin-top:4px!important}#page-insights>.bw-intelligence-grid{margin-top:2px!important}#page-insights .bw-profile-setup{margin-top:14px!important;background:color-mix(in srgb,var(--bw-ui-surface) 96%,var(--bw-ui-soft))!important}
#page-insights .bw-profile-setup .bw-income-profile-head{margin-bottom:11px!important}#page-insights .bw-profile-setup .bw-income-summary,#page-insights .bw-profile-setup .bw-income-context{display:none!important}
@media(max-width:620px){#page-insights .bw-layout-label{align-items:flex-start;flex-direction:column;gap:2px}}
`;document.head.appendChild(style);
})();