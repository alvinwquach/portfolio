/**
 * Job Posting URL Parser
 * ======================
 *
 * Fetches a job posting URL and extracts structured data.
 * Supports: Greenhouse, Ashby, Lever, and generic fallback.
 *
 * Each parser returns a partial JobFormData object with whatever
 * fields it can extract from the page.
 */

export interface ParsedJob {
  company?: string
  role?: string
  jobUrl: string
  location?: string
  salaryMin?: number
  salaryMax?: number
  description?: string
  source?: string
}

// ── Detect which job board a URL belongs to ───────────────

type BoardType = 'greenhouse' | 'ashby' | 'lever' | 'unknown'

function detectBoard(url: string): BoardType {
  if (url.includes('greenhouse.io') || url.includes('boards.greenhouse')) return 'greenhouse'
  if (url.includes('ashbyhq.com') || url.includes('jobs.ashbyhq')) return 'ashby'
  if (url.includes('lever.co') || url.includes('jobs.lever')) return 'lever'
  return 'unknown'
}

// ── Salary extraction helper ──────────────────────────────

function parseSalary(text: string): { min?: number; max?: number } {
  // Match patterns like "$140,000 - $180,000", "$140K-$180K", "$140k – $180k"
  const rangeMatch = text.match(
    /\$\s*([\d,]+)\s*[kK]?\s*[-–—to]+\s*\$?\s*([\d,]+)\s*[kK]?/,
  )
  if (rangeMatch) {
    let min = parseInt(rangeMatch[1].replace(/,/g, ''), 10)
    let max = parseInt(rangeMatch[2].replace(/,/g, ''), 10)
    // If values look like they're in K (e.g., $140 - $180)
    if (min < 1000 && text.toLowerCase().includes('k')) {
      min *= 1000
      max *= 1000
    }
    // Handle "$140 - $180" without K indicator but clearly salary range
    if (min < 1000 && max < 1000 && min > 50) {
      min *= 1000
      max *= 1000
    }
    return { min, max }
  }

  // Single value like "$180,000" or "$180K"
  const singleMatch = text.match(/\$\s*([\d,]+)\s*[kK]?/)
  if (singleMatch) {
    let val = parseInt(singleMatch[1].replace(/,/g, ''), 10)
    if (val < 1000 && text.toLowerCase().includes('k')) val *= 1000
    return { min: val }
  }

  return {}
}

// ── HTML text extraction helpers ──────────────────────────

function extractText(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#\d+;/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractMetaContent(html: string, property: string): string | undefined {
  const regex = new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']*)["']|<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${property}["']`,
    'i',
  )
  const match = html.match(regex)
  return match?.[1] || match?.[2] || undefined
}

// ── Greenhouse Parser ─────────────────────────────────────

async function parseGreenhouse(url: string, html: string): Promise<ParsedJob> {
  const result: ParsedJob = { jobUrl: url, source: 'company-site' }

  // Try the JSON-LD structured data first (Greenhouse embeds this)
  const jsonLdMatch = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i)
  if (jsonLdMatch) {
    try {
      const data = JSON.parse(jsonLdMatch[1])
      result.role = data.title
      result.company = data.hiringOrganization?.name
      result.location = data.jobLocation?.[0]?.address?.addressLocality
        || data.jobLocation?.address?.addressLocality
      if (data.baseSalary) {
        const salary = data.baseSalary
        result.salaryMin = salary.value?.minValue
        result.salaryMax = salary.value?.maxValue
      }
      if (data.description) {
        result.description = extractText(data.description).slice(0, 500)
      }
      return result
    } catch {
      // Fall through to HTML parsing
    }
  }

  // Fallback: parse HTML
  result.role = extractMetaContent(html, 'og:title')
    || html.match(/<h1[^>]*>(.*?)<\/h1>/i)?.[1]?.trim()
  result.company = extractMetaContent(html, 'og:site_name')
  result.location = html.match(/class=["'][^"']*location[^"']*["'][^>]*>(.*?)<\//i)?.[1]?.trim()

  const text = extractText(html)
  const salary = parseSalary(text)
  result.salaryMin = salary.min
  result.salaryMax = salary.max

  return result
}

// ── Ashby Parser ──────────────────────────────────────────

async function parseAshby(url: string, html: string): Promise<ParsedJob> {
  const result: ParsedJob = { jobUrl: url, source: 'company-site' }

  // Ashby uses JSON-LD too
  const jsonLdMatch = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i)
  if (jsonLdMatch) {
    try {
      const data = JSON.parse(jsonLdMatch[1])
      result.role = data.title
      result.company = data.hiringOrganization?.name
      result.location = data.jobLocation?.[0]?.address?.addressLocality
        || data.jobLocation?.address?.addressLocality
      if (data.baseSalary) {
        result.salaryMin = data.baseSalary.value?.minValue
        result.salaryMax = data.baseSalary.value?.maxValue
      }
      if (data.description) {
        result.description = extractText(data.description).slice(0, 500)
      }
      return result
    } catch {
      // Fall through
    }
  }

  // Fallback
  result.role = extractMetaContent(html, 'og:title')
  result.company = extractMetaContent(html, 'og:site_name')

  // Ashby embeds job data in __NEXT_DATA__ sometimes
  const nextDataMatch = html.match(/<script[^>]+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i)
  if (nextDataMatch) {
    try {
      const nextData = JSON.parse(nextDataMatch[1])
      const jobPosting = nextData?.props?.pageProps?.jobPosting
        || nextData?.props?.pageProps?.job
      if (jobPosting) {
        result.role = result.role || jobPosting.title
        result.company = result.company || jobPosting.organizationName || jobPosting.companyName
        result.location = jobPosting.locationName || jobPosting.location
        if (jobPosting.compensationTierSummary) {
          const salary = parseSalary(jobPosting.compensationTierSummary)
          result.salaryMin = salary.min
          result.salaryMax = salary.max
        }
      }
    } catch {
      // Fall through
    }
  }

  const text = extractText(html)
  if (!result.salaryMin) {
    const salary = parseSalary(text)
    result.salaryMin = salary.min
    result.salaryMax = salary.max
  }

  return result
}

