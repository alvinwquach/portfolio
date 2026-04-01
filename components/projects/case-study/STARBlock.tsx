/**
 * STARBlock — Interview STAR format answer block
 */

const COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  amber:   { bg: 'rgba(245,158,11,0.04)', border: 'rgba(245,158,11,0.1)', text: '#f59e0b', badge: 'rgba(245,158,11,0.15)' },
  blue:    { bg: 'rgba(59,130,246,0.04)', border: 'rgba(59,130,246,0.1)', text: '#3b82f6', badge: 'rgba(59,130,246,0.15)' },
  cyan:    { bg: 'rgba(103,232,249,0.04)', border: 'rgba(103,232,249,0.1)', text: '#67e8f9', badge: 'rgba(103,232,249,0.15)' },
  emerald: { bg: 'rgba(52,211,153,0.04)', border: 'rgba(52,211,153,0.1)', text: '#34d399', badge: 'rgba(52,211,153,0.15)' },
}

interface STARBlockProps {
  letter: string
  label: string
  color: 'amber' | 'blue' | 'cyan' | 'emerald'
  children: React.ReactNode
}

export function STARBlock({ letter, label, color, children }: STARBlockProps) {
  const c = COLORS[color]
  return (
    <div style={{ padding: 12, borderRadius: 8, backgroundColor: c.bg, border: `1px solid ${c.border}`, fontSize: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, backgroundColor: c.badge, color: c.text }}>{letter}</span>
        <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: c.text }}>{label}</span>
      </div>
      <div style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{children}</div>
    </div>
  )
}
