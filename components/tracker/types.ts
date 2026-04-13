export interface JobApplication {
  _id: string
  company: string
  role: string
  jobUrl?: string
  status: string
  dateApplied: string
  salaryRange?: {
    min?: number
    max?: number
    currency?: string
  }
  interviewDates?: {
    _key: string
    date: string
    type: string
    notes?: string
    interviewer?: string
    gcalEventId?: string
  }[]
  contacts?: {
    name?: string
    role?: string
    email?: string
    linkedin?: string
  }[]
  notes?: string
  nextStep?: string
  nextStepDate?: string
  referral?: boolean
  source?: string
  rejectionReason?: string
  compensation?: {
    baseSalary?: number
    equity?: string
    bonus?: string
    notes?: string
  }
  order?: number
}

export const PIPELINE_STATUSES = [
  'saved',
  'applied',
  'phone-screen',
  'technical',
  'onsite',
] as const

export const OUTCOME_STATUSES = [
  'offer',
  'rejected',
  'ghosted',
  'withdrawn',
] as const

export const STATUS_LIST = [
  ...PIPELINE_STATUSES,
  ...OUTCOME_STATUSES,
] as const

export const STATUS_LABELS: Record<string, string> = {
  saved: 'Saved',
  applied: 'Applied',
  'phone-screen': 'Phone Screen',
  technical: 'Technical',
  onsite: 'Onsite',
  offer: 'Offer',
  rejected: 'Rejected',
  ghosted: 'Ghosted',
  withdrawn: 'Withdrawn',
}

export const STATUS_BG_COLORS: Record<string, string> = {
  saved: 'bg-zinc-500/20 text-zinc-400',
  applied: 'bg-blue-500/20 text-blue-400',
  'phone-screen': 'bg-amber-500/20 text-amber-400',
  technical: 'bg-purple-500/20 text-purple-400',
  onsite: 'bg-indigo-500/20 text-indigo-400',
  offer: 'bg-green-500/20 text-green-400',
  rejected: 'bg-red-500/20 text-red-400',
  ghosted: 'bg-gray-500/20 text-gray-500',
  withdrawn: 'bg-gray-500/20 text-gray-500',
}

export const STATUS_DOT_COLORS: Record<string, string> = {
  saved: 'bg-zinc-500',
  applied: 'bg-blue-500',
  'phone-screen': 'bg-amber-500',
  technical: 'bg-purple-500',
  onsite: 'bg-indigo-500',
  offer: 'bg-green-500',
  rejected: 'bg-red-500',
  ghosted: 'bg-gray-500/50',
  withdrawn: 'bg-gray-500',
}

export const INTERVIEW_TYPE_ABBR: Record<string, string> = {
  'phone-screen': 'PH',
  technical: 'TC',
  behavioral: 'BH',
  'system-design': 'SD',
  'take-home': 'TS',
  onsite: 'OS',
  panel: 'PN',
  'final-round': 'FR',
  other: 'OT',
}

export const SOURCE_LABELS: Record<string, string> = {
  linkedin: 'LI',
  'company-site': 'Web',
  referral: 'Ref',
  indeed: 'Indeed',
  angellist: 'AL',
  other: 'Other',
}

export const CLOSED_STATUSES = new Set(['rejected', 'ghosted', 'withdrawn'])

export function formatSalaryCompact(min?: number, max?: number): string | null {
  if (!min && !max) return null
  const fmt = (n: number) => (n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`)
  if (min && max) return `${fmt(min)}\u2013${fmt(max)}`
  if (min) return `${fmt(min)}+`
  return `up to ${fmt(max!)}`
}

export function relativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'
  if (diffDays > 1 && diffDays <= 7) return `in ${diffDays}d`
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)}d ago`
  if (diffDays > 7) return `in ${Math.ceil(diffDays / 7)}w`
  return `${Math.ceil(Math.abs(diffDays) / 7)}w ago`
}

export function getLatestInterview(app: JobApplication) {
  if (!app.interviewDates || app.interviewDates.length === 0) return null
  const now = new Date()
  const sorted = [...app.interviewDates].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
  // Prefer the next upcoming interview; if none, show most recent past one
  const upcoming = sorted.filter((d) => new Date(d.date) >= now)
  return upcoming.length > 0 ? upcoming[upcoming.length - 1] : sorted[0]
}
