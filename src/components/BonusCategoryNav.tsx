import Link from 'next/link'
import { COPY } from '@/constants/copy'
import type { BonusSection } from '@/lib/api'

/**
 * The catch-all heading, which this list deliberately leaves out.
 *
 * Every offer not filed under a real type lands under "Special Offers", so it
 * is not a type at all — it is the whole area, already reachable from the nav
 * and the offers page. Hidden here rather than in the admin: the admin's
 * "Shown" switch would also remove it from the menu and the sections.
 */
const CATCH_ALL_SLUG = 'special-offers'

/**
 * "Bonuses By Kind", from sites/crogambline-redesign.html: one row per bonus
 * type — its name, a violet bar sized by how many bonuses it holds relative
 * to the largest type, and the count in mono. Each row opens that type's own
 * page.
 *
 * The counts are the SITE's — active, claimable, owned by a casino attached
 * here — resolved server-side, so a bar never promises more than its page has.
 * Renders nothing when the site has no Bonus area or every type is empty.
 */
export default function BonusCategoryNav({ sections }: { sections: BonusSection[] }) {
  const types = sections.filter((section) => section.slug !== CATCH_ALL_SLUG)
  if (types.length === 0) return null

  const max = Math.max(...types.map((t) => t.offers_count), 1)

  return (
    <nav aria-labelledby="bonus-types-heading">
      <p className="kicker">Browse</p>
      <h2 id="bonus-types-heading" className="font-display mt-2 text-[30px] leading-none text-ink sm:text-[48px]">
        {COPY.home.bonusTypesTitle}
      </h2>
      <ul className="mt-[26px] flex flex-col gap-2" role="list">
        {types.map((section) => (
          <li key={section.id}>
            <Link
              href={`/bonuses/${section.slug}`}
              className="grid grid-cols-[minmax(0,1fr)_40px] items-center gap-x-4 gap-y-2 rounded-xl border border-transparent px-4 py-3 text-ink transition-colors hover:border-line hover:bg-ground-2 hover:text-white sm:grid-cols-[180px_minmax(0,1fr)_48px]"
            >
              <span className="font-semibold">{section.name}</span>
              <span aria-hidden className="col-span-2 row-start-2 h-3 overflow-hidden rounded-full bg-ground-2 sm:col-span-1 sm:row-start-auto">
                <span
                  className="block h-full rounded-full bg-gradient-to-r from-brand to-brand-soft"
                  style={{ width: `${Math.round((section.offers_count / max) * 100)}%` }}
                />
              </span>
              <span className="col-start-2 row-start-1 text-right font-mono text-accent sm:col-start-3">
                {section.offers_count}
                <span className="sr-only"> {section.offers_count === 1 ? COPY.bonusCategory.countOne : COPY.bonusCategory.countMany}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
