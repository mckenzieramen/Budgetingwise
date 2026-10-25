/* Budgetingwise Reference UI Loader V3 — approved seven-tab customer experience. */
import './customer-reference-pages-v3.js?v=reference-pages-v3';
import './customer-reference-data-v3.js?v=reference-data-v3';
import './customer-reference-plan-v3.js?v=reference-plan-v3';

(()=>{'use strict';
const STYLE_ID='bwCustomerReferenceV3';
function attachStyle(){let link=document.getElementById(STYLE_ID);if(!link){link=document.createElement('link');link.id=STYLE_ID;link.rel='stylesheet';link.href='./customer-reference-ui-v3.css?v=reference-ui-v3';document.head.appendChild(link);return}document.head.appendChild(link)}
attachStyle();
// Legacy customer styles are injected later by boot.js. Re-appending this link after load
// guarantees that the approved reference remains the final visual authority without changing data logic.
window.addEventListener('load',()=>requestAnimationFrame(attachStyle),{once:true});
document.getElementById('dashboardView')?.addEventListener('budgetingwise:page-change',()=>{const link=document.getElementById(STYLE_ID);if(link&&link!==document.head.lastElementChild)document.head.appendChild(link)});
})();