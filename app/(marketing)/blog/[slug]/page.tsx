/**
 * Knowledge Node Detail Page
 * ==========================
 * Individual knowledge node with content, related nodes, and code snippets
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getKnowledgeNode, getKnowledgeNodes } from '@/lib/graphql/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, BookOpen, Bug, Lightbulb, Code, GraduationCap, BarChart3, ExternalLink, Clock } from 'lucide-react';
import { KnowledgeChart } from '@/components/d3/KnowledgeChart';
import { ShareButtons } from '@/components/ui/ShareButtons';

interface Props {
  params: Promise<{ slug: string }>;
}

// Badge variant type matching the Badge component
type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'gold' | 'build' | 'bug' | 'decision' | 'concept' | 'tutorial' | 'chart';

// Portable Text block types
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

// Node type icons and labels
const nodeTypeConfig: Record<string, { icon: typeof Code; label: string; color: string; variant: BadgeVariant }> = {
  build: { icon: Code, label: 'Build Log', color: 'text-cyan', variant: 'build' },
  bug: { icon: Bug, label: 'Bug Fix', color: 'text-coral', variant: 'bug' },
  decision: { icon: Lightbulb, label: 'Decision', color: 'text-amber', variant: 'decision' },
  concept: { icon: BookOpen, label: 'Concept', color: 'text-cyan', variant: 'concept' },
  tutorial: { icon: GraduationCap, label: 'Tutorial', color: 'text-green-600', variant: 'tutorial' },
  chart: { icon: BarChart3, label: 'Chart', color: 'text-purple-600', variant: 'chart' },
  deep_dive: { icon: BookOpen, label: 'Deep Dive', color: 'text-indigo-600', variant: 'concept' },
  lesson_learned: { icon: Lightbulb, label: 'Lesson Learned', color: 'text-amber', variant: 'decision' },
  tool_review: { icon: Code, label: 'Tool Review', color: 'text-emerald-600', variant: 'build' },
};

/**
 * Calculate reading time from content
 * Assumes average reading speed of 200 words per minute
 */
function calculateReadingTime(content?: PortableTextBlock[]): number {
  if (!content || content.length === 0) return 1;

  // Extract all text from portable text blocks
  const text = content
    .filter((block) => block._type === 'block')
    .map((block) =>
      block.children?.map((child) => child.text || '').join(' ') || ''
    )
    .join(' ');

  // Count words (split by whitespace)
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // Calculate minutes (min 1 minute)
  return Math.max(1, Math.ceil(wordCount / 200));
}

