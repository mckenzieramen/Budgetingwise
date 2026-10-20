/* Budgetingwise Contrast Control V21 — makes the Advanced contrast slider functional. */
(function(){
'use strict';
const STORAGE='budgetingwise-settings-v15';
function clamp(n,min,max){return Math.max(min,Math.min(max,n))}
function apply(value){
  const dash=document.getElementById('dashboardView');
  if(!dash)return;
  const contrast=clamp(Number(value)||60,40,100);
  /* 60 is the visual baseline. Range becomes 0.80x -> 1.40x. */
  const factor=(contrast+40)/100;
  dash.style.setProperty('--bw-contrast-filter',factor.toFixed(2));
  const preview=document.getElementById('bwPreview');
  if(preview)preview.style.setProperty('--bw-contrast-filter',factor.toFixed(2));
}
function read(){try{return JSON.parse(localStorage.getItem(STORAGE)||'{}').contrast??60}catch(e){return 60}}
window.addEventListener('budgetingwise:theme-change',e=>apply(e.detail?.contrast??read()));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>apply(read()));else apply(read());
})();
