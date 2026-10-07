Chapter 1 — Load Finds the Weak Coupling

A queue is a claim on the future. Every request that arrives faster than the
system can service it borrows time from requests that have not arrived yet,
and the debt is paid in latency. Teams discover this the hard way because
average load is a liar: a service that idles at 40% utilization for twenty-
three hours can still spend the twenty-fourth hour in a queue so deep it
never drains before the next burst arrives.

Little's law is the whole arithmetic of the chapter: the number of items in
a stable system equals the arrival rate multiplied by the time each item
spends inside. L = λW. Nothing in that equation cares about your framework,
your cloud, or your confidence. When λ approaches the service rate μ, the
wait W does not degrade gracefully — it approaches an asymptote, which is a
polite way of saying it goes vertical.

The practical consequence is that utilization targets are self-delusion.
Running a coupling at 90% of its measured service rate does not buy 10%
headroom; it buys a queue that doubles in depth every time the arrival
rate flickers upward. The first coupling in the chain that reaches the
asymptote decides the latency of everything behind it — which is why the
chapter title says load finds the weak coupling, not the weak service.

Capacity planning, then, is not a budgeting exercise. It is the discipline
of locating the weakest coupling before traffic does. The teams that get
this right instrument the queue at every boundary, not just the load
balancer, because the boundary you forgot is where the queue forms first.
