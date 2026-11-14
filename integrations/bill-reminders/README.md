# Enable bill reminder email

1. Create a standalone Google Apps Script project under the Budgetingwise sender account and copy in Code.gs and the appsscript.json manifest.
2. Use a Google Cloud project with the Firestore API enabled. Grant the sender account the Cloud Datastore Viewer role on the Budgetingwise Firebase project.
3. In Firestore indexes, enable a collection-group single-field ascending index on planning.hasBillReminders.
4. Run installBillReminderTrigger once from the editor and grant the requested Google permissions. There is no web endpoint to publish.
5. Use your own Budgetingwise account to save a test bill due within three days with Email reminder checked. Run sendUpcomingBillReminders from the editor and verify delivery in the registered inbox. Running it again should skip the same bill occurrence.

The worker runs daily in the 8 AM Asia/Manila time window, sends one reminder per unpaid occurrence, and uses the registered Budgetingwise email.
