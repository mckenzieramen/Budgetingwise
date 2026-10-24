/* Budgetingwise dashboard financial chart V4 — polished finance trend + readable expense breakdown. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP',maximumFractionDigits:0}).format(Number(n)||0);
let latestTxs=[];
const labels=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const palette=[
  'var(--bw-ui-accent,#6f57e8)',
  'color-mix(in srgb,var(--bw-ui-accent,#6f57e8) 72%,#3b9cff)',
  'color-mix(in srgb,var(--bw-ui-accent,#6f57e8) 58%,#21ad82)',
  'color-mix(in srgb,var(--bw-ui-accent,#6f57e8) 48%,#ee9c4b)',
  'color-mix(in srgb,var(--bw-ui-accent,#6f57e8) 54%,#db6680)',
  'color-mix(in srgb,var(--bw-ui-accent,#6f57e8) 44%,#64748b)'
];
function sum(rows,type){return rows.filter(t=>t.type===type).reduce((n,t)=>n+Math.max(0,Number(t.amount)||0),0)}
function dateOf(t){const d=new Date(String(t.date||'')+'T12:00:00');return Number.isFinite(d.getTime())?d:null}
function monthBuckets(rows,year){const out=Array.from({length:12},(_,i)=>({month:i,income:0,expense:0,savings:0}));rows.forEach(t=>{const d=dateOf(t);if(!d||d.getFullYear()!==year)return;const b=out[d.getMonth()],a=Math.max(0,Number(t.amount)||0);if(t.type==='income')b.income+=a;else if(t.type==='expense')b.expense+=a;else if(t.type==='savings')b.savings+=a});return out}
function yearsFor(rows){const set=new Set(rows.map(dateOf).filter(Boolean).map(d=>d.getFullYear()));set.add(new Date().getFullYear());return [...set].sort((a,b)=>b-a)}
function visibleMonths(year,months){const now=new Date();return year===now.getFullYear()?months.slice(0,now.getMonth()+1):months}
function smoothPath(points){if(!points.length)return'';if(points.length===1)return`M ${points[0].x} ${points[0].y}`;let d=`M ${points[0].x} ${points[0].y}`;for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],cx=(a.x+b.x)/2;d+=` C ${cx} ${a.y}, ${cx} ${b.y}, ${b.x} ${b.y}`}return d}
function renderChart(rows){
 const chart=$('earningsChart'),select=$('earningsYear');if(!chart)return;
 const years=yearsFor(rows),selected=Number(select?.value)||years[0];
 if(select){const keep=years.includes(selected)?selected:years[0];select.innerHTML=years.map(y=>`<option value="${y}">${y}</option>`).join('');select.value=String(keep);if(!select.dataset.bwBound){select.dataset.bwBound='1';select.addEventListener('change',()=>renderChart(latestTxs))}}
 const year=Number(select?.value)||years[0],months=visibleMonths(year,monthBuckets(rows,year)),now=new Date();
 const yrRows=rows.filter(t=>{const d=dateOf(t);return d&&d.getFullYear()===year&&(year!==now.getFullYear()||d.getMonth()<=now.getMonth())});
 const income=sum(yrRows,'income'),expense=sum(yrRows,'expense'),net=income-expense,has=months.some(m=>m.income||m.expense),max=Math.max(1,...months.flatMap(m=>[m.income,m.expense]));
 const W=920,H=248,pad={l:18,r:14,t:18,b:32},plotW=W-pad.l-pad.r,plotH=H-pad.t-pad.b,step=months.length>1?plotW/(months.length-1):plotW;
 const point=(m,i,key)=>({x:pad.l+(months.length===1?plotW/2:i*step),y:pad.t+plotH-(m[key]/max)*plotH,v:m[key],i});
 const incPts=months.map((m,i)=>point(m,i,'income')),expPts=months.map((m,i)=>point(m,i,'expense'));
 const incPath=smoothPath(incPts),expPath=smoothPath(expPts),baseY=pad.t+plotH,incArea=`${incPath} L ${incPts.at(-1)?.x||pad.l} ${baseY} L ${incPts[0]?.x||pad.l} ${baseY} Z`,expArea=`${expPath} L ${expPts.at(-1)?.x||pad.l} ${baseY} L ${expPts[0]?.x||pad.l} ${baseY} Z`;
 if(has){
   chart.innerHTML=`<div class="bw-line-shell"><div class="bw-line-scale"><span>${money(max)}</span><span>${money(max*.75)}</span><span>${money(max*.5)}</span><span>${money(max*.25)}</span><span>₱0</span></div><div class="bw-line-chart" role="img" aria-label="Income and expenses from January through ${labels[months.length-1]} ${year}"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><linearGradient id="bwIncomeArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#249b70" stop-opacity=".13"/><stop offset="1" stop-color="#249b70" stop-opacity="0"/></linearGradient><linearGradient id="bwExpenseArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#da6078" stop-opacity=".09"/><stop offset="1" stop-color="#da6078" stop-opacity="0"/></linearGradient></defs>${[0,.25,.5,.75,1].map(r=>`<line x1="${pad.l}" y1="${pad.t+plotH*r}" x2="${W-pad.r}" y2="${pad.t+plotH*r}" class="bw-grid-line"/>`).join('')}<path d="${incArea}" fill="url(#bwIncomeArea)"/><path d="${expArea}" fill="url(#bwExpenseArea)"/><path d="${incPath}" class="bw-line income"/><path d="${expPath}" class="bw-line expense"/>${incPts.map((p,i)=>`<g class="bw-point-group${year===now.getFullYear()&&i===now.getMonth()?' current':''}"><title>${labels[i]} ${year} — Income ${money(p.v)}, Expenses ${money(expPts[i].v)}, Net ${money(p.v-expPts[i].v)}</title><circle cx="${p.x}" cy="${p.y}" r="4" class="bw-point income"/><circle cx="${expPts[i].x}" cy="${expPts[i].y}" r="4" class="bw-point expense"/></g>`).join('')}</svg><div class="bw-month-labels" style="--count:${months.length}">${months.map((m,i)=>`<span class="${year===now.getFullYear()&&i===now.getMonth()?'current':''}">${labels[i]}${year===now.getFullYear()&&i===now.getMonth()?'<b>Now</b>':''}</span>`).join('')}</div></div></div>`;
 }else chart.innerHTML=`<div class="bw-chart-empty"><strong>No activity from January to ${labels[months.length-1]} ${year}</strong><span>Add income or expense transactions to populate this chart.</span></div>`;
 const card=chart.closest('.bw-ref-card');if(card){let totals=card.querySelector('.bw-flow-totals');if(!totals){totals=document.createElement('div');totals.className='bw-flow-totals';card.insertBefore(totals,chart)}totals.innerHTML=`<div class="bw-flow-period"><span>${labels[0]}–${labels[months.length-1]} ${year}</span><small>Financial flow</small></div><div class="bw-flow-stat income"><i></i><span><small>Income</small><strong>${money(income)}</strong></span></div><div class="bw-flow-stat expense"><i></i><span><small>Expenses</small><strong>${money(expense)}</strong></span></div><div class="bw-flow-net ${net<0?'negative':'positive'}"><small>Net</small><strong>${money(net)}</strong></div>`}
}
function breakdownEntries(rows){const now=new Date(),cats=new Map();rows.filter(t=>t.type==='expense').forEach(t=>{const d=dateOf(t);if(!d||d.getMonth()!==now.getMonth()||d.getFullYear()!==now.getFullYear())return;const k=String(t.category||'Other').trim()||'Other';cats.set(k,(cats.get(k)||0)+Math.max(0,Number(t.amount)||0))});const sorted=[...cats].sort((a,b)=>b[1]-a[1]);if(sorted.length<=5)return sorted;const top=sorted.slice(0,5),other=sorted.slice(5).reduce((n,x)=>n+x[1],0);if(other)top.push(['Other',other]);return top}
function renderBreakdown(rows){const donut=$('expenseDonut'),legend=$('categoryLegend');if(!donut||!legend)return;const entries=breakdownEntries(rows),total=entries.reduce((n,x)=>n+x[1],0);const totalNode=donut.querySelector('#donutTotal');if(totalNode)totalNode.textContent=money(total);
 if(!entries.length){donut.style.background='conic-gradient(var(--bw-ui-border) 0 100%)';legend.innerHTML='<div class="bw-chart-empty compact"><strong>No expenses this month</strong><span>Your category breakdown will appear here.</span></div>';return}
 let cursor=0;const segments=entries.map(([name,val],i)=>{const pct=total?val/total*100:0,start=cursor,end=cursor+pct;cursor=end;return `${palette[i%palette.length]} ${start.toFixed(2)}% ${end.toFixed(2)}%`});donut.style.background=`conic-gradient(${segments.join(',')})`;
 legend.innerHTML=entries.map(([name,val],i)=>{const pct=total?Math.round(val/total*100):0;return `<div class="bw-cat-row" style="--cat-color:${palette[i%palette.length]}"><span class="bw-cat-dot"></span><div class="bw-cat-copy"><strong>${String(name).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}</strong><small>${pct}% of monthly expenses</small></div><b>${money(val)}</b></div>`}).join('')
}
function renderGoals(goals){const box=$('bwRefGoals');if(!box)return;const arr=Array.isArray(goals)?goals:[];box.innerHTML=arr.length?arr.slice(0,3).map(g=>{const pct=Math.min(100,Math.round((Number(g.saved)||0)/Math.max(1,Number(g.target)||1)*100));return `<div class="bw-ref-goal-demo"><span class="goal-icon">◎</span><div><strong>${String(g.name||'Goal')}</strong><small>${money(g.saved)} of ${money(g.target)}</small><div><i style="width:${pct}%"></i></div></div><b>${pct}%</b></div>`}).join(''):'<div class="bw-chart-empty compact"><strong>No goals yet</strong><span>Create a goal to track progress here.</span></div>'}
function render(txs,goals){latestTxs=Array.isArray(txs)?txs:[];renderChart(latestTxs);renderBreakdown(latestTxs);renderGoals(goals);const now=new Date(),cut=new Date(now.getTime()-30*86400000),recent=latestTxs.filter(t=>{const d=dateOf(t);return d&&d>=cut&&d<=now});const inc=sum(recent,'income'),exp=sum(recent,'expense');if($('bwInsightDashboard'))$('bwInsightDashboard').textContent=recent.length?`Last 30 days: ${money(inc)} income vs ${money(exp)} expenses.`:'Add transactions to unlock personalized insights.';if($('bwSavingDashboard'))$('bwSavingDashboard').textContent=inc?`Recent cash flow after expenses: ${money(inc-exp)}.`:'Record income to see your recent cash flow.'}
window.renderReferenceDashboard=render;
const style=document.createElement('style');style.textContent=`
#dashboardView .bw-ref-income{overflow:hidden}
#dashboardView #earningsChart{min-height:248px!important;height:auto!important;padding:4px 0 0!important;display:block!important;overflow:hidden}
#dashboardView .bw-flow-totals{display:flex;align-items:center;gap:0;margin:2px 0 12px;padding:10px 12px;border:1px solid color-mix(in srgb,var(--bw-ui-border) 78%,transparent);border-radius:14px;background:color-mix(in srgb,var(--bw-ui-surface) 97%,var(--bw-ui-accent) 3%);box-shadow:0 5px 16px rgba(24,28,58,.03)}
#dashboardView .bw-flow-period{min-width:108px;padding-right:13px;margin-right:13px;border-right:1px solid var(--bw-ui-border)}
#dashboardView .bw-flow-period>span{display:block;font-size:9px;font-weight:800;color:var(--bw-ui-text)}
#dashboardView .bw-flow-period small{display:block;margin-top:2px;font-size:6px;color:var(--bw-ui-muted)!important;text-transform:uppercase;letter-spacing:.08em}
#dashboardView .bw-flow-stat{display:flex;align-items:center;gap:7px;padding:0 13px;border-right:1px solid var(--bw-ui-border)}
#dashboardView .bw-flow-stat i{width:7px;height:7px;border-radius:999px;box-shadow:0 0 0 4px color-mix(in srgb,currentColor 8%,transparent)}
#dashboardView .bw-flow-stat.income{color:#24956d}.bw-flow-stat.expense{color:#d95d76}
#dashboardView .bw-flow-stat.income i{background:#24956d}.bw-flow-stat.expense i{background:#d95d76}
#dashboardView .bw-flow-stat small,#dashboardView .bw-flow-net small{display:block;font-size:6px;color:var(--bw-ui-muted)!important;text-transform:uppercase;letter-spacing:.07em;font-weight:800}
#dashboardView .bw-flow-stat strong,#dashboardView .bw-flow-net strong{display:block;margin-top:2px;font-size:10px!important;line-height:1.15;color:var(--bw-ui-text)!important}
#dashboardView .bw-flow-net{margin-left:auto;padding-left:13px;text-align:right}.bw-flow-net.positive strong{color:#238d68!important}.bw-flow-net.negative strong{color:#cf536c!important}
#dashboardView .bw-line-shell{display:grid;grid-template-columns:58px minmax(0,1fr);gap:9px;align-items:stretch;min-height:218px;padding:3px 2px 0}
#dashboardView .bw-line-scale{display:flex;flex-direction:column;justify-content:space-between;padding:5px 0 33px;text-align:right}.bw-line-scale span{font-size:6.5px;color:var(--bw-ui-muted)}
#dashboardView .bw-line-chart{position:relative;min-width:0;padding:0 0 25px}
#dashboardView .bw-line-chart svg{display:block;width:100%;height:210px;overflow:visible}
#dashboardView .bw-line-chart svg rect{stroke:none!important;fill:transparent!important}
#dashboardView .bw-grid-line{stroke:color-mix(in srgb,var(--bw-ui-border) 54%,transparent);stroke-width:.7;stroke-dasharray:2 6}
#dashboardView .bw-line{fill:none;stroke-width:2.25;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke;filter:drop-shadow(0 2px 3px rgba(20,28,55,.035))}
#dashboardView .bw-line.income{stroke:#249b70}.bw-line.expense{stroke:#da6078}
#dashboardView .bw-point{stroke:var(--bw-ui-surface);stroke-width:2;vector-effect:non-scaling-stroke}.bw-point.income{fill:#249b70}.bw-point.expense{fill:#da6078}
#dashboardView .bw-point-group.current .bw-point{r:5;filter:drop-shadow(0 2px 5px rgba(53,47,95,.13))}
#dashboardView .bw-month-labels{position:absolute;left:18px;right:14px;bottom:0;display:grid;grid-template-columns:repeat(var(--count),minmax(0,1fr));align-items:start}
#dashboardView .bw-month-labels span{text-align:center;font-size:7px;color:var(--bw-ui-muted)!important;display:flex;align-items:center;justify-content:center;gap:3px;white-space:nowrap}
#dashboardView .bw-month-labels span.current{color:var(--bw-ui-accent)!important;font-weight:850}.bw-month-labels b{font-size:5px;padding:2px 4px;border-radius:999px;background:var(--bw-ui-soft);color:var(--bw-ui-accent)!important;text-transform:uppercase;letter-spacing:.06em}
#dashboardView .bw-ref-income .bw-ref-chart-key{justify-content:flex-start!important;gap:18px!important;margin-top:2px!important;padding-top:8px!important;border-top:1px solid color-mix(in srgb,var(--bw-ui-border) 70%,transparent)}
#dashboardView .bw-ref-income .bw-ref-chart-key span{font-size:7px!important;color:var(--bw-ui-muted)!important;font-weight:700!important}
#dashboardView .bw-ref-breakdown{display:grid!important;grid-template-columns:minmax(132px,164px) minmax(0,1fr)!important;gap:22px!important;align-items:center!important;min-height:230px!important;padding:16px 2px 8px!important}
#dashboardView .expense-donut{width:144px!important;height:144px!important;min-width:144px!important;border-radius:50%!important;position:relative!important;display:grid!important;place-items:center!important;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--bw-ui-border) 60%,transparent),0 10px 26px rgba(28,31,62,.055)!important}
#dashboardView .expense-donut:after{content:'';position:absolute;inset:17px;border-radius:50%;background:var(--bw-ui-surface);box-shadow:0 0 0 1px color-mix(in srgb,var(--bw-ui-border) 78%,transparent)}
#dashboardView .expense-donut .donut-inner{position:relative!important;z-index:2!important;text-align:center!important;width:86px!important;height:86px!important;display:grid!important;place-content:center!important;gap:2px!important;background:transparent!important;border:0!important;border-radius:50%!important}
#dashboardView .expense-donut .donut-inner strong{font-size:17px!important;line-height:1.05!important;color:var(--bw-ui-text)!important;letter-spacing:-.03em!important}
#dashboardView .expense-donut .donut-inner small{font-size:7px!important;color:var(--bw-ui-muted)!important;text-transform:uppercase!important;letter-spacing:.08em!important;font-weight:800!important}
#dashboardView .category-legend{display:flex!important;flex-direction:column!important;gap:0!important;min-width:0!important;width:100%!important}
#dashboardView .bw-cat-row{display:grid;grid-template-columns:9px minmax(0,1fr) auto;gap:9px;align-items:center;padding:9px 0;border-bottom:1px solid color-mix(in srgb,var(--bw-ui-border) 76%,transparent);min-width:0}
#dashboardView .bw-cat-row:last-child{border-bottom:0}
#dashboardView .bw-cat-dot{width:8px;height:8px;border-radius:50%;background:var(--cat-color);box-shadow:0 0 0 3px color-mix(in srgb,var(--cat-color) 12%,transparent)}
#dashboardView .bw-cat-copy{min-width:0}.bw-cat-copy strong{display:block;font-size:8.5px!important;line-height:1.2!important;color:var(--bw-ui-text)!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.bw-cat-copy small{display:block;margin-top:2px;font-size:6.5px!important;color:var(--bw-ui-muted)!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#dashboardView .bw-cat-row>b{font-size:8.5px!important;color:var(--bw-ui-text)!important;font-weight:800!important;white-space:nowrap}
#dashboardView .bw-chart-empty{min-height:210px;display:grid;place-content:center;text-align:center;gap:4px;color:var(--bw-ui-muted)}#dashboardView .bw-chart-empty strong{font-size:10px!important}.bw-chart-empty span{font-size:8px}.bw-chart-empty.compact{min-height:90px}
@media(max-width:900px){#dashboardView #earningsChart{overflow-x:auto}.bw-line-shell{min-width:590px}.bw-flow-totals{overflow-x:auto;white-space:nowrap}.bw-flow-period{min-width:96px}.bw-flow-stat{padding:0 10px}#dashboardView .bw-ref-breakdown{grid-template-columns:1fr!important;justify-items:center!important;gap:14px!important}.category-legend{width:100%!important}}
`;document.head.appendChild(style);
})();
