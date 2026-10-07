Chapter 2 — The Lisbon Ring Outage

The postmortem that taught the industry the most about quorum math was
not written by a cloud provider. It came from a regional logistics
company in Lisbon whose internal consistency ring failed on a Tuesday
morning in March 2019 and stayed down for eleven hours.

The ring ran fourteen nodes across three racks. A rolling upgrade had
reduced the effective membership to thirteen for six minutes — and
inside that window, a partition split the ring five/eight. The write
path required a quorum of eight. Nodes in the smaller partition kept
accepting writes on stale membership, and when the partition healed,
the two halves had both committed overlapping key ranges.

The compounding failure was the retry storm. Clients treated quorum
errors as transient and retried with exponential backoff — capped at
one second, which is not backoff so much as a metronome. Within ninety
seconds the healed ring was serving forty times its normal write rate,
and the operators who paged in found a system that was technically
available and practically unusable.

The fix list was embarrassingly short: refuse writes on stale
membership rather than hoping the partition heals, make quorum a
function of current membership and not configuration-day membership,
and put a real ceiling on retries. The lesson the author draws is that
quorum is not a number you set — it is a property of the membership
the ring believes it has right now.
