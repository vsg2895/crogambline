'use client'

import { useState } from 'react'
import Link from 'next/link'
import { COPY } from '@/constants/copy'
import type { SpecialOffer } from '@shared/types/specialOffer'

const PER_PAGE = 4

/**
 * A casino's attached special offers, shown 4 at a time with the total count.
 * When there are more than 4, client-side pagination pages through them (the
 * offers already arrive with the casino, so no extra fetch is needed).
 */
export default function CasinoSpecialOffers({ offers }: { offers: SpecialOffer[] }) {
  const [page, setPage] = useState(0)

  // The API may serialize an empty relation as {} rather than []; guard for it
  // so a casino with no offers doesn't crash (offers.slice is not a function).
  const list = Array.isArray(offers) ? offers : []
  const total = list.length
  if (total === 0) return null

  const pageCount = Math.ceil(total / PER_PAGE)
  const start = page * PER_PAGE
  const visible = list.slice(start, start + PER_PAGE)

  return (
    <section className="mt-11">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h2 className="min-w-0 font-display text-[24px] leading-tight text-ink sm:text-[30px]">
          {COPY.casinos.offersHeading} <span className="text-faint">({total})</span>
        </h2>
        {pageCount > 1 && (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Previous offers"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line-soft text-muted transition-colors hover:border-brand-soft hover:text-white disabled:opacity-40 disabled:hover:border-line-soft disabled:hover:text-muted"
            >
              ←
            </button>
            {/* `whitespace-nowrap`, and it is load-bearing: in a flex row next
                to a heading this is three tokens ("1", "/", "2"), and a long
                heading squeezed it into three stacked lines between the two
                arrows. The counter is one word, so it is told to behave like
                one. */}
            <span className="whitespace-nowrap font-mono text-sm text-muted">{page + 1} / {pageCount}</span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={page === pageCount - 1}
              aria-label="More offers"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line-soft text-muted transition-colors hover:border-brand-soft hover:text-white disabled:opacity-40 disabled:hover:border-line-soft disabled:hover:text-muted"
            >
              →
            </button>
          </div>
        )}
      </div>

      {/* The design's offer cells: type, name, bonus, link — the whole cell
          one link to the offer's page. */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-3">
        {visible.map((offer) => (
          <Link
            key={offer.id}
            href={`/special-offers/${offer.slug}`}
            className="flex flex-col gap-1 rounded-[14px] border border-line bg-paper p-4 text-ink transition-colors hover:border-brand"
          >
            {/* The bonus TYPE, as the editor named it; an unfiled offer shows
                nothing rather than an empty label. */}
            {offer.bonus_category_name && (
              <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-faint">{offer.bonus_category_name}</span>
            )}
            <span className="text-[15px] font-semibold">{offer.title}</span>
            {offer.bonuses && <span className="line-clamp-2 text-sm font-semibold text-accent-soft">{offer.bonuses}</span>}
            <span className="mt-auto pt-2 text-[13px] font-semibold text-brand-soft">View offer →</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
