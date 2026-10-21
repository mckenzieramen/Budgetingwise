let premiumActionReplay=false;

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function dialogsReady(){
  for(let i=0;i<40&&!window.bwConfirm;i++)await sleep(50);
  return Boolean(window.bwConfirm);
}

// Route legacy success/error alerts into the Budgetingwise premium dialog.
window.alert=message=>{
  if(window.bwAlert)window.bwAlert(String(message||''),'Budgetingwise');
};

// A confirmed premium action is replayed once. The existing admin action handler
// then receives a one-time YES instead of opening the browser's native confirm box.
const nativeConfirm=window.confirm.bind(window);
window.confirm=message=>premiumActionReplay?true:nativeConfirm(message);

document.addEventListener('click',async event=>{
  const button=event.target.closest('[data-force-logout],[data-delete-client],[data-toggle-status]');
  if(!button||premiumActionReplay)return;
  if(!await dialogsReady())return;

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  const row=button.closest('.client-row');
  const drawer=document.getElementById('drawerContent');
  const name=row?.querySelector('.client-name')?.textContent?.trim()||drawer?.querySelector('.drawer-profile h3')?.textContent?.trim()||'this customer';

  let options;
  if(button.matches('[data-delete-client]')){
    options={title:'Delete customer account?',message:`You are about to permanently delete ${name}. Their Budgetingwise profile, transactions and goals will be removed. This cannot be undone.`,confirmText:'Delete permanently',danger:true};
  }else if(button.matches('[data-force-logout]')){
    options={title:'Log out customer?',message:`This will suspend ${name} and block customer access until the account is activated again.`,confirmText:'Log out & suspend',danger:true};
  }else{
    const suspending=(button.textContent||'').toLowerCase().includes('suspend')||row?.querySelector('.status-active');
    options=suspending
      ?{title:'Suspend customer?',message:`${name} will no longer be able to access the customer portal until the account is activated again.`,confirmText:'Suspend account',danger:true}
      :{title:'Activate customer?',message:`${name} will regain access to the Budgetingwise customer portal.`,confirmText:'Activate account',danger:false};
  }

  const approved=await window.bwConfirm(options.message,{title:options.title,confirmText:options.confirmText,danger:options.danger});
  if(!approved)return;

  premiumActionReplay=true;
  try{button.click()}finally{setTimeout(()=>{premiumActionReplay=false},1200)}
},true);
