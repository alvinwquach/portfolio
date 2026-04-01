/**
 * SectionHeader — Shared section title for case study pages
 * Uses inline styles for the new dark design system.
 */

import type { ComponentType } from 'react'

interface SectionHeaderProps {
  icon: ComponentType<{ size?: number; style?: React.CSSProperties }>
  color?: string   // accent color for icon (default: blue)
  title: string
  subtitle?: string
  size?: 'default' | 'sm'
}

export function SectionHeader({ icon: Icon, color = '#3b82f6', title, subtitle, size = 'default' }: SectionHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <div style={{ padding: 8, borderRadius: 8, backgroundColor: `${color}10` }}>
        <Icon size={size === 'sm' ? 15 : 16} style={{ color }} />
      </div>
      <div>
        <h2 style={{ fontSize: size === 'sm' ? 17 : 19, fontWeight: 700, color: 'var(--ds-text)', margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '2px 0 0' }}>{subtitle}</p>}
      </div>
    </div>
  )
}
