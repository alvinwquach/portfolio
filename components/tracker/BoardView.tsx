'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'
import { ApplicationCard } from './ApplicationCard'
import { ApplicationDetail } from './ApplicationDetail'
import { moveApplication, reorderApplications } from '@/app/actions/tracker-update'
import type { JobApplication } from './types'

const BOARD_COLUMNS = [
  {
    key: 'saved',
    label: 'Saved',
    dotColor: 'bg-zinc-500',
    statuses: ['saved'],
  },
  {
    key: 'applied',
    label: 'Applied',
    dotColor: 'bg-blue-500',
    statuses: ['applied'],
  },
  {
    key: 'screen',
    label: 'Screen',
    dotColor: 'bg-amber-500',
    statuses: ['phone-screen'],
  },
  {
    key: 'interview',
    label: 'Interview',
    dotColor: 'bg-purple-500',
    statuses: ['technical', 'onsite'],
  },
  {
    key: 'offer',
    label: 'Offer',
    dotColor: 'bg-green-500',
    statuses: ['offer'],
  },
  {
    key: 'closed',
    label: 'Closed',
    dotColor: 'bg-red-500',
    statuses: ['rejected', 'ghosted', 'withdrawn'],
  },
] as const

const COLUMN_DROP_STATUS: Record<string, string> = {
  saved: 'saved',
  applied: 'applied',
  screen: 'phone-screen',
  interview: 'technical',
  offer: 'offer',
  closed: 'withdrawn',
}

function SortableCard({
  app,
  onClick,
}: {
  app: JobApplication
  onClick: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: app._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(isDragging && 'opacity-30')}
    >
      <ApplicationCard app={app} onClick={onClick} />
    </div>
  )
}

