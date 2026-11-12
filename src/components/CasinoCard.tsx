import Image from 'next/image'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { CasinoWithAttachment } from '@shared/types/casino'

export function Stars({ rating, className = '' }: { rating: number; className?: string }) {
  return (
    <span className={`tracking-[1px] text-gold ${className}`.trim()} role="img" aria-label={`Rated ${rating} out of 5`}>
      {'★'.repeat(rating)}
      <span className="text-line-soft">{'★'.repeat(5 - rating)}</span>
    </span>
  )
}

/**
 * The casino's logo on the white tile every logo sits on, so dark
 * and light artwork alike stay legible on the violet ground. With no artwork,
 * the name itself in the tile.
 */
export function LogoTile({ casino, className = '' }: { casino: CasinoWithAttachment; className?: string }) {
  // The casino's "Image" (logo), NOT the wide "Banner Image" (that's used big
  // on the single casino page). Falls back to the banner if no Image.
  const image = resolveImageUrl(casino.image_path ?? casino.banner_image)

  return (
    <span className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-white p-1 text-center text-xs font-bold leading-tight text-cream ${className}`.trim()}>
      {image ? (
        <Image src={image} alt={casino.name} width={224} height={160} sizes="112px" className="h-auto max-h-full w-auto max-w-full object-contain" />
      ) : (
        casino.name
      )}
    </span>
  )
}

/**
 * One casino in the ranking, from sites/crogambline-redesign.html: a card with
 * the logo tile, name and score, the headline offer in a signal-orange band, and the two actions.
 * Rendered as an <li>, so the list it sits in (an <ol> grid) keeps the order.
 *
 * Rank 1 carries the "Fastest tested" tag — by rank, not position, so page 2
 * of a list has none. The list order is the ranking; no number is printed.
 */
export default function CasinoCard({ casino, rank }: { casino: CasinoWithAttachment; rank?: number }) {
  return (
    <li className="card cg-casino relative flex flex-col gap-3.5 overflow-hidden p-[22px]">
      {rank === 1 && (
        <span className="-mb-1 self-start rounded-full border border-brand/40 bg-brand/15 px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-brand-soft">FASTEST TESTED</span>
      )}

      <div className="relative flex items-center gap-4">
        <LogoTile casino={casino} className="cg-logo h-20 w-28 rounded-2xl" />
        <div className="min-w-0">
          <h3 className="font-display text-[22px] leading-[1.05] text-ink">
            {casino.name}
          </h3>
          <p className="mt-1 flex items-center gap-2 text-[13px] text-muted">
            <Stars rating={casino.rating} />
            {casino.rating.toFixed(1)}
          </p>
        </div>
      </div>

      {casino.bonuses && (
        <p className="rounded-xl bg-accent/15 px-3.5 py-3 text-[15px] font-semibold text-accent-soft">{casino.bonuses}</p>
      )}

      <div className="mt-auto grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">
        <a
          href={casino.attachment.affiliate_url}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="btn-primary inline-flex min-h-11 items-center justify-center whitespace-nowrap px-2.5 text-sm font-semibold"
        >
          {COPY.casinos.visitCasino}
        </a>
        <Link
          href={`/casinos/${casino.slug}`}
          className="btn-ghost inline-flex min-h-11 items-center justify-center whitespace-nowrap px-2.5 text-sm font-semibold"
        >
          {COPY.casinos.readReview}
        </Link>
      </div>
    </li>
  )
}

/** The <ol> classes every list of CasinoCards uses: 3 / 2 / 1 columns. */
export const CASINO_GRID = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
