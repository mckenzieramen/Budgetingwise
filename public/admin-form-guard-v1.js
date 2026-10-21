(()=>{'use strict';
const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
const pick=()=>{const a=new Uint32Array(1);crypto.getRandomValues(a);return alphabet[a[0]%alphabet.length]};
const makePassword=()=>`Bw!${Array.from({length:10},pick).join('')}${Math.floor(10+Math.random()*90)}`;
function apply(){
  const form=document.getElementById('createUserForm'),email=document.getElementById('newEmail'),password=document.getElementById('newTempPassword'),generate=document.getElementById('generatePassword'),count=document.getElementById('clientCountLabel');
  if(count)count.textContent='';
  const heading=document.querySelector('#clientsPanel .table-head h3');if(heading)heading.childNodes[0].nodeValue='Clients ';
  if(!form||!email||!password)return;
  form.setAttribute('autocomplete','off');
  email.setAttribute('autocomplete','off');email.setAttribute('data-lpignore','true');email.setAttribute('data-1p-ignore','true');
  password.setAttribute('autocomplete','new-password');password.setAttribute('data-lpignore','true');password.setAttribute('data-1p-ignore','true');
  if(!form.dataset.bwCleaned){email.value='';password.value=makePassword();form.dataset.bwCleaned='1'}
  if(generate&&!generate.dataset.bwRandom){generate.dataset.bwRandom='1';generate.addEventListener('click',()=>{requestAnimationFrame(()=>{password.value=makePassword()})},{capture:true})}
  form.addEventListener('reset',()=>requestAnimationFrame(()=>{email.value='';password.value=makePassword()}),{once:false});
}
apply();
new MutationObserver(apply).observe(document.getElementById('adminApp')||document.body,{childList:true,subtree:true});
})();