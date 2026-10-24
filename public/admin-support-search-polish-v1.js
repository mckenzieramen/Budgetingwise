(()=>{'use strict';
const apply=()=>{
  const root=document.getElementById('adminSupportPanel');
  if(!root)return false;
  let tools=root.querySelector('#bwsInboxTools,.bws-inbox-tools');
  if(!tools)return false;
  tools.classList.add('bws-search-polished');
  let input=tools.querySelector('input[type="search"],input');
  if(!input)return false;
  input.setAttribute('aria-label','Search conversations');
  if(!document.getElementById('bwsSearchPolishCss')){
    const s=document.createElement('style');
    s.id='bwsSearchPolishCss';
    s.textContent=`
#adminSupportPanel #bwsInboxTools.bws-search-polished,
#adminSupportPanel .bws-inbox-tools.bws-search-polished{position:relative!important}
#adminSupportPanel #bwsInboxTools.bws-search-polished>img,
#adminSupportPanel #bwsInboxTools.bws-search-polished>svg,
#adminSupportPanel .bws-inbox-tools.bws-search-polished>img,
#adminSupportPanel .bws-inbox-tools.bws-search-polished>svg,
#adminSupportPanel #bwsInboxTools.bws-search-polished .search-icon img,
#adminSupportPanel .bws-inbox-tools.bws-search-polished .search-icon img{display:none!important}
#adminSupportPanel #bwsInboxTools.bws-search-polished:before,
#adminSupportPanel .bws-inbox-tools.bws-search-polished:before{content:'';position:absolute;left:11px;top:17px;width:15px;height:15px;z-index:3;pointer-events:none;background-repeat:no-repeat;background-position:center;background-size:15px 15px;opacity:.78;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235b4b8a' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='6.5'/%3E%3Cpath d='m16 16 4 4'/%3E%3C/svg%3E")}
#adminSupportPanel #bwsInboxTools.bws-search-polished>input,
#adminSupportPanel .bws-inbox-tools.bws-search-polished>input{padding-left:34px!important;padding-right:11px!important;background:#fbfcff!important;border:1px solid #dfe3ed!important;box-shadow:none!important;color:#2d3348!important;outline:none!important}
#adminSupportPanel #bwsInboxTools.bws-search-polished>input:focus,
#adminSupportPanel .bws-inbox-tools.bws-search-polished>input:focus{border-color:#bfb4ff!important;box-shadow:0 0 0 3px rgba(98,70,235,.08)!important;background:#fff!important}
#adminSupportPanel #bwsInboxTools.bws-search-polished>input::placeholder,
#adminSupportPanel .bws-inbox-tools.bws-search-polished>input::placeholder{color:#9aa1b2!important;opacity:1!important}
`;
    document.head.appendChild(s);
  }
  return true;
};
if(!apply()){
  let n=0;
  const t=setInterval(()=>{if(apply()||++n>40)clearInterval(t)},100);
}
document.addEventListener('click',e=>{if(e.target.closest('#adminSupportNav'))setTimeout(apply,120)},true);
})();