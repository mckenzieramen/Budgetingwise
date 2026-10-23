const q=(s,p=document)=>p.querySelector(s);

function ticketNumber(button){
  const text=button.querySelector('.asp-ticket-grid strong')?.textContent||'';
  const m=text.match(/#(\d+)/);
  return m?Number(m[1]):0;
}

function sortHistory(box,mode){
  const list=q('[data-ticket-list]',box);
  if(!list)return;
  const items=[...list.querySelectorAll('.asp-ticket-summary')];
  items.sort((a,b)=>mode==='oldest'?ticketNumber(a)-ticketNumber(b):ticketNumber(b)-ticketNumber(a));
  items.forEach(item=>list.appendChild(item));
}

function enhance(box){
  if(!box||box.dataset.sortReady==='1')return;
  box.dataset.sortReady='1';
  const head=q('.asp-ticket-history-head',box);
  if(!head)return;
  const controls=document.createElement('label');
  controls.className='asp-ticket-sort-control';
  controls.innerHTML='<span>Sort</span><select aria-label="Sort ticket history"><option value="newest">Newest</option><option value="oldest">Oldest</option></select>';
  head.appendChild(controls);
  const select=q('select',controls);
  select.onchange=()=>sortHistory(box,select.value);
  sortHistory(box,'newest');
}

if(!document.getElementById('aspTicketSortStyle')){
  const style=document.createElement('style');
  style.id='aspTicketSortStyle';
  style.textContent=`.asp-ticket-sort-control{display:flex;align-items:center;gap:6px}.asp-ticket-sort-control span{font-size:8px;font-weight:800;color:#8b85a0;text-transform:uppercase;letter-spacing:.08em}.asp-ticket-sort-control select{height:30px;padding:0 28px 0 9px;border:1px solid #ded8f7;border-radius:9px;background:#fff;color:#4f3abd;font-size:9px;font-weight:800;cursor:pointer;outline:none}.asp-ticket-sort-control select:focus{border-color:#9e8ff1;box-shadow:0 0 0 3px rgba(98,70,229,.09)}@media(max-width:420px){.asp-ticket-history-head{align-items:flex-start;gap:8px;flex-wrap:wrap}.asp-ticket-sort-control{width:100%;justify-content:flex-end}}`;
  document.head.appendChild(style);
}

const scan=()=>document.querySelectorAll('[data-ticket-v7]').forEach(enhance);
new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true});
scan();
