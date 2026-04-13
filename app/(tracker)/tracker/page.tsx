import { clientWithoutCdn } from '@/sanity/lib/client'
import { TrackerTabs } from './TrackerTabs'
import type { JobApplication } from '@/components/tracker/types'

const QUERY = `*[_type == "jobApplication"] | order(dateApplied desc) {
  _id,
  company,
  role,
  jobUrl,
  status,
  dateApplied,
  salaryRange,
  interviewDates,
  contacts,
  notes,
  nextStep,
  nextStepDate,
  referral,
  source,
  rejectionReason,
  compensation,
  order
}`

export const dynamic = 'force-dynamic'

export default async function TrackerPage() {
  const applications = await clientWithoutCdn.fetch<JobApplication[]>(QUERY)

  return <TrackerTabs applications={applications} />
}
