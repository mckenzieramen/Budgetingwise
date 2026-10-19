// Premium dashboard charts use real transaction and goal data only.
(function(){
 const peso=n=>new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP',maximumFractionDigits:0}).format(Number(n)||0);
 const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const colors=['#ffdb54','#ff906d','#e7e7ed','#6539f6','#ff424a','#1269ee','#39ad9d','#9a7bf8'];
 function drawChart(target,txs,year){
  const el=document.getElementById(target);if(!el)return;
  const now=new Date(),currentYear=Number(year)||now.getFullYear();
  const monthly=Array.from({length:12},()=>({income:0,expense:0}));
  txs.forEach(t=>{const d=String(t.date||'').match(/^(\d{4})-(\d{2})/);if(!d||Number(d[1])!==currentYear)return;const m=Number(d[2])-1;if(m<0||m>11)return;if(t.type==='income')monthly[m].income+=Number(t.amount)||0;if(t.type==='expense')monthly[m].expense+=Number(t.amount)||0});
  const last=currentYear===now.getFullYear()?Math.max(6,now.getMonth()):11;
  const first=Math.max(0,last-6);const selected=monthly.slice(first,last+1);
  const max=Math.max(1,...selected.flatMap(x=>[x.income,x.expense]));
  const top=Math.ceil(max/1000)*1000||1000;
  const names=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const ticks=[3,2,1,0].map(i=>'<span>'+peso(top*i/3)+'</span>').join('');
  const cols=selected.map((x,i)=>'<div class="chart-month"><div class="chart-bars"><i class="expense-bar" title="Expenses: '+peso(x.expense)+'" style="height:'+Math.max(1,x.expense/top*100)+'%"></i><i class="income-bar" title="Income: '+peso(x.income)+'" style="height:'+Math.max(1,x.income/top*100)+'%"></i></div><small>'+names[first+i]+'</small></div>').join('');
  el.innerHTML='<div class="chart-yaxis">'+ticks+'</div><div class="chart-plot">'+cols+(txs.length?'':'<span class="chart-empty-note">No transactions yet</span>')+'</div>';
 }
 function render(txs=[],goals=[]){
  if(!Array.isArray(txs))txs=[];if(!Array.isArray(goals))goals=[];
  const year=document.getElementById('earningsYear');if(year){const current=new Date().getFullYear();const selected=year.value||String(current);year.innerHTML=[current,current-1,current-2].map(y=>'<option value="'+y+'">'+y+'</option>').join('');year.value=selected;year.onchange=()=>{drawChart('earningsChart',txs,year.value);drawChart('analyticsChart',txs,year.value)}}
  drawChart('earningsChart',txs,year?.value);drawChart('analyticsChart',txs,year?.value);
  const amounts=new Map();let total=0;
  txs.forEach(t=>{if(t.type!=='expense')return;const v=Math.max(0,Number(t.amount)||0);const cat=String(t.category||'Other');amounts.set(cat,(amounts.get(cat)||0)+v);total+=v});
  const entries=[...amounts.entries()].sort((a,b)=>b[1]-a[1]);
  const donut=document.getElementById('expenseDonut'),label=document.getElementById('categoryLegend'),totalEl=document.getElementById('donutTotal');
  if(totalEl)totalEl.textContent=peso(total);
  if(donut){let offset=0;const segments=entries.map(([_,amount],i)=>{const from=offset;offset+=amount/Math.max(total,1)*100;return colors[i%colors.length]+' '+from+'% '+offset+'%'});donut.style.background=segments.length?'conic-gradient('+segments.join(',')+')':'#ededf5'}
  if(label)label.innerHTML=entries.length?entries.slice(0,8).map(([cat,amount],i)=>'<div title="'+safe(cat)+' '+peso(amount)+'"><i style="background:'+colors[i%colors.length]+'"></i><span>'+safe(cat)+'</span></div>').join(''):'<div class="muted">No expenses recorded yet</div>';
  const goal=goals[0],name=document.getElementById('overviewGoalName'),amt=document.getElementById('overviewGoalAmounts'),fill=document.getElementById('overviewGoalFill'),percent=document.getElementById('overviewGoalPercent'),target=document.getElementById('overviewGoalTarget');
  const pct=goal?Math.max(0,Math.min(100,Math.round((Number(goal.saved)||0)/Math.max(1,Number(goal.target)||0)*100))):0;
  if(name)name.textContent=goal?.name||'Your savings journey';
  if(amt)amt.textContent=goal?peso(goal.saved)+' of '+peso(goal.target):'No goal set yet';
  if(fill)fill.style.width=pct+'%';if(percent)percent.textContent=pct+'%';
  if(target)target.textContent=goal?.goalDate?'Target: '+goal.goalDate:'Create a goal to get started';
 }
 window.renderPremiumOverview=render;
 document.addEventListener('DOMContentLoaded',()=>{
  const input=document.getElementById('dashboardSearch');if(input)input.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();document.querySelectorAll('#recentList .list-item').forEach(el=>el.hidden=!!q&&!el.textContent.toLowerCase().includes(q))});
  document.querySelectorAll('[data-page="analytics"]').forEach(el=>el.addEventListener('click',()=>drawChart('analyticsChart',[],document.getElementById('earningsYear')?.value)));
  render([],[]);
 });
})();
