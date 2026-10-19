/* Budgetingwise navigation: shared route controller for authenticated and guest views. */
(()=>{'use strict';
const valid=new Set(['dashboard','transactions','analytics','savings','insights','settings']);
const labels={dashboard:'Dashboard',transactions:'Transactions',analytics:'Analytics',savings:'Goals',insights:'Smart Insights',settings:'Settings'};
const root=document.getElementById('dashboardView');
if(!root)return;
const pageFromHash=()=>{const m=location.hash.match(/^#\/([a-z]+)$/);return m&&valid.has(m[1])?m[1]:null};
const visible=()=>!root.classList.contains('hidden');
let current=null;
function show(page,{historyMode='push'}={}){
 if(!valid.has(page)||!visible())return false;
 const target=document.getElementById('page-'+page);
 if(!target)return false;
 root.querySelectorAll('.page').forEach(node=>node.classList.toggle('hidden',node!==target));
 root.querySelectorAll('.sidebar-nav [data-page]').forEach(node=>{
  const active=node.dataset.page===page;
  node.classList.toggle('active',active);
  node.setAttribute('aria-pressed',String(active));
  if(active)node.setAttribute('aria-current','page');else node.removeAttribute('aria-current');
 });
 current=page;
 try{sessionStorage.setItem('budgetingwise-last-page',page)}catch(e){}
 const hash='#/'+page;
 if(location.hash!==hash&&historyMode!=='none')history[historyMode==='replace'?'replaceState':'pushState']({bwPage:page},'',hash);
 document.title=labels[page]+' | Budgetingwise';
 root.querySelector('.premium-main')?.scrollTo({top:0,behavior:'instant'});
 window.scrollTo({top:0,behavior:'instant'});
 root.dispatchEvent(new CustomEvent('budgetingwise:page-change',{detail:{page}}));
 return true;
}
// Capture before legacy handlers, so a single click cannot trigger competing page transitions.
root.addEventListener('click',event=>{
 const link=event.target.closest('[data-page]');
 if(!link||!root.contains(link)||!valid.has(link.dataset.page)||!visible())return;
 event.preventDefault();
 event.stopImmediatePropagation();
 show(link.dataset.page);
},true);
function restore(){if(!visible())return;const desired=pageFromHash()||current||(()=>{try{return sessionStorage.getItem('budgetingwise-last-page')}catch(e){return null}})()||'dashboard';show(valid.has(desired)?desired:'dashboard',{historyMode:pageFromHash()?'none':'replace'})}
window.addEventListener('popstate',restore);
window.addEventListener('hashchange',restore);
if(visible())restore();
else{const observer=new MutationObserver(()=>{if(visible()){observer.disconnect();restore()}});observer.observe(root,{attributes:true,attributeFilter:['class']})}
document.addEventListener('DOMContentLoaded',()=>{
 if(visible())restore();
 if(!root.querySelector('.bw-navigation-help')){
  const hint=document.createElement('p');hint.className='bw-navigation-help';hint.textContent='Tip: Ctrl + K to find a page · Your selected workspace controls which records you see.';
  root.querySelector('.bw-sidebar-workspace')?.append(hint);
 }
});
window.bwNavigate=page=>show(page);
})();