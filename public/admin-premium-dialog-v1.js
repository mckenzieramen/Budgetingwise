const DIALOG_STYLE_ID='bw-premium-dialog-style';
let lastDialogSourceRect=null;

document.addEventListener('pointerdown',e=>{
  const el=e.target.closest('button,[role="button"],a');
  if(!el||el.closest('.bw-dialog'))return;
  const r=el.getBoundingClientRect();
  lastDialogSourceRect={left:r.left,top:r.top,width:r.width,height:r.height};
},true);

function ensureDialogStyle(){
  if(document.getElementById(DIALOG_STYLE_ID))return;
  const style=document.createElement('style');
  style.id=DIALOG_STYLE_ID;
  style.textContent=`
  .bw-dialog-backdrop{position:fixed;inset:0;z-index:999999;display:grid;place-items:center;padding:24px;background:rgba(20,18,39,.43);backdrop-filter:blur(9px) saturate(112%);-webkit-backdrop-filter:blur(9px) saturate(112%);opacity:0}
  .bw-dialog-backdrop.bw-ready{animation:bwDialogBackdropIn .34s cubic-bezier(.22,.72,.24,1) forwards}
  .bw-dialog-backdrop.bw-closing{animation:bwDialogBackdropOut .40s cubic-bezier(.32,.02,.48,1) forwards}
  .bw-dialog{position:relative;width:min(448px,calc(100vw - 32px));box-sizing:border-box;overflow:hidden;background:linear-gradient(180deg,rgba(255,255,255,.995),rgba(251,250,255,.995));border:1px solid rgba(105,76,235,.14);border-radius:24px;padding:26px;box-shadow:0 28px 90px rgba(24,20,54,.27),0 4px 18px rgba(69,48,159,.08);color:#171b31;transform-origin:var(--bw-origin-x,50%) var(--bw-origin-y,50%);will-change:transform,opacity;opacity:0}
  .bw-dialog-backdrop.bw-ready .bw-dialog{animation:bwDialogNativeIn .56s cubic-bezier(.2,.78,.22,1) both}
  .bw-dialog-backdrop.bw-closing .bw-dialog{animation:bwDialogNativeOut .40s cubic-bezier(.4,.05,.62,.2) both}
  .bw-dialog:before{content:'';position:absolute;left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,#7b61ff,#5b3fe6,#9b85ff)}
  .bw-dialog-top{display:flex;align-items:flex-start;gap:14px}.bw-dialog-copy{min-width:0;flex:1}
  .bw-dialog-icon{width:48px;height:48px;flex:0 0 48px;border-radius:15px;display:grid;place-items:center;background:linear-gradient(145deg,#f0edff,#faf9ff);color:#5c42e6;border:1px solid #ded7ff;box-shadow:0 8px 20px rgba(89,64,205,.10),inset 0 1px 0 #fff}
  .bw-dialog-icon.success{background:linear-gradient(145deg,#e8f8ef,#f5fff9);color:#0d8a59;border-color:#cdebdc}.bw-dialog-icon.danger{background:linear-gradient(145deg,#fff0f1,#fff8f8);color:#d53b49;border-color:#ffd4d9}.bw-dialog-icon svg{width:23px;height:23px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
  .bw-dialog h2{margin:2px 0 7px;font-size:18px;line-height:1.25;letter-spacing:-.025em;font-weight:900;color:#1d2238}.bw-dialog p{margin:0;color:#737c92;font-size:12px;line-height:1.6;white-space:pre-line}
  .bw-dialog-field{display:grid;gap:7px;margin-top:20px}.bw-dialog-field label{font-size:10px;font-weight:850;color:#4e566d}.bw-dialog-field input{width:100%;box-sizing:border-box;height:43px;border:1px solid #dddfea;border-radius:11px;background:#fff;padding:0 12px;color:#252a40;font:750 12px Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;outline:none;transition:border-color .18s ease,box-shadow .18s ease}.bw-dialog-field input:focus{border-color:#aa9aff;box-shadow:0 0 0 4px rgba(99,70,235,.09)}
  .bw-dialog-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:23px}.bw-dialog button{min-width:104px;height:40px;border-radius:11px;padding:0 16px;font-weight:850;font-size:11px;cursor:pointer;transition:transform .18s cubic-bezier(.2,.8,.2,1),box-shadow .18s ease,background .18s ease}.bw-dialog button:active{transform:scale(.985)}
  .bw-dialog-cancel{border:1px solid #e0e2eb;background:#fff;color:#5a6278}.bw-dialog-cancel:hover{background:#f8f9fc}.bw-dialog-primary{border:0;background:linear-gradient(135deg,#6d50f4,#5838df);color:#fff;box-shadow:0 8px 20px rgba(91,67,234,.22)}.bw-dialog-primary:hover{transform:translateY(-1px);box-shadow:0 11px 26px rgba(91,67,234,.28)}.bw-dialog-danger{border:0;background:linear-gradient(135deg,#e34d59,#c93443);color:#fff;box-shadow:0 8px 20px rgba(207,52,67,.19)}.bw-dialog-danger:hover{transform:translateY(-1px);box-shadow:0 11px 26px rgba(207,52,67,.25)}
  @keyframes bwDialogBackdropIn{0%{opacity:0}100%{opacity:1}}
  @keyframes bwDialogBackdropOut{0%{opacity:1}100%{opacity:0}}
  @keyframes bwDialogNativeIn{
    0%{opacity:0;transform:translate(var(--bw-source-x,0),var(--bw-source-y,14px)) scale(.84,.82)}
    42%{opacity:.82;transform:translate(calc(var(--bw-source-x,0)*.28),calc(var(--bw-source-y,14px)*.28)) scale(.965,.955)}
    72%{opacity:1;transform:translate(calc(var(--bw-source-x,0)*.06),calc(var(--bw-source-y,14px)*.06)) scale(1.006,.998)}
    100%{opacity:1;transform:none}
  }
  @keyframes bwDialogNativeOut{
    0%{opacity:1;transform:none}
    32%{opacity:.98;transform:translate(calc(var(--bw-source-x,0)*.08),calc(var(--bw-source-y,14px)*.08)) scale(.985,.98)}
    70%{opacity:.66;transform:translate(calc(var(--bw-source-x,0)*.55),calc(var(--bw-source-y,14px)*.55)) scale(.90,.86)}
    100%{opacity:0;transform:translate(var(--bw-source-x,0),var(--bw-source-y,14px)) scale(.82,.78)}
  }
  @media(max-width:520px){.bw-dialog-backdrop{padding:16px}.bw-dialog{padding:22px;border-radius:20px}.bw-dialog-top{gap:12px}.bw-dialog-icon{width:44px;height:44px;flex-basis:44px}.bw-dialog-actions{flex-direction:column-reverse}.bw-dialog button{width:100%}}
  @media(prefers-reduced-motion:reduce){.bw-dialog-backdrop,.bw-dialog-backdrop.bw-ready,.bw-dialog-backdrop.bw-closing,.bw-dialog,.bw-dialog-backdrop.bw-ready .bw-dialog,.bw-dialog-backdrop.bw-closing .bw-dialog{animation:none!important;opacity:1!important;transform:none!important}}
  `;
  document.head.appendChild(style);
}

