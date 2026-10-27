/* Budgetingwise dashboard reset — navigation remains; page content intentionally empty for rebuild. */
(()=>{'use strict';
const page=document.getElementById('page-dashboard');
if(page){
  page.className='page';
  page.replaceChildren();
}
})();
