import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBonusArea, getCategories, getCategory, getSpecialOffers } from '@/lib/api'
import type { BonusSection } from '@/lib/api'
import { buildItemListSchema, buildWebPageSchema, jsonLdScript, buildFaqSchema, SHARE_IMAGES } from '@/lib/seo'
import { COPY } from '@/constants/copy'
import { FAQ_ITEMS } from '@/constants/faq'
import CasinoCard, { CASINO_GRID } from '@/components/CasinoCard'
import BonusCategoryNav from '@/components/BonusCategoryNav'
import BonusRows from '@/components/BonusRows'
import CategoryNav from '@/components/CategoryNav'
import SpecialOfferCard from '@/components/SpecialOfferCard'
import { SITE_URL } from '@/lib/config'
import type { Category } from '@shared/types/category'
import type { CasinoWithAttachment } from '@shared/types/casino'
import type { SpecialOffer } from '@shared/types/specialOffer'
import { casinosHeading } from '@/lib/categories'

/** Offers shown per bonus type in the home page's Bonuses section — one row. */
const HOME_BONUSES_PER_CATEGORY = 3

/**
 * The hero's "How we time a payout" card: the four stages of the clock the
 * FAQ below explains. The last one is the finish, drawn in green.
 */
const PAYOUT_STAGES = [
  { title: 'Request sent', text: 'The clock starts the moment we ask for the money.' },
  { title: 'Pending window', text: 'Time the casino holds the request before approving.' },
  { title: 'Verification', text: 'Identity checks, listed separately for first payouts.' },
  { title: 'Money arrives', text: 'The clock stops in our account, not at "approved".' },
] as const

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? ''
const YEAR = new Date().getFullYear()

type Props = { searchParams: Promise<{ category?: string; page?: string }> }

// Resolve the selected category (default = first/highest-priority) for the home casinos section.
async function resolveCategory(searchParams: Props['searchParams']) {
  const sp = await searchParams
  const categories = (await getCategories()).data
  const selected =
    sp.category && categories.some((c) => c.slug === sp.category) ? sp.category : categories[0]?.slug
  return { categories: categories as Category[], selected }
}

export async function generateMetadata(): Promise<Metadata> {
  const title = `${COPY.home.homeTitle} ${YEAR} | ${SITE_NAME}`
  const description = COPY.home.metaDescription
  return {
    title,
    description,
    alternates: { canonical: '/' },
    openGraph: { type: 'website', url: '/', siteName: SITE_NAME, title, description, images: SHARE_IMAGES },
    twitter: { card: 'summary_large_image', title, description, images: SHARE_IMAGES },
  }
}

