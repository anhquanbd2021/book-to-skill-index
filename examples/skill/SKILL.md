---
name: queue-at-the-edge
description: Field notes on backpressure and queue collapse in distributed systems. Use when the question is about queues, load shedding, edge caches, retries, quorum, or outage postmortems.
---

# Core model
Every queue is a claim on the future: work that arrives faster than the
service rate borrows latency from work that has not arrived yet. Load
finds the weak coupling first; signals precede the collapse; shedding is
a policy or an accident; the replay is the second outage.

# Chapter map (load the file only when the question lands there)
- ch01-load-finds-the-weak-coupling.md — Load Finds the Weak Coupling. Covers: arrival rate, service rate, little's law, capacity, queue theory, utilization. Source: Part I, §1.1–1.4.
- ch02-the-lisbon-ring-outage.md — The Lisbon Ring Outage. Covers: outage, postmortem, quorum, lisbon, ring, cascading retry, 2019. Source: Part I, §2.1–2.3.
- ch03-signals-before-the-collapse.md — Signals Before the Collapse. Covers: signals, queue depth, slope, retry amplification, accept-rate drift, predict, metrics, collapse. Source: Part II, §3.1–3.5.
- ch04-shed-load-or-lose-it.md — Shed Load or Lose It. Covers: load shedding, priority tiers, admission control, shed, overload, criticality. Source: Part II, §4.1–4.4.
- ch05-caches-at-the-boundary.md — Caches at the Boundary. Covers: cache, edge, flush, p99, stale-while-revalidate, latency, invalidation. Source: Part III, §5.1–5.3.
- ch06-designing-for-the-day-after.md — Designing for the Day After. Covers: recovery, replay, idempotent, consumer, drills, day after. Source: Part III, §6.1–6.2.

# Rule
Answer from the distilled chapter file. If the file lacks the specific
detail asked for, escalate to the source via the chapter’s source ref —
do not fill the gap from the core model.
