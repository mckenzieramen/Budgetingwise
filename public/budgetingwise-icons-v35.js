/* Budgetingwise V36 — one permanent SVG sprite in /public/icons is the source of truth. */
(()=>{'use strict';
const FILE='./icons/budgetingwise-premium-icons.svg?v=36';
const aliases={salary:'wallet',notification:'bell',profile:'user',dark:'moon',light:'sun',down:'income',up:'expense',pig:'savings',target:'goals',spark:'insights',bars:'analytics'};
const available=new Set(['dashboard','transactions','analytics','goals','insights','settings','logout','search','bell','help','user','food','transport','shopping','bills','entertainment','health','education','others','wallet','income','expense','savings','home','laptop','travel','positive','suggestion','progress','calendar','list','pie']);
function svg(name,cls='bw-icon'){name=aliases[name]||name;if(!available.has(name))name='dashboard';return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><use href="${FILE}#${name}"></use></svg>`}
window.BudgetingwiseIcons={file:FILE,svg,has:name=>available.has(aliases[name]||name)};
})();