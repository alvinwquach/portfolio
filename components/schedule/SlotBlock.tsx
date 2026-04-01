/**
 * SlotBlock — Individual Time Slot in the Calendar Grid
 * =====================================================
 *
 * WHAT IS THIS?
 * Each clickable time block in the calendar columns.
 * Shows the formatted time (e.g., "9:00 AM") and applies the
 * correct CSS class based on the slot's state.
 *
 * SLOT STATES (from globals.css):
 *   .slot-available  → Blue-tinted, clickable
 *   .slot-selected   → Solid blue with checkmark
 *   .slot-disabled   → Grayed out, not clickable
 *   .slot-pending    → Dashed border, dimmed blue
 *
 * PROPS:
 *   slot      — TimeSlot data (start, end, available, isPending)
 *   timezone  — User's IANA timezone for display formatting
 *   isSelected — Whether this slot is the currently selected one
 *   onSelect  — Callback when user clicks an available slot
 */

'use client'

import type { TimeSlot } from '@/types/scheduling'
import { formatSlotForDisplay } from '@/lib/scheduling/slots'

interface SlotBlockProps {
  slot: TimeSlot
  timezone: string
  isSelected: boolean
  onSelect: (slot: TimeSlot) => void
}

export default function SlotBlock({
  slot,
  timezone,
  isSelected,
  onSelect,
}: SlotBlockProps) {
  // PSEUDOCODE:
  // determine which CSS class to apply:
  //   if isSelected → "slot-selected"
  //   if not available → "slot-disabled"
  //   if isPending → "slot-pending"
  //   else → "slot-available"
  //
  // format the time for display in user's timezone
  //
  // render a button with:
  //   the correct CSS class
  //   the formatted time
  //   a checkmark if selected
  //   onClick handler (only if available)

  // ── Determine CSS class ────────────────────────────────
  const getSlotClass = (): string => {
    if (isSelected) return 'slot-selected'
    if (!slot.available) return 'slot-disabled'
    if (slot.isPending) return 'slot-pending'
    return 'slot-available'
  }

  // ── Format time for display ────────────────────────────
  // Converts UTC ISO string to localized time (e.g., "9:00 AM")
  const displayTime = formatSlotForDisplay(slot.start, timezone)

  // ── Can this slot be clicked? ──────────────────────────
  // Only available and pending slots are clickable.
  // Disabled (past/unavailable) slots can't be selected.
  const isClickable = slot.available || slot.isPending

  return (
    <button
      className={getSlotClass()}
      onClick={() => isClickable && onSelect(slot)}
      disabled={!isClickable}
      // tabIndex: disabled slots shouldn't receive keyboard focus
      tabIndex={isClickable ? 0 : -1}
      // aria-label for screen readers
      aria-label={`${displayTime}${isSelected ? ' (selected)' : ''}${!slot.available ? ' (unavailable)' : ''}`}
      type="button"
    >
      <span className="flex items-center justify-center gap-1.5">
        {displayTime}
        {/* Show a checkmark next to the time when selected */}
        {isSelected && (
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        )}
      </span>
    </button>
  )
}
