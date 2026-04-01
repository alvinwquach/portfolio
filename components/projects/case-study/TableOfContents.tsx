/**
 * TableOfContents — Sticky sidebar nav for case study pages
 * Highlights the active section based on scroll position.
 */

'use client'

import { useState, useEffect } from 'react'

interface TOCProps {
  sections: { id: string; label: string }[]
}

export function TableOfContents({ sections }: TOCProps) {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    if (sections.length === 0) return

    // Observe each section's div to detect which is in view
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible section (closest to top)
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    )

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections])

  if (sections.length === 0) return null

  return (
    <nav style={{ position: 'sticky', top: 100 }}>
      <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', margin: '0 0 12px', fontFamily: 'var(--font-mono)' }}>
        On this page
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, borderLeft: '1px solid rgba(255,255,255,0.06)', paddingLeft: 12 }}>
        {sections.map(({ id, label }) => {
          const isActive = activeId === id
          return (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              style={{
                fontSize: 12,
                padding: '4px 0',
                color: isActive ? '#3b82f6' : 'rgba(255,255,255,0.35)',
                textDecoration: 'none',
                transition: 'color 0.15s',
                fontWeight: isActive ? 500 : 400,
                borderLeft: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                marginLeft: -13,
                paddingLeft: 11,
              }}
            >
              {label}
            </a>
          )
        })}
      </div>
    </nav>
  )
}
