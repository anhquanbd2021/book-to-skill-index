# ch02 — The Lisbon Ring Outage (distilled)

Postmortem, March 2019: a partition during a rolling upgrade split a
consistency ring five/eight; the small side kept taking writes on stale
membership, and a retry storm (backoff capped at 1s) multiplied write
load ~40x after the heal.

Rules kept:
- Refuse writes on stale membership.
- Quorum must be a function of current membership, not config-day
  membership.
- Retry ceilings are part of quorum safety, not client politeness.

Source ref: Part I, §2.1–2.3.

// distiller note: ring size and clock details dropped as trivia.
