/* Budgetingwise Planning Assistant V1 — budget, bills, payday and safe-to-spend planning. */
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

const fbApp=getApps().length?getApp():initializeApp(firebaseConfig);
const auth=getAuth(fbApp),db=getFirestore(fbApp),$=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP',maximumFractionDigits:0}).format(Number(n)||0);
const localPrefix='budgetingwise-planning-v1:';
const trialKey='budgetingwise-trial-planning-v1';
let currentUid=null,lastDetail=null,state={monthlyBudget:0,nextPayday:'',bills:[]};

function isTrial(){return document.getElementById('dashboardView')?.dataset.trialAccount==='true'||sessionStorage.getItem('budgetingGuest')==='1'}
function key(){return currentUid?localPrefix+currentUid:localPrefix+'browser'}
function monthKey(d=todayInManila()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`}
function parseDate(v){if(!v)return null;const d=new Date(v+'T12:00:00');return Number.isFinite(d.getTime())?d:null}
function validDate(t){return parseDate(String(t?.date||''))}
function todayInManila(){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Manila',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts();
  const fields=Object.fromEntries(parts.map(({type,value})=>[type,value]));
  return new Date(+fields.year,+fields.month-1,+fields.day,12);
}
let calendarMonth=todayInManila();
let selectedDay=null;
function dateKey(d){return monthKey(d)+'-'+String(d.getDate()).padStart(2,'0')}
function normalizeBill(b){return{id:String(b?.id||`bill-${Date.now()}-${Math.random().toString(36).slice(2,7)}`),name:String(b?.name||'').trim().slice(0,80),amount:Math.max(0,Number(b?.amount)||0),dueDay:Math.min(31,Math.max(1,Math.round(Number(b?.dueDay)||1))),paidMonth:String(b?.paidMonth||''),dueDate:/^\d{4}-\d{2}-\d{2}$/.test(b?.dueDate||'')?b.dueDate:'',emailReminder:b?.emailReminder===true}}
function normalize(v){return{monthlyBudget:Math.max(0,Number(v?.monthlyBudget)||0),nextPayday:/^\d{4}-\d{2}-\d{2}$/.test(String(v?.nextPayday||''))?String(v.nextPayday):'',bills:Array.isArray(v?.bills)?v.bills.map(normalizeBill).filter(b=>b.name&&b.amount>0).slice(0,30):[]}}
function readLocal(){try{const raw=isTrial()?sessionStorage.getItem(trialKey):localStorage.getItem(key());return raw?normalize(JSON.parse(raw)):null}catch{return null}}
function writeLocal(v){try{const raw=JSON.stringify(normalize(v));if(isTrial())sessionStorage.setItem(trialKey,raw);else localStorage.setItem(key(),raw)}catch{}}
function publish(){window.bwPlanningProfile=JSON.parse(JSON.stringify(state));window.dispatchEvent(new CustomEvent('budgetingwise:planning-profile-changed',{detail:window.bwPlanningProfile}))}
function currentMonthRows(rows){const now=new Date();return rows.filter(t=>{const d=validDate(t);return d&&d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth()})}
function summarize(rows){const s={income:0,expense:0,savings:0,balance:0};for(const t of rows){const a=Math.max(0,Number(t.amount)||0);if(t.type==='income')s.income+=a;else if(t.type==='expense')s.expense+=a;else if(t.type==='savings')s.savings+=a}s.balance=s.income-s.expense-s.savings;return s}
function endOfMonth(d=new Date()){return new Date(d.getFullYear(),d.getMonth()+1,0,12)}
function billDateForMonth(b,y,m){if(b.dueDate)return parseDate(b.dueDate);const last=new Date(y,m+1,0).getDate();return new Date(y,m,Math.min(last,b.dueDay),12)}
function plannedOccurrence(b,from=todayInManila()){const current=billDateForMonth(b,from.getFullYear(),from.getMonth());if(b.paidMonth!==monthKey(from))return current;return billDateForMonth(b,from.getFullYear(),from.getMonth()+1)}
window.bwBillDeadline=(bill)=>plannedOccurrence(bill,todayInManila());
window.bwBillIsPaid=(bill)=>bill.paidMonth===(bill.dueDate?bill.dueDate.slice(0,7):monthKey());
function daysUntil(date){if(!date)return null;const a=todayInManila(),today=new Date(a.getFullYear(),a.getMonth(),a.getDate()),target=new Date(date.getFullYear(),date.getMonth(),date.getDate());return Math.round((target-today)/86400000)}
function effectivePayday(){let d=parseDate(state.nextPayday);if(!d)return null;const now=new Date(),today=new Date(now.getFullYear(),now.getMonth(),now.getDate());if(d>=today)return d;const freq=window.bwSalaryProfile?.frequency||'monthly';let guard=0;while(d<today&&guard++<60){if(freq==='weekly')d.setDate(d.getDate()+7);else if(freq==='biweekly')d.setDate(d.getDate()+14);else if(freq==='semi-monthly')d.setDate(d.getDate()+15);else d.setMonth(d.getMonth()+1)}return d}
function planningMath(detail){const rows=Array.isArray(detail?.transactions)?detail.transactions:[],summary=detail?.summary||summarize(rows),month=summarize(currentMonthRows(rows)),now=todayInManila(),payday=effectivePayday(),horizon=payday||endOfMonth(now);const dueBills=state.bills.filter(b=>!b.dueDate||b.paidMonth!==b.dueDate.slice(0,7)).map(b=>({...b,nextDue:plannedOccurrence(b,now)})).filter(b=>b.nextDue<=horizon);const billsReserve=dueBills.reduce((n,b)=>n+b.amount,0),budgetRemaining=state.monthlyBudget>0?state.monthlyBudget-month.expense:null,afterBills=summary.balance-billsReserve;let safe=afterBills;if(budgetRemaining!==null)safe=Math.min(safe,budgetRemaining);safe=Math.max(0,safe);return{rows,summary,month,payday,horizon,dueBills,billsReserve,budgetRemaining,afterBills,safe}}

function ensureUI(){const page=$('page-plan');if(!page)return null;let root=$('bwPlanningAssistant');if(root)return root;root=document.createElement('section');root.id='bwPlanningAssistant';root.className='bw-planning-assistant';root.innerHTML=`<div class="bw-plan-head"><div><h3>Financial Plan</h3></div></div><div class="bw-plan-kpis"><article class="bw-safe-card"><small>SAFE TO SPEND</small><strong id="bwSafeToSpend">—</strong><p id="bwSafeFormula">Set a budget or bills to improve this estimate.</p></article><article><small>MONTHLY BUDGET</small><strong id="bwPlanBudget">—</strong><p id="bwPlanBudgetMeta">No monthly limit set.</p></article><article><small>NEXT PAYDAY</small><strong id="bwPlanPayday">—</strong><p id="bwPlanPaydayMeta">Add your next payday.</p></article><article><small>BILLS BEFORE PAYDAY</small><strong id="bwPlanBills">—</strong><p id="bwPlanBillsMeta">No upcoming planned bills.</p></article></div><div class="bw-plan-layout"><div class="bw-plan-setup"><div class="bw-plan-section-title"><div><strong>Monthly plan</strong><small>Set a spending limit and your next payday.</small></div></div><form id="bwPlanForm" class="bw-plan-form"><label><span>Monthly spending budget</span><div class="bw-plan-money"><i>₱</i><input id="bwMonthlyBudget" type="number" min="0" step="0.01" placeholder="0.00"></div></label><label><span>Next payday</span><input id="bwNextPayday" type="date"></label><button class="primary" type="submit">Save plan</button></form><p id="bwPlanStatus" class="bw-plan-status" aria-live="polite"></p></div><div class="bw-plan-bills"><div class="bw-plan-section-title"><div><strong>Bills and deadlines</strong><small>Choose a due date and whether it repeats monthly.</small></div><span id="bwBillCount">0 bills</span></div><form id="bwBillForm" class="bw-bill-form"><input id="bwBillName" maxlength="80" placeholder="Bill name" aria-label="Bill name"><input id="bwBillAmount" type="number" min="0.01" step="0.01" placeholder="Amount" aria-label="Bill amount"><input id="bwBillDate" type="date" required aria-label="Bill due date"><label><input id="bwBillRecurring" type="checkbox"> Repeat monthly</label><label id="bwBillReminderLabel"><input id="bwBillReminder" type="checkbox"> Email reminder <small>Within 3 days of the deadline, once email service is enabled.</small></label><button type="submit">Add bill</button></form><div id="bwBillList" class="bw-bill-list"></div></div></div><section class="bw-deadline-calendar" aria-label="Bill deadline calendar"><header><button type="button" id="bwCalendarPrev" aria-label="Previous month">‹</button><h3 id="bwCalendarTitle"></h3><button type="button" id="bwCalendarNext" aria-label="Next month">›</button></header><div id="bwCalendarDays" class="bw-calendar-days"></div><p id="bwCalendarDetail" aria-live="polite"></p></section>`;
 page.append(root);
 for(const [id,offset] of [['bwCalendarPrev',-1],['bwCalendarNext',1]]){
   $(id).addEventListener('click',()=>{
     calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+offset,1,12);
     selectedDay=null;
     renderCalendar();
   });
 }
 $('bwCalendarDays').addEventListener('click',event=>{
   const button=event.target.closest('[data-day]');
   if(!button)return;
   selectedDay=button.dataset.day;
   $('bwBillDate').value=selectedDay;
   for(const day of $('bwCalendarDays').querySelectorAll('[data-day]')){
     day.setAttribute('aria-pressed',String(day===button));
   }
   showCalendarDay();
 });
 $('bwPlanForm')?.addEventListener('submit',savePlan);$('bwBillForm')?.addEventListener('submit',addBill);$('bwBillList')?.addEventListener('click',billAction);return root}
function billsOnDay(key){
  return state.bills.filter(b=>b.dueDate===key||(!b.dueDate&&dateKey(billDateForMonth(b,calendarMonth.getFullYear(),calendarMonth.getMonth()))===key));
}
function showCalendarDay(){
  const detail=$('bwCalendarDetail');
  if(!selectedDay){detail.textContent='Select a day to see deadlines or set the due date for a new bill.';return}
  const bills=billsOnDay(selectedDay);
  detail.textContent=selectedDay+' · '+(bills.length?bills.map(b=>b.name+' ('+money(b.amount)+')').join(', '):'No bills due');
}
function renderCalendar(){
  const y=calendarMonth.getFullYear(),m=calendarMonth.getMonth();
  $('bwCalendarTitle').textContent=calendarMonth.toLocaleDateString('en-PH',{month:'long',year:'numeric'});
  const labels=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day=>'<span>'+day+'</span>').join('');
  const blank='<span></span>'.repeat(new Date(y,m,1).getDay());
  const buttons=Array.from({length:new Date(y,m+1,0).getDate()},(_,index)=>{
    const date=dateKey(new Date(y,m,index+1,12)),count=billsOnDay(date).length;
    return '<button type="button" data-day="'+date+'" aria-pressed="'+(date===selectedDay)+'" aria-label="'+date+(count?', '+count+' due':'')+'">'+(index+1)+(count?'<b>'+count+'</b>':'')+'</button>';
  }).join('');
  $('bwCalendarDays').innerHTML=labels+blank+buttons;
  showCalendarDay();
}
function syncInputs(){if($('bwMonthlyBudget')&&document.activeElement!==$('bwMonthlyBudget'))$('bwMonthlyBudget').value=state.monthlyBudget||'';if($('bwNextPayday'))$('bwNextPayday').value=state.nextPayday||''}
function renderBills(math){const list=$('bwBillList'),mk=monthKey(),today=todayInManila();if(!list)return;$('bwBillCount').textContent=`${state.bills.length} bill${state.bills.length===1?'':'s'}`;if(!state.bills.length){list.innerHTML='<p class="bw-plan-empty">No recurring bills yet. Add rent, internet, utilities or subscriptions.</p>';return}list.innerHTML=state.bills.slice().sort((a,b)=>a.dueDay-b.dueDay).map(b=>{const paid=b.paidMonth===(b.dueDate?b.dueDate.slice(0,7):mk),due=plannedOccurrence(b),reserved=math.dueBills.some(x=>x.id===b.id),overdue=!paid&&due<new Date(today.getFullYear(),today.getMonth(),today.getDate());let note;if(paid&&reserved)note='Paid this month · next bill reserved';else if(paid)note=b.dueDate?'Paid':'Paid this month';else if(overdue&&reserved)note='Overdue · reserved in safe-to-spend';else if(reserved)note='Reserved before next payday';else note='Later this cycle';return`<div class="bw-bill-row ${paid&&!reserved?'paid':''}"><div class="bw-bill-date"><strong>${due.getDate()}</strong><small>${due.toLocaleDateString('en-PH',{month:'short'})}</small></div><div><strong>${escapeHtml(b.name)}</strong><small>${note} · ${dateKey(due)}${b.emailReminder?' · Email reminder requested':''}</small></div><span>${money(b.amount)}</span><button type="button" data-bill-paid="${escapeHtml(b.id)}">${paid?'Undo paid':'Mark paid'}</button><button type="button" class="danger" data-bill-delete="${escapeHtml(b.id)}" aria-label="Delete ${escapeHtml(b.name)}">×</button></div>`}).join('')}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function render(detail){lastDetail=detail||lastDetail;if(!lastDetail)return;ensureUI();const m=planningMath(lastDetail);syncInputs();$('bwSafeToSpend').textContent=money(m.safe);$('bwSafeFormula').textContent=`Available ${money(m.summary.balance)} − planned bills ${money(m.billsReserve)}${m.budgetRemaining!==null?` · budget room ${money(Math.max(0,m.budgetRemaining))}`:''}.`;$('bwPlanBudget').textContent=state.monthlyBudget>0?money(state.monthlyBudget):'—';$('bwPlanBudgetMeta').textContent=state.monthlyBudget>0?`${money(m.month.expense)} spent · ${money(Math.max(0,m.budgetRemaining))} remaining`:'Set a monthly spending limit.';const days=daysUntil(m.payday);$('bwPlanPayday').textContent=m.payday?new Intl.DateTimeFormat('en-PH',{month:'short',day:'numeric'}).format(m.payday):'—';$('bwPlanPaydayMeta').textContent=m.payday?(days===0?'Payday is today':days===1?'1 day to payday':`${days} days to payday`):'Add your next payday date.';$('bwPlanBills').textContent=money(m.billsReserve);$('bwPlanBillsMeta').textContent=m.dueBills.length?`${m.dueBills.length} planned bill${m.dueBills.length===1?'':'s'} reserved`:'No unpaid bills due in this planning window.';$('bwBillReminderLabel').hidden=isTrial();renderBills(m);renderCalendar();window.dispatchEvent(new CustomEvent('budgetingwise:planning-calculated',{detail:{safeToSpend:m.safe,billsReserve:m.billsReserve,budgetRemaining:m.budgetRemaining,nextPayday:m.payday?.toISOString().slice(0,10)||'',monthlyExpense:m.month.expense}}))}
async function persist(message){writeLocal(state);publish();if(lastDetail)render(lastDetail);const status=$('bwPlanStatus');if(status)status.textContent=isTrial()?`${message} Saved for this trial session.`:`${message} Saved on this device.`;if(isTrial()||!auth.currentUser)return;try{await setDoc(doc(db,'users',auth.currentUser.uid,'planning','finance'),{...normalize(state),hasBillReminders:state.bills.some(b=>b.emailReminder),updatedAt:serverTimestamp()},{merge:true});if(status)status.textContent=`${message} Saved to your account.`}catch(err){console.warn('Planning account sync unavailable:',err);if(status)status.textContent=`${message} Saved on this device. Account sync is currently unavailable.`}}
function savePlan(e){e.preventDefault();state.monthlyBudget=Math.max(0,Number($('bwMonthlyBudget')?.value)||0);state.nextPayday=$('bwNextPayday')?.value||'';persist('Monthly plan updated.')}
function addBill(e){
  e.preventDefault();
  const name=$('bwBillName').value.trim(),amount=Number($('bwBillAmount').value);
  const dueDate=$('bwBillDate').value,date=parseDate(dueDate);
  if(!name||!Number.isFinite(amount)||amount<=0||!date||state.bills.length>=30){
    $('bwPlanStatus').textContent=state.bills.length>=30?'Remove a bill before adding another (30 maximum).':'Enter a bill name, amount and due date.';
    return;
  }
  const recurring=$('bwBillRecurring').checked;
  if(recurring&&monthKey(date)!==monthKey()){
    $('bwPlanStatus').textContent='For a monthly bill, select the due day in the current month.';
    return;
  }
  state.bills=[...state.bills,normalizeBill({name,amount,dueDate:recurring?'':dueDate,dueDay:date.getDate(),emailReminder:!isTrial()&&$('bwBillReminder').checked})];
  calendarMonth=date;
  selectedDay=dueDate;
  e.target.reset();
  persist(name+' added.');
}
function billAction(e){const paid=e.target.closest('[data-bill-paid]'),del=e.target.closest('[data-bill-delete]');if(paid){const id=paid.dataset.billPaid,b=state.bills.find(x=>x.id===id);if(!b)return;const period=b.dueDate?b.dueDate.slice(0,7):monthKey();b.paidMonth=b.paidMonth===period?'':period;persist(`${b.name} ${b.paidMonth?'marked paid':'marked unpaid'}.`);return}if(del){const id=del.dataset.billDelete,b=state.bills.find(x=>x.id===id);if(!b)return;state.bills=state.bills.filter(x=>x.id!==id);persist(`${b.name} removed.`)}}

onAuthStateChanged(auth,async user=>{currentUid=user?.uid||null;if(isTrial()){const saved=readLocal();state=saved||normalize({monthlyBudget:30000,nextPayday:new Date(Date.now()+8*86400000).toISOString().slice(0,10),bills:[{name:'Rent',amount:9000,dueDay:1},{name:'Internet',amount:1699,dueDay:12},{name:'Mobile Plan',amount:999,dueDay:20}]});writeLocal(state);publish();if(lastDetail)render(lastDetail);return}state=readLocal()||normalize({});publish();if(lastDetail)render(lastDetail);if(!user)return;try{const snap=await getDoc(doc(db,'users',user.uid,'planning','finance'));if(currentUid===user.uid&&snap.exists()){state=normalize(snap.data());writeLocal(state);publish();if(lastDetail)render(lastDetail)}}catch(err){console.warn('Planning profile load unavailable:',err)}});
render({transactions:[]});
window.addEventListener('budgetingwise:financial-data-rendered',e=>render(e.detail));
window.addEventListener('budgetingwise:salary-profile-changed',()=>{if(lastDetail)render(lastDetail)});

const style=document.createElement('style');style.textContent=`
.bw-deadline-calendar{margin-top:16px;padding:16px;border:1px solid #dce4da;border-radius:14px;background:#fff;color:#243b2e}
.bw-deadline-calendar header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}
.bw-deadline-calendar button{cursor:pointer;border:1px solid #dce4da;border-radius:8px;background:#f6f8f4;color:#243b2e;min-height:36px;padding:4px 8px}
.bw-calendar-days{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;text-align:center}
.bw-calendar-days b{display:block;color:#17614a;font-size:11px}
.bw-calendar-days button[aria-pressed=true]{outline:2px solid #17614a}
.bw-deadline-calendar p{margin:12px 0 0;color:#3d5546}
#bwBillReminderLabel[hidden]{display:none!important}
#page-plan .bw-planning-assistant{margin:0 0 14px;padding:18px 19px;border:1px solid var(--bw-ui-border);border-radius:16px;background:var(--bw-ui-surface);box-shadow:0 8px 28px rgba(28,31,50,.04)}
#page-plan .bw-plan-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:13px}.bw-plan-head span{font-size:7px;font-weight:850;letter-spacing:.11em;color:var(--bw-ui-accent)}.bw-plan-head h3{margin:4px 0!important;font-size:15px!important}.bw-plan-head p{margin:0!important;max-width:680px;font-size:8px!important;line-height:1.55!important}.bw-plan-head>b{padding:6px 9px;border-radius:999px;background:var(--bw-ui-soft);color:var(--bw-ui-accent)!important;font-size:7px!important;border:1px solid color-mix(in srgb,var(--bw-ui-accent) 14%,var(--bw-ui-border))}
#page-plan .bw-plan-kpis{display:grid;grid-template-columns:1.15fr repeat(3,1fr);gap:8px;margin-bottom:10px}.bw-plan-kpis article{padding:13px;border:1px solid var(--bw-ui-border);border-radius:12px;background:var(--bw-ui-surface-2)}.bw-plan-kpis article.bw-safe-card{background:linear-gradient(135deg,color-mix(in srgb,var(--bw-ui-accent) 9%,var(--bw-ui-surface)),var(--bw-ui-surface));border-color:color-mix(in srgb,var(--bw-ui-accent) 18%,var(--bw-ui-border))}.bw-plan-kpis small{display:block;font-size:6.5px!important;font-weight:850;letter-spacing:.06em;color:var(--bw-ui-muted)!important}.bw-plan-kpis strong{display:block;margin-top:6px;font-size:17px!important;letter-spacing:-.035em!important;font-variant-numeric:tabular-nums}.bw-plan-kpis p{margin:5px 0 0!important;font-size:7px!important;line-height:1.45!important;color:var(--bw-ui-muted)!important}
#page-plan .bw-plan-layout{display:grid;grid-template-columns:minmax(280px,.8fr) minmax(0,1.2fr);gap:10px}.bw-plan-setup,.bw-plan-bills{padding:13px;border:1px solid var(--bw-ui-border);border-radius:13px;background:var(--bw-ui-surface-2)}.bw-plan-section-title{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:9px}.bw-plan-section-title strong{font-size:9px!important}.bw-plan-section-title small{display:block;margin-top:3px;font-size:7px!important;color:var(--bw-ui-muted)!important}.bw-plan-section-title>span{font-size:7px;color:var(--bw-ui-muted)}
#page-plan .bw-plan-form{display:grid;gap:8px}.bw-plan-form label>span{display:block;margin-bottom:4px;font-size:7px;font-weight:800;color:var(--bw-ui-muted)}.bw-plan-form :is(input,button){min-height:38px!important}.bw-plan-money{display:grid;grid-template-columns:30px 1fr;border:1px solid var(--bw-ui-border);border-radius:10px;overflow:hidden;background:var(--bw-ui-surface)}.bw-plan-money i{display:grid;place-items:center;font-style:normal;font-size:9px;font-weight:850;color:var(--bw-ui-muted);border-right:1px solid var(--bw-ui-border)}.bw-plan-money input{border:0!important;border-radius:0!important;box-shadow:none!important}.bw-plan-status{min-height:12px;margin:7px 0 0!important;font-size:7px!important;color:var(--bw-ui-muted)!important}
#page-plan .bw-bill-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-bottom:8px}.bw-bill-form :is(input,button){min-height:34px!important;font-size:12px!important}.bw-bill-form label{display:flex;align-items:center;gap:5px}.bw-bill-form label input{min-height:0!important;width:auto}.bw-bill-form button{border:1px solid var(--bw-ui-border);border-radius:9px;background:var(--bw-ui-surface);color:var(--bw-ui-text);font-weight:800}
#page-plan .bw-bill-list{display:grid;gap:6px;max-height:205px;overflow:auto}.bw-bill-row{display:grid;grid-template-columns:34px minmax(0,1fr) auto auto 24px;gap:8px;align-items:center;padding:8px;border:1px solid var(--bw-ui-border);border-radius:10px;background:var(--bw-ui-surface)}.bw-bill-row.paid{opacity:.64}.bw-bill-date{width:32px;height:32px;display:grid;place-items:center;align-content:center;border-radius:8px;background:var(--bw-ui-soft)}.bw-bill-date strong{font-size:10px!important;line-height:1}.bw-bill-date small{font-size:5px!important}.bw-bill-row>div:nth-child(2)>strong{display:block;font-size:8px!important}.bw-bill-row>div:nth-child(2)>small{display:block;margin-top:2px;font-size:6.5px!important;color:var(--bw-ui-muted)!important}.bw-bill-row>span{font-size:8px;font-weight:850}.bw-bill-row button{min-height:28px;padding:0 8px;border:1px solid var(--bw-ui-border);border-radius:8px;background:var(--bw-ui-surface-2);color:var(--bw-ui-text);font-size:6.5px;font-weight:800}.bw-bill-row button.danger{padding:0;width:24px;color:#bd5167}.bw-plan-empty{margin:0!important;padding:16px;text-align:center;font-size:7px!important;color:var(--bw-ui-muted)!important}
@media(max-width:1050px){#page-plan .bw-plan-kpis{grid-template-columns:1fr 1fr}.bw-plan-layout{grid-template-columns:1fr!important}}
@media(max-width:700px){#page-plan .bw-plan-kpis{grid-template-columns:1fr!important}.bw-bill-form{grid-template-columns:1fr 1fr!important}.bw-bill-form button{grid-column:1/-1}.bw-bill-row{grid-template-columns:34px minmax(0,1fr) auto}.bw-bill-row>button{grid-row:2}.bw-bill-row button.danger{grid-column:3}}
`;document.head.appendChild(style);
