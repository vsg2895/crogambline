/**
 * Frequently asked questions for this site.
 *
 * Rendered VISIBLY on the home page and emitted as FAQPage structured data from
 * this same array. Google requires the two to match; markup-only FAQ is a
 * guidelines violation, which is why the page maps over this constant rather
 * than duplicating the text.
 *
 * The wording is unique to this site: these answers are indexable page content,
 * and they are exactly the kind of text an answer engine quotes.
 */
export const FAQ_ITEMS = [
  {
    question: 'How do you measure a payout time?',
    answer:
      'We deposit, play through whatever the terms require, then request a withdrawal and start the clock. It stops when the money is in the receiving account, not when the casino marks the request approved. The figure we publish is that full elapsed time.',
  },
  {
    question: 'Why is my withdrawal slower than the time you list?',
    answer:
      'Usually verification. Our timings assume an account that has already passed identity checks, because that is the steady state you will be in after the first payout. A first withdrawal often adds a day or more while documents are reviewed, and we list that separately.',
  },
  {
    question: 'Does the payment method change the answer?',
    answer:
      'Substantially. Card refunds are the slowest leg on most sites and can add several working days after the casino has released the funds. E-wallets and crypto usually clear within hours of approval. We record which method we used so the number means something.',
  },
  {
    question: 'Do weekends and holidays affect it?',
    answer:
      'For anything routed through a bank, yes — a Friday evening request often lands on Tuesday. Casinos that process internally at weekends are flagged, because it is one of the few things that reliably separates a fast payer from an average one.',
  },
  {
    question: 'Do you get paid by the casinos you time?',
    answer:
      'We may earn a commission when someone signs up through a link here. It has no bearing on a measured time and cannot buy a position: the ordering is generated from the recorded hours, and a slow result stays published.',
  },
  {
    question: 'How often are the timings rechecked?',
    answer:
      'We re-test periodically and after any report that a site has slowed. A casino whose payout time worsens is re-ordered, and if it stops paying within a reasonable window it comes off the list entirely rather than being quietly downgraded.',
  },
] as const
