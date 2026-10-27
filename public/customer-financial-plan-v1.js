/* Budgetingwise Financial Plan reset — keep the navigation destination, leave page content blank. */
import './customer-reference-ui-v2.js?v=reference-ui-v14-premium-rebuild';
(()=>{'use strict';
const root=document.getElementById('dashboardView');
const content=root?.querySelector('.premium-content');
const nav=root?.querySelector('.sidebar-nav');
if(!root||!content||!nav)return;
let page=document.getElementById('page-plan');
if(!page){
  page=document.createElement('div');
  page.id='page-plan';
  page.className='page hidden';
  page.setAttribute('aria-hidden','true');
  content.appendChild(page);
}else{
  page.replaceChildren();
}
let button=nav.querySelector('[data-page="plan"]');
if(!button){
  button=document.createElement('button');
  button.className='nav-btn';
  button.type='button';
  button.dataset.page='plan';
  button.innerHTML='<span>◫</span> Financial Plan';
  const goals=nav.querySelector('[data-page="savings"]');
  goals?nav.insertBefore(button,goals):nav.appendChild(button);
}
})();
