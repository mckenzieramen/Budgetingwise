/* Budgetingwise V37 — permanent premium SVG sprite + complete app-wide icon roles. */
(()=>{'use strict';
const FILE='./icons/budgetingwise-premium-icons.svg?v=37';
const aliases={salary:'wallet',notification:'bell',profile:'user',account:'user',dark:'moon',light:'sun',down:'income',up:'expense',pig:'savings',target:'goals',spark:'insights',bars:'analytics',reports:'analytics',categories:'list',customGoal:'analytics',alert:'expense',edit:'settings',delete:'logout',more:'others',appearance:'insights',preferences:'settings',privacy:'settings',download:'income',import:'income',backup:'savings',system:'dashboard'};
const available=new Set(['dashboard','transactions','analytics','goals','insights','settings','logout','search','bell','help','user','food','transport','shopping','bills','entertainment','health','education','others','wallet','income','expense','savings','home','laptop','travel','positive','suggestion','progress','calendar','list','pie']);
function resolve(name){name=aliases[name]||name;return available.has(name)?name:'dashboard'}
function svg(name,cls='bw-icon'){name=resolve(name);return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><use href="${FILE}#${name}"></use></svg>`}
window.BudgetingwiseIcons={file:FILE,svg,resolve,has:name=>available.has(resolve(name))};
})();