/**
 * All user-facing and SEO-facing wording for this site.
 *
 * The KEY STRUCTURE is identical across every site in the network — same
 * groups, same keys, same order — so the apps stay interchangeable and a
 * component written for one works on all of them.
 *
 * The WORDS are unique to this site. That is not decoration: the brands are
 * separate domains serving the same catalogue, and if they shipped the same
 * titles, descriptions and headings, Google would treat them as duplicate
 * content and suppress all but one. Every string that reaches a <title>, a meta
 * description, an <h1>/<h2> or a JSON-LD field must read differently here than
 * on the sibling sites.
 *
 * crogambline's angle, taken from the design in sites/crogambline.html: the
 * stopwatch — we request a withdrawal at every casino we list and record how
 * many hours it takes to arrive, then rank on the measured number.
 */
export const COPY = {
  // Site-wide identity. These feed the root layout's fallback <title>, the
  // default meta description, the Organization/WebSite JSON-LD and the default
  // og:/twitter: description — i.e. every page that does not set its own.
  //
  // `description` must stay distinct from `home.metaDescription`: the home page
  // overrides it, so if the two matched, the site would simply be duplicating
  // itself across the pages that fall back to this one (the legal pages, the
  // 404, and any CMS page with no meta description authored in the admin).
  site: {
    titleTail: 'Time to Cash, Measured',
    description:
      'requests a withdrawal at every casino it lists and records how many hours it takes to arrive — then ranks on the measured number, not the advertised one.',
    keywords: [
      'how long casino withdrawals take',
      'fastest paying casinos',
      'same day payout casinos',
      'kyc verification delay',
      'weekend withdrawal delays',
    ],
  },
  nav: {
    casinos: 'Casinos',
    specialOffers: 'Special Offers',
    categories: 'Categories',
  },
  home: {
    heroEyebrow: 'Measured, Not Advertised',
    // Split in two so the JSX keeps its emphasised <em> while the words change.
    heroHeadline: 'We withdraw first.',
    heroHighlight: 'Then we rank.',
    heroSubtitle:
      'Every casino on this list has paid us. We time the request, the pending window and the verification, then publish the hours it took.',
    topCasinosTitle: 'Top casinos by tested payout',
    topCasinosSubtitle: 'Ordered by the hours between our request and the money arriving. Filter by category.',
    featuredCasinos: 'See The Timings',
    specialOffers: 'Offers From Fast Payers',
    viewAll: 'View All',
    // Leads the home <title>; the year and brand are appended in page.tsx.
    homeTitle: 'Time to Cash, Measured',
    faqTitle: 'How a score is built',
    metaDescription:
      'We request a withdrawal at every casino we list and record how many hours it takes to arrive. The number you see is the one we measured.',
  },
  casinos: {
    pageTitle: 'Ranked by Time to Cash',
    pageDescription:
      'Casinos ordered by measured hours from request to funds received, with the pending window and verification delay listed separately.',
    // Meta-description fallback for a casino review page. Casino records are
    // GLOBAL master data shared by every site, so without a per-site line here
    // all four domains would ship the identical description for the same casino.
    // Short per-site tail appended to an ADMIN-ENTERED casino meta description.
    // Casino records are shared by every site, so without this the same
    // description would ship on all four domains the moment the field is filled.
    // Appended to og:title / twitter:title on a casino review. The casino's
    // own meta_title is shared master data, so without this every domain
    // shipped an IDENTICAL share-card title for the same casino.
    // H2 over the offers block on a casino page. The literal 'Special Offers'
    // was hardcoded in the component on all six sites — an identical H2 on
    // every review page in the network.
    offersHeading: 'Offers From Fast Payers',
    // Tail of the summary H2: `{casino.name} payout profile`.
    glanceHeadingTail: 'payout profile',
    reviewTitleTail: 'Payout Time Measured',
    reviewSignature: 'Withdrawal timed end to end.',
    reviewSummary: 'how long a withdrawal actually took, where the hours went, and what changes the answer.',
    visitCasino: 'Open Casino',
    readReview: 'Read The Breakdown',
    rating: 'Payout Score',
    noResults: 'Nothing we have timed matches those filters yet.',
  },
  specialOffers: {
    pageTitle: 'Offers From Sites That Pay Out',
    pageDescription:
      'Bonuses attached to casinos that cleared our withdrawal test. A good offer at a slow payer is not a good offer.',
    // Appended to an offer's (shared) bonus text so the four sites do not ship
    // an identical meta description for the same offer.
    offerMetaSuffix: 'Attached to a casino whose withdrawal we timed end to end.',
    claim: 'Claim Offer',
    noResults: 'No current offers from a casino we have timed.',
  },
  categories: {
    pageTitle: 'Browse by What Slows You Down',
    pageDescription:
      'The things that decide whether you wait hours or days — verification, payment method, weekends, pending windows.',
    // Meta-description tail for a single category page. Category records are
    // shared master data, so this is what keeps the four sites distinct there.
    categoryMetaSuffix: 'ranked by measured hours from request to funds received.',
    noResults: 'Nothing in this category has been timed yet.',
  },
  newsletter: {
    title: 'Get the payout alert, not the promo blast',
    subtitle: 'One email when a casino\u2019s payout time moves — faster or slower. Nothing else.',
    placeholder: 'Email for payout timings',
    button: 'Subscribe',
    success: 'Almost set — confirm the link in your inbox to get new payout timings.',
    error: 'That did not get through. Try once more.',
  },
  footer: {
    // Short brand blurb in the footer, above the legal links.
    //
    // KEEP THIS UNDER ~72 CHARACTERS. The footer's brand column is
    // (1152 - 32 padding - 40 gap) / 2 = 540px at the sm: breakpoint where the
    // grid becomes two columns, and the text renders at 14px — about 77
    // characters to a line. Anything longer wraps to a second line, which is
    // what this wording was trimmed to fix. It still wraps on a phone, where a
    // single column is ~340px; that is unavoidable for any real sentence and is
    // the correct behaviour there.
    tagline:
      'We withdraw first, then we rank. Hours, not adjectives — 18+.',
    // Registered postal address, shown beside the copyright line. A physical
    // address in the footer is what mailbox providers and the gambling
    // affiliate compliance checks both look for, and it must match the address
    // used in the email templates.
    postalAddress: '1 Cathedral Square, Bristol BS1 5DD, United Kingdom',
    disclaimer:
      'Gambling carries real financial risk and is for adults aged 18 and over only. A fast withdrawal is not a reason to deposit more than you can afford to lose. Some links here earn us a commission; it plays no part in a measured payout time.',
  },
  errors: {
    notFound: 'No page here. A casino that stops paying gets delisted, not hidden.',
    apiError: 'This did not load in time. Please refresh shortly.',
  },
} as const
