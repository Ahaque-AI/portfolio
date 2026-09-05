# Collection and legal-page requirements

Status: preview policy pages implemented; future live-service legal inputs remain
unresolved. No collection or analytics is active in this repository.
Current flow: full name is mandatory on both paths. Email and agreement are
required only for a full introduction; comments are optional. Name-only
continuation ignores other fields. A successfully submitted full name is saved in
browser local storage to bypass the introduction on return. Back to introduction
and Arrival clear it so the visitor can replace it. It is not sent.

## Separate the two events

| Event | Intended data | Open decision |
| --- | --- | --- |
| Visit | Minimal event/time, no submitted identity | What counts as a visit, consent approach, bot/repeat handling, notification frequency |
| Voluntary introduction | Full name, email, submission time, applicable notice/consent version | Purpose, provider, retention, deletion process, notification channel |

The owner requests a notification on a visit and optional visitor details.
The current preview requires a name before showing the next-phase message.
Visit notifications are a separate feature, not implicit permission to identify
visitors. A managed endpoint may process IP addresses or retain access logs even
if the form does not request them; assess and disclose actual provider behavior.

Proposed notification content: an anonymous visit notice or a new-submission
notice linking to private storage. Decide whether full contact details are
needed in the notification channel before implementing that transfer.

## Privacy page: `/privacy/`

Implemented with copy limited to current preview behavior. Future service requirements:

Cover the owner/contact, actual data collected (including service logs), purpose
for each event, applicable processing basis, recipients/providers, storage
location and transfers where relevant, retention period, deletion/contact
process, analytics/storage behavior, choices, and effective date.

## Terms page: `/terms/`

Implemented with copy limited to current preview behavior. Future launch requirements:

Cover site owner, portfolio purpose, content ownership and third-party credits,
permitted use, external project/demo links, contact, effective date, and any
applicable service limitations. Decide whether this informational portfolio
needs contractual acceptance or simply accessible terms before drafting copy.
Keep any collection permission distinct from marketing permission.

## Inputs to resolve during planning

- Why retain visitors' full names and email addresses, and whether follow-up is intended.
- Notification channel and whether to notify per event or aggregate repeated visits.
- External provider, access controls, storage/log behavior, and retention duration.
- Public contact for privacy requests and the deletion workflow.
- Intended audience/jurisdictions and corresponding legal requirements.

These questions do not block the local design preview. They must be resolved before
activating collection or claiming the legal pages describe a working service.
