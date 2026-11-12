import Link from 'next/link'
import { COPY } from '@/constants/copy'
import { Stars } from '@/components/CasinoCard'
import { CLAIMABLE_BONUS_CATEGORY } from '@/components/SpecialOfferCard'
import type { BonusSection } from '@/lib/api'
import type { SpecialOffer } from '@shared/types/specialOffer'

/**
 * One offer in a bonus row: whose it is (mono), its name, the bonus in signal
 * orange, the stars, then the actions.
 *
 * Claim follows the same rule as SpecialOfferCard: it exists only on the
 * Special Offers type, and only when the offer has an affiliate link (the
 * link-less case falls back to Details, which reaches the same offer page).
 */
export function OfferCell({ offer }: { offer: SpecialOffer }) {
  const claimable = offer.bonus_category_slug === CLAIMABLE_BONUS_CATEGORY && !!offer.affiliate_url

  return (
    <li className="flex flex-col gap-1 rounded-[14px] border border-line bg-paper p-4 transition-colors hover:border-brand">
      {offer.casino?.name && <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-faint">{offer.casino.name}</span>}
      <Link href={`/special-offers/${offer.slug}`} className="py-0.5 text-[15px] font-semibold text-ink hover:text-white">{offer.title}</Link>
      {offer.bonuses && <span className="text-sm font-semibold text-accent-soft">{offer.bonuses}</span>}
      <Stars rating={offer.rating} className="text-xs" />
      <span className="mt-auto flex flex-wrap gap-x-4 pt-1 text-[13px] font-semibold">
        <Link href={`/special-offers/${offer.slug}`} aria-label={`Details: ${offer.title}`} className="inline-flex min-h-11 items-center text-brand-soft hover:text-white">Details →</Link>
        {claimable && (
          <a href={offer.affiliate_url!} target="_blank" rel="nofollow sponsored noopener" className="inline-flex min-h-11 items-center text-accent hover:text-white">
            Claim ↗
          </a>
        )}
      </span>
    </li>
  )
}

/**
 * The home page's Bonuses, from sites/crogambline-redesign.html: one row per
 * bonus type — its name, line and "See more" on the left, its first offers
 * beside it. Each row is anchored `#bonus-<slug>` (the anchor every site's
 * home page exposes); scroll-mt clears the sticky header.
 */
export default function BonusRows({ sections }: { sections: BonusSection[] }) {
  return (
    <div className="mt-[26px] border-t border-line">
      {sections.map((section) => (
        <div
          key={section.id}
          id={`bonus-${section.slug}`}
          className="grid scroll-mt-24 grid-cols-1 gap-3.5 border-b border-line py-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-6"
        >
          <div>
            <h3 className="font-display text-[22px] text-ink">
              <Link href={`/bonuses/${section.slug}`} className="hover:text-white">{section.name}</Link>
            </h3>
            <p className="mt-1.5 text-[13px] text-faint">
              {section.description || `${section.offers_count} ${section.offers_count === 1 ? 'offer' : 'offers'} listed`}
            </p>
            <Link
              href={`/bonuses/${section.slug}`}
              aria-label={`${COPY.home.seeMore} — ${section.name}`}
              className="mt-1 inline-flex min-h-11 items-center text-sm text-brand-soft hover:text-white"
            >
              {COPY.home.seeMore} →
            </Link>
          </div>
          <ul role="list" className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {section.offers.map((offer) => <OfferCell key={offer.id} offer={offer} />)}
          </ul>
        </div>
      ))}
    </div>
  )
}
