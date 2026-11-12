import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import type { Category } from '@shared/types/category'

/**
 * Crogambline category selector, from sites/crogambline-redesign.html: one
 * segmented control — every category a segment with its count in mono, the
 * selected one raised (`.chip-active`, count in signal orange). Wider than
 * the screen, it scrolls sideways inside its own track; the page never does.
 *
 * Mounted on the home page and on the casinos listing.
 *
 * On a phone the chips stack, one per row, each the full width of the column;
 * from sm they are one row of EQUAL chips — `w-max` + `1fr` columns, so every
 * track resolves to the widest label — scrolling sideways in its own track if
 * the row is wider than the page.
 */
export default function CategoryNav({
  categories,
  selected,
}: {
  categories: Category[]
  selected: string
}) {
  return (
    <nav
      aria-label="Casino categories"
      className="no-scrollbar grid grid-cols-1 gap-1 rounded-[14px] border border-line bg-ground-2 p-1 sm:inline-grid sm:max-w-full sm:auto-cols-[1fr] sm:grid-flow-col sm:grid-cols-none sm:overflow-x-auto"
    >
      {categories.map((c) => {
        const active = c.slug === selected
        return (
          <Link
            key={c.id}
            /*
             * ALWAYS the canonical category route.
             *
             * `/?category=<slug>` and `/casinos?category=<slug>` are both 301'd
             * to this very URL at the edge (lib/seo/redirects.ts), so emitting
             * either would mean linking a redirect — one wasted hop per visitor
             * and, per category, crawl budget spent on URLs that resolve
             * elsewhere. The segments therefore NAVIGATE rather than filter in
             * place: the destination renders the same list under a URL that
             * can be linked, shared and indexed.
             */
            href={`/categories/${c.slug}`}
            aria-current={active ? 'page' : undefined}
            className={`chip flex min-h-10 w-full items-center justify-center gap-2 whitespace-nowrap px-3.5 text-sm font-medium transition-colors ${active ? 'chip-active' : ''}`}
          >
            {/* The category's own icon, the one the Casinos menu shows beside it.
                A plain <img>: next/image refuses SVG, and an icon gains nothing
                from resizing. alt="" because the label already names it. */}
            {c.logo_path && (
              <img src={resolveImageUrl(c.logo_path)!} alt="" width={16} height={16} className="h-4 w-4 shrink-0" />
            )}
            {c.name}
            {typeof c.casinos_count === 'number' && (
              <span className={`font-mono text-xs ${active ? 'text-accent' : 'text-faint'}`}>{c.casinos_count}</span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
