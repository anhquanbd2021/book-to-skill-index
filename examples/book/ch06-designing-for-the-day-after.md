Chapter 6 — Designing for the Day After

The outage ends when the queue drains; the incident ends a day later,
when the work the queue was holding finally replays. The chapter is
about the second outage — the one inside the first — and why teams
that survive the storm still lose the cleanup.

Replay is the load nobody sized for. Every message held during the
stall arrives after it, at once, in whatever order the transport felt
like. Consumers that were correct under ordered, once-only delivery
meet duplicate and reordered delivery on the worst morning of the
year. This is the book's definition of an honest idempotent consumer:
one where processing the same message twice produces the same state
as processing it once — not a retry flag, a property of the write.

The drills section argues the point in the only way that convinces:
schedule the replay. Run the burst you are afraid of on a Tuesday in
peacetime and find out whether the consumer deduplicates or merely
hopes. The teams that drill discover their duplicates in staging; the
teams that do not discover them in the incident channel.

The closing line of the book is the thesis of this chapter and
arguably of the whole field: backpressure is not the failure mode.
Backpressure is the system telling you the truth early, at a price you
can still afford. The failure mode is a system with no honest way to
say no.
