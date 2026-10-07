Chapter 4 — Shed Load or Lose It

Every overloaded system sheds load. The only choice is whether the
shedding is a policy or a consequence. A system without a shedding
policy still drops work — it drops whichever requests happened to be
in the slowest queue, which is to say it drops by accident and usually
drops the wrong ones.

A shedding policy is a pre-committed answer to a question you will be
too busy to think about: which work do we refuse first? The chapter
insists the answer be written in tiers before the incident, because
every tier invented during the incident is a negotiation conducted at
the worst possible moment. Three tiers cover most systems: tier zero is
the work that cannot be refused (payments settling, safety checks),
tier one is the work that degrades gracefully (recommendations,
previews), and tier two is the work that can vanish entirely (analytics
beacons, prefetch).

Admission control is the enforcement mechanism: a gate that checks the
tier against the system's current headroom and refuses cheaply instead
of accepting expensively. The cost of a refusal is a round trip and a
status code. The cost of an accepted request you cannot serve is the
queue position of every request behind it.

The author closes with the uncomfortable part: shedding feels like
failure, so teams delay it until the system makes the decision for
them. Refusing 5% of traffic on purpose is an availability strategy.
Losing 40% by accident is an outage with a longer incident report.
