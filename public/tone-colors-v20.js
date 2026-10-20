/* Budgetingwise V25 — reliable 1/2/3 tone switching with harmonious color families. */
(function(){
'use strict';
const KEY='budgetingwise-tone-colors-v25';
const palettes={violet:['#6536f5','#8b68f7','#ad96fa'],ocean:['#1686e9','#38a4ec','#67c0ef'],emerald:['#08a68a','#2db99e','#68ccb8'],rose:['#e84b97','#ed70aa','#f39ac2'],sunset:['#f57c34','#f79658','#f9b17e'],midnight:['#34477f','#536596','#7a89ae'],crimson:['#e64263','#eb6680','#f08da0'],teal:['#00a8b6','#2db9c4','#67cbd2']};
const $=s=>document.querySelector(s);let custom={};try{custom=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
function prefs(){try{return JSON.parse(localStorage.getItem('budgetingwise-settings-v15')||'{}')}catch(e){return {}}}
function selectedStyle(){const active=document.querySelector('.bw-gradient-row [data-style].active');return active?.dataset.style||$('#dashboardView')?.dataset.themeStyle||prefs().style||'solid'}
function palette(){const id=prefs().palette||'violet';return palettes[id]||palettes.violet}
function count(s){return s==='triple'?3:s==='dual'?2:1}
function storageKey(s){return `${prefs().palette||'violet'}:${s}`}
function colors(s=selectedStyle()){const base=palette().slice(0,count(s)),saved=custom[storageKey(s)];return Array.isArray(saved)&&saved.length===base.length?saved:base}
function apply(s=selectedStyle()){
 const dash=$('#dashboardView');if(!dash)return;const arr=colors(s),a=arr[0],b=arr[1]||a,c=arr[2]||b;
 const g=s==='solid'?`linear-gradient(115deg,${a},${a})`:s==='dual'?`linear-gradient(115deg,${a} 0%,${b} 100%)`:`linear-gradient(115deg,${a} 0%,${b} 52%,${c} 100%)`;
 dash.dataset.themeStyle=s;
 [['--bw-user-accent',a],['--bw-user-accent-2',b],['--bw-user-accent-3',c],['--bw-user-gradient',g],['--bw-adaptive-accent',a],['--bw-adaptive-action',a],['--bw-adaptive-secondary',b],['--bw-adaptive-third',c],['--bw-adaptive-gradient',g],['--theme-accent',a],['--theme-dark',b],['--theme-light',c],['--theme-gradient',g],['--bw-brand-chart',a],['--bw-brand-chart-alt',b],['--bw-brand-chart-third',c],['--sv-accent',a]].forEach(([k,v])=>dash.style.setProperty(k,v));
 const preview=$('#bwPreview');if(preview){preview.style.setProperty('--sv-accent',a);preview.style.setProperty('--preview-gradient',g);preview.style.setProperty('--preview-surface-2',b)}
 render(s);
}
function render(s=selectedStyle()){
 const row=$('.bw-gradient-row');if(!row)return;let panel=$('#bwToneColorOptions');if(!panel){panel=document.createElement('div');panel.id='bwToneColorOptions';panel.className='bw-tone-color-options';row.after(panel)}
 const arr=colors(s),labels=s==='solid'?['Main color']:s==='dual'?['Primary color','Secondary color']:['Primary color','Secondary color','Highlight color'];
 panel.dataset.toneCount=String(labels.length);
 panel.innerHTML=`<div class="bw-tone-options-head"><strong>${labels.length} Tone colors</strong><small>${labels.length===1?'One focused brand color':'Harmonious colors from the same family'}</small></div><div class="bw-tone-pickers">${labels.map((label,i)=>`<label><span>${label}</span><div><i style="background:${arr[i]}"></i><input class="bw-tone-hex" data-tone-index="${i}" value="${arr[i]}" maxlength="7"><input class="bw-tone-picker" data-tone-index="${i}" type="color" value="${arr[i]}" aria-label="${label}"></div></label>`).join('')}</div>`;
}
function setColor(i,v){if(!/^#[0-9a-f]{6}$/i.test(v))return;const s=selectedStyle(),arr=colors(s);arr[i]=v;custom[storageKey(s)]=arr;try{localStorage.setItem(KEY,JSON.stringify(custom))}catch(e){}apply(s)}
/* Capture the clicked option immediately. Do not wait for another script's stored preference to catch up. */
document.addEventListener('click',e=>{const btn=e.target.closest('.bw-gradient-row [data-style]');if(!btn)return;const s=btn.dataset.style;if(!['solid','dual','triple'].includes(s))return;document.querySelectorAll('.bw-gradient-row [data-style]').forEach(x=>x.classList.toggle('active',x===btn));const dash=$('#dashboardView');if(dash)dash.dataset.themeStyle=s;render(s);apply(s)},true);
document.addEventListener('input',e=>{if(e.target.matches('.bw-tone-picker'))setColor(Number(e.target.dataset.toneIndex),e.target.value)});
document.addEventListener('change',e=>{if(e.target.matches('.bw-tone-hex'))setColor(Number(e.target.dataset.toneIndex),e.target.value)});
window.addEventListener('budgetingwise:theme-change',()=>setTimeout(()=>apply(selectedStyle()),0));
function brand(){const logo=$('.sidebar-logo');if(!logo)return;const subtitle=logo.querySelector('small');if(subtitle)subtitle.textContent='PERSONAL FINANCE & WEALTH';logo.setAttribute('aria-label','Budgetingwise — Personal Finance & Wealth')}
function init(){brand();apply(selectedStyle())}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();