const REMINDER_ZONE = 'Asia/Manila';
const FIRESTORE_ROOT = 'https://firestore.googleapis.com/v1/projects/budgetingwise-78b3a/databases/(default)/documents';

function installBillReminderTrigger() {
  if (!ScriptApp.getProjectTriggers().some(trigger => trigger.getHandlerFunction() === 'sendUpcomingBillReminders')) {
    ScriptApp.newTrigger('sendUpcomingBillReminders').timeBased()
      .everyDays(1).atHour(8).inTimezone(REMINDER_ZONE).create();
  }
}

function sendUpcomingBillReminders() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;
  try {
    const today = Utilities.formatDate(new Date(), REMINDER_ZONE, 'yyyy-MM-dd');
    const store = PropertiesService.getScriptProperties();
    const sent = store.getProperties();
    const month = today.slice(0, 7);
    const previousMonth = new Date(Date.UTC(+month.slice(0,4), +month.slice(5)-2, 1)).toISOString().slice(0,7);
    Object.keys(sent).filter(key => key.startsWith('sent:') && sent[key] < previousMonth)
      .forEach(key => store.deleteProperty(key));
    const plans = firestoreRequest_(FIRESTORE_ROOT + ':runQuery', {
      structuredQuery: {
        from: [{collectionId:'planning', allDescendants:true}],
        where: {fieldFilter:{field:{fieldPath:'hasBillReminders'},op:'EQUAL',value:{booleanValue:true}}}
      }
    });
    let remaining = MailApp.getRemainingDailyQuota();
    for (const {document: plan} of plans) {
      if (!remaining) break;
      if (!plan || !/\/users\/[^/]+\/planning\/finance$/.test(plan.name)) continue;
      const pending = pendingBills_(plan.fields.bills?.arrayValue?.values || [], today);
      const unsent = pending.filter(bill => !sent[reminderKey_(plan.name, bill)]);
      if (!unsent.length) continue;
      const customer = firestoreRequest_('https://firestore.googleapis.com/v1/' +
        plan.name.replace(/\/planning\/finance$/, '')).fields;
      const email = customer?.email?.stringValue;
      if (!email || customer?.status?.stringValue !== 'active' ||
          customer?.accountActivated?.booleanValue === false) continue;
      const body = unsent.map(({name, due}) => name + ' is due on ' + due + '.').join('\n');
      try {
        MailApp.sendEmail(email, 'Upcoming bill deadlines | Budgetingwise',
          body + '\n\nView your Financial Plan at https://budgetingwise.pages.dev/#/plan',
          {name:'Budgetingwise'});
      } catch (error) {
        console.error('Bill reminder send failed: ' + error.name);
        continue;
      }
      remaining--;
      const updates = Object.fromEntries(unsent.map(bill => [reminderKey_(plan.name, bill), bill.due.slice(0,7)]));
      store.setProperties(updates);
      Object.assign(sent, updates);
    }
  } finally {
    lock.releaseLock();
  }
}

function pendingBills_(values, today) {
  const start = new Date(today + 'T00:00:00Z');
  const cutoff = new Date(start.getTime() + 3 * 86400000).toISOString().slice(0,10);
  return values.flatMap(value => {
    const bill = value.mapValue?.fields;
    if (!bill?.emailReminder?.booleanValue || !bill.id?.stringValue || !bill.name?.stringValue) return [];
    const exact = bill.dueDate?.stringValue;
    const paid = bill.paidMonth?.stringValue;
    const dates = exact ? [exact] : [0,1].map(offset => {
      const year = start.getUTCFullYear(), month = start.getUTCMonth() + offset;
      const last = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
      const day = Math.min(last, Math.max(1, Math.round(Number(bill.dueDay?.integerValue || bill.dueDay?.doubleValue) || 1)));
      return new Date(Date.UTC(year, month, day)).toISOString().slice(0,10);
    });
    return dates.filter(due => /^\d{4}-\d{2}-\d{2}$/.test(due) && due >= today && due <= cutoff && due.slice(0,7) !== paid)
      .map(due => ({id:bill.id.stringValue,name:bill.name.stringValue,due}));
  });
}
function reminderKey_(document, bill) {
  return 'sent:' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256, JSON.stringify([document,bill.id,bill.due])));
}
function firestoreRequest_(url, body) {
  const options = {headers:{Authorization:'Bearer ' + ScriptApp.getOAuthToken()}};
  if (body) Object.assign(options,{method:'post',contentType:'application/json',payload:JSON.stringify(body)});
  return JSON.parse(UrlFetchApp.fetch(url,options).getContentText());
}
