(()=>{'use strict';
const sets={expense:[['Food & Dining','fork'],['Transportation','car'],['Shopping','bag'],['Bills','receipt'],['Entertainment','game'],['Health','heart'],['Education','book'],['Others','dots']],income:[['Salary','wallet'],['Freelance','spark'],['Business','briefcase'],['Allowance','cash'],['Investment Income','chart'],['Bonus','gift'],['Refund','return'],['Other Income','dots']],savings:[['Emergency Fund','shield'],['Travel Fund','plane'],['Retirement','home'],['Education Fund','book'],['Investment','chart'],['Home Fund','house'],['Gadget Fund','device'],['Other Savings','dots']]};
const needs=new Set(['Food & Dining','Transportation','Bills','Health','Education','Rent','Groceries','Utilities','Mobile Plan']);const wants=new Set(['Shopping','Entertainment','Dining & Leisure','Travel','Others']);window.bwBudgetGroup=category=>category==='Needs'||needs.has(category)?'Needs':category==='Wants'||wants.has(category)?'Wants':category==='Savings'||/Fund$/.test(category)||category==='Investment'?'Savings':'Other';
const icons={fork:'<path d="M7 3v7M4 3v5a3 3 0 0 0 6 0V3M7 11v10M15 3v18M15 3c3 1 5 4 5 8h-5"/>',car:'<path d="M5 17h14l-1.3-7.2A2.2 2.2 0 0 0 15.5 8h-7a2.2 2.2 0 0 0-2.2 1.8L5 17Z"/><path d="M7 8l1-3h8l1 3M4 14h16M7 17v2M17 17v2"/><circle cx="8" cy="14" r="1"/><circle cx="16" cy="14" r="1"/>',bag:'<path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/>',receipt:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 8h6M9 12h6M9 16h4"/>',game:'<path d="M8 8h8a5 5 0 0 1 4.7 6.7l-1 2.8a2.2 2.2 0 0 1-3.8.6L14.5 16h-5l-1.4 2.1a2.2 2.2 0 0 1-3.8-.6l-1-2.8A5 5 0 0 1 8 8Z"/><path d="M8 11v4M6 13h4M16 12h.01M18 14h.01"/>',heart:'<path d="M12 20S4 15.5 4 9.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8 3.5C20 15.5 12 20 12 20Z"/><path d="M12 8v6M9 11h6"/>',book:'<path d="m3 9 9-5 9 5-9 5-9-5Z"/><path d="M7 12v4c3 2 7 2 10 0v-4M21 9v6"/>',dots:'<circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/>',wallet:'<path d="M4 6h14a2 2 0 0 1 2 2v10H4V6Zm0 0 10-3v3m3 5h3v4h-3a2 2 0 0 1 0-4Z"/>',spark:'<path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4L12 3Zm6 10 .8 2.2L21 16l-2.2.8L18 19l-.8-2.2L15 16l2.2-.8L18 13Z"/>',briefcase:'<path d="M4 8h16v11H4V8Zm5 0V5h6v3m-11 5h16"/>',cash:'<path d="M3 7h18v10H3V7Zm4 2a2 2 0 0 1-2 2v2a2 2 0 0 1 2 2m10-6a2 2 0 0 0 2 2v2a2 2 0 0 0-2 2M12 10v4"/>',chart:'<path d="M4 19V5m0 14h16M7 15l4-4 3 2 5-6"/>',gift:'<path d="M4 10h16v10H4V10Zm-1-4h18v4H3V6Zm9 0v14m0-14c-2 0-4-1-4-3 0-1.2 1-2 2-2 2 0 2 5 2 5Zm0 0c2 0 4-1 4-3 0-1.2-1-2-2-2-2 0-2 5-2 5Z"/>',return:'<path d="M9 7H5v-4M5 7c2-3 5-4 8-3a8 8 0 1 1-6 14"/>',shield:'<path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Zm-3 9 2 2 4-5"/>',plane:'<path d="m3 11 18-7-7 17-3-7-8-3Zm8 3 4-4"/>',home:'<path d="m4 11 8-7 8 7v9h-6v-5h-4v5H4v-9Z"/>',house:'<path d="m3 11 9-8 9 8M5 10v10h14V10M9 20v-6h6v6"/>',device:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 6h6M11 18h2"/>'};
const svg=n=>icons[n]||icons.dots;const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${svg(n)}</svg>`;const all=[...sets.expense,...sets.income,...sets.savings];const iconFor=name=>all.find(x=>x[0].toLowerCase()===String(name||'').trim().toLowerCase())?.[1]||(/rent|utility|mobile|internet|electric/i.test(name)?'receipt':/grocery|dining|food/i.test(name)?'fork':'dots');
const customIcons = [
  ['heart','Health'], ['car','Transport'], ['bag','Shopping'], ['fork','Food'],
  ['house','Housing'], ['receipt','Bills'], ['gift','Gifts'], ['book','Education'],
  ['plane','Travel'], ['briefcase','Work'], ['device','Tech'], ['game','Gaming'],
  ['shield','Emergency'], ['chart','Investment'], ['wallet','Money'], ['spark','Personal']
];
const customKey = 'bw:custom-category';
const validIcon = key => customIcons.some(([value]) => value === key);
window.bwCategoryIcon = (name, chosen) => icon(validIcon(chosen) ? chosen : iconFor(name));
window.bwTransactionCategory = () => {
  const select = document.getElementById('txCategory');
  const name = document.getElementById('bwCustomCategoryName');
  const picker = document.getElementById('bwCustomCategory');
  if (select?.value !== customKey) return {category:select?.value || '', categoryIcon:''};
  const category = name.value.trim();
  if (!category) {
    name.setCustomValidity('Enter a custom category name.');
    name.reportValidity();
    return null;
  }
  return {category, categoryIcon:picker.dataset.icon};
};
function css(){if(document.getElementById('bwCategoryPremiumCss'))return;const s=document.createElement('style');s.id='bwCategoryPremiumCss';s.textContent=`.bw-premium-transaction-modal label:has(#txCategory){display:block}.bw-premium-transaction-modal #txCategory{position:absolute!important;opacity:0!important;pointer-events:none!important;width:1px!important;height:1px!important}.bw-category-picker{margin-top:8px}.bw-category-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;margin-bottom:10px}.bw-category-heading strong{font-size:11px!important;font-weight:850!important;color:var(--bw-ui-text,#171a26)!important}.bw-category-heading small{font-size:8px!important;color:var(--bw-ui-muted,#73798b)!important}.bw-category-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.bw-category-card{position:relative;min-height:86px!important;padding:11px 8px!important;border:1px solid var(--bw-ui-border,#e5e7ee)!important;border-radius:13px!important;background:var(--bw-ui-surface,#fff)!important;color:var(--bw-ui-text,#171a26)!important;display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer}.bw-category-card.active{border-color:var(--bw-ui-accent,#6544e9)!important;background:var(--bw-ui-soft,#f5f2ff)!important}.bw-category-icon{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;background:#f3f0ff;color:#6544e9}.bw-category-icon svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.bw-category-card span:last-child{font-size:8.5px!important;font-weight:800!important}.bw-category-card.active:after{content:'✓';position:absolute;right:7px;top:7px;width:17px;height:17px;border-radius:999px;display:grid;place-items:center;background:#6544e9;color:#fff;font-size:9px;font-weight:900}@media(max-width:620px){.bw-category-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}`;document.head.appendChild(s)}
function render(preferred, chosenIcon) {
  const select = document.getElementById('txCategory');
  const type = document.getElementById('txType');
  if (!select || !type) return;

  let picker = document.getElementById('bwTransactionCategoryPicker');
  if (!picker) {
    picker = document.createElement('div');
    picker.className = 'bw-category-picker';
    picker.id = 'bwTransactionCategoryPicker';
    picker.innerHTML = '<div class="bw-category-grid" role="group" aria-label="Transaction category"></div>';
    const custom = document.createElement('fieldset');
    custom.id = 'bwCustomCategory';
    custom.innerHTML = `<legend>Custom category</legend><label for="bwCustomCategoryName">Category name</label><input id="bwCustomCategoryName" type="text" maxlength="60" placeholder="e.g. Pet care"><div class="bw-category-icon-options" role="group" aria-label="Choose an icon">${customIcons.map(([value,label])=>`<button type="button" data-icon="${value}" aria-pressed="false">${icon(value)}<span>${label}</span></button>`).join('')}</div>`;
    custom.querySelector('input').addEventListener('input', event => event.target.setCustomValidity(''));
    custom.addEventListener('click', event => {
      const button = event.target.closest('[data-icon]');
      if (button) setCustomIcon(button.dataset.icon);
    });
    const nativeField = select.closest('label');
    nativeField.hidden = true;
    nativeField.after(picker, custom);
    select.hidden = true;
    picker.addEventListener('click', event => {
      const button = event.target.closest('[data-bw-category]');
      if (!button) return;
      select.value = button.dataset.bwCategory;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  const items = [...(sets[type.value] || sets.expense)];
  const current = preferred ?? select.value;
  const hasCustomIcon = validIcon(chosenIcon);
  if (preferred && !hasCustomIcon && !items.some(([name]) => name === preferred)) {
    items.push([preferred, iconFor(preferred)]);
  }

  const otherIndex = items.findIndex(([name]) => ['Others', 'Other Income', 'Other Savings'].includes(name));
  const otherName = items[otherIndex][0];
  items[otherIndex] = [otherName, 'dots', customKey];
  select.replaceChildren(...items.map(([name,,value=name]) => new Option(name, value)));
  const isCustom = hasCustomIcon || current === otherName;
  select.value = isCustom ? customKey : items.some(([name]) => name === current) ? current : items[0][0];
  const customName = document.getElementById('bwCustomCategoryName');
  customName.value = preferred && isCustom ? preferred : '';
  customName.setCustomValidity('');
  setCustomIcon(hasCustomIcon ? chosenIcon : 'spark');
  picker.firstElementChild.replaceChildren(...items.map(([name, glyph, value=name], index) => {
    const button = document.createElement('button');
    const badge = document.createElement('span');
    const label = document.createElement('span');
    button.type = 'button';
    button.className = 'bw-category-card';
    button.dataset.bwCategory = value;
    badge.className = 'bw-category-icon';
    badge.dataset.tone = String(index % 8);
    badge.innerHTML = icon(glyph);
    label.textContent = name;
    button.append(badge, label);
    return button;
  }));
  sync();
}

function setCustomIcon(value) {
  const panel = document.getElementById('bwCustomCategory');
  panel.dataset.icon = value;
  panel.querySelectorAll('[data-icon]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.icon===value)));
}
function sync() {
  const select = document.getElementById('txCategory');
  const panel = document.getElementById('bwCustomCategory');
  const input = document.getElementById('bwCustomCategoryName');
  panel.hidden = select.value !== customKey;
  input.disabled = panel.hidden;
  input.required = !panel.hidden;
  document.querySelectorAll('[data-bw-category]').forEach(button => {
    const active = button.dataset.bwCategory === select.value;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function boot() {
  css();
  render('');
  const category = document.getElementById('txCategory');
  category?.addEventListener('change', sync);
  document.getElementById('txType')?.addEventListener('change', event => {
    render(event.detail?.category ?? '', event.detail?.categoryIcon);
  });
  category?.form?.addEventListener('reset', () => queueMicrotask(() => {
    document.getElementById('txType').dispatchEvent(new Event('change', { bubbles: true }));
  }));
  document.getElementById('bwCancelTransaction')?.addEventListener('click', () => {
    document.getElementById('closeModal')?.click();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
})();
