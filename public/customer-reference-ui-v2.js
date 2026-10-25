/* Budgetingwise Reference UI Loader V3 — approved seven-tab customer experience. */
import './customer-reference-pages-v3.js?v=reference-pages-v3';
import './customer-reference-data-v3.js?v=reference-data-v3';
import './customer-reference-plan-v3.js?v=reference-plan-v3';

(()=>{'use strict';
const styles=[['bwCustomerReferenceV3','./customer-reference-ui-v3.css?v=reference-ui-v3'],['bwCustomerReferenceFixesV3','./customer-reference-final-fixes-v3.css?v=reference-fixes-v3']];
function attachStyles(){for(const [id,href] of styles){let link=document.getElementById(id);if(!link){link=document.createElement('link');link.id=id;link.rel='stylesheet';link.href=href;document.head.appendChild(link)}else document.head.appendChild(link)}}
attachStyles();
// Legacy customer styles are injected later by boot.js. Re-appending these links after load/page changes
// guarantees that the approved reference remains the final visual authority without changing data logic.
window.addEventListener('load',()=>requestAnimationFrame(attachStyles),{once:true});
document.getElementById('dashboardView')?.addEventListener('budgetingwise:page-change',attachStyles);
})();