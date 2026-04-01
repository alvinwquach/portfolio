/**
 * Blog Detail Page — Content + Sticky Sidebar
 * =============================================
 *
 * LAYOUT:
 *   LEFT (main): Back link, date/meta, title, content, related nodes/projects
 *   RIGHT (sidebar, sticky): Share buttons, tags, "Explore More" nav links
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getKnowledgeNode, getKnowledgeNodes } from '@/lib/graphql/queries';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, BookOpen, Bug, Lightbulb, Code, GraduationCap, BarChart3, ExternalLink, Clock, ArrowRight } from 'lucide-react';
import { KnowledgeChart } from '@/components/d3/KnowledgeChart';
import { ShareButtons } from '@/components/ui/ShareButtons';

interface Props {
  params: Promise<{ slug: string }>;
}

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'gold' | 'build' | 'bug' | 'decision' | 'concept' | 'tutorial' | 'chart';

interface PortableTextChild {
  _type: string;
  text?: string;
  marks?: string[];
}

interface PortableTextBlock {
  _type: string;
  _key?: string;
  style?: string;
  listItem?: string;
  level?: number;
  children?: PortableTextChild[];
  markDefs?: Array<{ _key: string; _type: string; href?: string }>;
}

const nodeTypeConfig: Record<string, { icon: typeof Code; label: string; variant: BadgeVariant }> = {
  build: { icon: Code, label: 'Build Log', variant: 'build' },
  bug: { icon: Bug, label: 'Bug Fix', variant: 'bug' },
  decision: { icon: Lightbulb, label: 'Decision', variant: 'decision' },
  concept: { icon: BookOpen, label: 'Concept', variant: 'concept' },
  tutorial: { icon: GraduationCap, label: 'Tutorial', variant: 'tutorial' },
  chart: { icon: BarChart3, label: 'Chart', variant: 'chart' },
  deep_dive: { icon: BookOpen, label: 'Deep Dive', variant: 'concept' },
  lesson_learned: { icon: Lightbulb, label: 'Lesson Learned', variant: 'decision' },
  tool_review: { icon: Code, label: 'Tool Review', variant: 'build' },
};

function calculateReadingTime(content?: PortableTextBlock[]): number {
  if (!content || content.length === 0) return 1;
  const text = content
    .filter(block => block._type === 'block')
    .map(block => block.children?.map(child => child.text || '').join(' ') || '')
    .join(' ');
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export async function generateStaticParams() {
  const nodes = await getKnowledgeNodes({ status: 'published' });
  return nodes.map(node => ({ slug: node.slug.current }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const node = await getKnowledgeNode(slug);
  if (!node) return { title: 'Not Found' };
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alvinquach.dev';
  return {
    title: `${node.title} | Blog`,
    description: node.summary,
    alternates: { canonical: `${baseUrl}/blog/${slug}` },
  };
}

export default async function KnowledgeNodePage({ params }: Props) {
  const { slug } = await params;
  const node = await getKnowledgeNode(slug);
  if (!node) notFound();

  const config = nodeTypeConfig[node.nodeType] || nodeTypeConfig.concept;
  const Icon = config.icon;
  const readingTime = calculateReadingTime(node.content);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alvinquach.dev';

  return (
    <div style={{ maxWidth: 1060, margin: '0 auto', padding: '32px 24px 48px' }}>
      {/* Back link */}
      <Link
        href="/blog"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 28, textDecoration: 'none' }}
        className="hover:text-white transition-colors"
      >
        <ArrowLeft size={14} /> Back to Blog
      </Link>

      <div className="flex gap-0 lg:gap-12">
        {/* ═══ MAIN CONTENT ══════════════════════════════ */}
        <article style={{ flex: 1, minWidth: 0 }}>
          {/* Header meta */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
            {node.publishedAt && (
              <span>{formatDate(node.publishedAt)}</span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={12} /> {readingTime} min read
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--ds-text)', margin: '0 0 16px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
            {node.title}
          </h1>

          {/* Badges row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            <Badge variant={config.variant}>
              <Icon className="h-3 w-3 mr-1" />
              {config.label}
            </Badge>
            {node.featured && <Badge variant="gold">Featured</Badge>}
            {node.depthLevel && (
              <Badge variant="outline">
                Depth: {'●'.repeat(node.depthLevel)}{'○'.repeat(5 - node.depthLevel)}
              </Badge>
            )}
          </div>

          {/* Tags — inline on mobile, sidebar on desktop */}
          <div className="lg:hidden" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {node.tags?.map(tag => (
              <Link key={tag._id} href={`/blog?tags=${tag.slug.current}`}>
                <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {tag.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Share — inline on mobile */}
          <div className="lg:hidden" style={{ marginBottom: 20 }}>
            <ShareButtons url={`${baseUrl}/blog/${slug}`} title={node.title} summary={node.summary} />
          </div>

          {/* Divider */}
          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '0 0 32px' }} />

          {/* Summary */}
          {node.summary && (
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: '0 0 28px' }}>
              {node.summary}
            </p>
          )}

          {/* Code Snippet */}
          {node.codeSnippet && node.codeSnippet.code && (
            <div style={{ marginBottom: 32, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', backgroundColor: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                  {node.codeSnippet.filename || node.codeSnippet.language || 'Code'}
                </span>
                {node.codeSnippet.language && (
                  <Badge variant="outline" className="text-xs">{node.codeSnippet.language}</Badge>
                )}
              </div>
              <pre style={{ padding: 16, margin: 0, overflowX: 'auto', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <code style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-mono)' }}>
                  {node.codeSnippet.code}
                </code>
              </pre>
            </div>
          )}

          {/* Content (Portable Text) */}
          {node.content && node.content.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              {node.content.map((block: PortableTextBlock, index: number) => {
                if (block._type === 'block') {
                  const style = block.style || 'normal';
                  const text = block.children?.map((child: PortableTextChild) => child.text).join('') || '';
                  switch (style) {
                    case 'h1': return <h2 key={index} style={{ fontSize: 24, fontWeight: 700, color: 'var(--ds-text)', margin: '32px 0 12px' }}>{text}</h2>;
                    case 'h2': return <h2 key={index} style={{ fontSize: 20, fontWeight: 700, color: 'var(--ds-text)', margin: '28px 0 10px' }}>{text}</h2>;
                    case 'h3': return <h3 key={index} style={{ fontSize: 17, fontWeight: 600, color: 'var(--ds-text)', margin: '24px 0 8px' }}>{text}</h3>;
                    case 'h4': return <h4 key={index} style={{ fontSize: 15, fontWeight: 600, color: 'var(--ds-text)', margin: '20px 0 6px' }}>{text}</h4>;
                    case 'blockquote': return (
                      <blockquote key={index} style={{ borderLeft: '3px solid rgba(59,130,246,0.4)', paddingLeft: 16, margin: '16px 0', fontStyle: 'italic', color: 'rgba(255,255,255,0.45)' }}>
                        {text}
                      </blockquote>
                    );
                    default: return <p key={index} style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, margin: '0 0 16px' }}>{text}</p>;
                  }
                }
                return null;
              })}
            </div>
          )}

          {/* Chart Data */}
          {node.chartData && node.chartData.chartType && (
            <div style={{ marginBottom: 32, padding: 20, borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600, color: 'var(--ds-text)', margin: '0 0 16px' }}>
                <BarChart3 size={16} style={{ color: '#f59e0b' }} />
                {node.chartData.chartType === 'bar' && 'Bar Chart'}
                {node.chartData.chartType === 'line' && 'Line Chart'}
                {node.chartData.chartType === 'pie' && 'Pie Chart'}
              </h3>
              <KnowledgeChart chartData={node.chartData} height={350} />
            </div>
          )}

          {/* Related Projects */}
          {node.relatedProjects && node.relatedProjects.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ds-text)', margin: '0 0 12px' }}>Related Projects</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {node.relatedProjects.map(project => (
                  <Link key={project._id} href={`/project/${project.slug.current}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, fontSize: 13, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--ds-text)', textDecoration: 'none' }}
                    className="hover:border-[rgba(59,130,246,0.2)] transition-colors"
                  >
                    <Code size={13} style={{ color: '#3b82f6' }} />
                    {project.name}
                    <ExternalLink size={11} style={{ color: 'rgba(255,255,255,0.25)' }} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Knowledge Nodes */}
          {node.relatedNodes && node.relatedNodes.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ds-text)', margin: '0 0 12px' }}>Related Knowledge</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {node.relatedNodes.map(related => {
                  const rc = nodeTypeConfig[related.nodeType] || nodeTypeConfig.concept;
                  const RIcon = rc.icon;
                  return (
                    <Link key={related._id} href={`/blog/${related.slug.current}`} style={{ textDecoration: 'none' }} className="group">
                      <div style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' }} className="hover:border-[rgba(59,130,246,0.2)] transition-colors">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                          <Badge variant={rc.variant} className="text-xs">
                            <RIcon className="h-3 w-3 mr-1" />
                            {rc.label}
                          </Badge>
                        </div>
                        <h3 className="group-hover:text-[#3b82f6] transition-colors" style={{ fontSize: 14, fontWeight: 500, color: 'var(--ds-text)', margin: '0 0 4px' }}>
                          {related.title}
                        </h3>
                        <p className="line-clamp-2" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0, lineHeight: 1.5 }}>
                          {related.summary}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </article>

        {/* ═══ STICKY SIDEBAR — desktop only ═══════════ */}
        <aside className="hidden lg:block" style={{ width: 220, flexShrink: 0 }}>
          <div style={{ position: 'sticky', top: 100 }}>
            {/* Share */}
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', margin: '0 0 10px', fontFamily: 'var(--font-mono)' }}>Share</p>
              <ShareButtons url={`${baseUrl}/blog/${slug}`} title={node.title} summary={node.summary} />
            </div>

            {/* Tags */}
            {node.tags && node.tags.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', margin: '0 0 10px', fontFamily: 'var(--font-mono)' }}>Topics</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {node.tags.map(tag => (
                    <Link key={tag._id} href={`/blog?tags=${tag.slug.current}`}>
                      <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.06)' }} className="hover:border-[rgba(59,130,246,0.2)] transition-colors">
                        {tag.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Explore More */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', margin: '0 0 10px', fontFamily: 'var(--font-mono)' }}>Explore more</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { label: 'Projects', href: '/projects' },
                  { label: 'Experience', href: '/experience' },
                  { label: 'Request a call', href: '/schedule' },
                ].map(link => (
                  <Link key={link.href} href={link.href}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', padding: '4px 0' }}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                    <ArrowRight size={12} style={{ color: 'rgba(255,255,255,0.2)' }} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Importance rating */}
            {node.importance && (
              <div style={{ marginTop: 28 }}>
                <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', margin: '0 0 8px', fontFamily: 'var(--font-mono)' }}>Importance</p>
                <span style={{ fontSize: 14, color: '#f59e0b', letterSpacing: 2 }}>
                  {'★'.repeat(node.importance)}{'☆'.repeat(5 - node.importance)}
                </span>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
