import Link from 'next/link'

/**
 * Crogambline brand logo, from sites/crogambline-redesign.html: a rounded
 * violet tile holding a white stopwatch, with a signal-orange pip on its
 * corner — the "time to cash" clock the whole design is built around.
 *
 * Same component contract as the sibling sites: one optional `className`. The
 * Link has NO aria-label: its visible text ("Crogambline Time to cash") is its
 * accessible name, and a label that did not start with that text failed
 * Lighthouse's label-content-name-mismatch audit.
 */

/**
 * The bare mark, with no link or wordmark around it. Exported because the
 * footer shows the SAME artwork — one definition, so the two cannot drift.
 */
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="relative grid shrink-0 place-items-center rounded-xl bg-brand-dark"
      style={{ width: size, height: size }}
    >
      <svg width={size / 2} height={size / 2} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v4l2.5 2M10 2h4" />
      </svg>
      <span className="absolute -right-[3px] -top-[3px] h-2.5 w-2.5 rounded-full border-2 border-cream bg-accent" />
    </span>
  )
}

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex min-h-11 shrink-0 items-center gap-3 rounded-xl ${className}`.trim()}>
      <LogoMark />
      <span className="flex flex-col">
        <span className="font-display text-[20px] leading-none text-ink">Crogambline</span>
        <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Time to cash</span>
      </span>
    </Link>
  )
}
