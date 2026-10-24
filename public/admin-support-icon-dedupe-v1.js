(()=>{'use strict';
const root=()=>document.getElementById('adminSupportPanel');
function dedupe(el){const icons=[...el.querySelectorAll(':scope > .bws-premium-icon,:scope > .bws-final-icon')];if(icons.length<2)return;const keep=icons.find(x=>x.classList.contains('bws-premium-icon'))||icons[0];icons.forEach(x=>{if(x!==keep)x.remove()})}
function run(){const r=root();if(!r)return;r.querySelectorAll('.bws-actions-grid button,.bws-quick-grid-v3 button,.bws-final-quick-grid button,.bws-section-title>strong,.bws-card-head-v3>strong,.bws-final-overview-head>strong').forEach(dedupe)}
let timer=0;const schedule=()=>{clearTimeout(timer);timer=setTimeout(run,30)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('click',e=>{if(e.target.closest('#adminSupportPanel,#adminSupportNav'))setTimeout(run,40)},true);
setInterval(run,1000);
})();