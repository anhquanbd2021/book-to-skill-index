# ch06 — Designing for the Day After (distilled)

The second outage is the replay: held messages arrive at once,
duplicated and reordered. An honest idempotent consumer processes a
message twice to the same state as once — a property of the write,
not a retry flag.

Rules kept:
- Schedule the replay drill in peacetime; find duplicates in staging.
- Backpressure is the system telling the truth early — the failure is
  a system with no honest way to say no.

Source ref: Part III, §6.1–6.2.
