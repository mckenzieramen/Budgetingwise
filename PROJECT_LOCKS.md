# Budgetingwise Project Lock Registry

Locked areas must not be changed unless Cliff explicitly asks to unlock or modify that specific area.

## Locked

- Admin Sidebar
  - Compact collapsed state remains icon-only.
  - Expanded state shows icon + label.
  - Dashboard / Clients / Chat Support / Log out labels remain visible when expanded.
  - Click-only collapse/expand behavior stays unchanged.
  - No drag behavior.
  - Active purple indicator/glass treatment stays unchanged.
  - Admin account card remains at the bottom directly above Log out.

- Chat Support right-side navigation
  - Customer Details header + Customer / Ticket Details / Email History / Account controls remain fixed at the top of the right panel.
  - Only the content below the fixed controls scrolls.
  - Clicking a navigation option smoothly scrolls the content area to its matching section.

- Support customer identity source
  - Registered customer BID comes from users/{uid}.budgetId.
  - Pulled/linked customer account identity must use exact UID, registered email, or BID matching; no fuzzy name matching.

- Search layout
  - Current approved search layout remains unchanged unless explicitly unlocked.

## Still Open / Needs Verification

- Create Support Ticket modal and customer validation flow.
- Customer Details data completeness and account pull-up edge cases.
- Ticket lifecycle verification: close/archive/new-ticket boundaries and ticket numbering.
- Password Recovery / follow-up flow verification.
- Admin header final polish.

## Rule

Before changing a locked area, confirm that the requested change explicitly targets that area. Avoid unrelated visual or behavioral changes to locked sections.
