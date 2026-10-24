(()=>{
  'use strict';
  const root=()=>document.getElementById('adminSupportPanel');
  let cache={uid:'',html:'',until:0};
  const currentDrawer=()=>root()?.querySelector('.bws-persistent-drawer');
  const currentBody=()=>currentDrawer()?.querySelector('.bws-drawer-body');
  const save=()=>{
    const d=currentDrawer(),b=currentBody();
    if(!d||!b||b.querySelector('.bws-drawer-empty'))return;
    cache={uid:d.dataset.uid||'',html:b.innerHTML,until:Date.now()+2500};
  };
  const restoreIfNeeded=()=>{
    if(!cache.html||Date.now()>cache.until)return;
    const d=currentDrawer(),b=currentBody();
    if(!d||!b||!cache.uid||d.dataset.uid!==cache.uid)return;
    const loading=b.querySelector('.bws-drawer-empty');
    if(loading&&/loading customer information/i.test(loading.textContent||'')) b.innerHTML=cache.html;
  };
  document.addEventListener('change',e=>{
    if(!e.target.closest('#adminSupportPanel'))return;
    if(e.target.matches('select')||e.target.closest('.asp-list-tools,.asp-list-head,.asp-thread-filters')){
      save();
      requestAnimationFrame(()=>restoreIfNeeded());
      setTimeout(restoreIfNeeded,60);
      setTimeout(restoreIfNeeded,140);
      setTimeout(restoreIfNeeded,260);
    }
  },true);
  document.addEventListener('input',e=>{
    if(!e.target.closest('#adminSupportPanel'))return;
    if(e.target.matches('input[type="search"],.asp-list-tools input,.asp-list-head input')) save();
  },true);
  const bind=()=>{
    const r=root();
    if(!r||r.dataset.bwsFilterStable)return false;
    r.dataset.bwsFilterStable='1';
    new MutationObserver(()=>restoreIfNeeded()).observe(r,{childList:true,subtree:true});
    return true;
  };
  if(!bind()){
    let n=0;const t=setInterval(()=>{if(bind()||++n>40)clearInterval(t)},100);
  }
})();
