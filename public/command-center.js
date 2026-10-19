/* Budgetingwise Command Center — local UI navigation only. */
(()=>{'use strict';const pages=[['dashboard','Dashboard','Financial overview','▦'],['transactions','Transactions','Search and review money activity','▤'],['analytics','Analytics','Income and expense insights','▥'],['savings','Goals','Savings progress and milestones','◎'],['settings','Settings','Appearance and account','⚙']];
let index=0,opened=false,origin=null;
const $=id=>document.getElementById(id);
const palette=$('bwCommandPalette'),input=$('bwCommandInput'),results=$('bwCommandResults');
function visible(){return !$('dashboardView')?.classList.contains('hidden')}
function filtered(){const q=(input?.value||'').trim().toLowerCase();return pages.filter(p=>p.slice(1,3).join(' ').toLowerCase().includes(q))}
function render(){if(!results)return;const list=filtered();index=Math.min(index,Math.max(0,list.length-1));results.innerHTML=list.map((p,i)=>'<button type="button" class="bw-command-item'+(i===index?' selected':'')+'" data-command-page="'+p[0]+'" role="option" aria-selected="'+(i===index)+'"><span class="bw-command-icon">'+p[3]+'</span><span><strong>'+p[1]+'</strong><small>'+p[2]+'</small></span><kbd>↵</kbd></button>').join('')||'<p class="bw-command-empty">No matching pages. Try Dashboard or Analytics.</p>'}
function open(){if(!visible()||!palette)return;origin=document.activeElement;opened=true;palette.classList.remove('hidden');palette.setAttribute('aria-hidden','false');if(input)input.value='';index=0;render();input?.focus()}
function close(){if(!palette)return;opened=false;palette.classList.add('hidden');palette.setAttribute('aria-hidden','true');origin?.focus?.()}
function navigate(name){const btn=document.querySelector('#dashboardView .sidebar-nav [data-page="'+name+'"]');if(btn){btn.click();close()}}
document.addEventListener('DOMContentLoaded',()=>{
const search=$('dashboardSearch');if(search){search.setAttribute('placeholder','Search or press Ctrl + K');search.setAttribute('title','Open Command Center (Ctrl + K)');search.addEventListener('focus',()=>{if(visible())open()});search.addEventListener('click',()=>{if(visible())open()})}
$('bwCommandTrigger')?.addEventListener('click',open);$('bwCommandClose')?.addEventListener('click',close);
palette?.addEventListener('click',e=>{if(e.target===palette)close();const b=e.target.closest('[data-command-page]');if(b)navigate(b.dataset.commandPage)});
input?.addEventListener('input',()=>{index=0;render()});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(opened)close();else open();return}if(!opened)return;if(e.key==='Escape'){e.preventDefault();close()}else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const l=filtered();if(!l.length)return;index=(index+(e.key==='ArrowDown'?1:-1)+l.length)%l.length;render();results?.querySelector('.selected')?.scrollIntoView({block:'nearest'})}else if(e.key==='Enter'){e.preventDefault();const p=filtered()[index];if(p)navigate(p[0])}else if(e.key==='Tab'){const focusable=[input,...palette.querySelectorAll('#bwCommandClose,[data-command-page]')].filter(Boolean);const i=focusable.indexOf(document.activeElement);if(e.shiftKey&&i===0){e.preventDefault();focusable[focusable.length-1]?.focus()}else if(!e.shiftKey&&i===focusable.length-1){e.preventDefault();focusable[0]?.focus()}}});
});
})();