// ── Lever Parser ──────────────────────────────────────────

async function parseLever(url: string, html: string): Promise<ParsedJob> {
  const result: ParsedJob = { jobUrl: url, source: 'company-site' }

  // Lever uses a consistent HTML structure
  result.role = html.match(/<h2[^>]*>(.*?)<\/h2>/i)?.[1]?.trim()
    || extractMetaContent(html, 'og:title')

  // Company name from URL: jobs.lever.co/{company}/...
  const companyFromUrl = url.match(/lever\.co\/([^/]+)/)?.[1]
  if (companyFromUrl) {
    result.company = companyFromUrl.charAt(0).toUpperCase() + companyFromUrl.slice(1)
  }
  result.company = extractMetaContent(html, 'og:site_name') || result.company

  // Location: Lever puts it in a specific div
  result.location = html.match(
    /class=["']location["'][^>]*>(.*?)<\//i,
  )?.[1]?.trim()
    || html.match(/class=["']posting-categories["'][\s\S]*?class=["']sort-by-commitment["'][^>]*>(.*?)<\//i)?.[1]?.trim()

  // Description
  const descMatch = html.match(/class=["']posting-description["']([\s\S]*?)<div[^>]+class=["']posting-btn/i)
  if (descMatch) {
    result.description = extractText(descMatch[1]).slice(0, 500)
  }

  const text = extractText(html)
  const salary = parseSalary(text)
  result.salaryMin = salary.min
  result.salaryMax = salary.max

  return result
}

// ── Generic Fallback Parser ───────────────────────────────

async function parseGeneric(url: string, html: string): Promise<ParsedJob> {
  const result: ParsedJob = { jobUrl: url, source: 'company-site' }

  // Try JSON-LD (many job pages use schema.org/JobPosting)
  const jsonLdMatches = html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
  for (const match of jsonLdMatches) {
    try {
      const data = JSON.parse(match[1])
      const jobData = data['@type'] === 'JobPosting'
        ? data
        : Array.isArray(data['@graph'])
          ? data['@graph'].find((item: { '@type'?: string }) => item['@type'] === 'JobPosting')
          : null

      if (jobData) {
        result.role = jobData.title
        result.company = jobData.hiringOrganization?.name
        result.location = typeof jobData.jobLocation === 'string'
          ? jobData.jobLocation
          : jobData.jobLocation?.address?.addressLocality
        if (jobData.baseSalary) {
          result.salaryMin = jobData.baseSalary.value?.minValue
          result.salaryMax = jobData.baseSalary.value?.maxValue
        }
        if (jobData.description) {
          result.description = extractText(jobData.description).slice(0, 500)
        }
        return result
      }
    } catch {
      continue
    }
  }

  // Fallback: Open Graph + HTML
  result.role = extractMetaContent(html, 'og:title')
    || html.match(/<h1[^>]*>(.*?)<\/h1>/i)?.[1]?.trim()
  result.company = extractMetaContent(html, 'og:site_name')

  // Try to get company from domain
  if (!result.company) {
    try {
      const hostname = new URL(url).hostname.replace('www.', '')
      const parts = hostname.split('.')
      if (parts.length >= 2) {
        result.company = parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
      }
    } catch {
      // ignore
    }
  }

  const text = extractText(html)
  const salary = parseSalary(text)
  result.salaryMin = salary.min
  result.salaryMax = salary.max

  return result
}

// ── Main entry point ──────────────────────────────────────

export async function parseJobUrl(url: string): Promise<ParsedJob> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; JobTracker/1.0)',
      Accept: 'text/html',
    },
    signal: AbortSignal.timeout(10000),
  })

  if (!response.ok) {
    return { jobUrl: url }
  }

  const html = await response.text()
  const board = detectBoard(url)

  switch (board) {
    case 'greenhouse':
      return parseGreenhouse(url, html)
    case 'ashby':
      return parseAshby(url, html)
    case 'lever':
      return parseLever(url, html)
    default:
      return parseGeneric(url, html)
  }
}
