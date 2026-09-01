import Link from 'next/link'

/**
 * Crogambline brand logo, taken from the inline SVG in sites/crogambline.html:
 * a square violet tile holding an open "C" in the ink colour, with a coral pip
 * breaking out of the curve.
 *
 * The mockup wrote the fills as `var(--cg-primary)` etc. Those variables do not
 * exist here — the palette moved into the theme layer — so the SVG reads the
 * project's own tokens instead. `currentColor` is not usable: the mark needs
 * three separate colours in one glyph.
 *
 * Same component contract as the sibling sites: one optional `className`, the
 * Link carries the accessible name, and the artwork is aria-hidden so a screen
 * reader announces the destination once rather than twice.
 */
/**
 * The bare mark, with no link or wordmark around it.
 *
 * Exported because the footer needs the SAME artwork. It used to carry its own
 * copy of an SVG — and that copy was nongambles' lime struck-circle, left over
 * from scaffolding this site from that one, with `#c9f24d` hardcoded so it did
 * not even follow the theme. One definition, used in both places, is what stops
 * that happening again.
 */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      role="presentation"
      className="shrink-0"
    >
      <rect width="32" height="32" rx="4" className="fill-brand" />
      <path
        d="M21.6 10.2a7.4 7.4 0 1 0 0 11.6"
        fill="none"
        strokeWidth="3.4"
        strokeLinecap="square"
        className="stroke-[var(--color-brand-ink)]"
      />
      <rect x="21" y="13.2" width="5.6" height="5.6" className="fill-accent" />
    </svg>
  )
}

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Crogambline home"
      className={`inline-flex shrink-0 items-center gap-3 rounded-[3px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${className}`.trim()}
    >
      <LogoMark />

      <span className="flex flex-col leading-none">
        <span className="font-display text-[19px] text-ink">Crogambline</span>
        <span className="kicker mt-[4px] text-[8px] text-faint">Time to cash</span>
      </span>
    </Link>
  )
}