function iconSvg(kind){
  if(kind==='success')return '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.6 2.6L16.5 9"/></svg>';
  if(kind==='danger')return '<svg viewBox="0 0 24 24"><path d="M12 3.5 20.5 19H3.5L12 3.5Z"/><path d="M12 9v4M12 16.5h.01"/></svg>';
  if(kind==='edit')return '<svg viewBox="0 0 24 24"><path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-4-4L4 16z"/><path d="m13.5 6.5 4 4"/></svg>';
  return '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg>';
}

function baseDialog({title,message,kind='info',confirmText='OK',cancelText='',danger=false,input=null}){
  ensureDialogStyle();
  return new Promise(resolve=>{
    const source=lastDialogSourceRect;
    lastDialogSourceRect=null;
    const backdrop=document.createElement('div');
    backdrop.className='bw-dialog-backdrop';
    backdrop.innerHTML=`<section class="bw-dialog" role="dialog" aria-modal="true" aria-labelledby="bwDialogTitle"><div class="bw-dialog-top"><div class="bw-dialog-icon ${kind}">${iconSvg(kind)}</div><div class="bw-dialog-copy"><h2 id="bwDialogTitle"></h2><p></p></div></div>${input?'<div class="bw-dialog-field"><label></label><input></div>':''}<div class="bw-dialog-actions">${cancelText?'<button type="button" class="bw-dialog-cancel"></button>':''}<button type="button" class="${danger?'bw-dialog-danger':'bw-dialog-primary'}"></button></div></section>`;
    backdrop.querySelector('h2').textContent=title;
    backdrop.querySelector('p').textContent=message;
    const field=input?backdrop.querySelector('.bw-dialog-field'):null;
    const inputEl=field?.querySelector('input')||null;
    if(field&&inputEl){field.querySelector('label').textContent=input.label||'Value';inputEl.value=input.value??'';inputEl.placeholder=input.placeholder||'';inputEl.type=input.type||'text';if(input.autocomplete)inputEl.autocomplete=input.autocomplete}
    const dialog=backdrop.querySelector('.bw-dialog');
    const confirmBtn=backdrop.querySelector(danger?'.bw-dialog-danger':'.bw-dialog-primary');
    confirmBtn.textContent=confirmText;
    const cancelBtn=backdrop.querySelector('.bw-dialog-cancel');
    if(cancelBtn)cancelBtn.textContent=cancelText;
    document.body.appendChild(backdrop);
    requestAnimationFrame(()=>{
      const d=dialog.getBoundingClientRect();
      const src=source||{left:window.innerWidth/2-1,top:window.innerHeight/2-1,width:2,height:2};
      const sourceX=src.left+src.width/2-(d.left+d.width/2);
      const sourceY=src.top+src.height/2-(d.top+d.height/2);
      dialog.style.setProperty('--bw-source-x',`${Math.round(sourceX)}px`);
      dialog.style.setProperty('--bw-source-y',`${Math.round(sourceY)}px`);
      dialog.style.setProperty('--bw-origin-x',`${Math.max(0,Math.min(d.width,src.left+src.width/2-d.left))}px`);
      dialog.style.setProperty('--bw-origin-y',`${Math.max(0,Math.min(d.height,src.top+src.height/2-d.top))}px`);
      void dialog.offsetWidth;
      backdrop.classList.add('bw-ready');
      setTimeout(()=>inputEl?inputEl.focus():confirmBtn.focus(),150);
    });
    let finished=false;
    const finish=value=>{
      if(finished)return;
      finished=true;
      document.removeEventListener('keydown',onKey);
      backdrop.classList.remove('bw-ready');
      backdrop.classList.add('bw-closing');
      const done=()=>{backdrop.remove();resolve(value)};
      if(matchMedia('(prefers-reduced-motion: reduce)').matches)done();else setTimeout(done,410);
    };
    const onKey=e=>{if(e.key==='Escape'&&cancelText)finish(input?null:false);if(e.key==='Enter'&&inputEl&&document.activeElement===inputEl)finish(inputEl.value)};
    confirmBtn.addEventListener('click',()=>finish(inputEl?inputEl.value:true));
    cancelBtn?.addEventListener('click',()=>finish(input?null:false));
    backdrop.addEventListener('click',e=>{if(e.target===backdrop&&cancelText)finish(input?null:false)});
    document.addEventListener('keydown',onKey);
  });
}

window.bwAlert=(message,title='Budgetingwise')=>baseDialog({title,message:String(message||''),kind:'success',confirmText:'Done'});
window.bwError=(message,title='Something went wrong')=>baseDialog({title,message:String(message||''),kind:'danger',confirmText:'OK',danger:true});
window.bwConfirm=(message,{title='Please confirm',confirmText='Confirm',danger=false}={})=>baseDialog({title,message:String(message||''),kind:danger?'danger':'info',confirmText,cancelText:'Cancel',danger});
window.bwPrompt=(message,{title='Update information',label='Value',value='',placeholder='',type='text',confirmText='Save'}={})=>baseDialog({title,message:String(message||''),kind:'edit',confirmText,cancelText:'Cancel',input:{label,value,placeholder,type}});
