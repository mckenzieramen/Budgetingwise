/* Budgetingwise V41 — exact reference-image icon atlas. No redrawn SVG icons. */
(()=>{'use strict';
const PARTS=['./icons/exact-atlas-01.txt?v=41','./icons/exact-atlas-02.txt?v=41'];
const aliases={salary:'wallet',notification:'bell',profile:'user',account:'user',down:'income',up:'expense',pig:'savings',target:'goals',spark:'insights',bars:'analytics',reports:'analytics',categories:'others',customGoal:'analytics',alert:'alert',appearance:'appearance',preferences:'preferences',privacy:'privacy',download:'import',backup:'backup',system:'system',dark:'dark',light:'light',edit:'edit',delete:'delete',more:'others'};
const names=['dashboard','transactions','analytics','goals','insights','settings','logout','search','bell','help','user','food','transport','shopping','bills','entertainment','health','education','others','wallet','income','expense','savings','home','laptop','travel','positive','suggestion','progress','alert','edit','delete','appearance','preferences','privacy','import','backup','dark','light','system'];
const index=Object.fromEntries(names.map((n,i)=>[n,i]));let atlas='';
const ready=Promise.all(PARTS.map(p=>fetch(p).then(r=>{if(!r.ok)throw new Error('Icon atlas unavailable');return r.text()}))).then(parts=>{atlas='data:image/webp;base64,'+parts.join('').replace(/\s+/g,'');document.dispatchEvent(new Event('budgetingwise:icons-ready'));return atlas}).catch(e=>{console.warn('Exact icon atlas could not load:',e);return''});
function resolve(n){n=aliases[n]||n;return Object.prototype.hasOwnProperty.call(index,n)?n:'dashboard'}
function svg(name,cls='bw-icon'){name=resolve(name);const i=index[name],cols=8,rows=5,x=i%cols,y=Math.floor(i/cols);return `<span class="${cls} bw-atlas-icon" data-bw-icon="${name}" style="--bw-ix:${x};--bw-iy:${y};--bw-cols:${cols};--bw-rows:${rows}" aria-hidden="true"></span>`}
function applyAtlas(){if(!atlas)return;document.documentElement.style.setProperty('--bw-exact-icon-atlas',`url("${atlas}")`)}
ready.then(applyAtlas);document.addEventListener('budgetingwise:icons-ready',applyAtlas);
window.BudgetingwiseIcons={file:PARTS.join(','),svg,resolve,has:n=>Object.prototype.hasOwnProperty.call(index,resolve(n)),ready};
})();