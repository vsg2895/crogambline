import Link from 'next/link'
import { Stars } from '@/components/CasinoCard'
import type { SpecialOffer } from '@shared/types/specialOffer'

/**
 * The bonus type whose cards carry a Claim button.
 *
 * WHY A TYPE AND NOT THE LINK. Claim used to appear on any offer that happened
 * to carry an affiliate URL, which made the card's primary action a property of
 * the data rather than an editorial decision: filing a bonus under "Free Spins"
 * or "Cashback" still produced a Claim button, because those offers have links
 * too. Claim now means one thing — this is a Special Offer — and whether the
 * offer has a link of its own no longer decides it.
 */
export const CLAIMABLE_BONUS_CATEGORY = 'special-offers'

/**
 * One offer on the listing pages, in the card vocabulary of
 * sites/crogambline-redesign.html: whose it is (mono), its name, the bonus in
 * signal orange, the stars, then the actions. No artwork — the design's offer
 * cells are text, and the offer page shows the banner whole.
 */
export default function SpecialOfferCard({ offer }: { offer: SpecialOffer }) {
  // Claim is a property of the bonus TYPE, not of whether a link happens
  // to be filled in. See CLAIMABLE_BONUS_CATEGORY.
  const claimable = offer.bonus_category_slug === CLAIMABLE_BONUS_CATEGORY

  return (
    <article className="card flex flex-col gap-1.5 p-5 hover:border-brand">
      {/* WHOSE bonus this is, above its name: a card in a grid of twenty does
          not say who gives it, which is the first thing someone comparing
          offers needs. Omitted, not blank, when the casino is not loaded. */}
      {offer.casino?.name && (
        <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-faint">{offer.casino.name}</p>
      )}
      <h3 className="text-[17px] font-semibold leading-snug text-ink">
        <Link href={`/special-offers/${offer.slug}`} className="block py-0.5 hover:text-white">{offer.title}</Link>
      </h3>
      {offer.bonuses && <p className="text-[15px] font-semibold text-accent-soft">{offer.bonuses}</p>}
      <Stars rating={offer.rating} className="text-sm" />
      <div className="mt-auto flex gap-2 pt-3">
        {/*
          * Claim belongs to the Special Offers bonus type and to nothing else.
          *
          * Three states, and the middle one is why this is not just
          * `offer.affiliate_url &&`:
          *
          *   Special Offers + link   →  Details · Claim → the casino
          *   Special Offers, NO link →  Claim alone, leading to the offer's own
          *                              page, where the terms and the operator
          *                              are. One button rather than two to the
          *                              same place.
          *   any other bonus type    →  Details alone. A Free Spins or Cashback
          *                              card is a link to a write-up, not a
          *                              call to action.
          */}
        {!(claimable && !offer.affiliate_url) && (
          <Link href={`/special-offers/${offer.slug}`} className="btn-ghost flex min-h-11 flex-1 items-center justify-center px-3 text-center text-sm font-semibold">Details</Link>
        )}
        {claimable && (
          offer.affiliate_url ? (
            <a href={offer.affiliate_url} target="_blank" rel="nofollow sponsored noopener" className="btn-primary flex min-h-11 flex-1 items-center justify-center px-3 text-center text-sm font-semibold">Claim</a>
          ) : (
            // No affiliate URL of its own: the offer's page is the only place that
            // can actually lead to the operator, so Claim goes there rather than
            // nowhere. An internal link, so no sponsored rel.
            <Link href={`/special-offers/${offer.slug}`} className="btn-primary flex min-h-11 flex-1 items-center justify-center px-3 text-center text-sm font-semibold">Claim</Link>
          )
        )}
      </div>
    </article>
  )
}
