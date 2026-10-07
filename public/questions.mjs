// The three scripted questions. Each declares:
//   marker      — a string that must appear in the supporting text for the
//                 question to be answerable from it
//   answer      — the correct answer (asserted by tests)
//   dropped     — true when the distiller dropped the fact (the lossy edge)
//
// "Answering" in the lab is evidence lookup: a mode is correct iff its
// loaded context contains the marker. That keeps the demo honest — it is
// showing context cost and routing, not impersonating an LLM.

export const QUESTIONS = [
  {
    id: 'q-signals',
    label: 'Which signals does the book say predict a queue collapse?',
    expectChapter: 'ch03',
    marker: 'queue-depth slope', // present in full text AND the distilled leaf
    answer: 'Three signals: queue-depth slope (not depth), retry amplification, and accept-rate drift — "two together is a forecast, all three is a collapse in progress."',
  },
  {
    id: 'q-flush-trigger',
    label: 'What p99 latency triggers the edge cache flush to stale?',
    expectChapter: 'ch05',
    marker: '250 ms',
    answer: 'The 250 ms flush trigger — when origin p99 exceeds 250 ms, the edge serves stale-while-revalidate instead of waiting on the stall.',
  },
  {
    id: 'q-ring-size',
    label: 'How many nodes were in the ring during the Lisbon outage?',
    expectChapter: 'ch02',
    marker: 'fourteen nodes',
    answer: 'Fourteen nodes across three racks — a rolling upgrade had reduced effective membership to thirteen when the partition hit.',
    // The distilled ch02 file keeps the *lesson* (stale-membership quorum)
    // and drops the node count as trivia — the lossy edge, on purpose.
    droppedFromDistill: true,
    partial: 'The distilled chapter covers the quorum miscount and the retry storm but drops the ring size — answering from it would be a confident guess.',
  },
];
