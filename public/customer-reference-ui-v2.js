/* Budgetingwise Reference UI Loader V11 — fixed-light screenshot-style customer experience with dedicated responsive authority. */
import './customer-reference-pages-v3.js?v=reference-pages-v5';
import './customer-reference-data-v3.js?v=reference-data-v4';
import './customer-reference-plan-v3.js?v=reference-plan-v4';
import './customer-reference-exact-v4.js?v=reference-exact-v4';
import './customer-planning-premium-v2.js?v=planning-premium-v2';
import './customer-rich-interactions-v1.js?v=rich-interactions-v1';
import './customer-dashboard-picture-v1.js?v=dashboard-picture-v2';

(()=>{'use strict';
const styles=[
 ['bwCustomerReferenceV3','./customer-reference-ui-v3.css?v=reference-ui-v4'],
 ['bwCustomerReferenceFixesV3','./customer-reference-final-fixes-v3.css?v=reference-fixes-v4'],
 ['bwCustomerReferenceExactV4','./customer-reference-exact-v4.css?v=reference-exact-v4'],
 ['bwCustomerPremiumQaV2','./customer-premium-qa-v2.css?v=premium-qa-v2'],
 ['bwCustomerPictureDashboardV1','./customer-picture-dashboard-v1.css?v=dashboard-picture-v1'],
 ['bwCustomerMobileResponsiveV1','./customer-mobile-responsive-v1.css?v=mobile-responsive-v1']
];
function attachStyles(){for(const [id,href] of styles){let link=document.getElementById(id);if(!link){link=document.createElement('link');link.id=id;link.rel='stylesheet';link.href=href;document.head.appendChild(link)}else document.head.appendChild(link)}}
attachStyles();
window.addEventListener('load',()=>requestAnimationFrame(attachStyles),{once:true});
document.getElementById('dashboardView')?.addEventListener('budgetingwise:page-change',attachStyles);
})();