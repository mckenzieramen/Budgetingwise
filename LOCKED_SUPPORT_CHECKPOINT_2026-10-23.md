# Budgetingwise Support — Locked Stable Checkpoint

Locked on: 2026-10-23

Stable support behavior at this checkpoint:

- One concern per support ticket.
- A new ticket is Open and the previous closed ticket remains in Chat History.
- Automated completed workflows use Yes / No follow-up actions.
- Yes starts a new ticket; No closes the current ticket and allows the support survey.
- Customer Chat History keeps previous closed conversations.
- Admin Chat History shows Ticket Number, Closed date/time, and Concern.
- Admin active ticket state refreshes from Firestore so a newly-created ticket does not remain visually Closed.
- Current admin transcript is limited to the current ticket after a new-ticket marker.
- Logged-in customer identity is used automatically in Chat Support.
- Password recovery account verification uses the registered account data.
- Admin account actions remain available: resend account info, resend activation key, edit login email, suspend/unsuspend.
- Premium support UI styles are enabled.

Locked main commit: 9c8e370163ffcefc3b0d14f91883750fcb05165a

Do not modify this checkpoint file when making future feature changes. Use it as a recovery reference.
