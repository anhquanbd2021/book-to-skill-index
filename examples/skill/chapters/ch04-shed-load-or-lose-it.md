# ch04 — Shed Load or Lose It (distilled)

Overloaded systems always shed — policy or accident. Write the tiers
before the incident: tier 0 cannot refuse (settlement, safety), tier 1
degrades (recommendations), tier 2 vanishes (beacons, prefetch).

Rules kept:
- Admission control refuses cheaply (a status code) instead of
  accepting expensively (a queue slot).
- Refusing 5% on purpose beats losing 40% by accident.

Source ref: Part II, §4.1–4.4.