function DroppableColumn({
  columnKey,
  dotColor,
  label,
  apps,
  onCardClick,
}: {
  columnKey: string
  dotColor: string
  label: string
  apps: JobApplication[]
  onCardClick: (app: JobApplication) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: columnKey })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col rounded-lg border border-line/30 bg-surface/30 p-2 transition-colors',
        isOver && 'border-accent/40 bg-accent/5',
      )}
    >
      <div className="mb-2 flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <span className={cn('h-2 w-2 rounded-full', dotColor)} />
          <span className="text-[11px] font-medium text-text-muted/70">
            {label}
          </span>
        </div>
        <span className="text-[11px] text-text-muted/40">{apps.length}</span>
      </div>

      <SortableContext
        items={apps.map((a) => a._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-1 flex-col gap-1.5">
          {apps.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-line/20 py-14">
              <span className="text-[10px] text-text-muted/20">
                No applications
              </span>
            </div>
          ) : (
            apps.map((app) => (
              <SortableCard
                key={app._id}
                app={app}
                onClick={() => onCardClick(app)}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  )
}

export function BoardView({
  applications,
}: {
  applications: JobApplication[]
}) {
  const [selected, setSelected] = useState<JobApplication | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [localApps, setLocalApps] = useState(applications)
  const [mounted, setMounted] = useState(false)
  const savingRef = useRef(false)

  // Track the original status before drag starts for accurate change detection
  const dragStartStatusRef = useRef<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Sync from server props, but not while a save is in flight
  useEffect(() => {
    if (!savingRef.current) {
      setLocalApps(applications)
    }
  }, [applications])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  )

  const columns = useMemo(
    () =>
      BOARD_COLUMNS.map((col) => ({
        ...col,
        apps: localApps
          .filter((a) => col.statuses.includes(a.status as never))
          .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity)),
      })),
    [localApps],
  )

  const activeApp = activeId
    ? localApps.find((a) => a._id === activeId) ?? null
    : null

  function findColumnForApp(appId: string): string | null {
    for (const col of columns) {
      if (col.apps.some((a) => a._id === appId)) return col.key
    }
    return null
  }

  function handleDragStart(event: DragStartEvent) {
    const id = event.active.id as string
    setActiveId(id)
    const app = localApps.find((a) => a._id === id)
    dragStartStatusRef.current = app?.status ?? null
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeAppId = active.id as string
    const overId = over.id as string

    const sourceCol = findColumnForApp(activeAppId)
    const destCol =
      BOARD_COLUMNS.find((c) => c.key === overId)?.key ??
      findColumnForApp(overId)

    if (!sourceCol || !destCol || sourceCol === destCol) return

    setLocalApps((prev) =>
      prev.map((a) =>
        a._id === activeAppId
          ? { ...a, status: COLUMN_DROP_STATUS[destCol] }
          : a,
      ),
    )
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    const originalStatus = dragStartStatusRef.current
    setActiveId(null)
    dragStartStatusRef.current = null

    if (!over || !originalStatus) return

    const activeAppId = active.id as string
    const overId = over.id as string

    // Determine which column the card is now in
    const targetColKey =
      BOARD_COLUMNS.find((c) => c.key === overId)?.key ??
      findColumnForApp(activeAppId) ??
      findColumnForApp(overId)

    if (!targetColKey) return

    const newStatus = COLUMN_DROP_STATUS[targetColKey]

    // Build ordered IDs for the target column
    const colDef = BOARD_COLUMNS.find((c) => c.key === targetColKey)!
    const colApps = localApps.filter((a) =>
      colDef.statuses.includes(a.status as never) ||
      (a._id === activeAppId && a.status === newStatus),
    )

    // Reorder: move active to the position of over
    const currentIndex = colApps.findIndex((a) => a._id === activeAppId)
    const overIndex = colApps.findIndex((a) => a._id === overId)

    if (currentIndex !== -1 && overIndex !== -1 && currentIndex !== overIndex) {
      const [moved] = colApps.splice(currentIndex, 1)
      colApps.splice(overIndex, 0, moved)
    }

    const orderedIds = colApps.map((a) => a._id)
    const statusChanged = originalStatus !== newStatus

    // Update local order
    setLocalApps((prev) => {
      const updated = prev.map((a) =>
        a._id === activeAppId ? { ...a, status: newStatus } : a,
      )
      for (let i = 0; i < orderedIds.length; i++) {
        const idx = updated.findIndex((a) => a._id === orderedIds[i])
        if (idx !== -1) updated[idx] = { ...updated[idx], order: i }
      }
      return updated
    })

    // Persist to Sanity
    savingRef.current = true
    try {
      if (statusChanged) {
        await moveApplication(activeAppId, newStatus, orderedIds)
      } else if (orderedIds.length > 1) {
        await reorderApplications(orderedIds)
      }
    } catch (err) {
      console.error('Failed to persist drag:', err)
      setLocalApps(applications)
    } finally {
      savingRef.current = false
    }
  }

  // Static board for SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="grid auto-cols-fr grid-flow-col gap-3">
        {columns.map((col) => (
          <div
            key={col.key}
            className="flex flex-col rounded-lg border border-line/30 bg-surface/30 p-2"
          >
            <div className="mb-2 flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className={cn('h-2 w-2 rounded-full', col.dotColor)} />
                <span className="text-[11px] font-medium text-text-muted/70">
                  {col.label}
                </span>
              </div>
              <span className="text-[11px] text-text-muted/40">
                {col.apps.length}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              {col.apps.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-line/20 py-14">
                  <span className="text-[10px] text-text-muted/20">
                    No applications
                  </span>
                </div>
              ) : (
                col.apps.map((app) => (
                  <ApplicationCard
                    key={app._id}
                    app={app}
                    onClick={() => setSelected(app)}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid auto-cols-fr grid-flow-col gap-3">
          {columns.map((col) => (
            <DroppableColumn
              key={col.key}
              columnKey={col.key}
              dotColor={col.dotColor}
              label={col.label}
              apps={col.apps}
              onCardClick={setSelected}
            />
          ))}
        </div>

        <DragOverlay>
          {activeApp ? (
            <div className="w-[200px] rotate-2 opacity-90">
              <ApplicationCard app={activeApp} onClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {selected && (
        <ApplicationDetail
          app={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
