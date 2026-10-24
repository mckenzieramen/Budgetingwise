(()=>{'use strict';
const $=(s,p=document)=>p.querySelector(s);
function css(){if($('#bwsTicketModalPolishCss'))return;const s=document.createElement('style');s.id='bwsTicketModalPolishCss';s.textContent=`
.bws-modal{background:rgba(24,22,40,.54)!important;backdrop-filter:blur(7px)!important;-webkit-backdrop-filter:blur(7px)!important;padding:24px!important}
.bws-modal>section{width:min(600px,calc(100vw - 32px))!important;max-height:min(760px,90vh)!important;overflow:hidden!important;border:1px solid rgba(222,218,242,.9)!important;border-radius:20px!important;background:#fff!important;box-shadow:0 30px 90px rgba(25,20,54,.26)!important;display:flex!important;flex-direction:column!important}
.bws-modal header{position:relative!important;display:flex!important;align-items:flex-start!important;justify-content:space-between!important;gap:18px!important;padding:20px 20px 17px!important;border-bottom:1px solid #ececf3!important;background:linear-gradient(180deg,#fff,#fcfbff)!important}
.bws-modal header>div{min-width:0!important;display:block!important}
.bws-modal header strong{display:block!important;margin:0!important;color:#20243a!important;font-size:15px!important;line-height:1.25!important;font-weight:900!important;letter-spacing:-.15px!important}
.bws-modal header small{display:block!important;margin-top:5px!important;color:#7f879b!important;font-size:9px!important;line-height:1.4!important;font-weight:600!important}
.bws-modal header [data-close]{flex:0 0 32px!important;width:32px!important;height:32px!important;border:1px solid #e7e5ef!important;border-radius:9px!important;background:#f8f8fb!important;color:#596075!important;font-size:20px!important;line-height:1!important;display:grid!important;place-items:center!important;cursor:pointer!important;transition:.16s ease!important}
.bws-modal header [data-close]:hover{background:#f0edff!important;border-color:#d8d1fb!important;color:#583dd3!important;transform:translateY(-1px)!important}
.bws-modal .bws-modal-body{padding:20px!important;overflow-y:auto!important;display:grid!important;gap:15px!important;background:#fff!important}
.bws-modal .bws-modal-body>label{display:grid!important;gap:7px!important;color:#292d41!important;font-size:9.5px!important;line-height:1.25!important;font-weight:850!important}
.bws-modal .bws-modal-body input,.bws-modal .bws-modal-body select,.bws-modal .bws-modal-body textarea{width:100%!important;box-sizing:border-box!important;border:1px solid #dfe2ec!important;border-radius:11px!important;background:#fff!important;color:#252a40!important;font:700 10px/1.35 Inter,Arial,sans-serif!important;outline:none!important;transition:border-color .16s ease,box-shadow .16s ease,background .16s ease!important}
.bws-modal .bws-modal-body input,.bws-modal .bws-modal-body select{height:45px!important;padding:0 13px!important}
.bws-modal .bws-modal-body select{cursor:pointer!important}
.bws-modal .bws-modal-body textarea{min-height:92px!important;max-height:190px!important;padding:12px 13px!important;resize:vertical!important}
.bws-modal .bws-modal-body input:focus,.bws-modal .bws-modal-body select:focus,.bws-modal .bws-modal-body textarea:focus{border-color:#8069ef!important;box-shadow:0 0 0 4px rgba(104,72,242,.10)!important;background:#fefeff!important}
.bws-modal .bws-inline-msg{min-height:18px!important;margin:-2px 0 0!important;padding:0!important;color:#c74655!important;font-size:8.5px!important;line-height:1.4!important;font-weight:700!important}
.bws-modal .bws-inline-msg:empty{min-height:0!important;margin:0!important}
.bws-modal .bws-primary[data-create]{width:100%!important;min-height:44px!important;margin-top:1px!important;border:0!important;border-radius:11px!important;background:linear-gradient(135deg,#6849f5,#5432dd)!important;color:#fff!important;font-size:10px!important;font-weight:900!important;letter-spacing:.05px!important;cursor:pointer!important;box-shadow:0 9px 20px rgba(84,54,214,.22)!important;transition:.16s ease!important}
.bws-modal .bws-primary[data-create]:hover:not(:disabled){transform:translateY(-1px)!important;box-shadow:0 12px 24px rgba(84,54,214,.27)!important}
.bws-modal .bws-primary[data-create]:disabled{opacity:.66!important;cursor:wait!important;transform:none!important}
@media(max-width:640px){.bws-modal{padding:12px!important}.bws-modal>section{width:100%!important;max-height:94vh!important;border-radius:16px!important}.bws-modal header{padding:17px 16px 15px!important}.bws-modal .bws-modal-body{padding:16px!important;gap:13px!important}}
`;document.head.appendChild(s)}
function enhance(){css();const m=$('.bws-modal');if(!m)return;const title=$('header strong',m);if(title&&/create support ticket/i.test(title.textContent||'')){const input=$('[data-find]',m);if(input){input.placeholder='Enter registered email or Budget ID';input.autocomplete='off';input.spellcheck=false}const ta=$('[data-message]',m);if(ta)ta.placeholder='Add an optional opening message to the customer…';const btn=$('[data-create]',m);if(btn&&!btn.dataset.labelReady){btn.dataset.labelReady='1';btn.textContent='Create support ticket'}}}
css();
document.addEventListener('click',e=>{if(e.target.closest('#bwsNewTicket,.bws-new-ticket'))setTimeout(enhance,30)},true);
const mo=new MutationObserver(()=>{if($('.bws-modal'))enhance()});mo.observe(document.documentElement,{childList:true,subtree:true});
})();