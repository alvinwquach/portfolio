'use client'

import { useState, useTransition, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { createApplication, type CreateApplicationInput } from '@/app/actions/tracker-update'

const SOURCE_OPTIONS = [
  { label: 'Company Site', value: 'company-site' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Referral', value: 'referral' },
  { label: 'Indeed', value: 'indeed' },
  { label: 'AngelList', value: 'angellist' },
  { label: 'Other', value: 'other' },
]

const STATUS_OPTIONS = [
  { label: 'Saved', value: 'saved' },
  { label: 'Applied', value: 'applied' },
]

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-medium text-text-muted/70">
      {children}
    </label>
  )
}

function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      className={cn(
        'w-full rounded-md border border-line/50 bg-transparent px-2.5 py-1.5 text-xs text-text placeholder:text-text-muted/40 focus:border-line focus:outline-none',
        className,
      )}
      {...props}
    />
  )
}

export function AddApplicationModal({ onClose }: { onClose: () => void }) {
  const [isPending, startTransition] = useTransition()
  const [parsing, setParsing] = useState(false)
  const [parseError, setParseError] = useState('')
  const [urlInput, setUrlInput] = useState('')

  const [form, setForm] = useState<CreateApplicationInput>({
    company: '',
    role: '',
    jobUrl: '',
    status: 'saved',
    source: 'company-site',
  })

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  function update(patch: Partial<CreateApplicationInput>) {
    setForm((prev) => ({ ...prev, ...patch }))
  }

  async function handleParseUrl() {
    if (!urlInput.trim()) return
    setParsing(true)
    setParseError('')

    try {
      const res = await fetch('/api/tracker/parse-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() }),
      })

      if (!res.ok) {
        const data = await res.json()
        setParseError(data.error || 'Failed to parse URL')
        // Still set the URL even if parsing fails
        update({ jobUrl: urlInput.trim() })
        setParsing(false)
        return
      }

      const data = await res.json()
      update({
        company: data.company || form.company,
        role: data.role || form.role,
        jobUrl: data.jobUrl || urlInput.trim(),
        source: data.source || form.source,
        salaryMin: data.salaryMin || form.salaryMin,
        salaryMax: data.salaryMax || form.salaryMax,
        notes: data.description || form.notes,
      })
    } catch {
      setParseError('Network error — could not reach the job posting')
      update({ jobUrl: urlInput.trim() })
    } finally {
      setParsing(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.company || !form.role) return

    startTransition(async () => {
      await createApplication(form)
      onClose()
    })
  }

  const canSubmit = form.company.trim() && form.role.trim() && !isPending

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-line bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-sm font-medium text-text">Add Application</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-text-muted transition-colors hover:text-text"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
          <div className="space-y-4 p-5">
            {/* URL Autofill */}
            <div className="space-y-1.5">
              <Label>Autofill from URL</Label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://jobs.greenhouse.io/company/..."
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={handleParseUrl}
                  disabled={parsing || !urlInput.trim()}
                  className="shrink-0 rounded-md border border-line/50 px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-line hover:text-text disabled:opacity-40"
                >
                  {parsing ? (
                    <span className="flex items-center gap-1.5">
                      <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Parsing...
                    </span>
                  ) : (
                    'Autofill'
                  )}
                </button>
              </div>
              {parseError && (
                <p className="text-[10px] text-amber-400/80">{parseError}</p>
              )}
              <p className="text-[10px] text-text-muted/40">
                Supports Greenhouse, Ashby, Lever, and most job pages
              </p>
            </div>

            <div className="h-px bg-line/30" />

            {/* Company */}
            <div className="space-y-1.5">
              <Label>Company *</Label>
              <Input
                value={form.company}
                onChange={(e) => update({ company: e.target.value })}
                placeholder="Stripe"
                required
              />
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <Label>Role *</Label>
              <Input
                value={form.role}
                onChange={(e) => update({ role: e.target.value })}
                placeholder="Software Engineer"
                required
              />
            </div>

            {/* Status + Source */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Status</Label>
                <select
                  value={form.status}
                  onChange={(e) => update({ status: e.target.value })}
                  className="w-full rounded-md border border-line/50 bg-transparent px-2.5 py-1.5 text-xs text-text focus:border-line focus:outline-none"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Source</Label>
                <select
                  value={form.source}
                  onChange={(e) => update({ source: e.target.value })}
                  className="w-full rounded-md border border-line/50 bg-transparent px-2.5 py-1.5 text-xs text-text focus:border-line focus:outline-none"
                >
                  {SOURCE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Job URL (manual) */}
            <div className="space-y-1.5">
              <Label>Job URL</Label>
              <Input
                type="url"
                value={form.jobUrl}
                onChange={(e) => update({ jobUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>

            {/* Salary Range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Salary Min</Label>
                <Input
                  type="number"
                  value={form.salaryMin ?? ''}
                  onChange={(e) =>
                    update({
                      salaryMin: e.target.value
                        ? parseInt(e.target.value, 10)
                        : undefined,
                    })
                  }
                  placeholder="140000"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Salary Max</Label>
                <Input
                  type="number"
                  value={form.salaryMax ?? ''}
                  onChange={(e) =>
                    update({
                      salaryMax: e.target.value
                        ? parseInt(e.target.value, 10)
                        : undefined,
                    })
                  }
                  placeholder="180000"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <textarea
                value={form.notes ?? ''}
                onChange={(e) => update({ notes: e.target.value })}
                placeholder="Stack, team, what caught your eye..."
                rows={3}
                className="w-full rounded-md border border-line/50 bg-transparent px-2.5 py-1.5 text-xs text-text placeholder:text-text-muted/40 focus:border-line focus:outline-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto border-t border-line px-5 py-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-md border border-line/50 px-4 py-2 text-xs text-text-muted transition-colors hover:border-line hover:text-text"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className="flex-1 rounded-md bg-accent px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {isPending ? 'Saving...' : 'Add Application'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
