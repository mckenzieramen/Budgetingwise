const DIALOG_STYLE_ID='bw-premium-dialog-style';

function ensureDialogStyle(){
  if(document.getElementById(DIALOG_STYLE_ID))return;
  const style=document.createElement('style');
  style.id=DIALOG_STYLE_ID;
  style.textContent=`
  .bw-dialog-backdrop{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:20px;background:rgba(17,16,39,.48);backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px);animation:bwFade .18s ease}
  .bw-dialog{width:min(430px,calc(100vw - 32px));box-sizing:border-box;background:rgba(255,255,255,.98);border:1px solid rgba(91,67,234,.13);border-radius:24px;padding:28px;box-shadow:0 30px 90px rgba(23,20,47,.28);color:#151b35;animation:bwPop .22s cubic-bezier(.2,.8,.2,1)}
  .bw-dialog-icon{width:54px;height:54px;border-radius:17px;display:grid;place-items:center;margin-bottom:18px;background:linear-gradient(135deg,#eeeaff,#f8f6ff);color:#5b43ea;border:1px solid #e1dcff}
  .bw-dialog-icon.success{background:#e8f8ef;color:#07884a;border-color:#d2f0df}.bw-dialog-icon.danger{background:#fff0f0;color:#d62828;border-color:#ffdada}.bw-dialog-icon svg{width:25px;height:25px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
  .bw-dialog h2{margin:0 0 8px;font-size:21px;line-height:1.25;letter-spacing:-.02em}.bw-dialog p{margin:0;color:#737c96;font-size:13px;line-height:1.65;white-space:pre-line}.bw-dialog-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:24px}.bw-dialog button{min-width:96px;border-radius:11px;padding:11px 16px;font-weight:800;font-size:12px;cursor:pointer}.bw-dialog-cancel{border:1px solid #e0e2ec;background:#fff;color:#525b75}.bw-dialog-primary{border:0;background:linear-gradient(90deg,#5b43ea,#755cf4);color:#fff;box-shadow:0 8px 20px rgba(91,67,234,.22)}.bw-dialog-danger{border:0;background:linear-gradient(90deg,#d93636,#ef5b5b);color:#fff;box-shadow:0 8px 20px rgba(217,54,54,.18)}
  @keyframes bwFade{from{opacity:0}to{opacity:1}}@keyframes bwPop{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}
  @media(max-width:520px){.bw-dialog{padding:22px;border-radius:20px}.bw-dialog-actions{flex-direction:column-reverse}.bw-dialog button{width:100%}}
  `;
  document.head.appendChild(style);
}

function iconSvg(kind){
  if(kind==='success')return '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.6 2.6L16.5 9"/></svg>';
  if(kind==='danger')return '<svg viewBox="0 0 24 24"><path d="M12 3 2.8 19h18.4L12 3Z"/><path d="M12 9v4M12 17h.01"/></svg>';
  return '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg>';
}

function showDialog({title,message,kind='info',confirmText='OK',cancelText='',danger=false}){
  ensureDialogStyle();
  return new Promise(resolve=>{
    const backdrop=document.createElement('div');
    backdrop.className='bw-dialog-backdrop';
    backdrop.innerHTML=`<section class="bw-dialog" role="dialog" aria-modal="true" aria-labelledby="bwDialogTitle"><div class="bw-dialog-icon ${kind}">${iconSvg(kind)}</div><h2 id="bwDialogTitle"></h2><p></p><div class="bw-dialog-actions">${cancelText?'<button type="button" class="bw-dialog-cancel"></button>':''}<button type="button" class="${danger?'bw-dialog-danger':'bw-dialog-primary'}"></button></div></section>`;
    backdrop.querySelector('h2').textContent=title;
    backdrop.querySelector('p').textContent=message;
    const buttons=backdrop.querySelectorAll('button');
    const confirmBtn=buttons[buttons.length-1];
    confirmBtn.textContent=confirmText;
    const finish=value=>{backdrop.remove();resolve(value)};
    confirmBtn.addEventListener('click',()=>finish(true));
    if(cancelText){const cancelBtn=backdrop.querySelector('.bw-dialog-cancel');cancelBtn.textContent=cancelText;cancelBtn.addEventListener('click',()=>finish(false));}
    backdrop.addEventListener('click',e=>{if(e.target===backdrop&&cancelText)finish(false)});
    const onKey=e=>{if(e.key==='Escape'&&cancelText){document.removeEventListener('keydown',onKey);finish(false)}};document.addEventListener('keydown',onKey,{once:false});
    document.body.appendChild(backdrop);
    requestAnimationFrame(()=>confirmBtn.focus());
  });
}

window.bwAlert=(message,title='Budgetingwise')=>showDialog({title,message:String(message||''),kind:'success',confirmText:'Done'});
window.bwError=(message,title='Something went wrong')=>showDialog({title,message:String(message||''),kind:'danger',confirmText:'OK',danger:true});
window.bwConfirm=(message,{title='Please confirm',confirmText='Confirm',danger=false}={})=>showDialog({title,message:String(message||''),kind:danger?'danger':'info',confirmText,cancelText:'Cancel',danger});
