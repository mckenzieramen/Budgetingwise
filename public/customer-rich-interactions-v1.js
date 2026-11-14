/* Budgetingwise Rich Interactions V1 — event-driven customer UX enhancements. */
(()=>{'use strict';
const root=document.getElementById('dashboardView');if(!root)return;
let latestDetail=null,rangeDays=7,revealObserver=null,lastChart="";
const currency = new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP'});
const compact = new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP',notation:'compact',maximumFractionDigits:1});
const dateLabel = new Intl.DateTimeFormat('en-PH',{month:'short',day:'numeric',timeZone:'UTC'});
const dayMs = 86400000;
const ranges = {'7D':7,'30D':30,'3M':90,'1Y':365};

function renderBalanceRange(){
  const box=document.getElementById('balanceTrendChart');
  if(!box||!latestDetail)return;
  const today=Date.parse(new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Manila',year:'numeric',month:'2-digit',day:'2-digit'}).format());
  const start=today-(rangeDays-1)*dayMs;
  const daily=new Map();
  let balance=0, hasHistory=false;
  for(const row of latestDetail.transactions||[]){
    const date=Date.parse(row.date);
    if(!Number.isFinite(date)||date>today)continue;
    hasHistory=true;
    const amount=Number(row.amount)||0;
    const change=row.type==='income'?amount:-amount;
    if(date<start)balance+=change;
    else daily.set(date,(daily.get(date)||0)+change);
  }
  if(!hasHistory){
    if(lastChart!=='empty')box.innerHTML='<div class="bw-chart-empty">Add a transaction to see your balance trend.</div>';
    lastChart='empty';
    return;
  }
  const points=Array.from({length:rangeDays},(_,index)=>{
    const date=start+index*dayMs;
    balance+=daily.get(date)||0;
    return {date,balance};
  });
  const key=JSON.stringify(points);
  if(key===lastChart&&box.querySelector('.bw-balance-plot'))return;
  lastChart=key;
  const width=600,height=170;
  const min=Math.min(0,...points.map(p=>p.balance)),max=Math.max(0,...points.map(p=>p.balance));
  const span=max-min||1;
  const x=index=>index*width/(points.length-1);
  const y=value=>height-8-(height-16)*(value-min)/span;
  const path=points.reduce((line,point,index)=>{
    const endX=x(index),endY=y(point.balance);
    if(!index)return `M0 ${endY}`;
    const startY=y(points[index-1].balance);
    const midpoint=(x(index-1)+endX)/2;
    return `${line} C${midpoint} ${startY} ${midpoint} ${endY} ${endX} ${endY}`;
  },'');
  const axis=Array.from({length:5},(_,index)=>compact.format(max-(max-min)*index/4));
  const labels=[0,1,2,3,4].map(index=>dateLabel.format(points[Math.round(index*(points.length-1)/4)].date));
  box.innerHTML=`<div class="bw-balance-layout"><div class="bw-balance-values">${axis.map(label=>`<span>${label}</span>`).join('')}</div><div class="bw-balance-plot" tabindex="0" role="group" aria-label="Daily closing balance. Use left and right arrows to inspect."><svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="bwBalanceInteractiveFill" x2="0" y2="1"><stop stop-color="#137458" stop-opacity=".24"/><stop offset="100%" stop-color="#137458" stop-opacity=".035"/></linearGradient></defs><g class="bw-balance-series"><path fill="url(#bwBalanceInteractiveFill)" d="${path} L${width} ${height} L0 ${height} Z"/><path fill="none" stroke="#006448" stroke-width="2" vector-effect="non-scaling-stroke" d="${path}"/></g></svg><span class="bw-balance-guide" hidden></span><span class="bw-balance-dot" hidden></span><output class="bw-balance-tooltip" aria-live="off" hidden></output></div><div class="bw-balance-labels">${labels.map(label=>`<span>${label}</span>`).join('')}</div></div>`;
  const plot=box.querySelector('.bw-balance-plot'),series=plot.querySelector('.bw-balance-series');
  const guide=plot.querySelector('.bw-balance-guide'),dot=plot.querySelector('.bw-balance-dot'),tooltip=plot.querySelector('output');
  let index=points.length-1,pending,displayedIndex;
  function show(at,announce=false){
    index=Math.min(points.length-1,Math.max(0,at));
    if(index===displayedIndex&&!announce)return;
    displayedIndex=index;
    const point=points[index],position=x(index)/width*100;
    for(const node of [guide,dot,tooltip])node.hidden=false;
    guide.style.left=dot.style.left=position+'%';
    dot.style.top=(y(point.balance)/height*100)+'%';
    tooltip.style.left=Math.min(78,Math.max(22,position))+'%';
    tooltip.setAttribute('aria-live',announce?'polite':'off');
    tooltip.textContent=dateLabel.format(point.date)+' · '+currency.format(point.balance);
  }
  function hide(){
    cancelAnimationFrame(pending);
    displayedIndex=undefined;
    for(const node of [guide,dot,tooltip])node.hidden=true;
  }
  function inspectPointer(event){
    const bounds=plot.getBoundingClientRect();
    if(!bounds.width)return;
    const at=Math.round((event.clientX-bounds.left)/bounds.width*(points.length-1));
    cancelAnimationFrame(pending);
    pending=requestAnimationFrame(()=>show(at));
  }
  plot.addEventListener('pointerdown',inspectPointer);
  plot.addEventListener('pointermove',inspectPointer);
  plot.addEventListener('pointercancel',hide);
  plot.addEventListener('pointerleave',hide);
  plot.addEventListener('blur',hide);
  plot.addEventListener('focus',()=>show(index,true));
  plot.addEventListener('keydown',event=>{
    if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
    event.preventDefault();
    show(index+(event.key==='ArrowLeft'?-1:1),true);
  });
  if(plot.getClientRects().length&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    series.animate([{clipPath:'inset(0 100% 0 0)',opacity:.25},{clipPath:'inset(0 0 0 0)',opacity:1}],
      {duration:950,easing:'cubic-bezier(.22,1,.36,1)'});
  }
}
function wireRangeButtons(){
  const wrap=document.querySelector('#page-dashboard .bw-balance-card .bw-range');
  if(!wrap||wrap.dataset.bwRich)return;
  wrap.dataset.bwRich='1';
  const buttons=[...wrap.querySelectorAll('button')];
  for(const button of buttons){
    button.setAttribute('aria-pressed',String(button.classList.contains('active')));
    button.addEventListener('click',()=>{
      for(const item of buttons){
        item.classList.toggle('active',item===button);
        item.setAttribute('aria-pressed',String(item===button));
      }
      rangeDays=ranges[button.textContent.trim()]||7;
      renderBalanceRange();
    });
  }
}
const balanceStyle=document.createElement('style');
balanceStyle.textContent=`
#page-dashboard #balanceTrendChart{color:#55685e;min-width:0;padding:0!important}
.bw-balance-layout{display:grid;grid-template-columns:40px minmax(0,1fr);gap:7px;align-items:stretch}
.bw-balance-values,.bw-balance-labels{display:flex;justify-content:space-between;font-size:10px}
.bw-balance-values{flex-direction:column;text-align:right;padding:3px 0}
.bw-balance-labels{grid-column:2}
.bw-balance-plot{position:relative;touch-action:pan-y;height:clamp(160px,22vw,220px);border-left:1px solid #dbe5dc;border-bottom:1px solid #dbe5dc;background:repeating-linear-gradient(to bottom,transparent 0,transparent calc(25% - 1px),#e9eee8 calc(25% - 1px),#e9eee8 25%)}
#page-dashboard .bw-balance-plot svg{width:100%;height:100%!important;display:block}
.bw-balance-guide,.bw-balance-dot,.bw-balance-tooltip{position:absolute;pointer-events:none}
.bw-balance-plot [hidden]{display:none!important}
.bw-balance-guide{top:0;bottom:0;border-left:1px dashed #4d806d}
.bw-balance-dot{width:10px;height:10px;border:2px solid white;border-radius:50%;background:#006448;transform:translate(-50%,-50%);box-shadow:0 0 0 1px #006448}
.bw-balance-tooltip{top:7px;transform:translateX(-50%);padding:6px 9px;border-radius:7px;background:#163d30;color:white;font-size:11px;white-space:nowrap}
`;
document.head.appendChild(balanceStyle);

function markScrollableTables(){root.querySelectorAll('.table-wrap').forEach(w=>w.dataset.bwScrollable=String(w.scrollWidth>w.clientWidth+2))}
function addTooltips(){root.querySelectorAll('.sidebar-nav .nav-btn').forEach(b=>{if(!b.dataset.bwTip)b.dataset.bwTip=`Open ${b.textContent.trim()}`});const search=document.getElementById('txSearch');if(search&&!search.title)search.title='Search transaction description or category';document.querySelectorAll('#page-dashboard .bw-ref-range button').forEach(b=>b.dataset.bwTip=`Show ${b.textContent.trim()} balance range`)}

function setupReveal(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(!('IntersectionObserver'in window))return;revealObserver?.disconnect();revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('bw-rich-visible');revealObserver.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -24px 0px'});const page=root.querySelector('.page:not(.hidden)');if(!page)return;page.querySelectorAll(':scope > .premium-panel,:scope > .bw-ref-card,:scope > .goal-grid,:scope > .bw-insight-feed,:scope > .bw-intelligence-grid,:scope > .bw-planning-assistant,:scope > #bwPlanOverviewMount').forEach(el=>{el.classList.add('bw-rich-reveal');revealObserver.observe(el)})}

function keyboardShortcuts(e){if(e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey)return;const tag=document.activeElement?.tagName;if(['INPUT','TEXTAREA','SELECT'].includes(tag))return;if(e.key==='/'){const input=document.getElementById('txSearch')||document.getElementById('dashboardSearch');if(input){e.preventDefault();input.focus()}}}

function enhance(){wireRangeButtons();markScrollableTables();addTooltips();setupReveal();if(latestDetail)renderBalanceRange()}
window.addEventListener('budgetingwise:financial-data-rendered',e=>{latestDetail=e.detail;requestAnimationFrame(()=>{enhance()})});
root.addEventListener('budgetingwise:page-change',()=>requestAnimationFrame(enhance));
window.addEventListener('resize',()=>requestAnimationFrame(markScrollableTables),{passive:true});
document.addEventListener('keydown',keyboardShortcuts);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance,{once:true});else requestAnimationFrame(enhance);
})();
