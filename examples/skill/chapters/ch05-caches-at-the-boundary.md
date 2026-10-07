# ch05 — Caches at the Boundary (distilled)

An edge cache is a read-side queue; treat it as flow control, not just
performance.

Rules kept:
- The 250 ms flush trigger: when origin p99 exceeds 250 ms, serve
  stale-while-revalidate. Threshold is your latency budget; the
  mechanism is non-negotiable.
- Purge-based invalidation during a stall = retry storm at the cache.
- Measure hit ratio per-tenant; aggregates hide starvation.

Source ref: Part III, §5.1–5.3.
