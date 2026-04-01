/**
 * AvailabilityLegend — Color Key (matches Kevin's design)
 * ========================================================
 * Small swatches showing what the slot colors mean.
 * Uses 2.5x2.5 rounded squares with matching colors.
 */

'use client'

export default function AvailabilityLegend() {
  return (
    <div className="flex items-center gap-4 text-[11px]" style={{ color: 'var(--sched-text-muted)' }}>
      <span className="flex items-center gap-1.5">
        <span
          className="h-2.5 w-2.5 rounded-sm"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--sched-accent) 20%, transparent)',
            border: '1px solid color-mix(in srgb, var(--sched-accent) 30%, transparent)',
          }}
        />
        Available
      </span>
      <span className="flex items-center gap-1.5">
        <span
          className="h-2.5 w-2.5 rounded-sm"
          style={{
            backgroundColor: 'var(--sched-accent)',
            border: '1px solid var(--sched-accent)',
          }}
        />
        Selected
      </span>
    </div>
  )
}
