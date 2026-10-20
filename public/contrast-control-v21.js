/* Budgetingwise Contrast Control V22 — art-directed value, depth and hierarchy. */
(function(){
'use strict';
const STORAGE='budgetingwise-settings-v15';
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const hexToRgb=hex=>{const h=String(hex||'').replace('#','');if(!/^[0-9a-f]{6}$/i.test(h))return null;return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16))};
const rgbToHex=rgb=>'#'+rgb.map(v=>clamp(Math.round(v),0,255).toString(16).padStart(2,'0')).join('');
const mix=(a,b,t)=>{const x=hexToRgb(a),y=hexToRgb(b);if(!x||!y)return a;return rgbToHex(x.map((v,i)=>v*(1-t)+y[i]*t))};
const luminance=hex=>{const rgb=hexToRgb(hex);if(!rgb)return .5;const c=rgb.map(v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
function readPrefs(){try{return JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch(e){return {}}}
function apply(value){
 const dash=document.getElementById('dashboardView');if(!dash)return;
 const prefs=readPrefs(),contrast=clamp(Number(value)||60,40,100),t=(contrast-40)/60;
 const cs=getComputedStyle(dash),bg=(prefs.background||cs.getPropertyValue('--bw-user-bg').trim()||'#f6f5ff'),fg=(prefs.foreground||cs.getPropertyValue('--bw-user-text').trim()||'#17224a'),accent=cs.getPropertyValue('--bw-user-accent').trim()||'#6536f5';
 const dark=luminance(bg)<.34,anchor=dark?'#ffffff':'#000000',opposite=dark?'#000000':'#ffffff';
 /* Value: low contrast stays soft; high contrast creates a deliberate light/dark hierarchy. */
 const text=mix(fg,anchor,.08+t*.34),muted=mix(text,bg,.38-t*.16),surface=mix(bg,opposite,dark?(.055+t*.075):(.72+t*.24)),surface2=mix(bg,opposite,dark?(.10+t*.10):(.58+t*.31)),border=mix(bg,accent,.16+t*.26),soft=mix(surface,accent,.035+t*.10);
 const shadowAlpha=(.06+t*.12).toFixed(2),shadowY=Math.round(5+t*8),shadowBlur=Math.round(18+t*20);
 const vars={'--bw-user-text':text,'--bw-brand-ink':text,'--bw-user-muted':muted,'--bw-brand-ink-muted':muted,'--bw-user-surface':surface,'--bw-brand-surface':surface,'--bw-brand-card':surface,'--bw-user-surface-2':surface2,'--bw-brand-surface-alt':surface2,'--bw-user-border':border,'--bw-brand-divider':border,'--bw-user-soft':soft,'--bw-art-shadow':`0 ${shadowY}px ${shadowBlur}px rgb(20 28 60 / ${shadowAlpha})`,'--bw-art-highlight':dark?'rgba(255,255,255,.07)':'rgba(255,255,255,.72)','--bw-art-depth':String(t.toFixed(2))};
 Object.entries(vars).forEach(([k,v])=>dash.style.setProperty(k,v));
 dash.dataset.artContrast=contrast<55?'soft':contrast<76?'balanced':'bold';
 const preview=document.getElementById('bwPreview');if(preview){preview.style.setProperty('--preview-text',text);preview.style.setProperty('--preview-muted',muted);preview.style.setProperty('--preview-surface',surface);preview.style.setProperty('--preview-surface-2',surface2);preview.style.setProperty('--preview-border',border)}
}
function read(){return readPrefs().contrast??60}
window.addEventListener('budgetingwise:theme-change',e=>apply(e.detail?.contrast??read()));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>apply(read()));else apply(read());
})();
