Chapter 3 — Signals Before the Collapse

Queues do not collapse suddenly; they announce themselves for minutes
before anyone believes them. The chapter catalogues the three signals
that predict a collapse with enough lead time to act on.

The first is queue-depth slope, not queue depth. A depth of ten
thousand that is flat is a backlog; a depth of two hundred rising at
fifty per second is a fire. Operators dashboard the level because it
is easy to graph, but the derivative is what kills you — every collapse
in the chapter showed a positive slope held for more than ninety
seconds before the level itself looked alarming.

The second is retry amplification. Count requests arriving at the
boundary and count work items entering the queue; when the second
number diverges from the first, the clients are retrying. The ratio
works-queue to offered-requests is the multiplier that turns a slow
service into a buried one. Above roughly 1.3, the queue is feeding on
itself.

The third is accept-rate drift. Systems shed load by refusing work,
and the rate at which the front door accepts requests drifts under
pressure long before the error budget burns. An accept rate that falls
from 99.8% to 97% reads as noise on a dashboard and reads as the first
two minutes of an incident in this book.

The author is blunt about the pattern: slope, amplification, drift.
Any one of them alone can be weather. Two together is a forecast. All
three is a collapse already in progress, wearing the disguise of a
metric anomaly.
