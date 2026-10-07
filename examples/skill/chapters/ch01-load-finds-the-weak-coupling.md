# ch01 — Load Finds the Weak Coupling (distilled)

Queues pay for bursts with latency. Little's law: items in system =
arrival rate × residence time (L = λW). As arrivals near the service
rate, wait goes vertical, not gradual.

Rules kept:
- Utilization targets are self-delusion; 90% busy = a queue that
  doubles on every upward flicker.
- The first coupling at the asymptote sets latency for everything
  behind it. Instrument every boundary queue, not just the balancer.

Source ref: Part I, §1.1–1.4.