export default async function HomePage({ searchParams }: Props) {
  /*
   * THE HOME PAGE HAS ONE PAGE, so `?page=2` is a page past the end.
   *
   * Nothing here is paginated (the full list is /casinos), yet `/?page=2` and
   * every other number a crawler guessed answered 200 with the whole home page
   * and an `index` robots tag: a duplicate of `/` at a URL of its own. A 404
   * says it is not a page at all, the rule every paginated listing here applies
   * past its last page. `?page=1` never reaches this: proxy.ts 301s it to `/`.
   */
  if (Math.max(1, Number((await searchParams).page) || 1) > 1) notFound()

  const { categories, selected } = await resolveCategory(searchParams)

  const [categoryRes, offersRes, anyOffersRes, bonusRes] = await Promise.allSettled([
    selected ? getCategory(selected) : Promise.resolve(null),
    getSpecialOffers(selected, 6),
    // Site-wide, unfiltered, limit 1 — just "does a visible offer exist at all?".
    // Runs alongside the others, so it costs no extra round-trip of latency, and
    // the public endpoint already excludes offers whose visibility is off.
    getSpecialOffers(undefined, 1),
    // The bonus TYPES: the chip row under the hero AND the per-type Bonuses
    // section further down, so each type brings its first
    // HOME_BONUSES_PER_CATEGORY offers (one full row of the three-up grid).
    // The chips only read names, marks and counts, which the server counts
    // over the unlimited set. allSettled means a site without the Bonus area
    // renders neither, and falls back to the plain Special offers grid.
    getBonusArea(HOME_BONUSES_PER_CATEGORY),
  ])

  // Empty when the site does not publish the Bonus area, or when the
  // request failed — the strip renders nothing either way.
  const bonusSections: BonusSection[] = bonusRes.status === 'fulfilled' ? bonusRes.value : []

  const catData =
    categoryRes.status === 'fulfilled' && categoryRes.value ? categoryRes.value.data : null
  const casinos: CasinoWithAttachment[] = catData?.casinos ?? []
  const activeCategory = catData?.category ?? null
  // "See More" is only an affordance when there is actually more: compare the
  // category's full count against the rows this page received, rather than
  // hard-coding the page size on both sides where the two could drift apart.
  const hasMoreCasinos = (catData?.meta?.total ?? 0) > casinos.length
  // Offers are already scoped to the selected category and capped by the backend (?category=&limit=).
  const topOffers: SpecialOffer[] = offersRes.status === 'fulfilled' ? offersRes.value.data : []

  // Whether ANY special offer is visible on this site. Drives the hero CTA:
  // a button leading to an empty page is worse than no button. On a failed
  // request this stays false, so the CTA hides rather than promising content
  // that may not be there.
  const anyOffersVisible: boolean =
    anyOffersRes.status === 'fulfilled' && anyOffersRes.value.data.length > 0

  // Organization schema is emitted site-wide from the root layout; the home
  // page only adds its page-specific ItemList of top casinos.
  //
  // The list is the SELECTED category, not the whole catalogue, so it is named
  // and addressed as that category — it previously claimed the generic name
  // "Top Casinos at <brand>" and pointed at /casinos, describing neither the
  // rows below it nor a URL that renders them.
  const listSchema = buildItemListSchema(
    activeCategory ? `${activeCategory.name} — ${COPY.home.topCasinosTitle}` : COPY.home.topCasinosTitle,
    selected ? `${SITE_URL}/categories/${selected}` : `${SITE_URL}/casinos`,
    casinos.map((c, i) => ({ position: i + 1, name: c.name, url: `${SITE_URL}/casinos/${c.slug}` })),
  )

  const graph = [
    buildWebPageSchema({
      // Mirrors the actual <title>. The previous "Best Online Casinos <year>"
      // was generic boilerplate shipped identically by the sibling domains and
      // matched neither this page's title nor its H1.
      name: `${COPY.home.homeTitle} ${YEAR}`,
      url: SITE_URL,
      description: COPY.home.metaDescription,
    }),
    listSchema,
    // Same array the section below renders — markup-only FAQ is a violation.
    buildFaqSchema(SITE_URL, FAQ_ITEMS),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(graph) }} />

      <main>
        {/* Hero: the claim on the left, the stopwatch on the right. */}
        <section className="hero-wash border-b border-line">
          <div className="relative mx-auto flex max-w-[1200px] flex-wrap items-center gap-12 px-4 pb-16 pt-14 sm:pt-[76px]">
            <div className="min-w-0 flex-[1.25_1_520px]">
              <p className="kicker">{COPY.home.heroEyebrow}</p>
              <h1 className="font-display font-display-wide mt-[18px] text-[46px] leading-[0.92] text-ink sm:text-[clamp(46px,7vw,92px)]">
                {COPY.home.heroHeadline}{' '}
                <span className="text-outline block">{COPY.home.heroHighlight}</span>
              </h1>
              <p className="mt-6 max-w-[520px] text-lg text-muted">{COPY.home.heroSubtitle}</p>
              <div className="mt-[30px] flex flex-wrap gap-3">
                <Link href="/casinos" className="btn-primary inline-flex min-h-12 items-center justify-center whitespace-nowrap px-[22px] text-[15px] font-semibold">
                  {COPY.home.featuredCasinos}
                </Link>
                {/* Only when a visible offer exists: a button to an empty page
                    is worse than no button. */}
                {anyOffersVisible && (
                  <Link href="/special-offers" className="btn-ghost inline-flex min-h-12 items-center justify-center whitespace-nowrap px-[22px] text-[15px] font-semibold">
                    {COPY.home.specialOffers}
                  </Link>
                )}
              </div>
            </div>

            <aside aria-labelledby="payout-clock" className="min-w-0 flex-[1_1_340px] rounded-[20px] border border-line-soft bg-paper px-[22px] pb-2.5 pt-[22px] lg:ml-auto lg:max-w-[440px]">
              <div className="mb-3.5 flex items-center justify-between gap-3">
                <h2 id="payout-clock" className="font-display text-[17px] text-ink">How we time a payout</h2>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-accent">
                  <span aria-hidden className="cg-blink h-2 w-2 rounded-full bg-accent" />
                  Clock running
                </span>
              </div>
              <ol>
                {PAYOUT_STAGES.map((stage, i) => {
                  const last = i === PAYOUT_STAGES.length - 1
                  return (
                    <li key={stage.title} className="cg-spine grid grid-cols-[28px_minmax(0,1fr)] gap-3.5 pb-[18px]">
                      <span aria-hidden className={`grid h-7 w-7 place-items-center rounded-full border-2 font-mono text-xs ${last ? 'border-win bg-win text-win-bg' : 'border-brand-dark bg-brand-dark text-white'}`}>
                        {last ? '✓' : i + 1}
                      </span>
                      <div>
                        <b className="block text-[15px] text-ink">{stage.title}</b>
                        <span className="block text-[13px] text-muted">{stage.text}</span>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </aside>
          </div>
        </section>

        {/* The ranking */}
        <section id="rank" className="py-[72px]" aria-labelledby="top-casinos-heading">
          <div className="mx-auto max-w-[1200px] px-4">
            <p className="kicker">The ranking</p>
            <h2 id="top-casinos-heading" className="font-display mt-2 text-[30px] leading-none text-ink sm:text-[48px]">{COPY.home.topCasinosTitle}</h2>
            <p className="mt-3 max-w-[560px] text-muted">{COPY.home.topCasinosSubtitle}</p>

            {categories.length > 0 && selected && (
              <div className="mt-[26px]"><CategoryNav categories={categories} selected={selected} /></div>
            )}

            {casinos.length === 0 ? (
              <p className="mt-6 text-muted">{COPY.casinos.noResults}</p>
            ) : (
              <ol className={`mt-[22px] ${CASINO_GRID}`}>
                {casinos.map((casino, i) => <CasinoCard key={casino.id} casino={casino} rank={i + 1} />)}
              </ol>
            )}

            {activeCategory && hasMoreCasinos && (
              <div className="mt-[26px] flex justify-center">
                <Link href={`/categories/${selected}`} aria-label={`See More Casinos — ${casinosHeading(activeCategory.name)}`} className="btn-ghost inline-flex min-h-12 items-center px-[22px] text-[15px] font-semibold">
                  See More Casinos →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Bonuses by kind — renders nothing when the site does not publish
            the Bonus area, so the band collapses rather than leaving a gap. */}
        {bonusSections.length > 0 && (
          <section className="pb-[72px]">
            <div className="mx-auto max-w-[1200px] px-4">
              <BonusCategoryNav sections={bonusSections} />
            </div>
          </section>
        )}

        {/* Bonuses — a row per bonus type, built from the same getBonusArea
            payload as the list above and the header/footer menus, so no row
            links to a type the menu lacks. A site without the Bonus area keeps
            the flat offers grid instead. */}
        {bonusSections.length > 0 ? (
          <section className="pb-[72px]" aria-labelledby="bonus-heading">
            <div className="mx-auto max-w-[1200px] px-4">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 id="bonus-heading" className="font-display text-[30px] leading-none text-ink sm:text-[48px]">{COPY.home.bonus}</h2>
                <Link href="/special-offers" aria-label={`${COPY.home.viewAll} bonuses`} className="inline-flex min-h-11 items-center font-semibold text-brand-soft hover:text-white">{COPY.home.viewAll} →</Link>
              </div>
              <BonusRows sections={bonusSections} />
              <div className="mt-[26px]">
                <Link href="/special-offers" className="btn-ghost inline-flex min-h-12 items-center px-[22px] text-[15px] font-semibold">
                  {COPY.home.seeAllBonuses} →
                </Link>
              </div>
            </div>
          </section>
        ) : topOffers.length > 0 && (
          <section className="pb-[72px]" aria-labelledby="offers-heading">
            <div className="mx-auto max-w-[1200px] px-4">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 id="offers-heading" className="font-display text-[30px] leading-none text-ink sm:text-[48px]">{COPY.home.specialOffers}</h2>
                <Link href="/special-offers" aria-label={`${COPY.home.viewAll} offers`} className="inline-flex min-h-11 items-center font-semibold text-brand-soft hover:text-white">{COPY.home.viewAll} →</Link>
              </div>
              <div className="mt-[26px] grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {topOffers.map((offer) => <SpecialOfferCard key={offer.id} offer={offer} />)}
              </div>
            </div>
          </section>
        )}

        {/* FAQ — rendered visibly because FAQPage structured data requires it,
            from the same FAQ_ITEMS array the schema is built from. Heading
            column on the left (sticky from lg), the questions on a numbered
            spine on the right. */}
        <section aria-labelledby="faq-heading">
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-start gap-12 px-4">
            <div className="flex-[1_1_300px] lg:sticky lg:top-24">
              <p className="kicker">FAQ</p>
              <h2 id="faq-heading" className="font-display font-display-wide mt-2.5 text-[34px] leading-[0.98] text-ink sm:text-[clamp(34px,4.4vw,54px)]">{COPY.home.faqTitle}</h2>
              <p className="mt-4 text-muted">Hours, not adjectives. This is what the numbers on the list mean.</p>
            </div>
            <div className="min-w-0 flex-[2_1_520px]">
              {FAQ_ITEMS.map((item, i) => (
                <div key={item.question} className="cg-spine cg-spine-qa grid grid-cols-[44px_minmax(0,1fr)] gap-[18px] pb-[30px] last:pb-0">
                  <span aria-hidden className="grid h-11 w-11 place-items-center rounded-[14px] border border-line-soft bg-surface font-mono text-sm text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="mt-2 text-[19px] font-semibold text-ink">{item.question}</h3>
                    <p className="mt-2 text-[15px] leading-[1.7] text-muted">{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
