(()=>{'use strict';
const q=(s,p=document)=>p.querySelector(s);
let running=false;

function cellValue(labelPattern){
  const drawer=q('#adminSupportPanel .bws-stable-drawer-v3');
  if(!drawer)return'';
  for(const cell of drawer.querySelectorAll('.bws-v3-cell')){
    const label=(cell.querySelector('span')?.textContent||'').trim();
    if(labelPattern.test(label))return (cell.querySelector('b')?.textContent||'').trim()
  }
  return''
}

async function ensureDialogs(){
  for(let i=0;i<40&&!window.bwConfirm;i++)await new Promise(r=>setTimeout(r,25));
  return Boolean(window.bwConfirm&&window.bwPrompt)
}

function invokeLegacy(action,{confirms=true,prompts=[]}={}){
  const hidden=q(`#bwsProfileExtras [data-aa="${action}"]`);
  if(!hidden)return false;
  const oldConfirm=window.confirm,oldPrompt=window.prompt;
  let index=0;
  try{
    window.confirm=()=>confirms;
    window.prompt=()=>prompts[index++]??null;
    hidden.click();
    return true
  }finally{
    window.confirm=oldConfirm;
    window.prompt=oldPrompt
  }
}

async function handle(action,button){
  if(running)return;
  running=true;
  try{
    if(!await ensureDialogs())return;
    if(action==='suspend'){
      const restoring=/unsuspend|restore/i.test(button.textContent||'');
      const ok=await window.bwConfirm(
        restoring?'This will restore access to the customer account.':'The customer will be blocked from normal account access until you restore the account.',
        {title:restoring?'Restore customer account?':'Suspend customer account?',confirmText:restoring?'Restore account':'Suspend account',danger:!restoring}
      );
      if(ok)invokeLegacy(action,{confirms:true});
      return
    }
    if(action==='signout'){
      const ok=await window.bwConfirm('The customer will be required to sign in again on their next session refresh.',{title:'Force customer sign out?',confirmText:'Force sign out',danger:true});
      if(ok)invokeLegacy(action,{confirms:true});
      return
    }
    if(action==='key'){
      const ok=await window.bwConfirm('A new activation email will be sent to the registered customer email. If the account is already activated, this may return it to activation mode.',{title:'Resend activation key?',confirmText:'Resend key'});
      if(ok)invokeLegacy(action,{confirms:true});
      return
    }
    if(action==='bid'){
      const current=cellValue(/budget id/i).replace(/^—$/,'');
      const value=await window.bwPrompt('Enter the customer’s new Budget ID. The existing account and support history will remain linked.',{title:'Change Budget ID',label:'Budget ID',value:current,placeholder:'BID00000',confirmText:'Update BID'});
      if(value!==null)invokeLegacy(action,{prompts:[value]});
      return
    }
    if(action==='email'){
      const current=cellValue(/^email$/i).replace(/^—$/,'');
      const value=await window.bwPrompt('Enter the new login email for this customer account.',{title:'Edit login email',label:'Login email',value:current,placeholder:'customer@email.com',type:'email',confirmText:'Update email'});
      if(value!==null)invokeLegacy(action,{prompts:[value]});
      return
    }
    if(action==='profile'){
      const name=cellValue(/customer name/i).replace(/^—$/,'').trim();
      const parts=name?name.split(/\s+/):[];
      const firstDefault=parts.length>1?parts.slice(0,-1).join(' '):(parts[0]||'');
      const lastDefault=parts.length>1?parts.at(-1):'';
      const first=await window.bwPrompt('Update the customer’s first name.',{title:'Edit customer profile',label:'First name',value:firstDefault,confirmText:'Continue'});
      if(first===null)return;
      const last=await window.bwPrompt('Update the customer’s last name.',{title:'Edit customer profile',label:'Last name',value:lastDefault,confirmText:'Save profile'});
      if(last!==null)invokeLegacy(action,{prompts:[first,last]});
    }
  }finally{running=false}
}

document.addEventListener('click',e=>{
  if(running)return;
  const button=e.target.closest('#adminSupportPanel .bws-stable-drawer-v3 [data-act]');
  const action=button?.dataset.act||'';
  if(!['suspend','signout','key','bid','email','profile'].includes(action))return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  handle(action,button).catch(err=>{console.warn('Premium support dialog:',err);window.bwError?.(err?.message||'Unable to complete this action.')})
},true);
})();
