/**
 * Project Detail Page — Single column + sticky TOC sidebar
 */

import { notFound } from 'next/navigation'
import { getProject, getProjects } from '@/lib/graphql/queries'
import { ScrollProgress } from '@/components/projects'
import { ProjectHero } from '@/components/projects/case-study/ProjectHero'
import {
  ProblemSection,
  ApproachSection,
  OutcomeSection,
  ArchitectureSection,
  RoadmapSection,
  InterviewSection,
  TechDecisionsSection,
  TradeoffsSection,
  ChallengesSection,
  CodeHighlightsSection,
  GallerySection,
  LessonsSection,
  FooterCTA,
  SectionDivider,
} from '@/components/projects/case-study/ProjectSections'
import { TableOfContents } from '@/components/projects/case-study/TableOfContents'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((project) => ({ slug: project.slug.current }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return { title: 'Project Not Found' }
  return {
    title: `${project.name} | Projects`,
    description: project.tagline || `Details about the ${project.name} project`,
    alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://alvinquach.dev'}/project/${slug}` },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const [project, allProjects] = await Promise.all([getProject(slug), getProjects()])
  if (!project) notFound()

  // Find the next project for the footer CTA
  const currentIndex = allProjects.findIndex(p => p.slug.current === slug)
  const nextProject = currentIndex >= 0 && currentIndex < allProjects.length - 1
    ? { name: allProjects[currentIndex + 1].name, slug: allProjects[currentIndex + 1].slug.current }
    : allProjects.length > 1
      ? { name: allProjects[0].name, slug: allProjects[0].slug.current } // wrap around
      : undefined

  // Build TOC from available data
  const toc: { id: string; label: string }[] = []
  if (project.situation || project.task) toc.push({ id: 'problem', label: 'The Problem' })
  if (project.actions?.length) toc.push({ id: 'approach', label: 'My Approach' })
  if (project.results?.length || project.metrics?.length) toc.push({ id: 'outcome', label: 'The Outcome' })
  if (project.architectureNotes) toc.push({ id: 'architecture', label: 'Architecture' })
  if (project.roadmap?.length) toc.push({ id: 'roadmap', label: 'Roadmap' })
  if (project.interviewQuestions?.length) toc.push({ id: 'interview', label: 'Interview Q&A' })
  if (project.technicalDecisions?.length) toc.push({ id: 'tech-decisions', label: 'Tech Decisions' })
  if (project.tradeoffs?.length) toc.push({ id: 'tradeoffs', label: 'Trade-offs' })
  if (project.challenges?.length) toc.push({ id: 'challenges', label: 'Challenges' })
  if (project.codeHighlights?.length) toc.push({ id: 'code', label: 'Code Highlights' })
  if (project.gallery?.length) toc.push({ id: 'gallery', label: 'Screenshots' })
  if (project.lessonsLearned?.length || project.futureImprovements?.length) toc.push({ id: 'lessons', label: 'Lessons & Future' })

  // Group sections: Story (problem/approach/outcome) | Deep Dive (arch/roadmap/interview/tech) | Reflection (tradeoffs/challenges/lessons)
  const hasStory = !!(project.situation || project.task || project.actions?.length || project.results?.length || project.metrics?.length)
  const hasDeepDive = !!(project.architectureNotes || project.roadmap?.length || project.interviewQuestions?.length || project.technicalDecisions?.length)
  const hasReflection = !!(project.tradeoffs?.length || project.challenges?.length || project.lessonsLearned?.length || project.futureImprovements?.length)

  return (
    <div style={{ paddingTop: 32, paddingBottom: 48 }}>
      <ScrollProgress />

      {/* Hero — full width */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
        <ProjectHero project={project} slug={slug} />
      </div>

      {/* TOC sidebar + content */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
        <div className="flex gap-0 lg:gap-10">
          {/* Sticky TOC — desktop only */}
          <aside className="hidden lg:block" style={{ width: 160, flexShrink: 0 }}>
            <TableOfContents sections={toc} />
          </aside>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Story group: Problem → Approach → Outcome */}
            <div id="problem"><ProblemSection project={project} /></div>
            <div id="approach"><ApproachSection project={project} /></div>
            <div id="outcome"><OutcomeSection project={project} /></div>

            {hasStory && hasDeepDive && <SectionDivider />}

            {/* Deep Dive group: Architecture → Roadmap → Interview → Tech Decisions */}
            <div id="architecture"><ArchitectureSection project={project} /></div>
            <div id="roadmap"><RoadmapSection project={project} /></div>
            <div id="interview"><InterviewSection project={project} /></div>
            <div id="tech-decisions"><TechDecisionsSection project={project} /></div>

            {hasDeepDive && hasReflection && <SectionDivider />}

            {/* Reflection group: Trade-offs → Challenges → Code → Gallery → Lessons */}
            <div id="tradeoffs"><TradeoffsSection project={project} /></div>
            <div id="challenges"><ChallengesSection project={project} /></div>
            <div id="code"><CodeHighlightsSection project={project} /></div>
            <div id="gallery"><GallerySection project={project} /></div>
            <div id="lessons"><LessonsSection project={project} /></div>

            <FooterCTA nextProject={nextProject} />
          </div>
        </div>
      </div>
    </div>
  )
}
