/* Budgetingwise Reference UI Loader V5 — approved seven-tab customer experience. */
import './customer-reference-pages-v3.js?v=reference-pages-v4';
import './customer-reference-data-v3.js?v=reference-data-v4';
import './customer-reference-plan-v3.js?v=reference-plan-v4';
import './customer-reference-exact-v4.js?v=reference-exact-v4';
import './customer-planning-premium-v2.js?v=planning-premium-v2';

(()=>{'use strict';
const styles=[
 ['bwCustomerReferenceV3','./customer-reference-ui-v3.css?v=reference-ui-v4'],
 ['bwCustomerReferenceFixesV3','./customer-reference-final-fixes-v3.css?v=reference-fixes-v4'],
 ['bwCustomerReferenceExactV4','./customer-reference-exact-v4.css?v=reference-exact-v4'],
 ['bwCustomerPremiumQaV2','./customer-premium-qa-v2.css?v=premium-qa-v2']
];
function attachStyles(){for(const [id,href] of styles){let link=document.getElementById(id);if(!link){link=document.createElement('link');link.id=id;link.rel='stylesheet';link.href=href;document.head.appendChild(link)}else document.head.appendChild(link)}}
attachStyles();
window.addEventListener('load',()=>requestAnimationFrame(attachStyles),{once:true});
document.getElementById('dashboardView')?.addEventListener('budgetingwise:page-change',attachStyles);
})();