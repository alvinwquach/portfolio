/**
 * Featured Blog Posts Section
 * ===========================
 * Highlights featured decision logs that explain technical choices.
 */

import Link from 'next/link';
import { ArrowRight, Tag } from 'lucide-react';

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  summary?: string;
  nodeType?: string;
}

interface FeaturedBlogPostProps {
  posts?: BlogPost[];
}

// Default featured posts if none provided from CMS
const defaultPosts: BlogPost[] = [
  {
    _id: 'sanity-decision',
    title: 'Why I Chose Sanity for My Portfolio',
    slug: { current: 'why-sanity-for-portfolio' },
    summary: 'Every portfolio needs a CMS. I evaluated Contentful, Storyblok, Strapi, and Sanity. Here\'s why Sanity won—and why I added GraphQL on top of GROQ.',
    nodeType: 'decision',
  },
  {
    _id: 'bring-the-shreds',
    title: 'Why I Chose Sanity for Bring The Shreds',
    slug: { current: 'why-sanity-for-bring-the-shreds' },
    summary: 'A fitness coaching business needed meal plans, coaching packages, e-commerce, and a blog. Sanity became the entire backend—no traditional server required.',
    nodeType: 'decision',
  },
];

const categoryColors: Record<string, string> = {
  build: 'text-green-400 bg-green-500/20 border-green-500/30',
  bug: 'text-red-400 bg-red-500/20 border-red-500/30',
  decision: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
  concept: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
};

function PostCard({ post }: { post: BlogPost }) {
  const category = post.nodeType || 'decision';

  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group block"
    >
      <article className="relative h-full p-6 md:p-8 rounded-xl border border-border/50 bg-card/50 hover:border-border hover:bg-card transition-all duration-300">
        {/* Category badge */}
        <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full mb-4 ${categoryColors[category] || 'text-muted-foreground bg-muted'}`}>
          <Tag className="w-3 h-3" />
          {category.charAt(0).toUpperCase() + category.slice(1)} Log
        </span>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-light text-foreground group-hover:text-primary transition-colors mb-3">
          {post.title}
        </h3>

        {/* Summary */}
        {post.summary && (
          <p className="text-muted-foreground/80 leading-relaxed line-clamp-3">
            {post.summary}
          </p>
        )}

        {/* Arrow indicator */}
        <div className="absolute top-6 right-6 md:top-8 md:right-8">
          <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </article>
    </Link>
  );
}

export function FeaturedBlogPost({ posts }: FeaturedBlogPostProps) {
  const displayPosts = posts && posts.length > 0 ? posts : defaultPosts;

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container max-w-5xl">
        {/* Section header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-border" />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Decision Logs
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4">
            Why I chose what I chose
          </h2>
          <p className="text-lg text-muted-foreground/80">
            Technical decisions with explicit trade-offs. No hand-waving.
          </p>
        </div>

        {/* Posts grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {displayPosts.slice(0, 2).map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

        {/* View all link */}
        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Browse all posts
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
