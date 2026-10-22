import 'https://cdn.jsdelivr.net/gh/mckenzieramen/Budgetingwise@ee7afdb702bdcb67e0796295090c3a412f859a80/public/chat-support-customer-v2.js';

// Extend the customer concern picker without disturbing the stable chat flow.
const enhanceCustomerConcerns=()=>{
  document.querySelectorAll('.bw-support-quick-actions').forEach(box=>{
    if(box.dataset.extendedConcerns==='1')return;
    box.dataset.extendedConcerns='1';
    const add=(type,label,message)=>{
      if(box.querySelector(`[data-extra-concern="${type}"]`))return;
      const b=document.createElement('button');
      b.type='button';b.dataset.extraConcern=type;b.textContent=label;
      b.onclick=async()=>{
        const input=document.getElementById('bwSupportInput');
        if(!input)return;
        input.value=message;
        input.focus();
        input.dispatchEvent(new Event('input',{bubbles:true}));
      };
      box.appendChild(b);
    };
    add('report-error','Report an error','I would like to report an error. Here are the details: ');
    add('suggestion','Share a suggestion','I have a suggestion for Budgetingwise: ');
  });
};
setInterval(enhanceCustomerConcerns,700);
enhanceCustomerConcerns();