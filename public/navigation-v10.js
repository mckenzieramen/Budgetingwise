/* Budgetingwise navigation: single reliable route controller for authenticated and guest views. */
(()=>{'use strict';
const valid=new Set(['dashboard','transactions','analytics','savings','plan','insights','settings']);
const labels={dashboard:'Dashboard',transactions:'Transactions',analytics:'Analytics',savings:'Goals',plan:'Financial Plan',insights:'AI Insights',settings:'Settings'};
const root=document.getElementById('dashboardView');
if(!root)return;
const pageFromHash=()=>{const m=location.hash.match(/^#\/([a-z]+)$/);return m&&valid.has(m[1])?m[1]:null};
const visible=()=>!root.classList.contains('hidden');
let current=null;
function show(page,{historyMode='push'}={}){
 if(!valid.has(page)||!visible())return false;
 const target=document.getElementById('page-'+page);
 if(!target)return false;
 root.querySelectorAll('.page').forEach(node=>{const active=node===target;node.classList.toggle('hidden',!active);node.setAttribute('aria-hidden',String(!active))});
 root.querySelectorAll('.sidebar-nav [data-page]').forEach(node=>{const active=node.dataset.page===page;node.classList.toggle('active',active);node.setAttribute('aria-pressed',String(active));if(active)node.setAttribute('aria-current','page');else node.removeAttribute('aria-current')});
 current=page;
 try{sessionStorage.setItem('budgetingwise-last-page',page)}catch(e){}
 const hash='#/'+page;
 if(location.hash!==hash&&historyMode!=='none')history[historyMode==='replace'?'replaceState':'pushState']({bwPage:page},'',hash);
 document.title=labels[page]+' | Budgetingwise';
 const main=root.querySelector('.premium-main');if(main)main.scrollTop=0;window.scrollTo(0,0);
 root.dispatchEvent(new CustomEvent('budgetingwise:page-change',{detail:{page}}));
 return true;
}
function routeClick(event){
 const link=event.target.closest('[data-page]');
 if(!link||!root.contains(link)||!valid.has(link.dataset.page)||!visible())return;
 event.preventDefault();
 show(link.dataset.page);
 if(root.classList.contains('bw-mobile-nav-open')){root.classList.remove('bw-mobile-nav-open');const toggle=root.querySelector('.mobile-nav-toggle');toggle?.setAttribute('aria-expanded','false');toggle?.setAttribute('aria-label','Open navigation menu');document.body.style.removeProperty('overflow')}
}
root.addEventListener('click',routeClick);
function restore(){if(!visible())return;let stored=null;try{stored=sessionStorage.getItem('budgetingwise-last-page')}catch(e){}const desired=pageFromHash()||current||stored||'dashboard';show(valid.has(desired)?desired:'dashboard',{historyMode:pageFromHash()?'none':'replace'})}
window.addEventListener('popstate',restore);window.addEventListener('hashchange',restore);
if(visible())restore();else{const observer=new MutationObserver(()=>{if(visible()){observer.disconnect();restore()}});observer.observe(root,{attributes:true,attributeFilter:['class']})}
document.addEventListener('DOMContentLoaded',()=>{if(visible())restore()});
window.bwNavigate=(page,options)=>show(page,options);
})();