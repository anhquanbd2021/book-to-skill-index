Chapter 5 — Caches at the Boundary

An edge cache is a queue in disguise: it absorbs bursts on the read
side exactly the way a request queue absorbs them on the write side,
and it fails the same way — gradually, then vertically. The chapter
treats the cache as a flow-control device first and a performance
device second, which inverts how most teams justify one.

The operational rule the author defends across three case studies is
the 250 ms flush trigger: when the p99 read latency of the origin
exceeds 250 ms for a sustained window, the edge stops waiting for
freshness and serves stale while revalidating in the background. The
number is not sacred — the book is careful to say your threshold is
your own latency budget — but the mechanism is non-negotiable. A cache
that waits for the origin during an origin stall propagates the stall
to every edge PoP; a cache that serves stale converts an origin
incident into a freshness degradation, which is a strictly better
outage.

Stale-while-revalidate gets its own section because it is the only
invalidation strategy that degrades instead of amplifying. Purge-based
invalidation during a stall is the cache equivalent of the retry storm
in chapter 2: every miss hammers the origin that is already down, and
the first successful refill arrives to a thundering herd.

The chapter ends with the bookkeeping everyone skips: a cache whose
hit ratio you do not measure per-tenant is a queue whose depth you do
not measure. One hot tenant can starve the rest, and the aggregate hit
ratio will look healthy the whole time.
