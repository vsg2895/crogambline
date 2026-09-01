import Link from 'next/link'
import type { Category } from '@shared/types/category'

/**
 * Crogambline category selector — square chips with a violet active state.
 * Works on the home page (basePath="/") and the casinos listing.
 */
export default function CategoryNav({
  categories,
  selected,
  basePath = '/casinos',
}: {
  categories: Category[]
  selected: string
  basePath?: string
}) {
  return (
    <nav aria-label="Casino categories" className="flex flex-wrap gap-3">
      {categories.map((c) => {
        const active = c.slug === selected
        return (
          <Link
            key={c.id}
            // On the home page the nav is an in-page filter (basePath="/"), so it
            // keeps the query form. Anywhere else it links straight at the
            // canonical category route — never through the 301.
            href={basePath === '/' ? `/?category=${c.slug}` : `/categories/${c.slug}`}
            aria-current={active ? 'page' : undefined}
            // `.chip` / `.chip-active` carry the colours and the hover state,
            // which cannot be expressed inline. min-h-11 keeps a 44px tap target.
            className={`chip flex min-h-11 items-center gap-2 px-4 py-2 text-sm transition-colors ${
              active ? 'chip-active font-semibold' : 'font-medium'
            }`}
          >
            {c.name}
            {typeof c.casinos_count === 'number' && (
              <span className={`text-xs ${active ? 'opacity-60' : 'text-faint'}`}>{c.casinos_count}</span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
