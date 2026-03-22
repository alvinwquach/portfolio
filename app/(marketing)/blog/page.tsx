/**
 * Blog Page — Writing as Proof
 * ============================
 * Not just blog posts. Evidence of how I think.
 *
 * Organized by type:
 * - Build logs: Systems in progress
 * - Bug fixes: Problems I've solved
 * - Decisions: Tradeoffs articulated
 * - Concepts: Things I've learned deeply
 */

import { getKnowledgeNodes, getTags } from '@/lib/graphql/queries';
import { BlogPageClient } from './BlogPageClient';

export const metadata = {
  title: 'Blog',
  description: 'Technical insights, build logs, bug fixes, and architectural decisions. Not just blog posts — evidence of how I think.',
};

interface PageProps {
  searchParams: Promise<{ type?: string; q?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const [knowledgeNodes, tags, params] = await Promise.all([
    getKnowledgeNodes({ status: 'published' }),
    getTags(),
    searchParams,
  ]);

  return (
    <BlogPageClient
      knowledgeNodes={knowledgeNodes}
      tags={tags}
      initialType={params.type || 'all'}
      initialSearch={params.q || ''}
    />
  );
}
