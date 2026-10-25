/* Budgetingwise Rich Interactions V1 — event-driven customer UX enhancements. */
(()=>{'use strict';
const root=document.getElementById('dashboardView');if(!root)return;
let latestDetail=null,rangeDays=7,revealObserver=null;
const money=n=>new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP',maximumFractionDigits:0}).format(Number(n)||0);
const parseMoney=text=>Number(String(text||'').replace(/[^0-9.-]/g,''))||0;
const validDate=t=>{const d=new Date(String(t?.date||'')+'T12:00:00');return Number.isFinite(d.getTime())?d:null};

function animateNumber(node,to,{currency=false,suffix=''}={}){
 if(!node||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const from=parseMoney(node.dataset.bwPreviousValue??node.textContent);if(!Number.isFinite(to))return;
 node.dataset.bwPreviousValue=String(to);if(Math.abs(to-from)<.01){node.textContent=currency?money(to):`${Math.round(to)}${suffix}`;return}
 const start=performance.now(),duration=420;node.classList.add('bw-number-updating');
 const step=now=>{const p=Math.min(1,(now-start)/duration),ease=1-Math.pow(1-p,3),v=from+(to-from)*ease;node.textContent=currency?money(v):`${Math.round(v)}${suffix}`;if(p<1)requestAnimationFrame(step);else{node.classList.remove('bw-number-updating');node.classList.add('bw-number-updated');setTimeout(()=>node.classList.remove('bw-number-updated'),420)}};requestAnimationFrame(step)
}
function animateMetrics(detail){const s=detail?.summary;if(!s)return;const map=[['incomeTotal',s.income],['expenseTotal',s.expense],['savingsTotal',s.savings],['remainingTotal',s.balance],['analyticsIncome',s.income],['analyticsExpense',s.expense]];for(const [id,v] of map)animateNumber(document.getElementById(id),Number(v)||0,{currency:true});if(document.getElementById('analyticsSavingsRate'))animateNumber(document.getElementById('analyticsSavingsRate'),Number(s.savingsRate)||0,{suffix:'%'})}

function rowsInRange(rows,days){if(!days||days>=3650)return rows.slice().filter(validDate);const end=new Date(),start=new Date(end);start.setDate(end.getDate()-(days-1));start.setHours(0,0,0,0);return rows.filter(t=>{const d=validDate(t);return d&&d>=start&&d<=end})}
function renderBalanceRange(){const box=document.getElementById('balanceTrendChart');if(!box||!latestDetail)return;const rows=rowsInRange(Array.isArray(latestDetail.transactions)?latestDetail.transactions:[],rangeDays).sort((a,b)=>validDate(a)-validDate(b));if(!rows.length){box.innerHTML='<div class="bw-chart-empty">No transactions in this range.</div>';return}let balance=0;const points=rows.map(t=>{const a=Math.max(0,Number(t.amount)||0);balance+=t.type==='income'?a:(t.type==='expense'||t.type==='savings'?-a:0);return{date:validDate(t),value:balance}}),sample=points.slice(-24),vals=sample.map(x=>x.value),min=Math.min(0,...vals),max=Math.max(1,...vals),W=820,H=180,pad=18,span=Math.max(1,max-min),x=i=>pad+(W-pad*2)*(sample.length===1?.5:i/(sample.length-1)),y=v=>pad+(H-pad*2)*(1-(v-min)/span),path=sample.map((p,i)=>`${i?'L':'M'}${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(' '),area=`${path} L ${x(sample.length-1).toFixed(1)} ${H-pad} L ${x(0).toFixed(1)} ${H-pad} Z`;box.innerHTML=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="bwBalanceFillRich" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".18"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs><path class="bw-balance-area" d="${area}" style="fill:url(#bwBalanceFillRich)!important"/><path class="bw-balance-line" d="${path}"/>${sample.map((p,i)=>`<circle cx="${x(i)}" cy="${y(p.value)}" r="2.8"><title>${p.date.toLocaleDateString('en-PH',{month:'short',day:'numeric'})}: ${money(p.value)}</title></circle>`).join('')}</svg><div class="bw-balance-axis">${sample.filter((_,i)=>i===0||i===sample.length-1||i===Math.floor((sample.length-1)/2)).map(p=>`<span>${p.date.toLocaleDateString('en-PH',{month:'short',day:'numeric'})}</span>`).join('')}</div>`}
function wireRangeButtons(){const wrap=document.querySelector('#page-dashboard .bw-ref-range');if(!wrap||wrap.dataset.bwRich==='1')return;wrap.dataset.bwRich='1';const map={'7D':7,'30D':30,'3M':90,'1Y':365};wrap.querySelectorAll('button').forEach(btn=>{btn.addEventListener('click',()=>{wrap.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b===btn));rangeDays=map[btn.textContent.trim()]||7;renderBalanceRange()});btn.setAttribute('aria-pressed',String(btn.classList.contains('active')))});wrap.addEventListener('click',()=>wrap.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.classList.contains('active'))))}

function markScrollableTables(){root.querySelectorAll('.table-wrap').forEach(w=>w.dataset.bwScrollable=String(w.scrollWidth>w.clientWidth+2))}
function addTooltips(){root.querySelectorAll('.sidebar-nav .nav-btn').forEach(b=>{if(!b.dataset.bwTip)b.dataset.bwTip=`Open ${b.textContent.trim()}`});const search=document.getElementById('txSearch');if(search&&!search.title)search.title='Search transaction description or category';document.querySelectorAll('#page-dashboard .bw-ref-range button').forEach(b=>b.dataset.bwTip=`Show ${b.textContent.trim()} balance range`)}

function setupReveal(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(!('IntersectionObserver'in window))return;revealObserver?.disconnect();revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('bw-rich-visible');revealObserver.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -24px 0px'});const page=root.querySelector('.page:not(.hidden)');if(!page)return;page.querySelectorAll(':scope > .premium-panel,:scope > .bw-ref-card,:scope > .goal-grid,:scope > .bw-insight-feed,:scope > .bw-intelligence-grid,:scope > .bw-planning-assistant,:scope > #bwPlanOverviewMount').forEach(el=>{el.classList.add('bw-rich-reveal');revealObserver.observe(el)})}

function keyboardShortcuts(e){if(e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey)return;const tag=document.activeElement?.tagName;if(['INPUT','TEXTAREA','SELECT'].includes(tag))return;if(e.key==='/'){const input=document.getElementById('txSearch')||document.getElementById('dashboardSearch');if(input){e.preventDefault();input.focus()}}}

function enhance(){wireRangeButtons();markScrollableTables();addTooltips();setupReveal();if(latestDetail)renderBalanceRange()}
window.addEventListener('budgetingwise:financial-data-rendered',e=>{latestDetail=e.detail;requestAnimationFrame(()=>{animateMetrics(e.detail);enhance()})});
root.addEventListener('budgetingwise:page-change',()=>requestAnimationFrame(enhance));
window.addEventListener('resize',()=>requestAnimationFrame(markScrollableTables),{passive:true});
document.addEventListener('keydown',keyboardShortcuts);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance,{once:true});else requestAnimationFrame(enhance);
})();
