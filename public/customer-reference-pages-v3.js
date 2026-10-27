/* Budgetingwise customer pages reset — navigation remains; page content intentionally empty for rebuild. */
(()=>{'use strict';
for(const id of ['transactions','analytics','savings','insights','settings']){
  const page=document.getElementById('page-'+id);
  if(page) page.replaceChildren();
}
})();