export async function generateStaticParams() {
  const nodes = await getKnowledgeNodes({ status: 'published' });
  return nodes.map((node) => ({
    slug: node.slug.current,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const node = await getKnowledgeNode(slug);

  if (!node) {
    return {
      title: 'Knowledge Node Not Found',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alvinquach.dev';

  return {
    title: `${node.title} | Blog`,
    description: node.summary,
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
    },
  };
}

export default async function KnowledgeNodePage({ params }: Props) {
  const { slug } = await params;
  const node = await getKnowledgeNode(slug);

  if (!node) {
    notFound();
  }

  const config = nodeTypeConfig[node.nodeType] || nodeTypeConfig.concept;
  const Icon = config.icon;
  const readingTime = calculateReadingTime(node.content);

  return (
    <div className="py-12">
      <div className="container max-w-4xl">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blogs
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant={config.variant}>
              <Icon className="h-3 w-3 mr-1" />
              {config.label}
            </Badge>
            {node.featured && (
              <Badge variant="gold">Featured</Badge>
            )}
            {node.depthLevel && (
              <Badge variant="outline">
                Depth: {'●'.repeat(node.depthLevel)}{'○'.repeat(5 - node.depthLevel)}
              </Badge>
            )}
          </div>

          <h1 className="text-4xl font-bold mb-4">{node.title}</h1>

          <p className="text-xl text-muted-foreground mb-6">{node.summary}</p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {node.publishedAt && (
              <span>Published {formatDate(node.publishedAt)}</span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {readingTime} min read
            </span>
            {node.importance && (
              <span>
                Importance: {'★'.repeat(node.importance)}{'☆'.repeat(5 - node.importance)}
              </span>
            )}
          </div>

          {/* Tags and Share */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
            {node.tags && node.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {node.tags.map((tag) => (
                  <Link key={tag._id} href={`/blog?tags=${tag.slug.current}`}>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-secondary"
                      style={tag.color ? { borderColor: tag.color, color: tag.color } : undefined}
                    >
                      {tag.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}

            <ShareButtons
              url={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://alvinquach.dev'}/blog/${slug}`}
              title={node.title}
              summary={node.summary}
            />
          </div>
        </header>

        {/* Code Snippet */}
        {node.codeSnippet && node.codeSnippet.code && (
          <div className="mb-12">
            <div className="bg-dark-900 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-dark-800 border-b border-dark-700">
                <span className="text-sm text-dark-300">
                  {node.codeSnippet.filename || node.codeSnippet.language || 'Code'}
                </span>
                {node.codeSnippet.language && (
                  <Badge variant="outline" className="text-xs">
                    {node.codeSnippet.language}
                  </Badge>
                )}
              </div>
              <pre className="p-4 overflow-x-auto">
                <code className="text-sm text-dark-100 font-mono">
                  {node.codeSnippet.code}
                </code>
              </pre>
            </div>
          </div>
        )}

        {/* Content (Portable Text - simplified rendering) */}
        {node.content && node.content.length > 0 && (
          <div className="prose prose-warm max-w-none mb-12">
            {node.content.map((block: PortableTextBlock, index: number) => {
              if (block._type === 'block') {
                const style = block.style || 'normal';
                const text = block.children
                  ?.map((child: PortableTextChild) => child.text)
                  .join('') || '';

                switch (style) {
                  case 'h1':
                    return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{text}</h1>;
                  case 'h2':
                    return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{text}</h2>;
                  case 'h3':
                    return <h3 key={index} className="text-xl font-semibold mt-6 mb-3">{text}</h3>;
                  case 'h4':
                    return <h4 key={index} className="text-lg font-semibold mt-4 mb-2">{text}</h4>;
                  case 'blockquote':
                    return (
                      <blockquote key={index} className="border-l-4 border-amber pl-4 italic text-muted-foreground my-4">
                        {text}
                      </blockquote>
                    );
                  default:
                    return <p key={index} className="text-muted-foreground mb-4 leading-relaxed">{text}</p>;
                }
              }
              return null;
            })}
          </div>
        )}

        {/* Chart Data (if present) */}
        {node.chartData && node.chartData.chartType && (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-amber" />
                {node.chartData.chartType === 'bar' && 'Bar Chart'}
                {node.chartData.chartType === 'line' && 'Line Chart'}
                {node.chartData.chartType === 'pie' && 'Pie Chart'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <KnowledgeChart chartData={node.chartData} height={350} />
            </CardContent>
          </Card>
        )}

        {/* Related Projects */}
        {node.relatedProjects && node.relatedProjects.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Related Projects</h2>
            <div className="flex flex-wrap gap-4">
              {node.relatedProjects.map((project) => (
                <Link
                  key={project._id}
                  href={`/projects/${project.slug.current}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  <Code className="h-4 w-4 text-cyan" />
                  {project.name}
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Nodes */}
        {node.relatedNodes && node.relatedNodes.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Related Knowledge</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {node.relatedNodes.map((relatedNode) => {
                const relatedConfig = nodeTypeConfig[relatedNode.nodeType] || nodeTypeConfig.concept;
                const RelatedIcon = relatedConfig.icon;

                return (
                  <Card
                    key={relatedNode._id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={relatedConfig.variant} className="text-xs">
                          <RelatedIcon className="h-3 w-3 mr-1" />
                          {relatedConfig.label}
                        </Badge>
                      </div>
                      <CardTitle className="text-base">
                        <Link
                          href={`/blog/${relatedNode.slug.current}`}
                          className="hover:text-cyan transition-colors"
                        >
                          {relatedNode.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {relatedNode.summary}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
